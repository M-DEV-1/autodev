
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
            router.push(`/project/${data.project.id}`);
        } catch (error) {
            console.error(error);
            setLoading(false);
            // Show error in "terminal" history ideally
        }
    };

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = inputBuffer.trim();
        if (!cmd) return;

        setInputBuffer("");

        if (cmd.toLowerCase() === 'back' || cmd.toLowerCase() === 'exit') {
            setMode('menu');
            setStep('mode_select');
            return;
        }

        if (step === 'scratch_prompt') {
            await handleProjectCreate("New Project", cmd);
        } else if (step === 'git_url') {
            await handleProjectCreate("Git Project", `Clone repo: ${cmd}`);
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

    return (
        <div className="w-full max-w-4xl mx-auto mb-16 transition-all duration-500 ease-in-out" onClick={() => inputRef.current?.focus()}>
            <GlassBox className="min-h-[400px] bg-[#0A0A0B]/90 shadow-2xl shadow-indigo-500/10 transition-all duration-300 flex flex-col cursor-text">

                {/* Header */}
                <div className="h-9 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.02]">
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                        </div>
                        <div className="ml-3 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                            <span className="text-slate-600">autodev</span>
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
                <div className="flex-1 p-6 relative font-mono text-sm">
                    {mode === 'menu' ? (
                        /* Menu Mode */
                        <div className="animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 mb-8 text-slate-300">
                                <span className="text-green-500">➜</span>
                                <span className="text-blue-400">~</span>
                                <span className="text-slate-400">autodev init</span>
                                {isTyping && <span className="w-2 h-4 bg-slate-500 animate-pulse ml-1" />}
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
                                                    ? "bg-white/[0.08] border-white/10"
                                                    : "border-transparent hover:bg-white/[0.02]",
                                                option.disabled && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            <div className="flex items-center gap-4 w-full">
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                                    isSelected ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-slate-500"
                                                )}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 flex flex-col gap-0.5 font-sans">
                                                    <span className={cn(
                                                        "font-medium transition-colors",
                                                        isSelected ? "text-white" : "text-slate-400"
                                                    )}>{option.label}</span>
                                                    <span className="text-xs text-slate-500">
                                                        {option.description}
                                                    </span>
                                                </div>
                                                {isSelected && (
                                                    <span className="text-blue-400 text-[10px] hidden sm:inline">ENTER</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* Wizard Mode (Same Component) */
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                            {/* Command History / Context */}
                            <div className="text-slate-500 mb-4">
                                <div className="flex gap-2">
                                    <span className="text-green-500">➜</span>
                                    <span className="text-blue-400">~</span>
                                    <span>autodev init</span>
                                </div>
                                <div className="ml-6 text-slate-400">
                                    {step === 'scratch_prompt' ? '✔ Selected: Start New Project' : '✔ Selected: Connect Git Repository'}
                                </div>
                            </div>

                            {/* Prompt */}
                            <div className="flex-1 flex flex-col">
                                <div className="text-slate-300 mb-2">
                                    {step === 'scratch_prompt'
                                        ? "Describe what you want to build (e.g. &apos;A generic SaaS landing page&apos;):"
                                        : "Enter the Git repository URL:"}
                                </div>

                                <form onSubmit={handleCommand} className="flex items-center gap-2 text-blue-400">
                                    <span className="text-green-500">?</span>
                                    <span className="font-bold">
                                        {step === 'scratch_prompt' ? "Idea" : "URL"}
                                        <span className="text-slate-600 ml-1">›</span>
                                    </span>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={loading ? "Creating project..." : inputBuffer}
                                        onChange={(e) => setInputBuffer(e.target.value)}
                                        disabled={loading}
                                        className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-600"
                                        placeholder={step === 'scratch_prompt' ? "Type your prompt..." : "https://github.com/..."}
                                        autoFocus
                                    />
                                    {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                                </form>

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
                                                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-slate-400 hover:text-white transition-colors"
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
            </GlassBox>

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
