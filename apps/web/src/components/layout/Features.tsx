"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, Box, Terminal, Zap, Fingerprint } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function Features() {
    const features = [
        {
            title: "Plan with Reasoning",
            description: "Uses Together AI to decompose potential PRs into actionable steps.",
            icon: Box,
            className: "md:col-span-2",
            image: "/assets/feature-blue-context.png"
        },
        {
            title: "Build in Sandbox",
            description: "Agents execution via Cline in secured containers.",
            icon: Terminal,
            className: "md:col-span-1",
            image: "/assets/feature-orange-context.png"
        },
        {
            title: "Deploy Instantly",
            description: "Seamless Kestra pipelines to Vercel.",
            icon: Zap,
            className: "md:col-span-1",
            image: "/assets/feature-pink-context.png"
        },
        {
            title: "Secure by Default",
            description: "Enterprise-grade encryption and access control for your repo.",
            icon: Fingerprint,
            className: "md:col-span-2",
            image: "/assets/feature-green-context.png"
        },
    ];

    return (
        <section id="features" className="container py-24 mx-auto px-4 md:px-6">
            <div className="mb-20 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
                    Everything you need to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                        automate your workflow
                    </span>
                </h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium">
                    Stop writing boilerplate. Start architecting systems.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={feature.className}
                    >
                        <Card className="h-full relative overflow-hidden bg-slate-950 border-white/5 hover:border-white/20 transition-all duration-500 group">
                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                            </div>

                            <div className="p-8 flex flex-col h-full justify-between relative z-10">
                                <div className="p-3 w-fit rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-300 font-medium leading-relaxed">{feature.description}</p>
                                </div>

                                <div className="absolute top-8 right-8 text-white/20 group-hover:text-white transition-colors">
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
