"use client";

import { AgentLayout } from "@/components/agent/AgentLayout";
import { ChatPanel } from "@/components/agent/ChatPanel";
import { TerminalPanel } from "@/components/agent/TerminalPanel";
import { RightPanel } from "@/components/agent/RightPanel";

import { useEffect } from "react";

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

    // Validation Effect
    useEffect(() => {
        if (!projectId) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${projectId}`)
            .then(res => {
                if (!res.ok) {
                    console.error("Project not found");
                    // Optionally redirect to 404 or dashboard
                }
            })
            .catch(err => console.error("Failed to validate project:", err));
    }, [projectId]);

    return (
        <main className="min-h-screen bg-[#0A0A0B] text-slate-200 overflow-hidden font-sans">
            {/* Header is global, but AgentLayout adds pt-20. We might need a ProjectHeader instead? 
             For now, relying on global Header. */}
            <AgentLayout
                chatPanel={<ChatPanel projectId={projectId} initialPrompt={prompt} />}
                terminalPanel={<TerminalPanel projectId={projectId} />}
                previewPanel={<RightPanel projectId={projectId} />}
            />
        </main>
    );
}
