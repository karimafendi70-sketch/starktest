/**
 * Photo encryption utilities
 * Uses AES-256-GCM for encrypting photo data
 */

import { encryptData, decryptData } from './crypto';

/**
 * Encrypt photo data
 */
export async function encryptPhoto(
  photoDataUrl: string,
  cryptoKey: CryptoKey
): Promise<{ encrypted: string; iv: string }> {
  // Remove data URL prefix to get just the base64 data
  const base64Data = photoDataUrl.split(',')[1] || photoDataUrl;
  
  const result = await encryptData(base64Data, cryptoKey);
  return result;
}

/**
 * Decrypt photo data
 */
export async function decryptPhoto(
  encryptedData: string,
  iv: string,
  cryptoKey: CryptoKey
): Promise<string> {
  const decrypted = await decryptData(encryptedData, iv, cryptoKey);
  
  // Return as data URL
  return `data:image/jpeg;base64,${decrypted}`;
}

/**
 * Encrypt thumbnail
 */
export async function encryptThumbnail(
  thumbnailDataUrl: string,
  cryptoKey: CryptoKey
): Promise<{ encrypted: string; iv: string }> {
  const base64Data = thumbnailDataUrl.split(',')[1] || thumbnailDataUrl;
  
  const result = await encryptData(base64Data, cryptoKey);
  return result;
}

/**
 * Decrypt thumbnail
 */
export async function decryptThumbnail(
  encryptedData: string,
  iv: string,
  cryptoKey: CryptoKey
): Promise<string> {
  const decrypted = await decryptData(encryptedData, iv, cryptoKey);
  
  return `data:image/jpeg;base64,${decrypted}`;
}
