"use client";

import dynamic from 'next/dynamic';

const XTermComponent = dynamic(() => import('./XTermComponent'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center text-slate-600 text-xs font-mono">Initializing Terminal...</div>
});

interface TerminalPanelProps {
    projectId: string;
}

export function TerminalPanel({ projectId }: TerminalPanelProps) {
    return (
        <div className="h-full w-full flex flex-col bg-[#0F0F11]">
            {/* Terminal Header */}
            <div className="h-8 flex items-center justify-between px-3 border-b border-white/5 select-none bg-black/20">
                <span className="text-xs font-mono text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500/50 animate-pulse" />
                    TERMINAL
                </span>
            </div>
            {/* XTerm Container */}
            <div className="flex-1 w-full p-2 overflow-hidden">
                <XTermComponent projectId={projectId} />
            </div>
        </div>
    );
}
