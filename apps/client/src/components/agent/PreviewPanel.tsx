
import { useState, useRef } from "react";
import { Loader2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewPanelProps {
    projectId: string;
}

export function PreviewPanel({ projectId }: PreviewPanelProps) {
    const [key, setKey] = useState(0); // For forcing refresh
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const previewUrl = `${process.env.NEXT_PUBLIC_API_URL}/preview/${projectId}/index.html`;

    const handleRefresh = () => {
        setIsLoading(true);
        setKey(prev => prev + 1);
    };

    return (
        <div className="h-full w-full flex flex-col bg-white relative">
            {/* Toolbar */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-3 z-20 border border-white/10 transition-opacity opacity-0 hover:opacity-100 duration-300">
                <div className="text-[10px] font-mono opacity-70 truncate max-w-[200px]">
                    /preview/{projectId}
                </div>
                <div className="h-3 w-px bg-white/20" />
                <button onClick={handleRefresh} className="hover:text-blue-400 transition-colors">
                    <RefreshCw className="w-3 h-3" />
                </button>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {/* Loading State Overlay */}
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm pointer-events-none">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                </div>
            )}

            <iframe
                key={key}
                ref={iframeRef}
                src={previewUrl}
                className="w-full h-full border-none bg-white"
                title="Preview"
                onLoad={() => setIsLoading(false)}
            />
        </div>
    );
}
