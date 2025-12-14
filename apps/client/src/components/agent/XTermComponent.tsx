import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { useProjectStore } from "@/store/project";

interface XTermComponentProps {
    projectId: string;
}

export default function XTermComponent({ projectId }: XTermComponentProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    const { initialize, socket, logs, disconnect } = useProjectStore();

    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return;

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
        fitAddonRef.current = fitAddon;

        term.writeln('\x1b[32m✔\x1b[0m Connected to \x1b[34mAutoDev Agent\x1b[0m');
        term.writeln('Waiting for instructions...');

        return () => {
            term.dispose();
            xtermRef.current = null;
        };
    }, []);

    useEffect(() => {
        initialize(projectId);
        return () => {
            disconnect();
        };
    }, [projectId, initialize, disconnect]);

    useEffect(() => {
        if (!socket || !xtermRef.current) return;

        const handleLog = (data: string | { type: string, message: string }) => {
            const message = typeof data === 'string' ? data : data.message;
            xtermRef.current?.write(message.replace(/\n/g, '\r\n'));
        };

        socket.on('project:log', handleLog);

        return () => {
            socket.off('project:log', handleLog);
        };
    }, [socket]);

    useEffect(() => {
        if (!xtermRef.current) return;

        fetch(`/api/proxy/projects/${projectId}`)
            .then(res => res.json())
            .then(data => {
                if (data.project && data.project.logs) {
                    data.project.logs.forEach((log: string) => {
                        xtermRef.current?.write(log.replace(/\n/g, '\r\n'));
                    });
                }
            })
            .catch(console.error);
    }, [projectId]);


    // Resize handling
    useEffect(() => {
        const handleResize = () => fitAddonRef.current?.fit();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <div ref={terminalRef} className="h-full w-full" />;
}
