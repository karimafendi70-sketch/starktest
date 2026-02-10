/**
 * Statistics calculation utilities
 */

import { JournalEntry } from '@/types/journal.types';

export interface JournalStatistics {
  totalEntries: number;
  totalWords: number;
  averageWordsPerEntry: number;
  longestEntry: {
    id: string;
    title: string;
    wordCount: number;
  } | null;
  wordsThisWeek: number;
  wordsThisMonth: number;
  entriesThisWeek: number;
  entriesThisMonth: number;
  mostUsedMood: string;
  mostUsedTags: Array<{ tag: string; count: number }>;
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(text: string): number {
  const wordCount = countWords(text);
  const wordsPerMinute = 250;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Calculate statistics for entries
 */
export function calculateStatistics(entries: JournalEntry[]): JournalStatistics {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      totalWords: 0,
      averageWordsPerEntry: 0,
      longestEntry: null,
      wordsThisWeek: 0,
      wordsThisMonth: 0,
      entriesThisWeek: 0,
      entriesThisMonth: 0,
      mostUsedMood: 'neutral',
      mostUsedTags: [],
    };
  }

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Calculate word counts
  const entriesWithWords = entries.map(entry => ({
    ...entry,
    wordCount: countWords(entry.content),
  }));

  const totalWords = entriesWithWords.reduce((sum, entry) => sum + entry.wordCount, 0);
  const averageWordsPerEntry = Math.round(totalWords / entries.length);

  // Find longest entry
  const longestEntry = entriesWithWords.reduce((longest, entry) => {
    return entry.wordCount > (longest?.wordCount || 0) ? entry : longest;
  });

  // Filter by time period
  const entriesThisWeek = entries.filter(
    entry => new Date(entry.date) >= oneWeekAgo
  );
  const entriesThisMonth = entries.filter(
    entry => new Date(entry.date) >= oneMonthAgo
  );

  const wordsThisWeek = entriesThisWeek.reduce(
    (sum, entry) => sum + countWords(entry.content),
    0
  );
  const wordsThisMonth = entriesThisMonth.reduce(
    (sum, entry) => sum + countWords(entry.content),
    0
  );

  // Calculate mood frequency
  const moodCounts: Record<string, number> = {};
  entries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  const mostUsedMood = Object.entries(moodCounts).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  // Calculate tag frequency
  const tagCounts: Record<string, number> = {};
  entries.forEach(entry => {
    entry.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const mostUsedTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalEntries: entries.length,
    totalWords,
    averageWordsPerEntry,
    longestEntry: {
      id: longestEntry.id,
      title: longestEntry.title,
      wordCount: longestEntry.wordCount,
    },
    wordsThisWeek,
    wordsThisMonth,
    entriesThisWeek: entriesThisWeek.length,
    entriesThisMonth: entriesThisMonth.length,
    mostUsedMood,
    mostUsedTags,
  };
}
