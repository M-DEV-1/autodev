export type ProjectStatus = 'idle' | 'running' | 'completed' | 'error';

export interface Project {
    id: string;
    name: string;
    prompt: string;
    status: ProjectStatus;
    workspacePath: string;
    createdAt: number;
    updatedAt: number;
}
