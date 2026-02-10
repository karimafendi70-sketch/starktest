/**
 * Type definitions for the encrypted journal app
 */

export type MoodType = 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'calm';

export interface Photo {
  id: string;
  url: string; // base64 for now, will be Cloudinary/Supabase in future
  thumbnail: string;
  filename: string;
  uploadedAt: Date;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  mood: MoodType;
  date: string; // ISO date string
  createdAt: number;
  updatedAt: number;
  photos?: Photo[];
  wordCount?: number;
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
