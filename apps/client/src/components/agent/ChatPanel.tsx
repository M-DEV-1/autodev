
"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { useEffect, useRef, useCallback, memo } from "react";
import { useProjectStore } from "@/store/project";

interface ChatPanelProps {
    projectId: string;
    initialPrompt?: string;
}

const ChatMessageItem = memo(({ msg }: { msg: { role: 'user' | 'agent', content: string } }) => (
    <div className={cn("flex flex-col gap-2 max-w-[90%]", msg.role === 'user' ? "ml-auto items-end" : "items-start")}>
        {/* Bubble */}
        <div className={cn(
            "px-4 py-3 text-sm leading-relaxed shadow-sm",
            msg.role === 'agent'
                ? "bg-[#1A1A1C] text-slate-200 rounded-2xl rounded-tl-sm border border-white/5"
                : "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
        )}>
            {msg.content}
        </div>
        {/* Avatar / Metadata (Minimal) */}
        <div className="text-[10px] text-slate-600 px-1">
            {msg.role === 'agent' ? 'AutoDev' : 'You'}
        </div>
    </div>
));
ChatMessageItem.displayName = 'ChatMessageItem';

export function ChatPanel({ projectId, initialPrompt }: ChatPanelProps) {
    const { messages, addMessage } = useProjectStore();
    const [input, setInput] = useState("");
    const hasStartedRef = useRef(false);

    const handleSend = useCallback(async (msgContent?: string) => {
        const text = msgContent || input;
        if (!text.trim()) return;

        if (!msgContent) {
            addMessage({ role: 'user', content: text });
            setInput("");
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectId: projectId,
                    prompt: text
                })
            });

            if (!response.ok) throw new Error('Failed to start agent');

            addMessage({ role: 'agent', content: "I've started working on that. Check the terminal for live updates." });
        } catch (error) {
            console.error(error);
            addMessage({ role: 'agent', content: "Sorry, something went wrong starting the agent." });
        }
    }, [input, addMessage, projectId]);

    // Initial Send Logic
    useEffect(() => {
        if (initialPrompt && !hasStartedRef.current) {
            hasStartedRef.current = true;
            addMessage({ role: 'user', content: initialPrompt });
            handleSend(initialPrompt);
        }
    }, [initialPrompt, handleSend, addMessage]);

    return (
        <div className="h-full flex flex-col bg-transparent">
            {/* Header / Top Bar */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 shrink-0 bg-transparent">
                <span className="text-sm font-medium text-slate-400">Agent Chat</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto space-y-6 p-4">
                {messages.map((msg, i) => (
                    <ChatMessageItem key={i} msg={msg} />
                ))}
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                        <p>No messages yet.</p>
                    </div>
                )}
            </div>

            {/* Input Area (Collapsed View) */}
            <div className="p-4 bg-transparent shrink-0">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-md transition-opacity opacity-0 group-hover:opacity-100" />
                    <Input
                        placeholder="Ask AutoDev to change something..."
                        className="relative pr-12 bg-[#1A1A1C] border-white/10 text-slate-200 placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:border-white/20 h-14 rounded-xl shadow-lg"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button
                        size="icon"
                        onClick={() => handleSend()}
                        className="absolute right-2 top-2 h-10 w-10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
