/**
 * Streak tracking utilities
 * Tracks daily writing streaks and achievements
 */

import { JournalEntry } from '@/types/journal.types';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  streakDates: string[]; // Array of ISO date strings
}

export interface StreakBadge {
  id: string;
  name: string;
  description: string;
  daysRequired: number;
  icon: string;
  achieved: boolean;
}

/**
 * Calculate streak from journal entries
 */
export function calculateStreak(entries: JournalEntry[]): StreakData {
  if (entries.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastEntryDate: null,
      streakDates: [],
    };
  }

  // Get unique dates (sorted newest first)
  const uniqueDates = Array.from(
    new Set(entries.map(entry => entry.date.split('T')[0]))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Calculate current streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentStreak = 0;
  let checkDate = new Date(today);

  for (const dateStr of uniqueDates) {
    const entryDate = new Date(dateStr);
    entryDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (checkDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0 || diffDays === 1) {
      currentStreak++;
      checkDate = new Date(entryDate);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const date1 = new Date(uniqueDates[i]);
    const date2 = new Date(uniqueDates[i + 1]);
    const diffDays = Math.floor(
      (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, currentStreak);

  return {
    currentStreak,
    longestStreak,
    lastEntryDate: uniqueDates[0] || null,
    streakDates: uniqueDates,
  };
}

/**
 * Get motivational message based on streak
 */
export function getStreakMessage(streak: number): string {
  if (streak === 0) {
    return "Start your streak today! 📝";
  } else if (streak >= 1 && streak <= 6) {
    return "Keep it up! 🌱";
  } else if (streak >= 7 && streak <= 29) {
    return "Great momentum! 🚀";
  } else if (streak >= 30 && streak <= 99) {
    return "You're on fire! 🔥";
  } else {
    return "Legendary streak! 🏆";
  }
}

/**
 * Get available badges
 */
export function getStreakBadges(currentStreak: number, longestStreak: number): StreakBadge[] {
  const badges: StreakBadge[] = [
    {
      id: 'week',
      name: 'Week Warrior',
      description: '7-day writing streak',
      daysRequired: 7,
      icon: '🌟',
      achieved: longestStreak >= 7,
    },
    {
      id: 'month',
      name: 'Monthly Master',
      description: '30-day writing streak',
      daysRequired: 30,
      icon: '🏅',
      achieved: longestStreak >= 30,
    },
    {
      id: 'hundred',
      name: 'Century Club',
      description: '100-day writing streak',
      daysRequired: 100,
      icon: '💎',
      achieved: longestStreak >= 100,
    },
    {
      id: 'year',
      name: 'Year Long',
      description: '365-day writing streak',
      daysRequired: 365,
      icon: '👑',
      achieved: longestStreak >= 365,
    },
  ];

  return badges;
}

/**
 * Check if streak is about to break (no entry today yet)
 */
export function isStreakAtRisk(lastEntryDate: string | null): boolean {
  if (!lastEntryDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastEntry = new Date(lastEntryDate);
  lastEntry.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Streak is at risk if last entry was yesterday and we haven't written today
  return lastEntry.getTime() === yesterday.getTime();
}
