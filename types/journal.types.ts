export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  photos?: string[];
  audio?: { url: string; duration: number; }; // New audio field added
}