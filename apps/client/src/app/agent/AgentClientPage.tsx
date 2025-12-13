
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AgentLayout } from "@/components/agent/AgentLayout";
import { ChatPanel } from "@/components/agent/ChatPanel";
import { TerminalPanel } from "@/components/agent/TerminalPanel";
import { RightPanel } from "@/components/agent/RightPanel";

function AgentContent() {
    const searchParams = useSearchParams();
    // potential usage of flow
    const flow = searchParams.get('flow');

    return (
        <AgentLayout
            chatPanel={<ChatPanel />}
            terminalPanel={<TerminalPanel />}
            previewPanel={<RightPanel />}
        />
    );
}

export default function AgentClientPage() {
    return (
        <main className="min-h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans pt-16">
            <Suspense fallback={<div className="flex h-full items-center justify-center text-slate-500">Loading workspace...</div>}>
                <AgentContent />
            </Suspense>
        </main>
    );
}
