
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Plus, Github, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { GlassBox } from "@/components/terminal/GlassBox";



import { useWizardStore } from "@/store/wizard";

interface InteractiveTerminalProps {
    isGuest: boolean;
}

export function InteractiveTerminal({ isGuest }: InteractiveTerminalProps) {
    const { mode, setMode, step, setStep } = useWizardStore();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [loading, setLoading] = useState(false);
    const [typedText, setTypedText] = useState("");
    const [inputBuffer, setInputBuffer] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
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

    // Focus input when in wizard mode
    useEffect(() => {
        if (mode === 'wizard' && !loading) {
            inputRef.current?.focus();
        }
    }, [mode, step, loading]);

    const handleSubmit = async () => {
        const cmd = inputBuffer.trim();
        if (!cmd) return;

        // Handle Back command
        if (cmd.toLowerCase().startsWith('back') || cmd.toLowerCase() === 'exit') {
            setMode('menu');
            setStep('mode_select');
            setInputBuffer("");
            return;
        }

        if (step === 'scratch_prompt') {
            await handleProjectCreate("New Project", cmd);
        } else if (step === 'git_url') {
            await handleProjectCreate("Git Project", `Clone repo: ${cmd}`);
        }
    };

    const handleProjectCreate = async (name: string, prompt: string) => {
        setLoading(true);
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
            const projectId = data.project._id;

            // Pass the prompt as a query param so the ChatPanel can pick it up immediately
            router.push(`/project/${projectId}?prompt=${encodeURIComponent(prompt)}`);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleKeyDownInput = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Explicitly handle 'back' here to ensure it's caught before any other logic
            const val = (e.target as HTMLTextAreaElement).value.trim().toLowerCase();
            if (val === 'back' || val === 'exit') {
                setMode('menu');
                setStep('mode_select');
                setInputBuffer("");
                return;
            }
            handleSubmit();
        }
    };

    const options = useMemo(() => [
        {
            id: 'new',
            label: 'Start New Project',
            icon: Plus,
            description: 'Initialize a new project with AI scaffolding',
            disabled: false,
            action: () => {
                setMode('wizard');
                setStep('scratch_prompt');
            }
        },
        {
            id: 'import',
            label: 'Connect Existing Git Repository',
            icon: Github,
            description: isGuest ? 'Sign in to access your repositories' : 'Import from your GitHub account',
            disabled: isGuest,
            action: () => {
                setMode('wizard');
                setStep('git_url');
            }
        }
    ], [isGuest, setMode, setStep]);

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

    // Auto-resize textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
        }
    }, [inputBuffer, mode]);

    return (
        <div className="w-full max-w-4xl mx-auto mb-16 transition-all duration-500 ease-in-out" onClick={() => inputRef.current?.focus()}>
            {/* Unified Terminal Container (Replaces GlassBox) */}
            <div className="
                relative z-10
                bg-[#0A0A0B]/80 backdrop-blur-3xl
                border border-white/10
                rounded-xl overflow-hidden
                shadow-2xl shadow-indigo-500/10
                transition-all duration-300
                flex flex-col
                min-h-[400px] max-h-[600px]
                cursor-text
                group
            ">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />

                {/* Header */}
                <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02] shrink-0 select-none relative z-10">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                        </div>
                        <div className="ml-3 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                            <span className="text-slate-500">autodev</span>
                            <span>/</span>
                            <span className="text-blue-400">
                                {mode === 'menu' ? 'dashboard' : step === 'scratch_prompt' ? 'new-project' : 'git-clone'}
                            </span>
                        </div>
                    </div>
                    {mode === 'wizard' && (
                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                            <span>Type &apos;back&apos; to return</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 relative font-mono text-sm overflow-y-auto no-scrollbar">
                    {mode === 'menu' ? (
                        /* Menu Mode */
                        <div className="animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 mb-8 text-slate-200 font-medium">
                                <span className="text-green-500">➜</span>
                                <span className="text-blue-400">~</span>
                                <span className="text-slate-200">autodev init</span>
                            </div>

                            <div className="mb-6 text-slate-300 h-6 flex items-center shadow-lg">
                                <span className="text-green-500 mr-2">➜</span>
                                <span className="text-white">{typedText}</span>
                                {isTyping && <span className="w-2 h-4 bg-slate-400 animate-pulse ml-1 inline-block" />}
                            </div>

                            <div className="space-y-3">
                                {options.map((option, index) => {
                                    const isSelected = selectedIndex === index;
                                    const Icon = option.icon;
                                    return (
                                        <div
                                            key={option.id}
                                            onClick={() => !option.disabled && option.action()}
                                            className={cn(
                                                "group relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer border",
                                                isSelected
                                                    ? "bg-white/[0.08] border-white/10 shadow-lg"
                                                    : "border-transparent hover:bg-white/[0.02]",
                                                option.disabled && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {/* Active Indicator Arrow */}
                                            {isSelected && (
                                                <div className="absolute left-2 text-blue-400 font-mono text-lg animate-pulse">
                                                    ›
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 w-full pl-4">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-slate-500"
                                                )}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-0.5 font-sans">
                                                    <span className={cn(
                                                        "font-medium transition-colors font-mono",
                                                        isSelected ? "text-white" : "text-slate-400"
                                                    )}>{option.label}</span>
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        {option.description}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <span className="text-[10px]">Press</span>
                                                        <kbd className="h-5 px-1.5 flex items-center justify-center rounded bg-white/10 text-[10px] font-mono text-slate-300 border border-white/10">
                                                            Enter
                                                        </kbd>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* Wizard Mode */
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-full flex flex-col">
                            <div className="text-slate-400 mb-4 shrink-0">
                                <div className="flex gap-2">
                                    <span className="text-green-500">➜</span>
                                    <span className="text-blue-400">~</span>
                                    <span>autodev init</span>
                                </div>
                                <div className="ml-6 text-slate-400">
                                    {step === 'scratch_prompt' ? '✔ Selected: Start New Project' : '✔ Selected: Connect Git Repository'}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="text-slate-200 mb-2 shrink-0">
                                    {step === 'scratch_prompt'
                                        ? "Describe what you want to build (e.g. 'A generic SaaS landing page'):"
                                        : "Enter the Git repository URL:"}
                                </div>

                                <div className="flex items-start gap-2 text-blue-400 w-full">
                                    <span className="text-green-500 mt-1">?</span>
                                    <span className="font-bold shrink-0 mt-1">
                                        {step === 'scratch_prompt' ? "Idea" : "URL"}
                                        <span className="text-slate-600 ml-1">›</span>
                                    </span>
                                    <textarea
                                        ref={inputRef as any}
                                        value={loading ? "Creating project..." : inputBuffer}
                                        onChange={(e) => setInputBuffer(e.target.value)}
                                        onKeyDown={handleKeyDownInput}
                                        disabled={loading}
                                        rows={1}
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 resize-none overflow-hidden min-h-[24px]"
                                        placeholder={step === 'scratch_prompt' ? "Type your prompt..." : "https://github.com/..."}
                                        autoFocus
                                    />
                                    {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500 shrink-0 mt-1" />}
                                </div>

                                {/* Chips */}
                                {!loading && step === 'scratch_prompt' && (
                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {[
                                            "Build a Pomodoro timer",
                                            "Create a blog API",
                                            "Simple landing page"
                                        ].map(chip => (
                                            <button
                                                key={chip}
                                                type="button"
                                                onClick={() => setInputBuffer(chip)}
                                                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-slate-300 hover:text-white transition-colors"
                                            >
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none opacity-50" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none opacity-50" />
                </div>
            </div>

            {/* Hint Footer */}
            <div className="mt-6 flex justify-center gap-8 text-[10px] text-slate-600 font-mono animate-in fade-in opacity-50">
                {mode === 'menu' ? (
                    <>
                        <div className="flex items-center gap-2">
                            <span>Use arrows to navigate</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Press Enter to select</span>
                        </div>
                    </>
                ) : (
                    <span>Type &apos;back&apos; to cancel</span>
                )}
            </div>
        </div>
    );
}
