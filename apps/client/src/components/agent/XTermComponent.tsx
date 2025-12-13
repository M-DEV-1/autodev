"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { io } from "socket.io-client";

interface XTermComponentProps {
    projectId: string;
}

export default function XTermComponent({ projectId }: XTermComponentProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new Terminal({
            theme: {
                background: '#00000000', // Transparent
                foreground: '#a9b1d6',
                cursor: '#c0caf5',
                selectionBackground: '#7aa2f744',
            },
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 13,
            cursorBlink: true,
            allowTransparency: true
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();
        xtermRef.current = term;

        // Welcome message
        term.writeln('\x1b[32m✔\x1b[0m Connected to \x1b[34mAutoDev Agent\x1b[0m');
        term.writeln('Waiting for instructions...');

        // Fetch historical logs
        fetch(`http://localhost:3002/api/projects/${projectId}`)
            .then(res => res.json())
            .then(data => {
                if (data.project && data.project.logs) {
                    data.project.logs.forEach((log: string) => {
                        term.write(log.replace(/\n/g, '\r\n'));
                    });
                }
            })
            .catch(err => {
                term.writeln(`\r\n\x1b[31mFailed to load historical logs: ${err.message}\x1b[0m`);
            });

        // Connect to Socket.IO
        const socket = io('http://localhost:3002');

        socket.on('connect', () => {
            term.writeln('\x1b[90m> Connected to stream server\x1b[0m');
            // Join project room
            socket.emit('join:project', projectId);
        });

        socket.on('project:log', (data: string | { type: string, message: string }) => {
            let message = '';
            if (typeof data === 'string') {
                message = data;
            } else {
                message = data.message;
            }
            term.write(message.replace(/\n/g, '\r\n'));
        });

        socket.on('disconnect', () => {
            term.writeln('\r\n\x1b[31m> Disconnected from server\x1b[0m');
        });

        const handleResize = () => fitAddon.fit();
        window.addEventListener('resize', handleResize);

        // Resize observer for container to refit
        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit();
        });
        resizeObserver.observe(terminalRef.current);

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            socket.disconnect();
            term.dispose();
        };
    }, [projectId]);

    return <div ref={terminalRef} className="h-full w-full" />;
}
