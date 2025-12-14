import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export interface LogMessage {
    type: 'info' | 'error' | 'system';
    message: string;
    timestamp: string;
}

export interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'dir';
    content?: string;
    children: FileNode[];
}

export interface ChatMessage {
    role: 'user' | 'agent';
    content: string;
    timestamp?: number;
}

interface ProjectState {
    projectId: string | null;
    socket: Socket | null;
    isConnected: boolean;

    // Data
    logs: LogMessage[];
    files: FileNode[];
    messages: ChatMessage[];
    activeFile: FileNode | null;
    status: 'idle' | 'running' | 'completed' | 'failed';

    // Actions
    initialize: (projectId: string) => void;
    disconnect: () => void;
    addMessage: (msg: ChatMessage) => void;
    setActiveFile: (file: FileNode | null) => void;
    setFiles: (files: FileNode[]) => void;
    fetchFiles: (projectId: string) => Promise<void>;
    clearLogs: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const useProjectStore = create<ProjectState>((set, get) => ({
    projectId: null,
    socket: null,
    isConnected: false,
    logs: [],
    files: [],
    messages: [],
    activeFile: null,
    status: 'idle',

    initialize: (projectId: string) => {
        const currentSocket = get().socket;
        if (currentSocket) currentSocket.disconnect();

        // Connect Socket
        const socket = io(API_URL);

        socket.on('connect', () => {
            set({ isConnected: true, socket });
            socket.emit('join:project', projectId);
        });

        socket.on('disconnect', () => {
            set({ isConnected: false });
        });

        // Listen for logs
        socket.on('project:log', (data: string | { type: string, message: string, timestamp?: string }) => {
            const logEntry: LogMessage = typeof data === 'string'
                ? { type: 'info', message: data, timestamp: new Date().toISOString() }
                : {
                    type: (data.type as any) || 'info',
                    message: data.message,
                    timestamp: data.timestamp || new Date().toISOString()
                };

            set(state => ({ logs: [...state.logs, logEntry] }));
        });

        // Listen for status updates if verified
        // socket.on('project:status', (status) => set({ status }));

        set({ projectId });
    },

    disconnect: () => {
        const { socket } = get();
        if (socket) socket.disconnect();
        set({ socket: null, isConnected: false, projectId: null });
    },

    addMessage: (msg) => set(state => ({ messages: [...state.messages, msg] })),

    setActiveFile: (file) => set({ activeFile: file }),

    setFiles: (files) => set({ files }),

    fetchFiles: async (projectId: string) => {
        try {
            const res = await fetch(`/api/proxy/projects/${projectId}/files`);
            const data = await res.json();
            if (data.files) {
                const tree = buildTree(data.files);
                set({ files: tree });
            }
        } catch (error) {
            console.error("Failed to fetch files:", error);
        }
    },

    clearLogs: () => set({ logs: [] }),
}));

// Helper to build tree from flat list
const buildTree = (flatFiles: any[]): FileNode[] => {
    const root: FileNode[] = [];
    const map = new Map<string, FileNode>();

    flatFiles.forEach(file => {
        const parts = file.path.split('/');
        const name = parts[parts.length - 1];
        map.set(file.path, {
            name,
            path: file.path,
            type: file.type,
            content: file.content,
            children: []
        });
    });

    flatFiles.forEach(file => {
        const node = map.get(file.path)!;
        const parts = file.path.split('/');
        if (parts.length === 1) {
            root.push(node);
        } else {
            const parentPath = parts.slice(0, -1).join('/');
            const parent = map.get(parentPath);
            if (parent) {
                parent.children.push(node);
            } else {
                root.push(node);
            }
        }
    });

    const sortNodes = (nodes: FileNode[]) => {
        nodes.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'dir' ? -1 : 1;
        });
        nodes.forEach(node => sortNodes(node.children));
    };
    sortNodes(root);
    return root;
};
