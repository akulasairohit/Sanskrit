"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MandalaBackground } from "./MandalaBackground";
import { HeroSection } from "./HeroSection";

interface LandingPageProps {
    onSearch: (query: string) => void;
    onNavigate: (tab: "chat" | "dictionary" | "grammar") => void;
}

export function LandingPage({ onSearch, onNavigate }: LandingPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-screen overflow-hidden bg-deep-space text-white"
        >
            <MandalaBackground />
            <HeroSection onSearch={onSearch} onNavigate={onNavigate} />
        </motion.div>
    );
}
