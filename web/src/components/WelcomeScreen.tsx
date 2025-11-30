"use client";

import { Sparkles } from "lucide-react";

interface SuggestionCardProps {
    title: string;
    text: string;
    onClick: () => void;
}

function SuggestionCard({ title, text, onClick }: SuggestionCardProps) {
    return (
        <button
            onClick={onClick}
            className="p-4 bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-border rounded-xl text-left transition-all group"
        >
            <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{title}</div>
            <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {text}
            </div>
        </button>
    );
}

interface WelcomeScreenProps {
    setInput: (value: string) => void;
}

export function WelcomeScreen({ setInput }: WelcomeScreenProps) {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center space-y-6" style={{ animationDelay: "0.2s" }}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
                Hello, Sanskrit Scholar
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                This MCP server is uniquely designed to provide authenticated, hallucination-free access to Vedic knowledge and Sanskrit grammar. It enables AI agents to communicate in valid Sanskrit and debate philosophical concepts with scholarly precision. Use the tools below to translate texts, query ancient wisdom, or simulate multi-agent debates.
            </p>

            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {["Translation", "Vedic Knowledge", "Grammar Validation", "AI Debates"].map((tool) => (
                    <span key={tool} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                        {tool}
                    </span>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
                <SuggestionCard
                    title="Translate to Sanskrit"
                    text="Translate 'Truth alone triumphs'"
                    onClick={() => setInput("Translate 'Truth alone triumphs' to Sanskrit")}
                />
                <SuggestionCard
                    title="Vedic Knowledge"
                    text="What is Dharma?"
                    onClick={() => setInput("What do the Vedas say about Dharma?")}
                />
                <SuggestionCard
                    title="AI Debate Simulation"
                    text="Start a debate about AI agents"
                    onClick={() => setInput("Start a debate about AI agents between Advaita and Dvaita schools")}
                />
                <SuggestionCard
                    title="Grammar Analysis"
                    text="Analyze 'Rāmaḥ'"
                    onClick={() => setInput("Analyze the grammar of 'Rāmaḥ'")}
                />
            </div>
        </div>
    );
}
