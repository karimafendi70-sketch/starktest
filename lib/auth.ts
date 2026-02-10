/**
 * Authentication utilities
 * Password hashing and validation using Web Crypto API with PBKDF2
 */

/**
 * Hash a password using PBKDF2 with SHA-256
 * This provides strong protection against brute force attacks
 */
export async function hashPassword(password: string, salt?: Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Use provided salt or generate a new one
  const passwordSalt = salt || crypto.getRandomValues(new Uint8Array(16));
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derive hash using PBKDF2 with 100,000 iterations
  const hashBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: passwordSalt.buffer as ArrayBuffer,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  
  const hashArray = Array.from(new Uint8Array(hashBits));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(passwordSalt).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return salt:hash format
  return `${saltHex}:${hashHex}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, hashHex] = storedHash.split(':');
  if (!saltHex || !hashHex) return false;
  
  // Convert salt from hex
  const salt = new Uint8Array(
    saltHex.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
  );
  
  // Hash the provided password with the stored salt
  const passwordHash = await hashPassword(password, salt);
  return passwordHash === storedHash;
}

/**
 * Generate a random emoji avatar
 */
export function generateRandomAvatar(): string {
  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😊', '😇', '🙂', '🙃', '😉',
    '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝',
    '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
    '🌟', '⭐', '🌈', '🔥', '💧', '⚡', '☀️', '🌙', '🌸', '🌺',
    '🌻', '🌷', '🌹', '🍀', '🌿', '🍃', '🌊', '🏔️', '🗻', '🏖️',
    '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🎸', '🎹', '🎺',
    '🎻', '🥁', '📚', '📖', '✏️', '📝', '💼', '📂', '📌', '📍',
  ];
  
  return emojis[Math.floor(Math.random() * emojis.length)];
}

/**
 * Generate a random color-based avatar (format: color:#RRGGBB)
 */
export function generateRandomColorAvatar(): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E63946', '#457B9D', '#F1FAEE', '#A8DADC', '#1D3557',
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Get initials from username
 */
export function getUserInitials(username: string): string {
  const parts = username.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
}

/**
 * Format date for display
 */
export function formatLastLogin(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}
