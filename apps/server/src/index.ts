import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { ClineService } from "./services/cline";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Configure CORS for both Express and Socket.IO
const allowedOrigins = [
    "http://localhost:3000",
    process.env.ALLOWED_ORIGINS || "*",
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST"],
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
app.post("/api/run", async (req, res) => {
    const { projectId, prompt } = req.body;

    if (!projectId || !prompt) {
        return res.status(400).json({ error: "Missing projectId or prompt" });
    }

    try {
        // Start background process
        await ClineService.run(projectId, prompt, io);
        res.json({ success: true, message: "Agent started" });
    } catch (error) {
        console.error("Failed to start agent:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
