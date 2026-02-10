"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface BookModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

/**
 * Toggle between day and night reading modes in book view
 */
export function BookModeToggle({ isDarkMode, onToggle }: BookModeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-book-accent/20 hover:bg-book-accent/30 transition-colors"
      aria-label={isDarkMode ? "Switch to day mode" : "Switch to night mode"}
    >
      {isDarkMode ? (
        <>
          <Sun className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-crimson text-amber-200">Day Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5 text-book-accent" />
          <span className="text-sm font-crimson text-book-text">Night Mode</span>
        </>
      )}
    </motion.button>
  );
}
