"use client";

import { useState, useEffect, useMemo } from "react";
import { File, Folder, Search, ChevronRight, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileSystemItem {
    path: string;
    type: 'file' | 'dir';
    content?: string;
}

interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'dir';
    content?: string;
    children: FileNode[];
}

interface FileSystemPanelProps {
    projectId: string;
}

export function FileSystemPanel({ projectId }: FileSystemPanelProps) {
    const [files, setFiles] = useState<FileSystemItem[]>([]);
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        fetch(`http://localhost:3002/api/projects/${projectId}/files`)
            .then(res => res.json())
            .then(data => {
                if (data.files) {
                    setFiles(data.files);
                }
            })
            .catch(err => console.error("Failed to fetch files:", err))
            .finally(() => setLoading(false));
    }, [projectId]);

    const fileTree = useMemo(() => {
        const root: FileNode[] = [];
        const map = new Map<string, FileNode>();

        // Sort files so folders come first? Or flat list processing.
        // We received flat paths like "src", "src/index.ts"
        // Need to sort by path length or handle parents first if implied.
        // Actually, backend returns full traversal, so we can build it safely?
        // Paths are relative "src/index.ts".

        // 1. Create all nodes
        files.forEach(file => {
            const parts = file.path.split('/');
            const name = parts[parts.length - 1];
            map.set(file.path, {
                name,
                path: file.path,
                type: file.type,
                content: file.content,
                children: []
            });
        });

        // 2. Assemble tree
        files.forEach(file => {
            const node = map.get(file.path)!;
            const parts = file.path.split('/');
            if (parts.length === 1) {
                root.push(node);
            } else {
                const parentPath = parts.slice(0, -1).join('/');
                const parent = map.get(parentPath);
                if (parent) {
                    parent.children.push(node);
                } else {
                    // Orphan or parent missed? Just add to root as fallback
                    root.push(node);
                }
            }
        });

        // 3. Sort nodes (Directories first, then files, alphabetical)
        const sortNodes = (nodes: FileNode[]) => {
            nodes.sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'dir' ? -1 : 1;
            });
            nodes.forEach(node => sortNodes(node.children));
        };
        sortNodes(root);

        return root;

    }, [files]);

    const toggleFolder = (path: string) => {
        const newSet = new Set(expandedFolders);
        if (newSet.has(path)) {
            newSet.delete(path);
        } else {
            newSet.add(path);
        }
        setExpandedFolders(newSet);
    };

    const FileTreeItem = ({ node, level = 0 }: { node: FileNode, level?: number }) => {
        const isExpanded = expandedFolders.has(node.path);
        const paddingLeft = level * 12 + 12;

        return (
            <div>
                <div
                    className={cn(
                        "flex items-center gap-1 py-1 hover:bg-white/5 cursor-pointer text-slate-400 hover:text-slate-200 select-none",
                        selectedFile?.path === node.path && "bg-white/10 text-white"
                    )}
                    style={{ paddingLeft: `${paddingLeft}px` }}
                    onClick={() => {
                        if (node.type === 'dir') {
                            toggleFolder(node.path);
                        } else {
                            setSelectedFile(node);
                        }
                    }}
                >
                    {node.type === 'dir' && (
                        isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                    )}
                    {node.type === 'file' && <File className="w-3 h-3 ml-[16px]" style={{ marginLeft: node.type === 'file' ? (level > 0 ? 0 : 16) : 0 }} />}
                    {/* Adjustment for icon alignment: Folders have chevron, files don't */}
                    {/* Actually cleaner: */}
                    {node.type === 'file' && <div className="w-3" />}

                    <span className="truncate">{node.name}</span>
                </div>
                {isExpanded && node.children.map(child => (
                    <FileTreeItem key={child.path} node={child} level={level + 1} />
                ))}
            </div>
        );
    };

    return (
        <div className="h-full w-full flex bg-[#0F0F11] font-mono text-xs">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/5 flex flex-col bg-[#050505]">
                <div className="h-10 flex items-center justify-between px-3 border-b border-white/5 shrink-0 bg-black/20">
                    <span className="font-medium text-slate-400">Files</span>
                    <div className="flex gap-2">
                        <Search className="w-3.5 h-3.5 text-slate-600 cursor-pointer hover:text-slate-400" />
                        <span className="text-[10px] text-slate-600 cursor-pointer hover:text-slate-400" onClick={() => {
                            // Refresh
                            setLoading(true);
                            fetch(`http://localhost:3002/api/projects/${projectId}/files`)
                                .then(res => res.json())
                                .then(data => data.files && setFiles(data.files))
                                .finally(() => setLoading(false));
                        }}>
                            ↻
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-slate-600 text-center">Loading...</div>
                    ) : (
                        <div className="py-2">
                            {fileTree.map(node => (
                                <FileTreeItem key={node.path} node={node} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Area: Editor */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0F0F11]">
                {/* Tabs */}
                {selectedFile ? (
                    <>
                        <div className="flex items-center bg-[#050505] border-b border-white/5">
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#0F0F11] border-r border-white/5 border-t-2 border-t-blue-500 text-slate-300">
                                <File className="w-3 h-3 text-blue-400" />
                                <span>{selectedFile.name}</span>
                                <X
                                    className="w-3 h-3 ml-2 text-slate-600 hover:text-slate-400 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFile(null);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-0 overflow-auto text-slate-300">
                            {/* Simple Code View */}
                            <div className="p-4">
                                <pre className="font-mono text-xs leading-6">
                                    <code>{selectedFile.content || 'Binary or empty'}</code>
                                </pre>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-600">
                        Select a file to view
                    </div>
                )}
            </div>
        </div>
    );
}
