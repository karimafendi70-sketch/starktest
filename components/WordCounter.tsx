"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { countWords, calculateReadingTime } from "@/lib/statistics";

interface WordCounterProps {
  text: string;
  showReadingTime?: boolean;
}

export function WordCounter({ text, showReadingTime = true }: WordCounterProps) {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const words = countWords(text);
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const time = calculateReadingTime(text);

    setWordCount(words);
    setCharCount(chars);
    setCharCountNoSpaces(charsNoSpaces);
    setReadingTime(time);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400"
    >
      <div className="flex items-center gap-1">
        <span className="font-semibold text-gray-900 dark:text-white">{wordCount}</span>
        <span>{wordCount === 1 ? 'word' : 'words'}</span>
      </div>

      <div className="flex items-center gap-1">
        <span className="font-semibold text-gray-900 dark:text-white">{charCount}</span>
        <span>characters</span>
      </div>

      {showReadingTime && wordCount > 0 && (
        <div className="flex items-center gap-1">
          <span>·</span>
          <span className="font-semibold text-gray-900 dark:text-white">{readingTime}</span>
          <span>min read</span>
        </div>
      )}
    </motion.div>
  );
}
