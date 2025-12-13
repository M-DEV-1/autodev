
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import os from 'os';

export class WorkspaceService {
    private static BASE_DIR = path.join(os.homedir(), '.autodev', 'workspaces');

    static async create(projectId: string, prompt: string): Promise<string> {
        const workspacePath = path.join(this.BASE_DIR, projectId);
        const repoPath = path.join(workspacePath, 'repo');
        const logsPath = path.join(workspacePath, 'logs');
        const clineDir = path.join(workspacePath, '.cline');

        if (!existsSync(workspacePath)) {
            // Create directories
            await fs.mkdir(workspacePath, { recursive: true });
            await fs.mkdir(repoPath, { recursive: true });
            await fs.mkdir(logsPath, { recursive: true });
            await fs.mkdir(clineDir, { recursive: true });

            // 1. projectContext.md
            await fs.writeFile(path.join(clineDir, 'projectContext.md'),
                `# Project Context
## Tech Stack
- Frontend: Next.js, React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB

## User Constraints
- Use clean, modern code.
- Follow best practices.
`);

            // 2. activeContext.md
            await fs.writeFile(path.join(clineDir, 'activeContext.md'),
                `# Active Task
${prompt}

## Current Goals
- [ ] Initialize project structure
- [ ] Implement requested features
`);

            // 3. progress.md
            await fs.writeFile(path.join(clineDir, 'progress.md'), `# Progress\n\nNo tasks completed yet.`);

            // 4. meta.json
            const meta = {
                projectId,
                createdAt: new Date().toISOString(),
                status: 'created'
            };
            await fs.writeFile(path.join(workspacePath, 'meta.json'), JSON.stringify(meta, null, 2));

            console.log(`Created workspace structure at: ${workspacePath}`);
        } else {
            console.log(`Workspace already exists at: ${workspacePath}`);
        }

        return workspacePath;
    }

    static getRepoPath(projectId: string): string {
        return path.join(this.BASE_DIR, projectId, 'repo');
    }

    static getRootPath(projectId: string): string {
        return path.join(this.BASE_DIR, projectId);
    }

    static async getFiles(projectId: string): Promise<any[]> {
        const repoPath = this.getRepoPath(projectId);
        if (!existsSync(repoPath)) return [];

        const files: any[] = [];

        async function traverse(currentPath: string, relativePath: string = '') {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });

            for (const entry of entries) {
                if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;

                const fullPath = path.join(currentPath, entry.name);
                const relPath = path.join(relativePath, entry.name);

                if (entry.isDirectory()) {
                    files.push({ path: relPath, type: 'dir', children: [] });
                    await traverse(fullPath, relPath);
                } else {
                    // Start with simple text check or limit size
                    // For now, read all (safe for small hackathon projects)
                    let content = '';
                    try {
                        content = await fs.readFile(fullPath, 'utf-8');
                    } catch (e) { content = '[Binary or Unreadable]'; }

                    files.push({
                        path: relPath,
                        type: 'file',
                        content: content
                    });
                }
            }
        }

        await traverse(repoPath);
        return files;
    }
}
