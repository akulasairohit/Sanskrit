"use client";

import { MessageSquare, Book, Menu, Plus, Settings, HelpCircle, History } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    activeTab: "chat" | "dictionary";
    setActiveTab: (tab: "chat" | "dictionary") => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <motion.div
            initial={{ width: 280 }}
            animate={{ width: isCollapsed ? 80 : 280 }}
            className="h-screen bg-secondary/30 border-r border-border flex flex-col py-4 transition-all duration-300 relative z-20"
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
                    icon={<MessageSquare className="w-5 h-5" />}
                    label="Chat"
                    isActive={activeTab === "chat"}
                    isCollapsed={isCollapsed}
                    onClick={() => setActiveTab("chat")}
                />
                <NavItem
                    icon={<Book className="w-5 h-5" />}
                    label="Dictionary"
                    isActive={activeTab === "dictionary"}
                    isCollapsed={isCollapsed}
                    onClick={() => setActiveTab("dictionary")}
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
