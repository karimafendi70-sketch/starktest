"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function BookNavigation({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: BookNavigationProps) {
  return (
    <div className="flex items-center justify-center gap-8 mt-8">
      <motion.button
        onClick={onPrevious}
        disabled={currentPage === 0}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-4 bg-book-accent/20 rounded-full hover:bg-book-accent/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-book-accent/20"
      >
        <ChevronLeft className="w-6 h-6 text-book-text" />
      </motion.button>

      <div className="text-center">
        <p className="font-crimson text-book-text text-lg">
          Page <span className="font-bold">{currentPage + 1}</span> of{" "}
          <span className="font-bold">{totalPages}</span>
        </p>
      </div>

      <motion.button
        onClick={onNext}
        disabled={currentPage === totalPages - 1}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-4 bg-book-accent/20 rounded-full hover:bg-book-accent/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-book-accent/20"
      >
        <ChevronRight className="w-6 h-6 text-book-text" />
      </motion.button>
    </div>
  );
}
