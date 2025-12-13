"use client";

import { useState } from "react";
import { PreviewPanel } from "./PreviewPanel";
import { FileSystemPanel } from "./FileSystemPanel";
import { cn } from "@/lib/utils";
import { Copy, Eye, Laptop } from "lucide-react";

export function RightPanel() {
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

    return (
        <div className="h-full w-full flex flex-col bg-[#0A0A0B] relative">
            {/* Tabs Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-2 shrink-0 bg-transparent justify-between">
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            activeTab === 'preview'
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        )}
                    >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            activeTab === 'code'
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        )}
                    >
                        <Laptop className="w-3.5 h-3.5" />
                        Code
                    </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pr-2">
                    <span className="text-[10px] text-slate-600 font-mono">localhost:3000</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-0 relative">
                {activeTab === 'preview' ? <PreviewPanel /> : <FileSystemPanel />}
            </div>
        </div>
    );
}
