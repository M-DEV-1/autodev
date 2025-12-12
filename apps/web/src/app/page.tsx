"use client";

import { Hero } from "@/components/layout/Hero";
import { GlassBox } from "@/components/terminal/GlassBox";
import { Features } from "@/components/layout/Features";
import { Footer } from "@/components/layout/Footer";
import { ClineIcon, KestraIcon, VercelIcon, CodeRabbitIcon, TogetherAIcon, OumiIcon } from "@/components/ui/Icons";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
    // Logo Data with Links
    const partners = [
        { name: "Cline", icon: ClineIcon, url: "https://cline.bot" },
        { name: "Kestra", icon: KestraIcon, url: "https://kestra.io" },
        { name: "Vercel", icon: VercelIcon, url: "https://vercel.com" },
        { name: "CodeRabbit", icon: CodeRabbitIcon, url: "https://coderabbit.ai" },
        { name: "Together AI", icon: TogetherAIcon, url: "https://together.ai" },
        { name: "Oumi", icon: OumiIcon, url: "https://oumi.ai" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <Hero />

            {/* Interactive Workspace Area */}
            <div className="container mx-auto px-6 -mt-32 md:-mt-40 relative z-20">
                <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
                    {/* Terminal / Agent View */}
                    <GlassBox className="h-[500px] shadow-2xl shadow-orange-500/20 border-orange-500/20">
                        <div className="p-6 font-mono text-sm leading-relaxed">
                            <div className="space-y-2">
                                <p className="text-slate-500">Initializing AutoDev Protocol v2.0...</p>
                                <p className="text-green-400">
                                    <span className="text-slate-600">[10:42:01]</span> Connecting to <span className="font-bold text-white">Cline Agent</span>... [CONNECTED]
                                </p>
                                <p className="text-purple-400">
                                    <span className="text-slate-600">[10:42:02]</span> Orchestrating workflow via <span className="font-bold text-white">Kestra</span>... [ACTIVE]
                                </p>
                                <p className="text-blue-400">
                                    <span className="text-slate-600">[10:42:03]</span> Retrieving context from <span className="font-bold text-white">GitHub</span>... [DONE]
                                </p>
                                <p className="text-orange-400">
                                    <span className="text-slate-600">[10:42:04]</span> Analyzing diffs with <span className="font-bold text-white">CodeRabbit</span>... [COMPLETE]
                                </p>
                                <p className="text-indigo-400">
                                    <span className="text-slate-600">[10:42:04]</span> Assembling AI models via <span className="font-bold text-white">Together.ai</span>... [READY]
                                </p>
                                <p className="text-yellow-400 animate-pulse">
                                    <span className="text-slate-600">[10:42:05]</span> Asking <span className="font-bold text-white">Vercel</span> if it&apos;s okay to deploy on a Friday... [APPROVED]
                                </p>
                                <p className="mt-4 text-white typing-cursor">_</p>
                            </div>
                        </div>
                    </GlassBox>
                </div>

                {/* Powered By Strip (Refactored) */}
                <div className="mt-20 py-10 border-y border-white/5 bg-slate-950/30 backdrop-blur-sm">
                    <p className="text-center text-xs font-semibold text-slate-500 mb-8 uppercase tracking-[0.2em]">
                        Powered By
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {partners.map((partner) => (
                            <Link
                                href={partner.url}
                                key={partner.name}
                                target="_blank"
                                className="group flex items-center gap-3 opacity-60 hover:opacity-100 transition-all duration-300 hover:-translate-y-1"
                            >
                                <partner.icon className="w-8 h-8 text-white group-hover:text-white" />
                                <span className="text-lg font-bold text-slate-300 group-hover:text-white transition-colors">
                                    {partner.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feature Cards */}
            <Features />

            {/* Footer */}
            <Footer />
        </div>
    );
}
