"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
            <div className="rounded-full border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl shadow-black/50 px-4 md:px-6 h-14 flex items-center justify-between supports-[backdrop-filter]:bg-black/20">

                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="AutoDev"
                        width={24}
                        height={24}
                        className="h-6 w-6"
                    />
                    <span className="text-base font-bold tracking-tight text-white hidden sm:block">AutoDev</span>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground/80">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                    <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                </nav>

                <div className="flex items-center gap-3">
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white border-none rounded-full px-5 h-8 text-xs font-semibold">
                        Get Started
                    </Button>
                </div>
            </div>
        </header>
    );
}
