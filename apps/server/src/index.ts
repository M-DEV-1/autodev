import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PtyService } from './services/pty';
import { AgentService } from './services/agent';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Services
const ptyService = new PtyService();
const agentService = new AgentService();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Terminal PTY
    socket.on('terminal:input', (data) => {
        ptyService.write(data);
    });

    const onDataDispose = ptyService.onData((data) => {
        socket.emit('terminal:output', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (onDataDispose) {
            onDataDispose();
        }
    });
});

// Agent Planning Route
app.post('/api/plan', async (req, res) => {
    const { prompt } = req.body;
    try {
        const plan = await agentService.planTask(prompt);
        res.json({ plan });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'AutoDev API' });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`✅ AutoDev API Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
