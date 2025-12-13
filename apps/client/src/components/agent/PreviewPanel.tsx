
"use client";

import { Loader2 } from "lucide-react";

export function PreviewPanel() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
            {/* Background Grid Pattern (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

            <div className="relative z-10 text-center space-y-6 p-8 max-w-md">
                <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                    <div className="relative flex items-center justify-center w-full h-full bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-medium text-slate-200">Generating Preview...</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        The agent is setting up your environment. Your application preview will appear here shortly.
                    </p>
                </div>
            </div>
        </div>
    );
}
