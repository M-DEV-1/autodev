"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <div className="relative overflow-hidden bg-background pt-12 pb-14 text-center">
            <div
                className="absolute top-0 left-[-10%] w-[600px] h-[600px] opacity-40 mix-blend-screen pointer-events-none z-0 animate-in fade-in duration-1000 slide-in-from-left-10"
                style={{
                    backgroundImage: "url('/assets/hero-floating-tunnel.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: "blur(40px)"
                }}
            />

            <div
                className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] opacity-50 mix-blend-screen pointer-events-none z-0 animate-in fade-in duration-1000 slide-in-from-right-10"
                style={{
                    backgroundImage: "url('/assets/hero-floating-cube.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    filter: "blur(30px)"
                }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10 pt-16 md:pt-24">
                <div className="max-w-4xl mx-auto space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-3 drop-shadow-sm">
                            Build Software <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 animate-gradient">
                                At The Speed of Thought
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-5">
                            Coordinate planning, coding, and deployment with a single prompt.
                            Powered by the world&apos;s best AI engineering tools.
                        </p>

                        <div className="flex gap-4 justify-center">
                            <Button size="lg" className="h-10 px-8 text-base font-semibold shadow-lg shadow-orange-500/20">
                                Start Building
                            </Button>
                            <Button variant="outline" size="lg" className="h-10 px-8 text-base bg-background/50 backdrop-blur-sm border-slate-700">
                                GitHub
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
