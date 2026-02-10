/**
 * IndexedDB utilities for storing encrypted journal entries
 */

const DB_NAME = 'EncryptedJournal';
const DB_VERSION = 1;
const STORE_NAME = 'entries';
const CONFIG_STORE = 'config';

export interface EncryptedEntry {
  id: string;
  encryptedTitle: string;
  encryptedContent: string;
  encryptedTags: string;
  mood: string;
  date: string;
  createdAt: number;
  updatedAt: number;
  titleIV: string;
  contentIV: string;
  tagsIV: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious';
  date: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppConfig {
  salt: string;
  passwordHash: string;
  isSetup: boolean;
  lastActivity?: number;
}

/**
 * Open or create the IndexedDB database
 */
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create entries store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const entriesStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        entriesStore.createIndex('date', 'date', { unique: false });
        entriesStore.createIndex('createdAt', 'createdAt', { unique: false });
        entriesStore.createIndex('mood', 'mood', { unique: false });
      }

      // Create config store
      if (!db.objectStoreNames.contains(CONFIG_STORE)) {
        db.createObjectStore(CONFIG_STORE, { keyPath: 'key' });
      }
    };
  });
}

/**
 * Save app configuration
 */
export async function saveConfig(config: AppConfig): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONFIG_STORE], 'readwrite');
    const store = transaction.objectStore(CONFIG_STORE);
    const request = store.put({ key: 'config', ...config });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get app configuration
 */
export async function getConfig(): Promise<AppConfig | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CONFIG_STORE], 'readonly');
    const store = transaction.objectStore(CONFIG_STORE);
    const request = store.get('config');

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        const { key, ...config } = result;
        resolve(config as AppConfig);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save an encrypted entry
 */
export async function saveEntry(entry: EncryptedEntry): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(entry);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get an encrypted entry by ID
 */
export async function getEntry(id: string): Promise<EncryptedEntry | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all encrypted entries
 */
export async function getAllEntries(): Promise<EncryptedEntry[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete an entry by ID
 */
export async function deleteEntry(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete all entries and reset the app (panic button)
 */
export async function deleteAllData(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME, CONFIG_STORE], 'readwrite');
    
    const entriesStore = transaction.objectStore(STORE_NAME);
    const configStore = transaction.objectStore(CONFIG_STORE);
    
    const clearEntries = entriesStore.clear();
    const clearConfig = configStore.clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Update last activity timestamp
 */
export async function updateLastActivity(): Promise<void> {
  const config = await getConfig();
  if (config) {
    config.lastActivity = Date.now();
    await saveConfig(config);
  }
}

/**
 * Export all data as JSON (for backup)
 */
export async function exportData(): Promise<string> {
  const entries = await getAllEntries();
  const config = await getConfig();
  
  return JSON.stringify({
    version: DB_VERSION,
    entries,
    config,
    exportedAt: Date.now(),
  }, null, 2);
}

/**
 * Import data from JSON backup
 */
export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.config) {
      await saveConfig(data.config);
    }
    
    if (data.entries && Array.isArray(data.entries)) {
      for (const entry of data.entries) {
        await saveEntry(entry);
      }
    }
  } catch (error) {
    throw new Error('Invalid backup file format');
  }
}
