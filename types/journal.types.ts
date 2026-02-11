/**
 * Type definitions for the encrypted journal app
 */

export type MoodType = 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'calm';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  mood: MoodType;
  date: string; // ISO date string
  createdAt: number;
  updatedAt: number;
  photos?: string[]; // Array of base64 data URLs
  wordCount?: number; // Cached word count
}

export interface AuthState {
  isAuthenticated: boolean;
  cryptoKey: CryptoKey | null;
  salt: Uint8Array | null;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  autoLockMinutes: number;
}
