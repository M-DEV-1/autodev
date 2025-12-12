"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Box, Terminal, Zap, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";

export function Features() {
    const features = [
        {
            title: "Plan with Reasoning",
            description: "Uses Together AI to decompose potential PRs into actionable steps.",
            icon: Box,
            className: "md:col-span-2",
            gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20"
        },
        {
            title: "Build in Sandbox",
            description: "Agents execution via Cline in secured containers.",
            icon: Terminal,
            className: "md:col-span-1",
            gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20"
        },
        {
            title: "Deploy Instantly",
            description: "Seamless Kestra pipelines to Vercel.",
            icon: Zap,
            className: "md:col-span-1",
            gradient: "from-pink-500/20 via-rose-500/20 to-red-500/20"
        },
        {
            title: "Secure by Default",
            description: "Enterprise-grade encryption and access control for your repo.",
            icon: Fingerprint,
            className: "md:col-span-2",
            gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20"
        },
    ];

    return (
        <section id="features" className="container py-24 mx-auto">
            <div className="mb-16 text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">
                    Everything you need to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                        automate your workflow
                    </span>
                </h2>
                <p className="text-muted-foreground text-lg">
                    Stop writing boilerplate. Start architecting systems. AutoDev handles the implementation details.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={feature.className}
                    >
                        <Card className="h-full relative overflow-hidden bg-slate-950 border-white/5 hover:border-white/10 transition-colors group">
                            {/* Gradient Blob */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out -z-10 blur-3xl",
                                feature.gradient
                            )} />

                            <div className="p-8 flex flex-col h-full justify-between relative z-10">
                                <div className="p-3 w-fit rounded-lg bg-white/5 border border-white/10">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400">{feature.description}</p>
                                </div>

                                <div className="absolute top-8 right-8 text-white/10 group-hover:text-white/30 transition-colors">
                                    <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
