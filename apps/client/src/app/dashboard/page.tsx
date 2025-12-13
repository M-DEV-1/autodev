'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { InteractiveTerminal } from "@/components/dashboard/InteractiveTerminal";
import { ProjectList } from "@/components/dashboard/ProjectList";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [isGuest, setIsGuest] = useState(false);
    return (
        <div className="min-h-screen bg-[#020202] text-white pt-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0 pointer-events-none" />

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">

                {/* Header */}
                <div className="mb-12 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-3 tracking-tight">
                        Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
                    </h2>
                    <p className="text-slate-400 text-lg">
                        {isGuest
                            ? "You are exploring in Guest Mode. Local changes only."
                            : "Create, deploy, and manage your autonomous projects."
                        }
                    </p>
                </div>

                {/* Interactive Terminal */}
                <InteractiveTerminal isGuest={isGuest} />

                {/* Projects Grid */}
                <div className="mt-16">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-200">
                        <span className="">Your Projects</span>
                    </h3>

                    {!isGuest ? (
                        <ProjectList />
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center backdrop-blur-sm">
                            <p className="text-slate-400 mb-2">Guest Mode Active</p>
                            <p className="text-slate-500 text-sm">
                                Sign in to save and manage your projects persistently.
                            </p>
                        </div>
                    )}
                </div>
            </main >
        </div >
    );
}
