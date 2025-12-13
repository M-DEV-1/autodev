"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewProjectWizardProps {
    onStart: (prompt: string) => void;
}

export function NewProjectWizard({ onStart }: NewProjectWizardProps) {
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = () => {
        if (!input.trim()) return;
        onStart(input);
    };

    const suggestions = [
        { label: "E-commerce Store", prompt: "Build a modern e-commerce store with a product grid, cart, and checkout flow using Next.js and Tailwind." },
        { label: "SaaS Dashboard", prompt: "Create a dark-themed SaaS dashboard with charts, data tables, and a sidebar navigation." },
        { label: "Landing Page", prompt: "Design a high-converting landing page for a mobile app with hero section, features, and pricing." },
        { label: "Blog Platform", prompt: "Develop a minimal blog platform with markdown support, categories, and a clean reading interface." }
    ];

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#020202] text-white relative overflow-hidden font-sans selection:bg-blue-500/30">

            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

            <div className="flex flex-col items-center w-full max-w-3xl px-6 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
                        What shall we build?
                    </h1>
                    <p className="text-xl text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                        Describe your dream application, and I&apos;ll handle the architecture, code, and design.
                    </p>
                </div>

                {/* Main Input */}
                <div className={cn(
                    "w-full relative group transition-all duration-300",
                    isFocused ? "scale-[1.02]" : "scale-100"
                )}>
                    <div className={cn(
                        "absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 transition duration-500",
                        isFocused ? "opacity-50 blur-md" : "opacity-20"
                    )} />

                    <div className="relative bg-[#0A0A0B] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        <textarea
                            placeholder="e.g. Build a kanban board with drag-and-drop..."
                            className="w-full bg-transparent border-none text-white placeholder:text-slate-600 focus:ring-0 p-8 text-xl leading-relaxed min-h-[160px] resize-none font-light"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            autoFocus
                        />

                        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-4 text-xs text-slate-500 font-mono hidden md:flex">
                                <span>Markdown supported</span>
                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                <span>Press Enter to start</span>
                            </div>

                            <Button
                                size="lg"
                                onClick={handleSubmit}
                                disabled={!input.trim()}
                                className="ml-auto bg-white text-black hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all font-semibold rounded-lg px-8 py-6 h-auto text-base"
                            >
                                Start Project
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="mt-12 w-full">
                    <p className="text-sm text-slate-500 mb-4 text-center uppercase tracking-widest font-semibold text-[10px]">Or try a template</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.label}
                                onClick={() => setInput(suggestion.prompt)}
                                className="group flex flex-col items-start p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all text-left"
                            >
                                <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors mb-1 flex items-center gap-2">
                                    {suggestion.label}
                                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </span>
                                <span className="text-xs text-slate-500 line-clamp-1 group-hover:text-slate-400 transition-colors">
                                    {suggestion.prompt}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
