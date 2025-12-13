
import { spawn, ChildProcess } from 'child_process';
import { Server } from 'socket.io';
import { WorkspaceService } from './workspace';

interface RunningProcess {
    process: ChildProcess;
    projectId: string;
}

export class ClineService {
    private static processes: Map<string, RunningProcess> = new Map();

    static async run(projectId: string, prompt: string, io: Server) {
        // 1. Get workspace
        const workspacePath = await WorkspaceService.create(projectId);

        // 2. Kill existing process for this project if any
        if (this.processes.has(projectId)) {
            const existing = this.processes.get(projectId);
            existing?.process.kill();
            this.processes.delete(projectId);
        }

        console.log(`[Cline] Starting process for project ${projectId} in ${workspacePath}`);

        // 3. Spawn process (Mocking Cline with a shell script for now that mimics output)
        // In real impl: 'npx', ['cline', 'run', '--prompt', prompt], { cwd: workspacePath }
        const child = spawn('bash', ['-c', `
            echo "Initializing Cliner..."
            sleep 1
            echo "Analyzing request: ${prompt}"
            sleep 1
            echo "Creating implementation plan..."
            sleep 1
            echo "Writing files to ${workspacePath}..."
            sleep 1
            echo "Done."
        `], {
            cwd: workspacePath,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        this.processes.set(projectId, { process: child, projectId });

        // 4. Stream logs
        child.stdout?.on('data', (data) => {
            const output = data.toString();
            // Emit to specific room
            io.to(`project:${projectId}`).emit('project:log', output);
        });

        child.stderr?.on('data', (data) => {
            const output = data.toString();
            io.to(`project:${projectId}`).emit('project:log', `\x1b[31m${output}\x1b[0m`); // Red for error
        });

        child.on('close', (code) => {
            console.log(`[Cline] Process exited with code ${code}`);
            io.to(`project:${projectId}`).emit('project:log', `\r\nProcess exited with code ${code}`);
            this.processes.delete(projectId);
        });

        return { success: true, pid: child.pid };
    }
}
