import { TerminalIcon, Minus, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlassBox({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={cn("relative group", className)}>
            {/* Glass Container */}
            <div className="
        relative z-10
        bg-black/40 backdrop-blur-xl
        border border-white/10
        rounded-xl overflow-hidden
        shadow-2xl shadow-black/50
        transition-all duration-300
        hover:border-white/20
        h-[500px] flex flex-col
      ">
                {/* Terminal Header */}
                <div className="h-10 bg-white/5 border-b border-white/10 flex items-center justify-between px-4 select-none">
                    <div className="flex items-center gap-2">
                        <TerminalIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-mono text-muted-foreground/80">autodev-agent@local:~</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-0 overflow-hidden relative font-mono text-sm">
                    {children}
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] opacity-10" />
                </div>
            </div>
        </div>
    );
}
