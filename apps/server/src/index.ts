import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { Project } from './models/Project';
import { WorkspaceService } from './services/workspace';
import { ClineService } from './services/cline';
import fs from 'fs';
import mongoose from "mongoose";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/autodev")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const app = express();
const httpServer = createServer(app);

// Configure CORS for both Express and Socket.IO
const allowedOrigins = [
    process.env.NEXT_PUBLIC_CLIENT_URL || "",
    process.env.ALLOWED_ORIGINS || "",
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join:project", (projectId: string) => {
        console.log(`Socket ${socket.id} joining project room: project:${projectId}`);
        socket.join(`project:${projectId}`);
        socket.emit("project:log", `Connected to project session: ${projectId}`);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// API Routes
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json({ projects });
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

app.get("/api/projects/:projectId", async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json({ project });
    } catch (error) {
        console.error("Failed to fetch project:", error);
        res.status(500).json({ error: "Failed to fetch project" });
    }
});

app.post("/api/projects", async (req, res) => {
    try {
        const { name, description, prompt } = req.body;
        const project = new Project({
            name: name || "New Project",
            description,
            prompt,
            status: 'idle'
        });
        await project.save();
        res.json({ project });
    } catch (error) {
        console.error("Failed to create project:", error);
        res.status(500).json({ error: "Failed to create project" });
    }
});

app.post("/api/run", async (req, res) => {
    const { projectId, prompt } = req.body;

    if (!projectId) {
        return res.status(400).json({ error: "Missing projectId" });
    }

    try {
        // Find project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Update project data if new prompt provided
        if (prompt) {
            project.prompt = prompt;
            await project.save();
        }

        // Start background process
        await ClineService.run(project, io);
        res.json({ success: true, message: "Agent started" });
    } catch (error) {
        console.error("Failed to start agent:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/api/projects/:projectId/files", async (req, res) => {
    try {
        const { projectId } = req.params;
        const files = await WorkspaceService.getFiles(projectId);
        res.json({ files });
    } catch (error) {
        console.error("Failed to fetch files:", error);
        res.status(500).json({ error: "Failed to fetch files" });
    }
});

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`📍 Health check: http://${process.env.NEXT_PUBLIC_API_URL}:${PORT}/health`);
});

// Graceful Shutdown
const handleShutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down...`);
    ClineService.killAll();
    httpServer.close(() => {
        console.log('HTTP server closed');
        // Close MongoDB connection if needed
        // mongoose.connection.close(false, () => {
        //     console.log('MongoDB connection closed');
        //     process.exit(0);
        // });
        process.exit(0);
    });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
