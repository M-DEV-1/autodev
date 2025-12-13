import * as pty from 'node-pty';
import os from 'os';

export class PtyService {
    private ptyProcess: pty.IPty;
    private listeners: ((data: string) => void)[] = [];

    constructor() {
        const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

        this.ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME || process.cwd(),
            env: process.env as { [key: string]: string }
        });

        this.ptyProcess.onData((data) => {
            this.listeners.forEach(listener => listener(data));
        });
    }

    write(data: string) {
        this.ptyProcess.write(data);
    }

    onData(callback: (data: string) => void) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }
}
