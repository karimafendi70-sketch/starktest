/**
 * Type definitions for photo system
 */

export interface Photo {
  id: string;
  userId: string;
  entryId: string;
  dataUrl: string; // Decrypted photo data URL
  thumbnailUrl: string; // Decrypted thumbnail data URL
  caption?: string;
  timestamp: string; // ISO date string
  metadata: PhotoMetadata;
}

export interface PhotoMetadata {
  width: number;
  height: number;
  size: number; // in bytes
  format: string; // 'image/jpeg', 'image/png', etc.
}

export interface EncryptedPhoto {
  id: string;
  userId: string;
  entryId: string;
  encryptedData: string;
  encryptedThumbnail: string;
  caption?: string;
  timestamp: string;
  metadata: PhotoMetadata;
  dataIV: string; // Initialization vector for data
  thumbnailIV: string; // Initialization vector for thumbnail
}
