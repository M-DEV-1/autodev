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

    const handleStartProject = async (prompt: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "New Project", // Could prompt for name later
                    prompt
                })
            });

            if (response.ok) {
                const data = await response.json();
                const projectId = data.project._id;
                const encodedPrompt = encodeURIComponent(prompt);
                router.push(`/project/${projectId}?prompt=${encodedPrompt}`);
            } else {
                console.error("Failed to create project");
                // Fallback or error state
            }
        } catch (err) {
            console.error(err);
        }
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
