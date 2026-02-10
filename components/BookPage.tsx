"use client";

import { motion } from "framer-motion";
import { JournalEntry } from "@/types/journal.types";
import { Smile, Frown, Meh, Zap, Cloud } from "lucide-react";

interface BookPageProps {
  entry: JournalEntry;
  pageNumber: number;
  isVisible: boolean;
}

const MoodIcon = ({ mood, className = "w-5 h-5" }: { mood: string; className?: string }) => {
  const icons: Record<string, React.ReactElement> = {
    happy: <Smile className={className} />,
    sad: <Frown className={className} />,
    neutral: <Meh className={className} />,
    excited: <Zap className={className} />,
    anxious: <Cloud className={className} />,
  };
  return icons[mood] || null;
};

export function BookPage({ entry, pageNumber, isVisible }: BookPageProps) {
  if (!isVisible) return null;

  // Format date in vintage style
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    
    // Add ordinal suffix (1st, 2nd, 3rd, etc.)
    const suffix = ["th", "st", "nd", "rd"];
    const v = day % 100;
    const ordinal = suffix[(v - 20) % 10] || suffix[v] || suffix[0];
    
    return `${month} ${day}${ordinal}, ${year}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full h-full bg-book-page rounded-lg shadow-2xl p-12 flex flex-col"
      style={{
        backgroundImage: `
          linear-gradient(90deg, rgba(139, 115, 85, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(139, 115, 85, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
        boxShadow: "inset 0 0 40px rgba(139, 115, 85, 0.1), 0 10px 30px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Book texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none rounded-lg"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Date Header */}
        <div className="text-center mb-8 border-b-2 border-book-accent/30 pb-4">
          <p className="font-crimson text-book-accent text-sm uppercase tracking-wider mb-2">
            {formatDate(entry.date)}
          </p>
          <div className="flex items-center justify-center gap-2">
            <MoodIcon mood={entry.mood} className="w-6 h-6 text-book-accent" />
            <h2 className="font-crimson text-3xl font-bold text-book-text">
              {entry.title}
            </h2>
          </div>
        </div>

        {/* Entry Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <p className="font-crimson text-lg leading-relaxed text-book-text whitespace-pre-wrap">
            {entry.content}
          </p>
        </div>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="mt-6 pt-4 border-t border-book-accent/20">
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-book-accent/10 border border-book-accent/30 rounded-full text-xs font-merriweather text-book-text"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Page Number */}
        <div className="text-center mt-6 pt-4 border-t border-book-accent/20">
          <p className="font-crimson text-book-accent text-sm">— {pageNumber} —</p>
        </div>
      </div>
    </motion.div>
  );
}
