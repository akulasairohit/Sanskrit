"use client";

import { useState } from "react";
import { Send, Sparkles, Loader2, Network } from "lucide-react";
import { motion } from "framer-motion";
import { GrammarVisualization } from "./GrammarVisualization";

export function GrammarAnalysis() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [grammarData, setGrammarData] = useState<any>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setIsLoading(true);
        setError("");
        setGrammarData(null);

        try {
            // We use the chat endpoint but prompt it to perform grammar analysis
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: `Analyze the grammar of this Sanskrit sentence: ${input}`
                }),
            });
            const data = await res.json();

            if (data.grammarData) {
                setGrammarData(data.grammarData);
            } else {
                // If no structured data, maybe the model just explained it in text.
                // For now, let's show an error if no structured data is returned.
                // Or we could show the text response if we wanted.
                if (data.response) {
                    // Try to see if we can parse it or just show it? 
                    // The GrammarVisualization expects specific structure.
                    setError("Could not generate structured grammar analysis. Please try a different sentence.");
                } else {
                    setError("No analysis returned.");
                }
            }
        } catch (err) {
            setError("Error communicating with server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4 space-y-6 md:space-y-8 overflow-y-auto pb-24 md:pb-4">
            <div className="text-center space-y-4 mt-6 md:mt-10">
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 text-primary mb-2 md:mb-4">
                    <Network className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-serif text-foreground">Grammar Analysis</h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    Enter a Sanskrit sentence to see its morphological breakdown and semantic graph.
                </p>
            </div>

            <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto w-full">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter Sanskrit text (e.g., रामः वनं गच्छति)"
                        className="w-full bg-card border border-border/50 hover:border-primary/50 focus:border-primary transition-colors rounded-xl py-4 pl-6 pr-14 text-lg outline-none shadow-sm"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-2 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
                <button
                    onClick={() => setInput("भज गोविन्दं भज गोविन्दं गोविन्दं भज मूढमते")}
                    className="p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card hover:border-primary/50 transition-all text-left group"
                >
                    <span className="text-xs font-bold text-primary mb-1 block uppercase tracking-wider">Bhaja Govindam</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        भज गोविन्दं भज गोविन्दं...
                    </span>
                </button>
                <button
                    onClick={() => setInput("सत्यमेव जयते नानृतम्")}
                    className="p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card hover:border-primary/50 transition-all text-left group"
                >
                    <span className="text-xs font-bold text-primary mb-1 block uppercase tracking-wider">Mundaka Upanishad</span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        सत्यमेव जयते नानृतम्
                    </span>
                </button>
            </div>

            <div className="flex-1 min-h-[400px]">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white animate-pulse" />
                        </div>
                        <p className="text-muted-foreground animate-pulse">Analyzing grammar...</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-center">
                        {error}
                    </div>
                )}

                {grammarData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <GrammarVisualization data={grammarData} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
