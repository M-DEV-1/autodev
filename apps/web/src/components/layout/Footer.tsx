"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-4 md:px-6">


                <div className="mb-20 relative rounded-3xl overflow-hidden border border-white/10 group">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/assets/feature-orange-context.png"
                            alt="Ready to ship"
                            fill
                            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
                        <div className="absolute inset-0 bg-black/40" />
                    </div>

                    <div className="relative z-10 p-12 md:p-20 text-center">
                        <h3 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-white drop-shadow-lg">
                            Ready to Ship <br className="md:hidden" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                                Faster?
                            </span>
                        </h3>
                        <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                            Join thousands of developers using AutoDev to automate their coding workflows.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-10 h-14 text-lg font-bold shadow-xl transition-all hover:scale-105">
                                Start for Free
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <div className="flex items-center gap-2">
                            <Image src="/logo.svg" alt="AutoDev" width={32} height={32} className="h-8 w-8" />
                            <span className="text-xl font-bold text-white">AutoDev</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Autonomous Development Platform powered by the next generation of AI agents.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Integrations</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">API Reference</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Community</Link></li>
                            <li><Link href="#" className="hover:text-orange-500 transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Give me</h4>
                        <p className="text-xs text-slate-400">your data.</p>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter email"
                                className="bg-slate-900 border-slate-800 text-white focus-visible:ring-orange-500"
                            />
                            <Button size="sm" variant="secondary">Go</Button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400">
                        © {new Date().getFullYear()} AutoDev Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-slate-600">
                        <Github href="https://github.com/M-DEV-1/autodev" className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Twitter href="https://x.com/mdev_1" className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Linkedin href="https://linkedin.com/in/ksmahadevan" className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
