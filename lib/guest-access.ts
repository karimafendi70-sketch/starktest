/**
 * Guest access management
 * Allows temporary read-only access to journal entries
 */

export interface GuestAccess {
  code: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  accessType: 'all' | 'specific' | 'dateRange';
  entryIds?: string[];
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Generate guest access code
 */
export function generateGuestCode(): string {
  const chars = '0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create guest access
 */
export function createGuestAccess(
  userId: string,
  expirationHours: number,
  accessType: 'all' | 'specific' | 'dateRange' = 'all',
  options?: {
    entryIds?: string[];
    dateFrom?: string;
    dateTo?: string;
  }
): GuestAccess {
  const code = generateGuestCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000);

  const access: GuestAccess = {
    code,
    userId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    accessType,
    ...options,
  };

  // Save to localStorage
  if (typeof window !== 'undefined') {
    const key = `guest_access_${code}`;
    localStorage.setItem(key, JSON.stringify(access));
  }

  return access;
}

/**
 * Verify guest access code
 */
export function verifyGuestCode(code: string): GuestAccess | null {
  if (typeof window === 'undefined') return null;

  const key = `guest_access_${code}`;
  const stored = localStorage.getItem(key);
  
  if (!stored) return null;

  try {
    const access: GuestAccess = JSON.parse(stored);
    
    // Check if expired
    const now = new Date();
    const expiresAt = new Date(access.expiresAt);
    
    if (now > expiresAt) {
      // Remove expired access
      localStorage.removeItem(key);
      return null;
    }

    return access;
  } catch {
    return null;
  }
}

/**
 * Get all guest access codes for user
 */
export function getUserGuestAccess(userId: string): GuestAccess[] {
  if (typeof window === 'undefined') return [];

  const accesses: GuestAccess[] = [];
  
  // Iterate through localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('guest_access_')) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const access: GuestAccess = JSON.parse(stored);
          if (access.userId === userId) {
            // Check if expired
            const now = new Date();
            const expiresAt = new Date(access.expiresAt);
            
            if (now <= expiresAt) {
              accesses.push(access);
            } else {
              // Remove expired
              localStorage.removeItem(key);
            }
          }
        } catch {
          // Invalid data, skip
        }
      }
    }
  }

  return accesses;
}

/**
 * Revoke guest access
 */
export function revokeGuestAccess(code: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`guest_access_${code}`);
}

/**
 * Check if guest has access to entry
 */
export function canGuestAccessEntry(
  access: GuestAccess,
  entryId: string,
  entryDate: string
): boolean {
  // Check access type
  if (access.accessType === 'all') {
    return true;
  }

  if (access.accessType === 'specific') {
    return access.entryIds?.includes(entryId) ?? false;
  }

  if (access.accessType === 'dateRange') {
    const date = new Date(entryDate);
    const from = access.dateFrom ? new Date(access.dateFrom) : null;
    const to = access.dateTo ? new Date(access.dateTo) : null;

    if (from && date < from) return false;
    if (to && date > to) return false;

    return true;
  }

  return false;
}

/**
 * Get time remaining for guest access
 */
export function getGuestAccessTimeRemaining(access: GuestAccess): {
  hours: number;
  minutes: number;
  expired: boolean;
} {
  const now = new Date();
  const expiresAt = new Date(access.expiresAt);
  
  if (now > expiresAt) {
    return { hours: 0, minutes: 0, expired: true };
  }

  const diffMs = expiresAt.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, expired: false };
}
