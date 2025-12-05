"use client";

import { useState } from "react";
import { Search, Book, Network, MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HomeViewProps {
    onSearch: (query: string) => void;
    onTabChange: (tab: "chat" | "dictionary" | "grammar" | "resources") => void;
}

export function HomeView({ onSearch, onTabChange }: HomeViewProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const suggestions = [
        { label: "Mahāvākya: Tat Tvam Asi", query: "What is the meaning of 'Tat Tvam Asi' from Chandogya Upanishad?" },
        { label: "Gita: Dharma Decline", query: "Analyze the verse 'Yadā yadā hi dharmasya' from Bhagavad Gita" },
        { label: "Rigveda: Truth is One", query: "Translate 'Ekaṁ sad viprā bahudhā vadanti' from Rigveda" },
        { label: "Vedantic AI Debate", query: "Simulate a debate between Advaita and Dvaita scholars about whether AI has consciousness, citing Vedic texts." },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-full w-full px-4 py-10 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl opacity-50" />
                {/* PSP Waves Background */}
                <img
                    src="/assets/psp_waves.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />

                {/* Existing Lotus */}
                <img
                    src="/assets/lotus.png"
                    alt="Lotus"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] max-w-full opacity-20 pointer-events-none"
                    style={{ marginBottom: "-50px" }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex flex-col items-center w-full max-w-3xl"
            >
                {/* Title */}
                <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6 md:mb-8 text-center drop-shadow-sm">
                    Sanskrit
                </h1>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 bg-secondary/30 p-1.5 rounded-3xl md:rounded-full backdrop-blur-sm border border-border/50">
                    <button
                        onClick={() => onTabChange("dictionary")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                        <Book size={16} />
                        Dictionary
                    </button>
                    <button
                        onClick={() => onTabChange("grammar")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    >
                        <Network size={16} />
                        Grammar
                    </button>
                    <button
                        onClick={() => { }} // Already on chat
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-background text-foreground shadow-sm border border-border/50"
                    >
                        <MessageSquare size={16} />
                        Agent
                    </button>
                </div>

                {/* Search Box */}
                <form onSubmit={handleSubmit} className="w-full relative mb-8 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                    <div className="relative flex items-center bg-card border border-border/50 rounded-2xl px-4 py-4 shadow-xl">
                        <Search className="w-6 h-6 text-muted-foreground mr-3" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask anything about Sanskrit..."
                            className="w-full bg-transparent border-none outline-none text-lg placeholder:text-muted-foreground/50"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!query.trim()}
                            className="p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles size={20} />
                        </button>
                    </div>
                </form>

                {/* Example Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => onSearch(s.query)}
                            className="flex flex-col items-start p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card hover:border-border hover:shadow-md transition-all text-left group"
                        >
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                                {s.label}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-2">
                                {s.query}
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
