import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The line export const dynamic = 'force-dynamic' is a Route Segment Config option in Next.js (specifically within the app router) that forces a page or route handler to be rendered dynamically at request time, opting out of all static generation and caching.  (from docs)

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();

        // Find the user to get their ID
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const projects = await Project.find({ userId: user._id as any }).sort({ updatedAt: -1 });

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, description, githubUrl, prompt } = await req.json();

        await connectDB();

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // @ts-ignore
        const project = await Project.create({
            name,
            description,
            githubUrl,
            prompt,
            userId: user._id as any,
        });

        return NextResponse.json({ project }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}
