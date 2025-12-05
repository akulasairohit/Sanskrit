"use client";

import { motion } from "framer-motion";
import { Search, Book, Network, MessageSquare } from "lucide-react";
import { useState } from "react";

interface HeroSectionProps {
    onSearch: (query: string) => void;
    onNavigate: (tab: "chat" | "dictionary" | "grammar") => void;
}

export function HeroSection({ onSearch, onNavigate }: HeroSectionProps) {
    const [query, setQuery] = useState("");

    const suggestions = [
        "Analyze: Rāma goes to the forest",
        "Translate: Dharma to English",
        "Explain: The concept of Karma"
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="relative z-30 flex flex-col h-screen w-full overflow-hidden">
            {/* Top Navigation */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full p-6 flex justify-between items-center"
            >
                <div className="text-2xl font-serif text-sanskrit-gold">Sanskrit</div>
                <nav className="flex gap-6 text-gray-300 font-sans text-sm">
                    <a href="#" className="hover:text-sanskrit-gold transition-colors">Learn</a>
                    <a href="#" className="hover:text-sanskrit-gold transition-colors">Resources</a>
                    <a href="#" className="hover:text-sanskrit-gold transition-colors">About</a>
                </nav>
            </motion.header>

            {/* Main Content - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20 px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-serif text-5xl md:text-7xl text-sanskrit-gold mb-8 drop-shadow-lg text-center"
                >
                    Sanskrit
                </motion.h1>

                {/* Feature Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-6 mb-12"
                >
                    <button
                        onClick={() => onNavigate("dictionary")}
                        className="group flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sanskrit-gold/50 transition-all duration-300 w-32 backdrop-blur-sm"
                    >
                        <div className="p-3 rounded-full bg-sanskrit-gold/10 text-sanskrit-gold mb-3 group-hover:scale-110 transition-transform">
                            <Book size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white">Dictionary</span>
                    </button>

                    <button
                        onClick={() => onNavigate("grammar")}
                        className="group flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sanskrit-gold/50 transition-all duration-300 w-32 backdrop-blur-sm"
                    >
                        <div className="p-3 rounded-full bg-sanskrit-gold/10 text-sanskrit-gold mb-3 group-hover:scale-110 transition-transform">
                            <Network size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white">Grammar</span>
                    </button>

                    <button
                        onClick={() => onNavigate("chat")}
                        className="group flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-sanskrit-gold/50 transition-all duration-300 w-32 backdrop-blur-sm"
                    >
                        <div className="p-3 rounded-full bg-sanskrit-gold/10 text-sanskrit-gold mb-3 group-hover:scale-110 transition-transform">
                            <MessageSquare size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-200 group-hover:text-white">Agent</span>
                    </button>
                </motion.div>

                {/* Search Bar */}
                <motion.form
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl relative z-50"
                >
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-sanskrit-gold to-lotus-pink rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative flex items-center bg-deep-space/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 shadow-2xl">
                            <Search className="w-6 h-6 text-sanskrit-gold mr-4" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ask anything about Sanskrit..."
                                className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 font-sans text-lg"
                                autoFocus
                            />
                        </div>
                    </div>
                </motion.form>

                {/* Suggestion Chips */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 mt-8"
                >
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => onSearch(s)}
                            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 transition-all hover:border-sanskrit-gold/50 hover:text-sanskrit-gold"
                        >
                            {s}
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Bottom Lotus */}
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none flex items-end justify-center"
            >
                <div className="relative w-full h-full">
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-lotus-pink blur-[100px] opacity-30 rounded-full"
                    />
                    <img
                        src="/assets/lotus.png"
                        alt="Lotus"
                        className="w-full h-full object-contain object-bottom drop-shadow-2xl"
                    />
                </div>
            </motion.div>
        </div>
    );
}
