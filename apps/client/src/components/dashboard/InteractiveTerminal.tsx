

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Github, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { GlassBox } from "@/components/terminal/GlassBox";

import { WizardTerminal } from "../wizard/WizardTerminal";

import { useWizardStore } from "@/store/wizard";

interface InteractiveTerminalProps {
    isGuest: boolean;
}

export function InteractiveTerminal({ isGuest }: InteractiveTerminalProps) {
    const { mode, setMode } = useWizardStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [loading, setLoading] = useState(false);
    const [typedText, setTypedText] = useState("");
    const router = useRouter();

    const textToType = "Select an option to initialize workspace...";

    // Reset wizard when unmounting
    useEffect(() => {
        return () => setMode('menu');
    }, [setMode]);

    useEffect(() => {
        if (typedText.length < textToType.length) {
            const timeout = setTimeout(() => {
                setTypedText(textToType.slice(0, typedText.length + 1));
            }, 30);
            return () => clearTimeout(timeout);
        } else {
            setIsTyping(false);
        }
    }, [typedText]);

    const handleProjectCreate = async (name: string, prompt: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    prompt
                })
            });

            if (!response.ok) throw new Error('Failed to create project');

            const data = await response.json();
            router.push(`/project/${data.project.id}`);
        } catch (error) {
            console.error(error);
            // Optionally show error in terminal?
        }
    };

    const options = useMemo(() => [
        {
            id: 'new',
            label: 'Start New Project',
            icon: Plus,
            description: 'Initialize a new project with AI scaffolding',
            disabled: false,
            action: () => setMode('wizard')
        },
        {
            id: 'import',
            label: 'Connect Existing Git Repository',
            icon: Github,
            description: isGuest ? 'Sign in to access your repositories' : 'Import from your GitHub account',
            disabled: isGuest,
            action: () => alert("Coming soon") // Placeholder or route
        }
    ], [isGuest, setMode]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (mode !== 'menu') return;
        if (loading) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % options.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
                break;
            case "Enter":
                e.preventDefault();
                const selected = options[selectedIndex];
                if (!selected.disabled) {
                    selected.action();
                }
                break;
        }
    }, [selectedIndex, loading, options, mode]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="w-full max-w-4xl mx-auto mb-16 transition-all duration-500 ease-in-out">
            {mode === 'wizard' ? (
                <div className="animate-in fade-in zoom-in duration-300">
                    <WizardTerminal
                        onProjectCreate={handleProjectCreate}
                    />
                </div>
            ) : (
                <GlassBox className="min-h-0 bg-[#0A0A0B]/90 shadow-2xl shadow-indigo-500/10 transition-all duration-300">
                    <div className="p-6 relative z-10">
                        <div className="flex items-center gap-2 mb-6 text-slate-300 font-mono text-sm">
                            <span className="text-green-500">➜</span>
                            <span className="text-blue-400">~</span>
                            <span>{typedText}</span>
                            {isTyping && <span className="w-2 h-4 bg-slate-500 animate-pulse ml-1" />}
                        </div>

                        <div className="space-y-2">
                            {options.map((option, index) => {
                                const isSelected = selectedIndex === index;
                                const Icon = option.icon;

                                return (
                                    <div
                                        key={option.id}
                                        onClick={() => {
                                            if (!option.disabled) {
                                                setSelectedIndex(index);
                                                option.action();
                                            }
                                        }}
                                        className={cn(
                                            "group relative flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer",
                                            isSelected
                                                ? "bg-white/10 text-white"
                                                : "text-slate-500 hover:text-slate-300",
                                            option.disabled && "opacity-50 cursor-not-allowed hover:text-slate-500"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute inset-0 rounded-lg border transition-opacity",
                                            isSelected ? "border-white/10 opacity-100" : "border-transparent opacity-0"
                                        )} />

                                        <div className="relative z-10 flex items-center justify-between w-full">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-4 flex justify-center",
                                                    isSelected ? "opacity-100" : "opacity-0"
                                                )}>
                                                    <span className="text-blue-400">❯</span>
                                                </div>

                                                <Icon className="w-4 h-4" />

                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium">{option.label}</span>
                                                    {isSelected && (
                                                        <span className="text-xs text-slate-400 animate-in fade-in slide-in-from-left-2 duration-200">
                                                            {option.description}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {isSelected && !loading && (
                                                <div className="flex items-center gap-2 text-xs text-slate-500 animate-in fade-in duration-300">
                                                    <span className="hidden sm:inline">Press</span>
                                                    <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 font-sans text-[10px] text-slate-300">Enter</kbd>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none opacity-50" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none opacity-50" />
                </GlassBox>
            )}

            {mode === 'menu' && (
                <div className="mt-4 flex justify-center gap-6 text-xs text-slate-600 font-mono animate-in fade-in">
                    <div className="flex items-center gap-2">
                        <kbd className="px-1.5 py-0.5 rounded bg-[#0A0A0B] border border-white/10">↑</kbd>
                        <kbd className="px-1.5 py-0.5 rounded bg-[#0A0A0B] border border-white/10">↓</kbd>
                        <span>to navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <kbd className="px-1.5 py-0.5 rounded bg-[#0A0A0B] border border-white/10">↵</kbd>
                        <span>to select</span>
                    </div>
                </div>
            )}
        </div>
    );
}
