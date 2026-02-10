/**
 * Multi-User Storage Management
 * Manages up to 5 users with separate encrypted data
 */

export interface User {
  id: string;
  username: string;
  avatar: string; // emoji or color code
  passwordHash: string; // SHA-256 hash
  createdAt: string;
  lastLogin: string;
  encryptionSalt: string; // base64 encoded salt for encryption key
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'vintage' | 'ocean' | 'forest';
  fontSize: 'small' | 'medium' | 'large';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  backgroundTexture: 'none' | 'paper' | 'leather' | 'fabric';
  bookModeEnabled: boolean;
  autoLockMinutes: number;
}

const USERS_STORAGE_KEY = 'app_users';
const MAX_USERS = 5;

const defaultSettings: UserSettings = {
  theme: 'light',
  fontSize: 'medium',
  lineSpacing: 'normal',
  backgroundTexture: 'none',
  bookModeEnabled: false,
  autoLockMinutes: 15,
};

/**
 * Get all users
 */
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    if (!usersJson) return [];
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

/**
 * Get user by ID
 */
export function getUserById(userId: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.id === userId) || null;
}

/**
 * Get user by username
 */
export function getUserByUsername(username: string): User | null {
  const users = getAllUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

/**
 * Create new user
 */
export function createUser(username: string, passwordHash: string, avatar: string, encryptionSalt: string): User | null {
  const users = getAllUsers();
  
  // Check max users limit
  if (users.length >= MAX_USERS) {
    throw new Error(`Maximum of ${MAX_USERS} users reached`);
  }
  
  // Check if username already exists
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw new Error('Username already exists');
  }
  
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    avatar,
    passwordHash,
    encryptionSalt,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    settings: { ...defaultSettings },
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return newUser;
}

/**
 * Update user's last login time
 */
export function updateUserLastLogin(userId: string): void {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date().toISOString();
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

/**
 * Update user settings
 */
export function updateUserSettings(userId: string, settings: Partial<UserSettings>): void {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].settings = {
      ...users[userIndex].settings,
      ...settings,
    };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
}

/**
 * Delete user and all their data
 */
export function deleteUser(userId: string): boolean {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  if (filteredUsers.length === users.length) {
    return false; // User not found
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
  
  // Also clean up user-specific data from IndexedDB
  // This will be done by the calling code that has access to deleteAllData
  
  return true;
}

/**
 * Check if max users limit reached
 */
export function isMaxUsersReached(): boolean {
  return getAllUsers().length >= MAX_USERS;
}

/**
 * Validate username
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 20) {
    return { valid: false, error: 'Username must be at most 20 characters' };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }
  
  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
  strength: 'weak' | 'medium' | 'strong';
} {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required', strength: 'weak' };
  }
  
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters', strength: 'weak' };
  }
  
  // Calculate password strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  
  return { valid: true, strength };
}

/**
 * Generate user database name (for IndexedDB)
 */
export function getUserDatabaseName(userId: string): string {
  return `journal_db_${userId}`;
}
