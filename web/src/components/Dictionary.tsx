import { useState } from "react";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface DictionaryEntry {
    word: string;
    iast: string;
    meanings: string[];
    etymology?: string;
    gender?: string;
    source: string;
}

export function Dictionary() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<DictionaryEntry | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await fetch(`/api/dictionary?query=${encodeURIComponent(query)}`);
            const data = await res.json();

            if (res.ok) {
                setResult(data);
            } else {
                setError(data.error || "Word not found");
            }
        } catch (err) {
            setError("Failed to fetch dictionary data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto w-full p-4 md:p-6 pb-24 md:pb-6">
            <div className="text-center mb-6 md:mb-10 mt-4 md:mt-8">
                <h1 className="text-2xl md:text-3xl font-serif font-medium mb-2">Sanskrit Dictionary</h1>
                <p className="text-muted-foreground">Powered by Monier-Williams & AI</p>
            </div>

            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto w-full mb-12">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a word (e.g., Dharma, Agni)..."
                    className="w-full bg-secondary/50 hover:bg-secondary/80 focus:bg-secondary transition-colors border-none rounded-full py-4 pl-12 pr-6 text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="absolute right-2 top-2 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
                </button>
            </form>

            <div className="flex-1 overflow-y-auto pb-20">
                {error && (
                    <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg max-w-md mx-auto">
                        {error}
                    </div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto shadow-lg relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-5xl font-serif mb-2 text-foreground">{result.word}</h2>
                                <p className="text-xl text-muted-foreground font-mono">{result.iast}</p>
                            </div>
                            {result.gender && (
                                <span className="px-3 py-1 bg-secondary rounded-full text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {result.gender}
                                </span>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-3">Meanings</h3>
                                <ul className="space-y-2">
                                    {result.meanings.map((meaning, idx) => (
                                        <li key={idx} className="flex gap-3 text-lg leading-relaxed">
                                            <span className="text-primary/50">•</span>
                                            {meaning}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {result.etymology && (
                                <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Etymology</h3>
                                    <p className="text-sm font-medium">{result.etymology}</p>
                                </div>
                            )}

                            <div className="pt-6 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
                                <span>Source: {result.source}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
