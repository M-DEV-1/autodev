
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import os from 'os';

export class WorkspaceService {
    private static BASE_DIR = path.join(os.homedir(), '.autodev', 'workspaces');

    static async create(projectId: string): Promise<string> {
        const workspacePath = path.join(this.BASE_DIR, projectId);

        if (!existsSync(workspacePath)) {
            await fs.mkdir(workspacePath, { recursive: true });

            // Initialize basic structure if needed
            // await fs.writeFile(path.join(workspacePath, 'README.md'), `# Project ${projectId}\n`);

            console.log(`Created workspace at: ${workspacePath}`);
        } else {
            console.log(`Workspace already exists at: ${workspacePath}`);
        }

        return workspacePath;
    }

    static async getPath(projectId: string): Promise<string> {
        return path.join(this.BASE_DIR, projectId);
    }
}
