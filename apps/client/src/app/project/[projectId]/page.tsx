"use client";

import { AgentLayout } from "@/components/agent/AgentLayout";
import { ChatPanel } from "@/components/agent/ChatPanel";
import { TerminalPanel } from "@/components/agent/TerminalPanel";
import { RightPanel } from "@/components/agent/RightPanel";

interface ProjectPageProps {
    params: {
        projectId: string;
    };
    searchParams: {
        prompt?: string;
    };
}

export default function ProjectPage({ params, searchParams }: ProjectPageProps) {
    const { projectId } = params;
    const { prompt } = searchParams;

    // TODO: Validate projectId and fetch project details if needed

    return (
        <main className="min-h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans">
            {/* Header is global, but AgentLayout adds pt-20. We might need a ProjectHeader instead? 
             For now, relying on global Header. */}
            <AgentLayout
                chatPanel={<ChatPanel initialPrompt={prompt} />}
                terminalPanel={<TerminalPanel />}
                previewPanel={<RightPanel />}
            />
        </main>
    );
}
