import mongoose, { Schema, Document } from 'mongoose';

export type ProjectStatus = 'idle' | 'running' | 'completed' | 'error';

export interface IProject extends Document {
    name: string;
    description?: string;
    prompt: string;
    status: ProjectStatus;
    workspacePath: string;
    logs: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    prompt: { type: String },
    githubUrl: { type: String },
    status: {
        type: String,
        enum: ['idle', 'running', 'completed', 'error'],
        default: 'idle'
    },
    workspacePath: { type: String },
    logs: { type: [String], default: [] },
}, {
    timestamps: true
});

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
