import { spawn, ChildProcess } from 'child_process';
import { Server } from 'socket.io';
import { WorkspaceService } from './workspace';
import { RunLimiter } from './runLimiter';
import { Project } from '../models/Project';
import fs from 'fs/promises';
import path from 'path';

interface RunningProcess {
    process: ChildProcess;
    projectId: string;
}

export class ClineService {
    private static processes: Map<string, RunningProcess> = new Map();

    static async run(project: any, io: Server) {
        // 0. Execution Lock via RunLimiter
        if (!RunLimiter.canRun()) {
            throw new Error(`Agent is busy. Max concurrent runs reached.`);
        }

        const { id: projectId, prompt } = project;

        try {
            RunLimiter.startRun();

            // 1. Get workspace (scaffolds structure if needed)
            const rootPath = await WorkspaceService.create(projectId, prompt);

            // Use 'repo' subdirectory as valid CWD for the agent
            const repoPath = WorkspaceService.getRepoPath(projectId);

            // Validation: Ensure repoPath exists
            try {
                await fs.access(repoPath);
                console.log(`[Cline] Verified CWD exists: ${repoPath}`);
            } catch (error) {
                console.error(`[Cline] CWD missing: ${repoPath}. Re-creating...`);
                await fs.mkdir(repoPath, { recursive: true });
            }

            // Update meta.json
            const metaPath = path.join(rootPath, 'meta.json');
            // Read existing or create new partial
            let meta: any = {};
            try {
                const content = await fs.readFile(metaPath, 'utf-8');
                meta = JSON.parse(content);
            } catch (e) { }

            meta.lastRun = new Date().toISOString();
            meta.status = 'running';
            await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));

            // System Prompt construction
            const systemPrompt = `
You must build projects using ONLY vanilla HTML, CSS, and JavaScript.
You must always create an \`index.html\` file at the project root.
All styles must go in \`styles.css\`.
All logic must go in \`script.js\`.
Do not use frameworks, bundlers, or package managers.
The project must be runnable by opening \`index.html\` directly in a browser.

    USER_REQUEST:
${prompt}
`.trim();

            console.log(`[Cline] Starting process for project ${projectId} in ${repoPath}`);

            // Emit Model Info Log (User Request)
            io.to(`project:${projectId}`).emit('project:log', {
                type: 'info',
                message: `Using Model: ${project.model || 'Unknown Model'}`,
                timestamp: new Date().toISOString()
            });

            // 2. Kill existing process
            if (this.processes.has(projectId)) {
                this.processes.get(projectId)?.process.kill();
                this.processes.delete(projectId);
                RunLimiter.endRun(); // Re-balance as we are starting a new one
                RunLimiter.startRun();
            }

            // 3. Spawn Cline Process
            const hardenedEnv = {
                ...process.env,
                PATH: `${process.env.PATH}:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${process.env.HOME}/.npm-global/bin`
            };

            const child = spawn('cline', ['--oneshot', '-y', systemPrompt], {
                cwd: repoPath, // IMPORTANT: Run inside repo/
                env: hardenedEnv,
                stdio: ['ignore', 'pipe', 'pipe']
            });

            // Debug Spawn Events
            child.on('spawn', () => {
                console.log(`[Cline] Process spawned successfully (PID: ${child.pid})`);
            });

            this.processes.set(projectId, { process: child, projectId });

            // 4. Stream logs & Persistence
            const handleLog = (data: Buffer | string, type: 'stdout' | 'stderr') => {
                const message = data.toString();
                // console.log(`[Cline][${type}] ${message.trim().substring(0, 100)}...`); // Local debug log

                // Structured Log Emission
                io.to(`project:${projectId}`).emit('project:log', {
                    type: type === 'stderr' ? 'error' : 'info',
                    message: message,
                    timestamp: new Date().toISOString()
                });

                // DB Persistence
                Project.findByIdAndUpdate(projectId, {
                    $push: { logs: message },
                    status: 'running'
                }).exec().catch(err => console.error("Log save error:", err));
            };

            child.stdout?.on('data', (d) => handleLog(d, 'stdout'));
            child.stderr?.on('data', (d) => handleLog(d, 'stderr'));

            child.on('error', (err) => {
                console.error(`[Cline] Failed to start process:`, err);
                io.to(`project:${projectId}`).emit('project:log', {
                    type: 'error',
                    message: `\x1b[31mFailed to start Cline: ${err.message}\x1b[0m`,
                    timestamp: new Date().toISOString()
                });
                this.cleanup(projectId, rootPath, 'failed');
            });

            child.on('close', (code) => {
                console.log(`[Cline] Process exited with code ${code}`);
                io.to(`project:${projectId}`).emit('project:log', {
                    type: 'system',
                    message: `\r\nProcess exited with code ${code}`,
                    timestamp: new Date().toISOString()
                });
                this.cleanup(projectId, rootPath, code === 0 ? 'completed' : 'failed');
            });

            return { success: true, pid: child.pid };
        } catch (error) {
            RunLimiter.endRun();
            throw error;
        }
    }

    private static async cleanup(projectId: string, rootPath: string, status: string) {
        if (this.processes.has(projectId)) {
            this.processes.delete(projectId);
            RunLimiter.endRun();
        }

        // Update meta.json
        try {
            const metaPath = path.join(rootPath, 'meta.json');
            const content = await fs.readFile(metaPath, 'utf-8');
            const meta = JSON.parse(content);
            meta.status = status;
            meta.finishedAt = new Date().toISOString();
            await fs.writeFile(metaPath, JSON.stringify(meta, null, 2));

            // Update DB Status
            await Project.findByIdAndUpdate(projectId, { status: status });
        } catch (e) {
            console.error("Cleanup error:", e);
        }
    }

    static killAll() {
        console.log(`[Cline] Killing ${this.processes.size} active processes...`);
        for (const [projectId, { process, projectId: pid }] of this.processes.entries()) {
            try {
                process.kill();
                console.log(`[Cline] Killed process for project ${pid}`);
            } catch (e) {
                console.error(`[Cline] Failed to kill process ${pid}:`, e);
            }
        }
        this.processes.clear();
        RunLimiter.reset(); // custom reset if needed, or just let node exit
    }
}
