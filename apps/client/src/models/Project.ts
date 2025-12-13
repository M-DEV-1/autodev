import mongoose, { Schema, Model } from 'mongoose';

export interface IProject {
    name: string;
    description?: string;
    userId: string; // Link to the User model
    githubUrl?: string; // Optional if it's a fresh project
    status: 'active' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        description: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } as any,
        githubUrl: { type: String },
        status: { type: String, enum: ['active', 'archived'], default: 'active' },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting model during hot reload
const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
