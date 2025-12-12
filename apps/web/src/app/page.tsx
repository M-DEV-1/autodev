"use client";

import { Hero } from "@/components/layout/Hero";
import { GlassBox } from "@/components/terminal/GlassBox";
import { Features } from "@/components/layout/Features";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { PARTNERS } from "@/lib/constants";
import { TerminalFeed } from "@/components/terminal/TerminalFeed";

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
                    <p className="text-center text-sm font-medium text-slate-500 mb-5 uppercase tracking-wider">
                        Powered by
                    </p>
                    <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-8 md:gap-14 w-full max-w-6xl px-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {PARTNERS.map((partner) => (
                            <Link
                                href={partner.url}
                                key={partner.name}
                                className="group relative flex items-center justify-center transition-transform hover:scale-110 duration-300"
                            >
                                <div className="h-12 md:h-8 w-auto relative">
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
                    </div>
                </div>
            </div>

            <Features />

            <Footer />
        </div>
    );
}
