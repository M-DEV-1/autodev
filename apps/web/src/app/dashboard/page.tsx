'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GlassBox } from "@/components/terminal/GlassBox";
import { cn } from "@/lib/utils";

interface Repo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    language: string;
    updated_at: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            if (status === 'loading') return;

            const guest = localStorage.getItem('autodev_guest');
            if (guest === 'true') {
                setIsGuest(true);
                setLoading(false);
                return;
            }

            if (status === 'unauthenticated') {
                router.push('/');
                return;
            }

            if (status === 'authenticated') {
                // Fetch repos via Next.js API route
                try {
                    const res = await fetch('/api/repos');
                    const data = await res.json();
                    if (data.repos) {
                        setRepos(data.repos);
                    }
                } catch (error) {
                    console.error("Failed to fetch repos", error);
                }
                setLoading(false);
            }
        };

        checkAuth();
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#020202] text-white">
                <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white pt-24 relative overflow-hidden">

            <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0 pointer-events-none" />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="animate-spin h-8 w-8 border-2 border-white/20 border-t-white rounded-full mb-4" />
                        <p className="text-slate-400 font-mono text-sm">Loading workspace...</p>
                    </div>
                ) : (
                    <>
                        {/* Welcome Section */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold mb-3 tracking-tight">
                                Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
                            </h2>
                            <p className="text-slate-400 text-lg">
                                {isGuest
                                    ? "You are exploring in Guest Mode. Changes won't be saved."
                                    : "Select a project to start coding."
                                }
                            </p>
                        </div>


                        <section className="mb-16">
                            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-200">
                                <span className="">Create New</span>
                            </h3>
                            <div onClick={() => router.push('/agent?flow=new')} className="cursor-pointer group">
                                <GlassBox className="min-h-[200px] md:min-h-[240px] hover:border-white/30 transition-colors">
                                    <div className="p-8 flex flex-col items-start justify-center h-full relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />

                                        <div className="relative z-10">
                                            <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg border border-white/10">
                                                <span className="text-2xl">✨</span>
                                            </div>
                                            <h4 className="text-xl font-bold mb-2">Start a New Project</h4>
                                            <p className="text-slate-400 max-w-lg mb-6">
                                                Initialize a new project from scratch. Our agent will help you scaffold the structure, set up dependencies, and write the initial code.
                                            </p>
                                            <div className="flex gap-2 text-xs font-mono text-slate-500">
                                                <span className="px-2 py-1 bg-white/5 rounded border border-white/5">Template-free</span>
                                                <span className="px-2 py-1 bg-white/5 rounded border border-white/5">AI-Powered</span>
                                            </div>
                                        </div>
                                    </div>
                                </GlassBox>
                            </div>
                        </section>

                        {/* Existing Repositories */}
                        {!isGuest && (
                            <section>
                                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-slate-200">
                                    <span className="">Your Repositories</span>
                                </h3>

                                {repos.length === 0 ? (
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center backdrop-blur-sm">
                                        <p className="text-slate-400 mb-4">No repositories found</p>
                                        <p className="text-slate-500 text-sm">
                                            Create a repository on GitHub first, then refresh this page
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {repos.map(repo => (
                                            <div
                                                key={repo.id}
                                                onClick={() => router.push(`/agent?repo=${repo.full_name}`)}
                                                className="group relative bg-[#0A0A0B]/60 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl p-6 cursor-pointer transition-all hover:shadow-2xl hover:shadow-black/50 overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                                <div className="relative z-10">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <h4 className="text-base font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                                                            {repo.name}
                                                        </h4>
                                                        {repo.language && (
                                                            <span className="px-2 py-0.5 bg-white/10 text-[10px] font-medium text-slate-300 rounded-full shrink-0 ml-2 border border-white/5">
                                                                {repo.language}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                                        {repo.description || 'No description available for this repository.'}
                                                    </p>

                                                    <div className="flex items-center justify-between mt-auto">
                                                        <span className="text-xs text-slate-600 font-mono">
                                                            {new Date(repo.updated_at).toLocaleDateString(undefined, {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                        <span className="text-xs font-medium text-blue-500 group-hover:translate-x-1 transition-transform">
                                                            Open Agent →
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
