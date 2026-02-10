/**
 * Search and filter utilities for journal entries
 */

import { JournalEntry, MoodType } from '@/types/journal.types';

export interface SearchFilters {
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  moods?: MoodType[];
  tags?: string[];
  minWordCount?: number;
  maxWordCount?: number;
  hasPhotos?: boolean;
}

export type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'word-count';

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Search entries with filters
 */
export function searchEntries(
  entries: JournalEntry[],
  filters: SearchFilters,
  sortBy: SortOption = 'relevance'
): JournalEntry[] {
  let results = [...entries];

  // Apply text search
  if (filters.query && filters.query.trim()) {
    const query = filters.query.toLowerCase();
    results = results.filter(entry => {
      const titleMatch = entry.title.toLowerCase().includes(query);
      const contentMatch = entry.content.toLowerCase().includes(query);
      const tagsMatch = entry.tags.some(tag => tag.toLowerCase().includes(query));
      return titleMatch || contentMatch || tagsMatch;
    });
  }

  // Apply date filters
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    results = results.filter(entry => new Date(entry.date) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999); // Include the entire end date
    results = results.filter(entry => new Date(entry.date) <= toDate);
  }

  // Apply mood filter
  if (filters.moods && filters.moods.length > 0) {
    results = results.filter(entry => filters.moods!.includes(entry.mood));
  }

  // Apply tag filter
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(entry =>
      filters.tags!.some(tag => entry.tags.includes(tag))
    );
  }

  // Apply word count filters
  if (filters.minWordCount !== undefined || filters.maxWordCount !== undefined) {
    results = results.filter(entry => {
      const wordCount = countWords(entry.content);
      if (filters.minWordCount !== undefined && wordCount < filters.minWordCount) {
        return false;
      }
      if (filters.maxWordCount !== undefined && wordCount > filters.maxWordCount) {
        return false;
      }
      return true;
    });
  }

  // Apply sort
  results = sortEntries(results, sortBy, filters.query);

  return results;
}

/**
 * Sort entries based on sort option
 */
function sortEntries(
  entries: JournalEntry[],
  sortBy: SortOption,
  query?: string
): JournalEntry[] {
  const sorted = [...entries];

  switch (sortBy) {
    case 'relevance':
      if (query && query.trim()) {
        // Calculate relevance score
        sorted.sort((a, b) => {
          const scoreA = calculateRelevanceScore(a, query);
          const scoreB = calculateRelevanceScore(b, query);
          return scoreB - scoreA;
        });
      } else {
        // Default to date desc if no query
        sorted.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
      break;

    case 'date-desc':
      sorted.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      break;

    case 'date-asc':
      sorted.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      break;

    case 'word-count':
      sorted.sort((a, b) => {
        const wordsA = countWords(a.content);
        const wordsB = countWords(b.content);
        return wordsB - wordsA;
      });
      break;
  }

  return sorted;
}

/**
 * Calculate relevance score for search results
 */
function calculateRelevanceScore(entry: JournalEntry, query: string): number {
  const lowerQuery = query.toLowerCase();
  let score = 0;

  // Title match (highest weight)
  if (entry.title.toLowerCase().includes(lowerQuery)) {
    score += 10;
    // Exact title match bonus
    if (entry.title.toLowerCase() === lowerQuery) {
      score += 20;
    }
  }

  // Content match
  const contentLower = entry.content.toLowerCase();
  const occurrences = (contentLower.match(new RegExp(lowerQuery, 'g')) || []).length;
  score += occurrences * 2;

  // Tag match
  if (entry.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
    score += 5;
  }

  return score;
}

/**
 * Highlight search terms in text
 */
export function highlightSearchTerms(text: string, query: string): string {
  if (!query || !query.trim()) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Get all unique tags from entries
 */
export function getAllTags(entries: JournalEntry[]): string[] {
  const tagSet = new Set<string>();
  entries.forEach(entry => {
    entry.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
