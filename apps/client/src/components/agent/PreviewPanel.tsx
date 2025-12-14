import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, RefreshCw, ExternalLink, AlertCircle, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface PreviewPanelProps {
    projectId: string;
}

type PreviewState = 'idle' | 'loading' | 'ready' | 'error';

const LOADING_MESSAGES = [
    "Cline CLI is working hard right now...",
    "CodeRabbit is making sure ClineCLI doesn't stop working...",
    "Prompt to Preview: 10 minute delivery!!",
    "Initializing workspace...",
    "Installing dependencies (just kidding, no node_modules here)...",
    "Generating premium vanilla JS...",
    "Adding some sparkles...",
    "Almost there..."
];

export function PreviewPanel({ projectId }: PreviewPanelProps) {
    const [status, setStatus] = useState<PreviewState>('loading'); // Default to loading on mount
    const [key, setKey] = useState(0); // For forcing refresh
    const [msgIndex, setMsgIndex] = useState(0);
    const [githubUrl, setGithubUrl] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const pollInterval = useRef<NodeJS.Timeout>();
    const timeoutTimer = useRef<NodeJS.Timeout>();
    const msgInterval = useRef<NodeJS.Timeout>();

    const previewUrl = `/api/proxy/preview/${projectId}/index.html`;

    const stopPolling = () => {
        if (pollInterval.current) clearInterval(pollInterval.current);
        if (timeoutTimer.current) clearTimeout(timeoutTimer.current);
        if (msgInterval.current) clearInterval(msgInterval.current);
    };

    const startPolling = useCallback(() => {
        stopPolling();
        setStatus('loading');
        setMsgIndex(0);

        // Cycle messages every 3s
        msgInterval.current = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        }, 3000);

        // Timeout after 60s
        timeoutTimer.current = setTimeout(() => {
            stopPolling();
            setStatus('error');
        }, 60000);

        // Poll every 2s
        pollInterval.current = setInterval(async () => {
            try {
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
                // Ignore errors
            }
        }, 2000);
    }, [previewUrl]);

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
        <div className="h-full w-full flex flex-col bg-[#0A0A0B] relative isolate overflow-hidden">

            {/* Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0B]/80 backdrop-blur-md rounded-full border border-white/10 shadow-xl shadow-indigo-500/10">
                    <span className="text-[10px] text-zinc-400 font-mono max-w-[150px] truncate">
                        /preview/{projectId}
                    </span>
                    <div className="h-3 w-px bg-white/10" />
                    <button onClick={handleRefresh} className="text-zinc-400 hover:text-white transition-colors">
                        <RefreshCw className={cn("w-3 h-3", status === 'loading' && "animate-spin")} />
                    </button>
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                        <ExternalLink className="w-3 h-3" />
                    </a>
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

            {/* Loading Overlay */}
            {status === 'loading' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0A0B]/90 backdrop-blur-md">
                    {/* Glassbox Container */}
                    <div className="relative flex flex-col items-center p-8 rounded-3xl bg-[#0A0A0B]/50 border border-white/10 shadow-2xl shadow-indigo-500/20 backdrop-blur-xl max-w-sm w-full mx-6 overflow-hidden ring-1 ring-white/5">

                        {/* Dynamic Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-blue-500/10 opacity-50" />

                        {/* Content */}
                        <div className="relative flex flex-col items-center gap-4 text-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full" />
                                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin relative z-10" />
                            </div>

                            <h3 className="text-lg font-medium text-white tracking-tight">Building Preview</h3>

                            <div className="h-6 overflow-hidden w-full px-4">
                                <p key={msgIndex} className="text-sm text-zinc-400 animate-in slide-in-from-bottom-2 fade-in duration-300 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {LOADING_MESSAGES[msgIndex]}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar (Visual) */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-1/3 animate-[shimmer_2s_infinite]" />
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {status === 'error' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0A0A0B]">
                    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-red-500/5 border border-red-500/10 shadow-xl">
                        <AlertCircle className="w-8 h-8 text-red-500/80" />
                        <div className="text-center">
                            <h3 className="text-sm font-medium text-red-200">Preview Unavailable</h3>
                            <p className="text-xs text-red-400/60 mt-1">Timed out waiting for index.html</p>
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium rounded-lg transition-colors border border-red-500/10"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Iframe content */}
            {(status === 'ready' || status === 'loading') && (
                <iframe
                    key={key}
                    ref={iframeRef}
                    src={status === 'ready' ? previewUrl : 'about:blank'}
                    className="w-full h-full border-none bg-white font-sans"
                    title="Preview"
                    sandbox="allow-scripts allow-downloads allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-forms allow-modals"
                />
            )}
        </div>
    );
}
