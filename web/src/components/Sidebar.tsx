"use client";

import { MessageSquare, Book, Menu, Plus, Settings, HelpCircle, History, Network, FileText } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    activeTab: "chat" | "dictionary" | "grammar" | "resources";
    setActiveTab: (tab: "chat" | "dictionary" | "grammar" | "resources") => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(true);

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.div
                initial={{ width: 80 }}
                animate={{ width: isCollapsed ? 80 : 280 }}
                className="hidden md:flex h-screen bg-secondary/30 border-r border-border flex-col py-4 transition-all duration-300 relative z-20"
            >
                <div className="px-4 mb-8 flex items-center justify-between">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                    >
                        <Menu className="w-6 h-6 text-muted-foreground" />
                    </button>
                </div>

                <div className="px-4 mb-6">
                    <button
                        onClick={() => setActiveTab("chat")}
                        className={cn(
                            "flex items-center gap-3 w-full p-3 rounded-full transition-all duration-200",
                            !isCollapsed ? "bg-accent/50 hover:bg-accent" : "justify-center bg-accent/50 hover:bg-accent aspect-square p-0"
                        )}
                    >
                        <Plus className="w-5 h-5 text-primary" />
                        {!isCollapsed && <span className="text-sm font-medium">New Chat</span>}
                    </button>
                </div>

                <div className="flex-1 px-2 space-y-2">
                    <NavItem
                        icon={<Book className="w-5 h-5" />}
                        label="Dictionary"
                        isActive={activeTab === "dictionary"}
                        isCollapsed={isCollapsed}
                        onClick={() => setActiveTab("dictionary")}
                    />
                    <NavItem
                        icon={<Network className="w-5 h-5" />}
                        label="Grammar"
                        isActive={activeTab === "grammar"}
                        isCollapsed={isCollapsed}
                        onClick={() => setActiveTab("grammar")}
                    />
                    <NavItem
                        icon={<FileText className="w-5 h-5" />}
                        label="Resources"
                        isActive={activeTab === "resources"}
                        isCollapsed={isCollapsed}
                        onClick={() => setActiveTab("resources")}
                    />
                </div>

                <div className="px-2 mt-auto space-y-2">
                    <NavItem
                        icon={<HelpCircle className="w-5 h-5" />}
                        label="Help"
                        isActive={false}
                        isCollapsed={isCollapsed}
                        onClick={() => { }}
                    />
                    <NavItem
                        icon={<History className="w-5 h-5" />}
                        label="Activity"
                        isActive={false}
                        isCollapsed={isCollapsed}
                        onClick={() => { }}
                    />
                    <NavItem
                        icon={<Settings className="w-5 h-5" />}
                        label="Settings"
                        isActive={false}
                        isCollapsed={isCollapsed}
                        onClick={() => { }}
                    />
                </div>
            </motion.div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50 flex justify-around items-center p-2 pb-6 safe-area-bottom">
                <button
                    onClick={() => setActiveTab("chat")}
                    className={cn("flex flex-col items-center p-2 rounded-lg transition-colors", activeTab === "chat" ? "text-primary" : "text-muted-foreground")}
                >
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-1">Chat</span>
                </button>
                <button
                    onClick={() => setActiveTab("dictionary")}
                    className={cn("flex flex-col items-center p-2 rounded-lg transition-colors", activeTab === "dictionary" ? "text-primary" : "text-muted-foreground")}
                >
                    <Book className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-1">Dict</span>
                </button>
                <button
                    onClick={() => setActiveTab("grammar")}
                    className={cn("flex flex-col items-center p-2 rounded-lg transition-colors", activeTab === "grammar" ? "text-primary" : "text-muted-foreground")}
                >
                    <Network className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-1">Grammar</span>
                </button>
                <button
                    onClick={() => setActiveTab("resources")}
                    className={cn("flex flex-col items-center p-2 rounded-lg transition-colors", activeTab === "resources" ? "text-primary" : "text-muted-foreground")}
                >
                    <FileText className="w-6 h-6" />
                    <span className="text-[10px] font-medium mt-1">Resources</span>
                </button>
            </div>
        </>
    );
}

function NavItem({
    icon,
    label,
    isActive,
    isCollapsed,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-4 w-full p-3 rounded-full transition-colors relative group",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground",
                isCollapsed && "justify-center"
            )}
        >
            {icon}
            {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
            {isCollapsed && (
                <div className="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50 pointer-events-none">
                    {label}
                </div>
            )}
        </button>
    );
}
