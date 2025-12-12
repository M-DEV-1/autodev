import * as pty from 'node-pty';

export class PtyService {
    private ptyProcess: pty.IPty | null = null;
    private onDataCallback: ((data: string) => void) | null = null;

    constructor() {
        // We defer spawn to the first write or explicit call if needed, 
        // but for now spawn immediately for simplicity
        this.spawn();
    }

    spawn() {
        const shell = process.env.SHELL || 'bash';
        this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME || process.cwd(),
            env: process.env as any
        });

        this.ptyProcess.onData((data) => {
            if (this.onDataCallback) {
                this.onDataCallback(data);
            }
        });
    }

    onData(callback: (data: string) => void) {
        this.onDataCallback = callback;
        return () => { this.onDataCallback = null; };
    }

    write(data: string) {
        if (this.ptyProcess) {
            this.ptyProcess.write(data);
        }
    }
}
