import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, RefreshCw, ExternalLink, AlertCircle, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface PreviewPanelProps {
    projectId: string;
}

type PreviewState = 'idle' | 'loading' | 'ready' | 'error';

export function PreviewPanel({ projectId }: PreviewPanelProps) {
    const [status, setStatus] = useState<PreviewState>('loading'); // Default to loading on mount
    const [key, setKey] = useState(0); // For forcing refresh
    const [msgIndex, setMsgIndex] = useState(0);
    const [githubUrl, setGithubUrl] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const pollInterval = useRef<NodeJS.Timeout>();
    const timeoutTimer = useRef<NodeJS.Timeout>();

    const previewUrl = `/api/proxy/preview/${projectId}/index.html`;

    const stopPolling = () => {
        if (pollInterval.current) clearInterval(pollInterval.current);
        if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
    };

    const startPolling = useCallback(() => {
        stopPolling();
        setStatus('loading');

        // Timeout after 60s
        timeoutTimer.current = setTimeout(() => {
            stopPolling();
            setStatus('error');
        }, 60000);

        // Poll every 2s
        pollInterval.current = setInterval(async () => {
            try {
                // We use HEAD or GET to check if file exists
                // Note: The proxy/backend must handle this route
                const res = await fetch(previewUrl, {
                    method: 'HEAD',
                    cache: 'no-store'
                });

                if (res.ok) {
                    stopPolling();
                    setStatus('ready');
                    setKey(prev => prev + 1); // Force iframe reload
                    // Trigger confetti
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            } catch (e) {
                // Ignore errors and keep polling
            }
        }, 2000);
    }, [previewUrl]);

    // Start polling on mount
    useEffect(() => {
        startPolling();
        // Fetch project for github url
        fetch(`/api/proxy/projects/${projectId}`).then(res => res.json()).then(data => {
            if (data.project?.githubUrl) {
                setGithubUrl(data.project.githubUrl);
            }
        }).catch(console.error);

        return () => stopPolling();
    }, [projectId, startPolling]);

    const handleRefresh = () => {
        startPolling();
    };

    return (
        <div className="h-full w-full flex flex-col bg-white relative">
            {/* Toolbar */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-3 z-20 border border-white/10 transition-opacity hover:opacity-100 opacity-0 duration-300">
                <div className="text-[10px] font-mono opacity-70 truncate max-w-[200px]">
                    /preview/{projectId}
                </div>
                <div className="h-3 w-px bg-white/10" />

                {githubUrl && (
                    <>
                        <a
                            href={`https://vercel.com/new/import?repository-url=${encodeURIComponent(githubUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium text-white bg-black hover:bg-neutral-900 px-2 py-0.5 rounded transition-colors"
                        >
                            <Rocket className="w-3 h-3" />
                            Deploy
                        </a>
                        <div className="h-3 w-px bg-white/10" />
                    </>
                )}

                <button onClick={handleRefresh} className="text-zinc-400 hover:text-white transition-colors">
                    <RefreshCw className={cn("w-3 h-3", status === 'loading' && "animate-spin")} />
                </button>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {/* States Overlay */}
            {status === 'loading' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                    <p className="text-sm font-medium text-slate-600 bg-white/80 px-3 py-1 rounded-full shadow-sm">
                        Building your project...
                    </p>
                </div>
            )}

            {status === 'error' && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-sm">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-sm font-medium text-red-600 mb-4">Preview timed out</p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-white text-sm font-medium rounded-md shadow-sm border hover:bg-gray-50"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Iframe */}
            {(status === 'ready' || status === 'loading') && (
                <iframe
                    key={key}
                    ref={iframeRef}
                    src={status === 'ready' ? previewUrl : 'about:blank'}
                    className="w-full h-full border-none bg-white"
                    title="Preview"
                />
            )}
        </div>
    );
}
