import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { PtyService } from './services/pty';
import { AgentService } from './services/agent';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Services
const ptyService = new PtyService();
const agentService = new AgentService();

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
    });
});

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
    res.json({ status: 'ok', service: 'apps/api' });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
});
