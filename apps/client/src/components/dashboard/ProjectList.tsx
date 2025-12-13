"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Folder, GitBranch, Clock } from "lucide-react";


interface Project {
    _id: string;
    name: string;
    description?: string;
    githubUrl?: string;
    status: 'active' | 'archived';
    updatedAt: string;
}

export function ProjectList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/projects');
                const data = await res.json();
                if (data.projects) {
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse border border-white/5" />
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <Folder className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-slate-200 mb-1">No projects found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    Get started by creating a new project via the terminal above.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <div
                    key={project._id}
                    onClick={() => router.push(`/project/${project._id}`)}
                    className="group relative bg-[#0A0A0B] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all cursor-pointer hover:shadow-2xl hover:shadow-black/50 overflow-hidden"
                >
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-white/5">
                                    <span className="text-sm font-bold text-blue-400">
                                        {project.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-mono">
                                        {project.githubUrl ? 'Synced' : 'Local'}
                                    </p>
                                </div>
                            </div>
                            <span className={`w-2 h-2 rounded-full ${project.status === 'active' ? 'bg-green-500' : 'bg-slate-500'
                                }`} />
                        </div>

                        <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">
                            {project.description || 'No description provided.'}
                        </p>

                        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                                <GitBranch className="w-3.5 h-3.5" />
                                <span>main</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
