"use client";

import { useState, useEffect } from "react";
import { TERMINAL_LINES } from "@/lib/constants";

export function TerminalFeed() {
    const [lines, setLines] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setLines(prev => prev < TERMINAL_LINES.length ? prev + 1 : prev);
        }, 600);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-3 font-mono text-sm leading-relaxed">
            {TERMINAL_LINES.map((line, i) => (
                i < lines && (
                    <div key={i} className={`${line.color} animate-in fade-in slide-in-from-left-2 duration-300`}>
                        {line.text.split(" ").map((word, w) => {
                            const isHighlight = line.highlight.some(h => word.includes(h));
                            const isTimestamp = word.startsWith("[") && word.endsWith("]");
                            return (
                                <span key={w} className={isHighlight ? "font-bold text-white" : isTimestamp ? "text-slate-600" : ""}>
                                    {word}{" "}
                                </span>
                            )
                        })}
                    </div>
                )
            ))}
            {lines === TERMINAL_LINES.length && (
                <p className="mt-4 text-white typing-cursor font-bold">_</p>
            )}
        </div>
    );
}
