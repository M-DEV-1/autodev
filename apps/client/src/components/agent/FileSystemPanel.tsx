import { useState, useEffect, useMemo, useCallback } from "react";
import { File, Folder, Search, ChevronRight, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore, FileNode } from "@/store/project";



interface FileSystemPanelProps {
    projectId: string;
}

export function FileSystemPanel({ projectId }: FileSystemPanelProps) {
    const { files, fetchFiles, activeFile, setActiveFile } = useProjectStore();
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        fetchFiles(projectId).finally(() => setLoading(false));
    }, [projectId, fetchFiles]);

    const toggleFolder = useCallback((path: string) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(path)) {
                newSet.delete(path);
            } else {
                newSet.add(path);
            }
            return newSet;
        });
    }, []);

    // Placeholder for buildTree function, assuming it will be defined elsewhere or is a utility.
    // For now, we'll just return the files as is to avoid breaking the code.
    // In a real scenario, `buildTree` would transform the flat `files` array into a hierarchical structure.
    const buildTree = (nodes: FileNode[]): FileNode[] => {
        // This is a simplified placeholder. A real buildTree function would construct a tree.
        // For the current context, we'll assume `files` is already a tree or `buildTree` is a no-op.
        return nodes;
    };

    const fileStructure = useMemo(() => {
        return buildTree(files);
    }, [files]);

    const FileTreeItem = useMemo(() => {
        const Item = ({ node, level = 0 }: { node: FileNode, level?: number }) => {
            const isExpanded = expandedFolders.has(node.path);
            const paddingLeft = level * 12 + 12;

            return (
                <div>
                    <div
                        className={cn(
                            "flex items-center gap-1 py-1 hover:bg-white/5 cursor-pointer text-slate-400 hover:text-slate-200 select-none",
                            activeFile?.path === node.path && "bg-white/10 text-white"
                        )}
                        style={{ paddingLeft: `${paddingLeft}px` }}
                        onClick={() => {
                            if (node.type === 'dir') {
                                toggleFolder(node.path);
                            } else {
                                setActiveFile(node);
                            }
                        }}
                    >
                        {node.type === 'dir' && (
                            isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                        )}
                        {node.type === 'file' && <File className="w-3 h-3 ml-[16px]" style={{ marginLeft: node.type === 'file' ? (level > 0 ? 0 : 16) : 0 }} />}
                        {node.type === 'file' && <div className="w-3" />}

                        <span className="truncate">{node.name}</span>
                    </div>
                    {isExpanded && node.children.map(child => (
                        <Item key={child.path} node={child} level={level + 1} />
                    ))}
                </div>
            );
        };
        return Item;
    }, [expandedFolders, activeFile, setActiveFile, toggleFolder]);

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
                            fetchFiles(projectId).finally(() => setLoading(false));
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
                            {files.map(node => (
                                <FileTreeItem key={node.path} node={node} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Area: Editor */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0F0F11]">
                {/* Tabs */}
                {activeFile ? (
                    <>
                        <div className="flex items-center bg-[#050505] border-b border-white/5">
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#0F0F11] border-r border-white/5 border-t-2 border-t-blue-500 text-slate-300">
                                <File className="w-3 h-3 text-blue-400" />
                                <span>{activeFile.name}</span>
                                <X
                                    className="w-3 h-3 ml-2 text-slate-600 hover:text-slate-400 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveFile(null);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-0 overflow-auto text-slate-300">
                            {/* Simple Code View */}
                            <div className="p-4">
                                <pre className="font-mono text-xs leading-6">
                                    <code>{activeFile.content || 'Binary or empty'}</code>
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
