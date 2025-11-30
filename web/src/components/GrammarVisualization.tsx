"use client";

import { motion } from "framer-motion";

interface WordBreakdown {
    original_text: string;
    split_form: string;
    meaning: string;
    category: "noun" | "verb" | "indeclinable" | "compound" | "other";
    details: string;
}

interface GrammarData {
    sentence: string;
    breakdown: WordBreakdown[];
}

interface GrammarVisualizationProps {
    data: GrammarData;
}

const categoryColors = {
    noun: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
    verb: "bg-green-500/10 text-green-600 border-green-200 dark:border-green-800 dark:text-green-400",
    indeclinable: "bg-gray-500/10 text-gray-600 border-gray-200 dark:border-gray-800 dark:text-gray-400",
    compound: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
    other: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800 dark:text-purple-400",
};

export function GrammarVisualization({ data }: GrammarVisualizationProps) {
    if (!data || !data.breakdown || data.breakdown.length === 0) return null;

    return (
        <div className="w-full mt-10 p-8 bg-card/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            <h3 className="text-[10px] font-bold text-muted-foreground/70 mb-10 uppercase tracking-[0.2em] text-center relative z-10">
                Grammar Decomposition
            </h3>

            <div className="relative w-full overflow-x-auto pb-4 scrollbar-hide z-10">
                <div className="min-w-[800px] flex flex-col gap-16 px-4">

                    {/* Level 1: Original Sentence */}
                    <div className="flex justify-center relative">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-serif text-center text-foreground leading-relaxed max-w-4xl drop-shadow-sm"
                        >
                            {data.sentence}
                        </motion.div>
                    </div>

                    {/* Connector Lines (Visual Only) */}
                    <div className="h-12 w-full relative -my-8 opacity-30 pointer-events-none">
                        <svg className="w-full h-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="transparent" />
                                    <stop offset="50%" stopColor="currentColor" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                            <path d="M 50% 0 C 50% 100, 10% 0, 10% 100" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                            <path d="M 50% 0 C 50% 100, 90% 0, 90% 100" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                            <path d="M 50% 0 L 50% 100" stroke="url(#lineGradient)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                        </svg>
                    </div>

                    {/* Level 2: Deconstructed Words */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {data.breakdown.map((item, idx) => {
                            const colorClass = categoryColors[item.category.toLowerCase() as keyof typeof categoryColors] || categoryColors.other;

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`relative group flex flex-col items-center p-5 rounded-2xl border ${colorClass} transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card/80 backdrop-blur-sm`}
                                >
                                    {/* Category Badge */}
                                    <span className="absolute -top-3 px-3 py-1 text-[9px] font-bold uppercase tracking-widest bg-background border border-border/50 rounded-full shadow-sm">
                                        {item.category}
                                    </span>

                                    {/* Split Form */}
                                    <div className="text-2xl font-medium mb-1 font-serif text-foreground/90">{item.split_form}</div>

                                    {/* Original Text Reference */}
                                    {item.original_text !== item.split_form && (
                                        <div className="text-xs opacity-50 mb-3 line-through decoration-current/30 font-mono">
                                            {item.original_text}
                                        </div>
                                    )}

                                    {/* Divider */}
                                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 my-2"></div>

                                    {/* Meaning & Details */}
                                    <div className="text-sm font-medium text-center text-foreground/80 mb-1">{item.meaning}</div>
                                    <div className="text-[10px] opacity-60 font-mono mt-1 text-center max-w-[140px] uppercase tracking-wide">
                                        {item.details}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
