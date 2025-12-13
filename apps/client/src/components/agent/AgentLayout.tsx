"use client";

import { ReactNode } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

interface AgentLayoutProps {
    chatPanel: ReactNode;
    terminalPanel: ReactNode;
    previewPanel: ReactNode;
}

export function AgentLayout({ chatPanel, terminalPanel, previewPanel }: AgentLayoutProps) {
    return (
        <div className="h-screen w-full bg-[#0A0A0B] overflow-hidden pt-20">
            <ResizablePanelGroup direction="horizontal">
                {/* Left Column: Chat & Terminal */}
                <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="flex flex-col border-r border-white/5 bg-black/20">
                    <ResizablePanelGroup direction="vertical">
                        {/* Chat Panel */}
                        <ResizablePanel defaultSize={60} minSize={20} className="flex flex-col relative">
                            {chatPanel}
                        </ResizablePanel>

                        <ResizableHandle withHandle={false} className="bg-white/5 hover:bg-white/10 transition-colors" />

                        {/* Terminal Panel */}
                        <ResizablePanel defaultSize={40} minSize={10} className="flex flex-col bg-black/40">
                            {terminalPanel}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle withHandle className="bg-white/5 hover:bg-white/10 transition-colors" />

                {/* Right Column: Preview */}
                <ResizablePanel defaultSize={70} className="bg-[#0A0A0B] relative">
                    {previewPanel}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}