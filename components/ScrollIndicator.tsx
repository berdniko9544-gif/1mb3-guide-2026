"use client";

import { motion } from "framer-motion";

export function ScrollIndicator() {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      className="scroll-indicator hidden md:flex"
      onClick={scrollToContent}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
    >
      <div className="scroll-indicator-icon" />
      <span className="text-xs text-white/40 font-semibold tracking-wider uppercase">
        Листай
      </span>
    </motion.div>
  );
}
