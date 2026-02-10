/**
 * Photo storage utilities using IndexedDB
 * Manages encrypted photos in IndexedDB
 */

import { EncryptedPhoto, Photo, PhotoMetadata } from '@/types/photo';
import { encryptPhoto, decryptPhoto, encryptThumbnail, decryptThumbnail } from './photo-encryption';
import { compressImage, generateThumbnail, getImageMetadata } from './image-processing';

const DB_NAME = 'EncryptedJournal';
const DB_VERSION = 2; // Increment version to add photos store
const PHOTOS_STORE = 'photos';

/**
 * Open database with photos store
 */
function openPhotoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create photos store if it doesn't exist
      if (!db.objectStoreNames.contains(PHOTOS_STORE)) {
        const photosStore = db.createObjectStore(PHOTOS_STORE, { keyPath: 'id' });
        photosStore.createIndex('userId', 'userId', { unique: false });
        photosStore.createIndex('entryId', 'entryId', { unique: false });
        photosStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

/**
 * Save encrypted photo
 */
export async function savePhoto(
  userId: string,
  entryId: string,
  photoDataUrl: string,
  cryptoKey: CryptoKey,
  caption?: string
): Promise<string> {
  // Compress image
  const compressed = await compressImage(photoDataUrl);
  
  // Generate thumbnail
  const thumbnail = await generateThumbnail(compressed);
  
  // Get metadata
  const metadata = await getImageMetadata(compressed);
  
  // Encrypt photo and thumbnail
  const encryptedData = await encryptPhoto(compressed, cryptoKey);
  const encryptedThumb = await encryptThumbnail(thumbnail, cryptoKey);
  
  // Create photo object
  const photoId = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const photo: EncryptedPhoto = {
    id: photoId,
    userId,
    entryId,
    encryptedData: encryptedData.encrypted,
    encryptedThumbnail: encryptedThumb.encrypted,
    dataIV: encryptedData.iv,
    thumbnailIV: encryptedThumb.iv,
    caption,
    timestamp: new Date().toISOString(),
    metadata,
  };
  
  // Save to IndexedDB
  const db = await openPhotoDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PHOTOS_STORE], 'readwrite');
    const store = transaction.objectStore(PHOTOS_STORE);
    const request = store.add(photo);
    
    request.onsuccess = () => resolve(photoId);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get photo by ID
 */
export async function getPhotoById(
  photoId: string,
  cryptoKey: CryptoKey
): Promise<Photo | null> {
  const db = await openPhotoDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PHOTOS_STORE], 'readonly');
    const store = transaction.objectStore(PHOTOS_STORE);
    const request = store.get(photoId);
    
    request.onsuccess = async () => {
      const encrypted = request.result as EncryptedPhoto | undefined;
      if (!encrypted) {
        resolve(null);
        return;
      }
      
      try {
        // Decrypt photo data
        const decryptedData = await decryptPhoto(
          encrypted.encryptedData,
          encrypted.dataIV,
          cryptoKey
        );
        
        const decryptedThumbnail = await decryptThumbnail(
          encrypted.encryptedThumbnail,
          encrypted.thumbnailIV,
          cryptoKey
        );
        
        const photo: Photo = {
          id: encrypted.id,
          userId: encrypted.userId,
          entryId: encrypted.entryId,
          dataUrl: decryptedData,
          thumbnailUrl: decryptedThumbnail,
          caption: encrypted.caption,
          timestamp: encrypted.timestamp,
          metadata: encrypted.metadata,
        };
        
        resolve(photo);
      } catch (error) {
        reject(error);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get photos for an entry
 */
export async function getPhotosForEntry(
  entryId: string,
  cryptoKey: CryptoKey
): Promise<Photo[]> {
  const db = await openPhotoDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PHOTOS_STORE], 'readonly');
    const store = transaction.objectStore(PHOTOS_STORE);
    const index = store.index('entryId');
    const request = index.getAll(entryId);
    
    request.onsuccess = async () => {
      const encrypted = request.result as EncryptedPhoto[];
      
      try {
        const photos = await Promise.all(
          encrypted.map(async (enc) => {
            const decryptedData = await decryptPhoto(
              enc.encryptedData,
              enc.dataIV,
              cryptoKey
            );
            
            const decryptedThumbnail = await decryptThumbnail(
              enc.encryptedThumbnail,
              enc.thumbnailIV,
              cryptoKey
            );
            
            return {
              id: enc.id,
              userId: enc.userId,
              entryId: enc.entryId,
              dataUrl: decryptedData,
              thumbnailUrl: decryptedThumbnail,
              caption: enc.caption,
              timestamp: enc.timestamp,
              metadata: enc.metadata,
            };
          })
        );
        
        resolve(photos);
      } catch (error) {
        reject(error);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

/**
 * Delete photo
 */
export async function deletePhoto(photoId: string): Promise<void> {
  const db = await openPhotoDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PHOTOS_STORE], 'readwrite');
    const store = transaction.objectStore(PHOTOS_STORE);
    const request = store.delete(photoId);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Get all photos for user
 */
export async function getAllPhotosForUser(
  userId: string,
  cryptoKey: CryptoKey
): Promise<Photo[]> {
  const db = await openPhotoDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([PHOTOS_STORE], 'readonly');
    const store = transaction.objectStore(PHOTOS_STORE);
    const index = store.index('userId');
    const request = index.getAll(userId);
    
    request.onsuccess = async () => {
      const encrypted = request.result as EncryptedPhoto[];
      
      try {
        const photos = await Promise.all(
          encrypted.map(async (enc) => {
            const decryptedData = await decryptPhoto(
              enc.encryptedData,
              enc.dataIV,
              cryptoKey
            );
            
            const decryptedThumbnail = await decryptThumbnail(
              enc.encryptedThumbnail,
              enc.thumbnailIV,
              cryptoKey
            );
            
            return {
              id: enc.id,
              userId: enc.userId,
              entryId: enc.entryId,
              dataUrl: decryptedData,
              thumbnailUrl: decryptedThumbnail,
              caption: enc.caption,
              timestamp: enc.timestamp,
              metadata: enc.metadata,
            };
          })
        );
        
        resolve(photos);
      } catch (error) {
        reject(error);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}
