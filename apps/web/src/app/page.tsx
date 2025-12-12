"use client";

import { Hero } from "@/components/layout/Hero";
import { GlassBox } from "@/components/terminal/GlassBox";
import { Features } from "@/components/layout/Features";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { PARTNERS } from "@/lib/constants";
import { TerminalFeed } from "@/components/terminal/TerminalFeed";
import { Marquee } from "@/components/ui/marquee";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />

            <div className="container mx-auto px-4 -mt-2 relative z-20">
                <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
                    <GlassBox className="min-h-[300px] md:min-h-[360px] shadow-2xl shadow-indigo-500/20 border-white/10 bg-[#0A0A0B]/80 backdrop-blur-3xl ring-1 ring-white/5">
                        <div className="p-8">
                            <TerminalFeed />
                        </div>
                    </GlassBox>
                </div>

                <div className="mt-24 mb-8 relative z-20 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    <p className="text-center text-sm font-medium text-slate-400 mb-5 uppercase tracking-wider">
                        Powered by
                    </p>
                    <div className="w-full max-w-6xl px-4 relative">
                        {/* Gradient masks for smooth fade effect */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                        <Marquee className="[--duration:30s] [--gap:3rem] py-4" pauseOnHover>
                            {PARTNERS.map((partner) => (
                                <Link
                                    href={partner.url}
                                    key={partner.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-center transition-opacity hover:opacity-100 opacity-60 grayscale hover:grayscale-0 duration-300 mx-4"
                                >
                                    <div className="h-8 md:h-10 w-auto relative">
                                        <Image
                                            src={partner.logo}
                                            alt={partner.name}
                                            width={160}
                                            height={40}
                                            className="h-full w-auto object-contain"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </Marquee>
                    </div>
                </div>
            </div>

            <Features />

            <Footer />
        </div>
    );
}
