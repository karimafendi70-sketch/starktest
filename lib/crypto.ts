/**
 * Encryption utilities using Web Crypto API
 * AES-256-GCM encryption for journal entries
 */

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const ITERATIONS = 100000;

/**
 * Derive a cryptographic key from a password
 */
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive AES-256 key using PBKDF2
  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random salt
 */
export function generateSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
}

/**
 * Generate a random IV (Initialization Vector)
 */
export function generateIV(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(IV_LENGTH));
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encrypt(
  data: string,
  key: CryptoKey
): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const iv = generateIV();

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    dataBuffer
  );

  return { ciphertext, iv };
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decrypt(
  ciphertext: ArrayBuffer,
  key: CryptoKey,
  iv: Uint8Array
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Convert ArrayBuffer to Base64 string for storage
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 string back to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Convert Uint8Array to Base64 string
 */
export function uint8ArrayToBase64(array: Uint8Array): string {
  return arrayBufferToBase64(array.buffer);
}

/**
 * Convert Base64 string to Uint8Array
 */
export function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(base64));
}

/**
 * Hash a password for verification (not stored, just for comparison)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return arrayBufferToBase64(hashBuffer);
}
