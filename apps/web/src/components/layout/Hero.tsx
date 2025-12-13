"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function Hero() {
    const router = useRouter();

    const handleGuestLogin = () => {
        // Simple guest mode logic
        localStorage.setItem('autodev_guest', 'true');
        router.push('/dashboard');
    };

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

                        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white mb-3 drop-shadow-sm">
                            Build Software <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-blue-500 animate-gradient">
                                At The Speed of Thought
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-5">
                            Coordinate planning, coding, and deployment with a single prompt.
                        </p>

                        <div className="flex gap-4 justify-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="lg" className="h-10 px-8 text-base font-semibold shadow-lg shadow-orange-500/20 bg-orange-700 hover:bg-orange-600 text-white">
                                        Start Building
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800 text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-bold">Welcome to AutoDev</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Choose how you want to get started.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-4 py-4">
                                        <Button
                                            size="lg"
                                            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                                            className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white flex items-center gap-2"
                                        >
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" /></svg>
                                            Sign in with GitHub
                                        </Button>

                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-gray-700" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-gray-900 px-2 text-gray-500">Or continue as</span>
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={handleGuestLogin}
                                            className="w-full border-gray-700 hover:bg-gray-800 hover:text-white"
                                        >
                                            Guest (Sandbox Mode)
                                        </Button>
                                        <p className="text-xs text-center text-gray-500 mt-2">
                                            Guest mode allows you to create projects but requires sign-in to save or deploy.
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <a href="https://github.com/M-DEV-1/autodev" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="lg" className="h-10 px-8 text-base bg-background/50 backdrop-blur-sm border-slate-700">
                                    View on GitHub
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
