"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-context';
import { encrypt, decrypt, arrayBufferToBase64, base64ToArrayBuffer, uint8ArrayToBase64, base64ToUint8Array } from './crypto';
import { saveEntry, getEntry, getAllEntries, deleteEntry, EncryptedEntry } from './db';
import { JournalEntry, MoodType } from '@/types/journal.types';

interface JournalContextType {
  entries: JournalEntry[];
  loading: boolean;
  loadEntries: () => Promise<void>;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  getEntryById: (id: string) => Promise<JournalEntry | null>;
  searchEntries: (query: string) => JournalEntry[];
  filterByTag: (tag: string) => JournalEntry[];
  filterByMood: (mood: MoodType) => JournalEntry[];
  getStats: () => { totalEntries: number; totalWords: number; entriesByMood: Record<MoodType, number> };
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, cryptoKey } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEntries = useCallback(async () => {
    if (!isAuthenticated || !cryptoKey) {
      setEntries([]);
      return;
    }

    setLoading(true);
    try {
      const encryptedEntries = await getAllEntries();
      const decryptedEntries: JournalEntry[] = [];

      for (const encrypted of encryptedEntries) {
        try {
          const title = await decrypt(
            base64ToArrayBuffer(encrypted.encryptedTitle),
            cryptoKey,
            base64ToUint8Array(encrypted.titleIV)
          );
          
          const content = await decrypt(
            base64ToArrayBuffer(encrypted.encryptedContent),
            cryptoKey,
            base64ToUint8Array(encrypted.contentIV)
          );
          
          const tagsStr = await decrypt(
            base64ToArrayBuffer(encrypted.encryptedTags),
            cryptoKey,
            base64ToUint8Array(encrypted.tagsIV)
          );
          
          const tags = tagsStr ? JSON.parse(tagsStr) : [];

          decryptedEntries.push({
            id: encrypted.id,
            title,
            content,
            tags,
            mood: encrypted.mood as MoodType,
            date: encrypted.date,
            createdAt: encrypted.createdAt,
            updatedAt: encrypted.updatedAt,
          });
        } catch (error) {
          console.error('Error decrypting entry:', encrypted.id, error);
        }
      }

      // Sort by date (newest first)
      decryptedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEntries(decryptedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, cryptoKey]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const addEntry = async (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!cryptoKey) throw new Error('Not authenticated');

    const id = crypto.randomUUID();
    const now = Date.now();

    // Encrypt data
    const { ciphertext: titleCipher, iv: titleIV } = await encrypt(entry.title, cryptoKey);
    const { ciphertext: contentCipher, iv: contentIV } = await encrypt(entry.content, cryptoKey);
    const { ciphertext: tagsCipher, iv: tagsIV } = await encrypt(JSON.stringify(entry.tags), cryptoKey);

    const encryptedEntry: EncryptedEntry = {
      id,
      encryptedTitle: arrayBufferToBase64(titleCipher),
      encryptedContent: arrayBufferToBase64(contentCipher),
      encryptedTags: arrayBufferToBase64(tagsCipher),
      mood: entry.mood,
      date: entry.date,
      createdAt: now,
      updatedAt: now,
      titleIV: uint8ArrayToBase64(titleIV),
      contentIV: uint8ArrayToBase64(contentIV),
      tagsIV: uint8ArrayToBase64(tagsIV),
    };

    await saveEntry(encryptedEntry);
    await loadEntries();
  };

  const updateEntry = async (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt'>>) => {
    if (!cryptoKey) throw new Error('Not authenticated');

    const existing = await getEntry(id);
    if (!existing) throw new Error('Entry not found');

    const now = Date.now();
    
    // Decrypt existing data if fields are not updated
    let title = updates.title;
    let content = updates.content;
    let tags = updates.tags;

    if (!title) {
      title = await decrypt(
        base64ToArrayBuffer(existing.encryptedTitle),
        cryptoKey,
        base64ToUint8Array(existing.titleIV)
      );
    }

    if (!content) {
      content = await decrypt(
        base64ToArrayBuffer(existing.encryptedContent),
        cryptoKey,
        base64ToUint8Array(existing.contentIV)
      );
    }

    if (!tags) {
      const tagsStr = await decrypt(
        base64ToArrayBuffer(existing.encryptedTags),
        cryptoKey,
        base64ToUint8Array(existing.tagsIV)
      );
      tags = JSON.parse(tagsStr);
    }

    // Encrypt updated data
    const { ciphertext: titleCipher, iv: titleIV } = await encrypt(title, cryptoKey);
    const { ciphertext: contentCipher, iv: contentIV } = await encrypt(content, cryptoKey);
    const { ciphertext: tagsCipher, iv: tagsIV } = await encrypt(JSON.stringify(tags), cryptoKey);

    const encryptedEntry: EncryptedEntry = {
      id,
      encryptedTitle: arrayBufferToBase64(titleCipher),
      encryptedContent: arrayBufferToBase64(contentCipher),
      encryptedTags: arrayBufferToBase64(tagsCipher),
      mood: updates.mood || existing.mood,
      date: updates.date || existing.date,
      createdAt: existing.createdAt,
      updatedAt: now,
      titleIV: uint8ArrayToBase64(titleIV),
      contentIV: uint8ArrayToBase64(contentIV),
      tagsIV: uint8ArrayToBase64(tagsIV),
    };

    await saveEntry(encryptedEntry);
    await loadEntries();
  };

  const removeEntry = async (id: string) => {
    await deleteEntry(id);
    await loadEntries();
  };

  const getEntryById = async (id: string): Promise<JournalEntry | null> => {
    if (!cryptoKey) return null;

    const encrypted = await getEntry(id);
    if (!encrypted) return null;

    try {
      const title = await decrypt(
        base64ToArrayBuffer(encrypted.encryptedTitle),
        cryptoKey,
        base64ToUint8Array(encrypted.titleIV)
      );
      
      const content = await decrypt(
        base64ToArrayBuffer(encrypted.encryptedContent),
        cryptoKey,
        base64ToUint8Array(encrypted.contentIV)
      );
      
      const tagsStr = await decrypt(
        base64ToArrayBuffer(encrypted.encryptedTags),
        cryptoKey,
        base64ToUint8Array(encrypted.tagsIV)
      );
      
      const tags = JSON.parse(tagsStr);

      return {
        id: encrypted.id,
        title,
        content,
        tags,
        mood: encrypted.mood as MoodType,
        date: encrypted.date,
        createdAt: encrypted.createdAt,
        updatedAt: encrypted.updatedAt,
      };
    } catch (error) {
      console.error('Error decrypting entry:', error);
      return null;
    }
  };

  const searchEntries = (query: string): JournalEntry[] => {
    const lowerQuery = query.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.content.toLowerCase().includes(lowerQuery)
    );
  };

  const filterByTag = (tag: string): JournalEntry[] => {
    return entries.filter((entry) => entry.tags.includes(tag));
  };

  const filterByMood = (mood: MoodType): JournalEntry[] => {
    return entries.filter((entry) => entry.mood === mood);
  };

  const getStats = () => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce((sum, entry) => {
      const words = entry.content.split(/\s+/).filter((w) => w.length > 0);
      return sum + words.length;
    }, 0);

    const entriesByMood: Record<MoodType, number> = {
      happy: 0,
      sad: 0,
      neutral: 0,
      excited: 0,
      anxious: 0,
      calm: 0,
    };

    entries.forEach((entry) => {
      entriesByMood[entry.mood]++;
    });

    return { totalEntries, totalWords, entriesByMood };
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        loading,
        loadEntries,
        addEntry,
        updateEntry,
        removeEntry,
        getEntryById,
        searchEntries,
        filterByTag,
        filterByMood,
        getStats,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}
