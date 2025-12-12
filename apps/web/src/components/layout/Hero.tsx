"use client";

import { motion } from "framer-motion";
import { ClineIcon, KestraIcon, VercelIcon, CodeRabbitIcon, TogetherAIcon, OumiIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <div className="relative overflow-hidden bg-background pt-20 pb-24 text-center">
            {/* Grainy Gradient Background */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] opacity-40 blur-3xl pointer-events-none z-0"
                style={{
                    backgroundImage: "url('/grainy-gradient.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />

            {/* Overlay Gradient to fade into background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-500 mb-6 backdrop-blur-sm">
                            <span>🚀 Autonomous Development Platform</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-sm">
                            Build Software <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 animate-gradient">
                                At The Speed of Thought
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Coordinate planning, coding, and deployment with a single prompt.
                            Powered by the world&apos;s best AI engineering tools.
                        </p>

                        <div className="flex gap-4 justify-center">
                            <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-orange-500/20">
                                Start Building
                            </Button>
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm border-slate-700">
                                View Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
