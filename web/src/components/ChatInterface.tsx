"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { GrammarVisualization } from "./GrammarVisualization";

import { WelcomeScreen } from "./WelcomeScreen";

interface Message {
    role: "user" | "model";
    content: string;
    toolUsed?: string;
    grammarData?: any;
}

export function ChatInterface() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage }),
            });
            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                {
                    role: "model",
                    content: data.response || "Sorry, something went wrong.",
                    toolUsed: data.tool,
                    grammarData: data.grammarData
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                { role: "model", content: "Error communicating with server." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full relative">
            {messages.length > 0 && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={() => setMessages([])}
                        className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                        Clear Chat
                    </button>
                </div>
            )}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 scrollbar-hide">
                {messages.length === 0 && (
                    <WelcomeScreen setInput={setInput} />
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex gap-4",
                            msg.role === "user" ? "justify-end" : "justify-start"
                        )}
                    >
                        {msg.role === "model" && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        )}

                        <div className={cn(
                            "max-w-[80%] rounded-2xl p-4 shadow-sm",
                            msg.role === "user"
                                ? "bg-secondary text-secondary-foreground rounded-tr-sm"
                                : "bg-card border border-border/50 text-card-foreground rounded-tl-sm w-full"
                        )}>
                            {msg.toolUsed && (
                                <div className="text-xs font-mono text-muted-foreground mb-2 flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Used tool: {msg.toolUsed}
                                </div>
                            )}
                            <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                            {/* Grammar Visualization */}
                            {msg.grammarData && (
                                <GrammarVisualization data={msg.grammarData} />
                            )}
                        </div>

                        {msg.role === "user" && (
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                                <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                        )}
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 mt-1">
                            <Sparkles className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10">
                <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter a prompt here"
                        className="w-full bg-secondary/50 hover:bg-secondary/80 focus:bg-secondary transition-colors border-none rounded-full py-4 pl-6 pr-14 text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 p-2 bg-transparent hover:bg-secondary rounded-full transition-colors disabled:opacity-50 text-primary"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                </form>
                <p className="text-center text-xs text-muted-foreground mt-3">
                    Gemini may display inaccurate info, including about people, so double-check its responses.
                </p>
            </div>
        </div>
    );
}
