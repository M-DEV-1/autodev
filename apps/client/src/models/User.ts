import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    image?: string;
    githubId: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        image: { type: String },
        githubId: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

// Prevent overwriting model during hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
