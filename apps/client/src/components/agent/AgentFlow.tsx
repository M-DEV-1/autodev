"use client";

import { NewProjectWizard } from "@/components/agent/NewProjectWizard";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AgentFlowProps {
    onClose: () => void;
    initialMode?: 'new' | 'import';
}

export function AgentFlow({ onClose, initialMode = 'new' }: AgentFlowProps) {
    const router = useRouter();

    const handleStartProject = (prompt: string) => {
        // In the future, create project via API first to get real ID
        const projectId = 'default-project';
        const encodedPrompt = encodeURIComponent(prompt);
        router.push(`/project/${projectId}?prompt=${encodedPrompt}`);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0A0A0B] animate-in fade-in duration-300">
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-50">
                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                </Button>
            </div>

            <NewProjectWizard onStart={handleStartProject} />
        </div>
    );
}
