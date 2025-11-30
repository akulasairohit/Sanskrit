"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Dictionary } from "@/components/Dictionary";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "dictionary">("chat");

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 relative flex flex-col">
        {activeTab === "chat" ? <ChatInterface /> : <Dictionary />}
      </main>
    </div>
  );
}
