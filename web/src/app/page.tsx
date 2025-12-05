"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Dictionary } from "@/components/Dictionary";
import { GrammarAnalysis } from "@/components/GrammarAnalysis";
import { Resources } from "@/components/Resources";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "dictionary" | "grammar" | "resources">("chat");

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 relative flex flex-col">
        {activeTab === "chat" ? (
          <ChatInterface setActiveTab={setActiveTab} />
        ) : activeTab === "dictionary" ? (
          <Dictionary />
        ) : activeTab === "grammar" ? (
          <GrammarAnalysis />
        ) : (
          <Resources />
        )}
      </main>
    </div>
  );
}
