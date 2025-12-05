"use client";

import { motion } from "framer-motion";

export function MandalaBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Dark Overlay/Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-deep-space via-[#111827] to-deep-space opacity-90 z-10" />

            {/* Rotating Mandala */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] opacity-20"
                animate={{ rotate: 360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            >
                <img
                    src="/assets/mandala.png"
                    alt="Mandala Pattern"
                    className="w-full h-full object-contain"
                />
            </motion.div>

            {/* Subtle Particles/Stars (Optional) */}
            <div className="absolute inset-0 z-20 opacity-30 bg-[url('/assets/noise.png')] mix-blend-overlay" />
        </div>
    );
}
