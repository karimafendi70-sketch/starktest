import { useCallback } from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JournalEntry } from "@/types/journal.types";
import { BookPage } from "./BookPage";
import { BookNavigation } from "./BookNavigation";
import { Bookmark } from "lucide-react";

interface BookViewProps {
  entries: JournalEntry[];
}

export function BookView({ entries }: BookViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  // Reset to first page if entries change
  useEffect(() => {
    setCurrentPage(0);
  }, [entries]);

  const handlePrevious = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < entries.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, entries.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevious, handleNext]);

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px] bg-book-bg rounded-xl">
        <div className="text-center p-12">
          <h3 className="font-crimson text-3xl font-bold text-book-text mb-4">
            No Entries to Display
          </h3>
          <p className="font-merriweather text-book-accent">
            Create your first journal entry to see it in book view
          </p>
        </div>
      </div>
    );
  }

  const pageVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      transformOrigin: direction > 0 ? "left" : "right",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -90 : 90,
      opacity: 0,
      transformOrigin: direction > 0 ? "right" : "left",
    }),
  };

  return (
    <div className="relative">
      {/* Book container with 3D perspective */}
      <div className="relative bg-book-bg rounded-xl p-8 shadow-2xl" style={{ perspective: "2000px" }}>
        {/* Bookmark decoration */}
        <div className="absolute top-0 right-12 -translate-y-4">
          <Bookmark className="w-8 h-12 text-book-accent fill-book-accent/50" />
        </div>

        {/* Book page container */}
        <div className="relative w-full h-[700px] max-w-4xl mx-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              <BookPage
                entry={entries[currentPage]}
                pageNumber={currentPage + 1}
                isVisible={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <BookNavigation
          currentPage={currentPage}
          totalPages={entries.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        {/* Keyboard hint */}
        <div className="text-center mt-4">
          <p className="font-crimson text-book-accent text-sm">
            Use arrow keys or buttons to navigate
          </p>
        </div>
      </div>
    </div>
  );
}
