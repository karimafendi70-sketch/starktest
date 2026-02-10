/**
 * Authentication utilities
 * Password hashing and validation using Web Crypto API
 */

/**
 * Hash a password using SHA-256
 * Note: This is NOT as secure as bcrypt for password storage,
 * but it's the best we can do in browser environment without external libraries
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
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
