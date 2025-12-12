"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeRabbitIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

export function Header() {
    return (
        <header className="sticky top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <CodeRabbitIcon className="h-6 w-6 text-orange-500" />
                    <span className="text-lg font-bold tracking-tight text-white">AutoDev</span>
                </div>

                {/* Nav Links - Hidden on mobile, flex on md */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-white">
                        Log in
                    </Button>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white border-none shadow-lg shadow-orange-500/20 rounded-full px-6">
                        Get Started
                    </Button>
                </div>
            </div>
        </header>
    );
}
