"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { useWizardStore } from "@/store/wizard";

interface WizardTerminalProps {
    onProjectCreate: (name: string, prompt: string) => Promise<void>;
}

const ASCII_ART = `
\x1b[34m
    _         _        ____            
   / \\  _   _| |_ ___ |  _ \\  _____   __
  / _ \\| | | | __/ _ \\| | | |/ _ \\ \\ / /
 / ___ \\ |_| | || (_) | |_| |  __/\\ V / 
/_/   \\_\\__,_|\\__\\___/|____/ \\___| \\_/  
                                        
\x1b[0m`;

const WELCOME_MSG = `
\x1b[1mWelcome to AutoDev v1.0.0\x1b[0m
Type \x1b[32mhelp\x1b[0m for instructions or just describe your project.

`;

type WizardStep = 'mode_select' | 'scratch_prompt' | 'git_url' | 'creating';

export function WizardTerminal({ onProjectCreate }: WizardTerminalProps) {
    const { step, setStep, setMode } = useWizardStore();
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    // We keep inputBuffer local as it's very high frequency and UI specific
    const [inputBuffer, setInputBuffer] = useState("");
    const router = useRouter();

    // Chips for quick actions
    const [showChips, setShowChips] = useState(true);

    const writePrompt = useCallback((term: Terminal, text = "> ") => {
        term.write(`\r\n\x1b[32m${text}\x1b[0m`);
    }, []);

    const handleCommand = useCallback(async (cmd: string) => {
        const term = xtermRef.current;
        if (!term) return;

        const cleanCmd = cmd.trim();

        if (step === 'mode_select') {
            if (cleanCmd === '1' || cleanCmd.toLowerCase() === 'scratch') {
                term.writeln('\r\n\x1b[36m[Mode selected: New Project from Scratch]\x1b[0m');
                term.writeln('Describe what you want to build (e.g. "A pomodoro timer with dark mode"):');
                writePrompt(term, "Query: ");
                setStep('scratch_prompt');
            } else if (cleanCmd === '2' || cleanCmd.toLowerCase() === 'git') {
                term.writeln('\r\n\x1b[36m[Mode selected: Connect Git Repository]\x1b[0m');
                term.writeln('Enter the repository URL (e.g. https://github.com/user/repo):');
                writePrompt(term, "Repo URL: ");
                setStep('git_url');
            } else {
                term.writeln('\r\n\x1b[31mInvalid option. Please select 1 or 2.\x1b[0m');
                writePrompt(term, "Select [1/2]: ");
            }
        } else if (step === 'scratch_prompt') {
            if (!cleanCmd) {
                writePrompt(term, "Query: ");
                return;
            }
            term.writeln('\r\n\x1b[33m[Initializing Project...]\x1b[0m');
            setStep('creating');
            setShowChips(false);
            await onProjectCreate("New Project", cleanCmd);
        } else if (step === 'git_url') {
            if (!cleanCmd) {
                writePrompt(term, "Repo URL: ");
                return;
            }
            term.writeln('\r\n\x1b[33m[Cloning Repository...]\x1b[0m');
            setStep('creating');
            setShowChips(false);
            // Handling GIT mode is a TODO for backend, for now treating as prompt
            await onProjectCreate("Git Project", `Clone and setup this repo: ${cleanCmd}`);
        }
    }, [step, setStep, onProjectCreate, writePrompt]);

    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return;

        const term = new Terminal({
            theme: {
                background: '#00000000',
                foreground: '#a9b1d6',
                cursor: '#c0caf5',
                selectionBackground: '#7aa2f744',
            },
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 14,
            cursorBlink: true,
            allowTransparency: true,
            rows: 20
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();
        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Banner
        // Check if we are freshly mounting or returning? 
        // For now, always show banner if we are mapping this component fresh.
        term.write(ASCII_ART.replace(/\n/g, '\r\n'));
        term.write(WELCOME_MSG.replace(/\n/g, '\r\n'));

        // Initial Prompt based on step?
        // If we want persisting terminal history, we need complex state. 
        // For now, since unmount/remount clears xterm, let's reset to start or handle step.
        // If step is NOT mode_select, we should probably output context.
        // But simpler: just always start fresh.
        if (step === 'mode_select') {
            term.writeln('Select an option to start:');
            term.writeln('  \x1b[36m1)\x1b[0m New Project from Scratch');
            term.writeln('  \x1b[36m2)\x1b[0m Connect Git Repository');
            writePrompt(term, "Select [1/2]: ");
        } else {
            // Recovering state implementation TODO. For now, reset step if corrupted.
            // setStep('mode_select'); // Can't call inside here easily without effect deps
            term.writeln('Resuming session...');
            writePrompt(term);
        }

        // Input Handling
        term.onData(e => {
            // We use the separate effect for input handling to avoid stale state issues with closures
            // This listener is purely for echo if needed, but we handle it all in the other effect now
        });

        // Cleanup
        return () => {
            term.dispose();
            xtermRef.current = null;
        };
    }, [writePrompt, step]); // Re-run if step changes implies re-mount usually.

    // Ref for buffer to avoid stale closures in onData
    const bufferRef = useRef("");

    // Attach listener separately to use latest handleCommand
    useEffect(() => {
        const term = xtermRef.current;
        if (!term) return;

        const disposable = term.onData(e => {
            if (step === 'creating') return;

            switch (e) {
                case '\r': // Enter
                    const cmd = bufferRef.current;
                    bufferRef.current = "";
                    handleCommand(cmd);
                    break;
                case '\u007F': // Backspace
                    // Simple check: don't delete prompt
                    // We roughly assume prompt length or just check empty buffer
                    if (bufferRef.current.length > 0) {
                        bufferRef.current = bufferRef.current.slice(0, -1);
                        term.write('\b \b');
                    }
                    break;
                default:
                    if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) {
                        bufferRef.current += e;
                        term.write(e);
                    }
            }
        });

        return () => {
            disposable.dispose();
        }
    }, [handleCommand, step]); // Only re-run if writePrompt changes (stable)

    // Chip handlers
    const insertText = (text: string) => {
        const term = xtermRef.current;
        if (!term) return;

        // Simulate typing
        bufferRef.current = text;
        // Erase current line first? Nah just append for now or simple "replace"
        // Let's just assume empty line for chip usage
        term.write(text);

        // Auto submit?
        // handleCommand(text); 
    };

    return (
        <div className="relative w-full h-[500px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col">
            {/* Header / Title Bar */}
            <div className="h-8 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 ml-2">autodev — interactive setup</div>
                </div>
                <button
                    onClick={() => setMode('menu')}
                    className="text-[10px] text-slate-500 hover:text-slate-300 font-mono flex items-center gap-1 transition-colors"
                >
                    <span>[ESC] Back</span>
                </button>
            </div>

            {/* Terminal Area */}
            <div className="flex-1 p-4 relative">
                <div ref={terminalRef} className="h-full w-full" />

                {/* Floating Chips (Contextual) */}
                {showChips && step === 'scratch_prompt' && (
                    <div className="absolute bottom-6 left-6 flex gap-2 flex-wrap max-w-2xl px-2">
                        {[
                            "Build a Pomodoro timer with React",
                            "Create a blog API with Express",
                            "Simple landing page for a SaaS"
                        ].map(template => (
                            <button
                                key={template}
                                onClick={() => insertText(template)}
                                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs border border-blue-500/20 rounded-full transition-colors font-mono cursor-pointer"
                            >
                                {template}
                            </button>
                        ))}
                    </div>
                )}
                {showChips && step === 'mode_select' && (
                    <div className="absolute bottom-6 left-6 flex gap-2">
                        <button onClick={() => insertText("1")} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 text-xs border border-white/10 rounded-md font-mono">1. New Project</button>
                        <button onClick={() => insertText("2")} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 text-xs border border-white/10 rounded-md font-mono">2. Connect Git</button>
                    </div>
                )}
            </div>
        </div>
    );
}
