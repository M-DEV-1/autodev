"use client";
// TODO: REPLACE MOCK FS with real calls

import { File, Folder, Search, ChevronRight, X } from "lucide-react";

export function FileSystemPanel() {
    return (
        <div className="h-full w-full flex bg-[#0F0F11] font-mono text-xs">
            <div className="w-64 border-r border-white/5 flex flex-col bg-[#050505]">
                <div className="h-10 flex items-center justify-between px-3 border-b border-white/5 shrink-0">
                    <span className="font-medium text-slate-400">Files</span>
                    <Search className="w-3.5 h-3.5 text-slate-600" />
                </div>

                <div className="flex-1 p-2 overflow-y-auto space-y-0.5">
                    <div className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-slate-200 cursor-pointer">
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-bold">src</span>
                    </div>
                    <div className="pl-4 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 text-blue-400 rounded cursor-pointer">
                            <File className="w-3 h-3" />
                            <span>index.ts</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded cursor-pointer">
                            <File className="w-3 h-3" />
                            <span>app.tsx</span>
                        </div>
                        <div className="flex items-center gap-2 px-2 py-1 text-slate-500 hover:text-slate-300 hover:bg-white/5 rounded cursor-pointer">
                            <File className="w-3 h-3" />
                            <span>utils.ts</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Area: Editor */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0F0F11]">
                {/* Tabs */}
                <div className="flex items-center bg-[#050505] border-b border-white/5">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#0F0F11] border-r border-white/5 border-t-2 border-t-blue-500 text-slate-300">
                        <File className="w-3 h-3 text-blue-400" />
                        <span>index.ts</span>
                        <X className="w-3 h-3 ml-2 text-slate-600 hover:text-slate-400 cursor-pointer" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-auto text-slate-300">
                    <pre className="font-mono text-xs leading-6">
                        <code className="language-typescript">
                            {`import express from "express";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.get("/", (req, res) => {
  res.send("Hello World");
});

httpServer.listen(3000, () => {
  console.log("Server running on port 3000");
});`}
                        </code>
                    </pre>
                </div>
            </div>
        </div>
    );
}
