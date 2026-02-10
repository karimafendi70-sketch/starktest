/**
 * Photo encryption utilities
 * Uses AES-256-GCM for encrypting photo data
 */

import { 
  encrypt, 
  decrypt, 
  arrayBufferToBase64, 
  base64ToArrayBuffer,
  uint8ArrayToBase64 
} from './crypto';

/**
 * Encrypt photo data
 */
export async function encryptPhoto(
  photoDataUrl: string,
  cryptoKey: CryptoKey
): Promise<{ encrypted: string; iv: string }> {
  // Remove data URL prefix to get just the base64 data
  const base64Data = photoDataUrl.split(',')[1] || photoDataUrl;
  
  const { ciphertext, iv } = await encrypt(base64Data, cryptoKey);
  return {
    encrypted: arrayBufferToBase64(ciphertext),
    iv: uint8ArrayToBase64(iv),
  };
}

/**
 * Decrypt photo data
 */
export async function decryptPhoto(
  encryptedData: string,
  iv: string,
  cryptoKey: CryptoKey
): Promise<string> {
  const ciphertext = base64ToArrayBuffer(encryptedData);
  const ivArray = base64ToArrayBuffer(iv);
  const decrypted = await decrypt(ciphertext, cryptoKey, new Uint8Array(ivArray));
  
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
  
  const { ciphertext, iv } = await encrypt(base64Data, cryptoKey);
  return {
    encrypted: arrayBufferToBase64(ciphertext),
    iv: uint8ArrayToBase64(iv),
  };
}

/**
 * Decrypt thumbnail
 */
export async function decryptThumbnail(
  encryptedData: string,
  iv: string,
  cryptoKey: CryptoKey
): Promise<string> {
  const ciphertext = base64ToArrayBuffer(encryptedData);
  const ivArray = base64ToArrayBuffer(iv);
  const decrypted = await decrypt(ciphertext, cryptoKey, new Uint8Array(ivArray));
  
  return `data:image/jpeg;base64,${decrypted}`;
}
