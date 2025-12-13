'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

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

    const handleSignOut = async () => {
        if (isGuest) {
            localStorage.removeItem('autodev_guest');
            router.push('/');
        } else {
            await signOut({ callbackUrl: '/' });
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            AutoDev
                        </h1>
                        {isGuest ? (
                            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded text-xs">
                                GUEST MODE
                            </span>
                        ) : session?.user && (
                            <div className="flex items-center gap-2 text-sm">
                                {session.user.image && (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        className="w-6 h-6 rounded-full"
                                    />
                                )}
                                <span className="text-gray-400">@{session.user.name}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                        {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
                        <p className="text-gray-400">Loading your workspace...</p>
                    </div>
                ) : (
                    <>
                        {/* Welcome Section */}
                        <div className="mb-12">
                            <h2 className="text-4xl font-bold mb-3">
                                Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
                            </h2>
                            <p className="text-gray-400 text-lg">
                                {isGuest
                                    ? "You are exploring in Guest Mode. Changes won't be saved."
                                    : "Choose a repository to start building with AutoDev"
                                }
                            </p>
                        </div>

                        {/* Start New Project */}
                        <section className="mb-12">
                            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <span className="text-2xl">🚀</span>
                                Start Fresh
                            </h3>
                            <div
                                onClick={() => router.push('/agent?flow=new')}
                                className="group relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-2 border-blue-500/30 hover:border-blue-500 rounded-xl p-8 cursor-pointer transition-all hover:scale-[1.02]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="text-xl font-bold mb-2">Create New Project</h4>
                                            <p className="text-gray-400">
                                                Start a new project from scratch with AutoDev. We'll scaffold everything for you.
                                            </p>
                                        </div>
                                        <div className="text-4xl group-hover:scale-110 transition-transform">
                                            ✨
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-sm text-gray-500">
                                        <span className="px-3 py-1 bg-gray-800/50 rounded-full">Template-based</span>
                                        <span className="px-3 py-1 bg-gray-800/50 rounded-full">Quick setup</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Existing Repositories */}
                        {!isGuest && (
                            <section>
                                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                    <span className="text-2xl">📦</span>
                                    Your Repositories
                                </h3>

                                {repos.length === 0 ? (
                                    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-12 text-center">
                                        <p className="text-gray-400 mb-4">No repositories found</p>
                                        <p className="text-gray-500 text-sm">
                                            Create a repository on GitHub first, then refresh this page
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {repos.map(repo => (
                                            <div
                                                key={repo.id}
                                                onClick={() => router.push(`/agent?repo=${repo.full_name}`)}
                                                className="group bg-gray-800/50 backdrop-blur border border-gray-700 hover:border-blue-500 rounded-lg p-6 cursor-pointer transition-all hover:scale-[1.02]"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <h4 className="text-lg font-semibold group-hover:text-blue-400 transition-colors line-clamp-1">
                                                        {repo.name}
                                                    </h4>
                                                    {repo.language && (
                                                        <span className="px-2 py-1 bg-gray-700 text-xs rounded-full shrink-0 ml-2">
                                                            {repo.language}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                                    {repo.description || 'No description'}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500">
                                                        Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                    </span>
                                                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium text-sm transition-colors">
                                                        Launch →
                                                    </button>
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
