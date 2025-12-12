"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TerminalIcon, CodeRabbitIcon } from "@/components/ui/Icons";
import { LayoutDashboard, Settings, Layers, Box } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/workflows", label: "Workflows", icon: Layers },
        { href: "/deployments", label: "Deployments", icon: Box },
        { href: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col z-50">
            {/* Brand */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-2 text-primary">
                    <CodeRabbitIcon className="w-8 h-8 text-primary" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                        AutoDev
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Status */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-950 rounded-lg border border-slate-800/50">
                    <TerminalIcon className="w-5 h-5 text-green-500" />
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-300">Agent Status</span>
                        <span className="text-[10px] text-green-400 capitalize">● Online (Idle)</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
