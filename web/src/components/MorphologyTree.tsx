"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, GitCommit, GitBranch, Circle } from 'lucide-react';

interface MorphologyNode {
    id: string;
    label: string;
    type: 'root' | 'stem' | 'suffix' | 'word';
    children?: MorphologyNode[];
    details?: string;
}

// Mock data for "Rāmeṇa"
const mockData: MorphologyNode = {
    id: 'word-1',
    label: 'Rāmeṇa (रामेण)',
    type: 'word',
    details: 'Instrumental Singular',
    children: [
        {
            id: 'stem-1',
            label: 'Rāma (राम)',
            type: 'stem',
            details: 'Prakṛti (Base)',
            children: [
                { id: 'root-1', label: '√ram (रम्)', type: 'root', details: 'Dhātu (To enjoy)' },
                { id: 'suffix-1', label: 'ghañ (घञ्)', type: 'suffix', details: 'Pratyaya (Agentive)' }
            ]
        },
        {
            id: 'suffix-2',
            label: 'ina (इन)',
            type: 'suffix',
            details: 'Vibhakti (Instr. Sing.)',
            children: [
                { id: 'rule-1', label: 'Rule 7.1.12', type: 'root', details: 'ṭā-ṅasi-ṅasām in-āt-syāḥ' },
                { id: 'rule-2', label: 'Rule 8.4.1', type: 'root', details: 'raṣābhyāṃ no ṇaḥ (Natva)' }
            ]
        }
    ]
};

const TreeNode = ({ node, depth = 0 }: { node: MorphologyNode; depth?: number }) => {
    const [isOpen, setIsOpen] = React.useState(true);
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div className="ml-4">
            <div
                className="flex items-center gap-2 py-1 cursor-pointer hover:bg-accent/50 rounded px-2 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-muted-foreground w-4">
                    {hasChildren ? (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : <Circle size={8} />}
                </span>

                <div className="flex items-center gap-2">
                    {node.type === 'word' && <GitCommit className="text-primary" size={16} />}
                    {node.type === 'stem' && <GitBranch className="text-blue-500" size={16} />}
                    {node.type === 'suffix' && <GitBranch className="text-green-500" size={16} />}
                    {node.type === 'root' && <Circle className="text-yellow-500" size={12} />}

                    <span className="font-medium text-sm">{node.label}</span>
                    {node.details && (
                        <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {node.details}
                        </span>
                    )}
                </div>
            </div>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                {hasChildren && (
                    <div className="border-l border-border ml-2 pl-2">
                        {node.children!.map((child) => (
                            <TreeNode key={child.id} node={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

interface MorphologyTreeProps {
    data?: MorphologyNode;
}

export function MorphologyTree({ data }: MorphologyTreeProps) {
    if (!data) {
        return (
            <div className="w-full border border-border rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden mt-4 p-4 text-center text-muted-foreground">
                No morphological analysis available.
            </div>
        );
    }

    return (
        <div className="w-full border border-border rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden mt-4">
            <div className="p-2 border-b border-border bg-muted/20">
                <h3 className="text-sm font-medium text-foreground">Morphological Analysis (Prakṛti-Pratyaya)</h3>
            </div>
            <div className="p-4">
                <TreeNode node={data} />
            </div>
        </div>
    );
}
