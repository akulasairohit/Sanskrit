"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, GitBranch, List } from "lucide-react";
import { SemanticGraphView } from "./SemanticGraphView";
import { MorphologyTree } from "./MorphologyTree";

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
    graph?: { nodes: any[]; edges: any[] };
    morphology_tree?: any;
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
    const [activeTab, setActiveTab] = useState<"breakdown" | "graph" | "morphology">("breakdown");

    if (!data || !data.breakdown || data.breakdown.length === 0) return null;

    return (
        <div className="w-full mt-6 p-1 bg-card/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl relative">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            {/* Header / Tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 relative z-10 bg-black/20">
                <h3 className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.2em]">
                    Analysis
                </h3>
                <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("breakdown")}
                        className={`p-1.5 rounded-md transition-all ${activeTab === "breakdown" ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        title="Word Breakdown"
                    >
                        <List size={14} />
                    </button>
                    <button
                        onClick={() => setActiveTab("graph")}
                        className={`p-1.5 rounded-md transition-all ${activeTab === "graph" ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        title="Semantic Graph"
                    >
                        <Network size={14} />
                    </button>
                    <button
                        onClick={() => setActiveTab("morphology")}
                        className={`p-1.5 rounded-md transition-all ${activeTab === "morphology" ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        title="Morphology Tree"
                    >
                        <GitBranch size={14} />
                    </button>
                </div>
            </div>

            <div className="p-4 relative z-10 min-h-[300px]">
                <AnimatePresence mode="wait">
                    {activeTab === "breakdown" && (
                        <motion.div
                            key="breakdown"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full"
                        >
                            <div className="flex justify-center mb-8">
                                <div className="text-2xl md:text-3xl font-serif text-center text-foreground leading-relaxed max-w-4xl drop-shadow-sm">
                                    {data.sentence}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                {data.breakdown.map((item, idx) => {
                                    const colorClass = categoryColors[item.category.toLowerCase() as keyof typeof categoryColors] || categoryColors.other;
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className={`relative group flex flex-col items-center p-4 rounded-xl border ${colorClass} transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card/80 backdrop-blur-sm min-w-[140px]`}
                                        >
                                            <span className="absolute -top-2.5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest bg-background border border-border/50 rounded-full shadow-sm">
                                                {item.category}
                                            </span>
                                            <div className="text-lg font-medium mb-1 font-serif text-foreground/90">{item.split_form}</div>
                                            {item.original_text !== item.split_form && (
                                                <div className="text-[10px] opacity-50 mb-2 line-through decoration-current/30 font-mono">
                                                    {item.original_text}
                                                </div>
                                            )}
                                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 my-1.5"></div>
                                            <div className="text-xs font-medium text-center text-foreground/80">{item.meaning}</div>
                                            <div className="text-[9px] opacity-60 font-mono mt-1 text-center uppercase tracking-wide">
                                                {item.details}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "graph" && (
                        <motion.div
                            key="graph"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full h-full"
                        >
                            <SemanticGraphView data={data.graph} />
                        </motion.div>
                    )}

                    {activeTab === "morphology" && (
                        <motion.div
                            key="morphology"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="w-full h-full"
                        >
                            <MorphologyTree data={data.morphology_tree} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
