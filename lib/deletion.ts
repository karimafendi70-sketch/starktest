/**
 * Deletion utilities
 * Handles deletion of entries, users, accounts, and all data
 */

import { deleteAllData as deleteAllIndexedDB } from './db';

/**
 * Delete a journal entry
 */
export async function deleteEntry(entryId: string): Promise<void> {
  // This will be handled by the journal context
  // Just a placeholder for consistency
  console.log('Deleting entry:', entryId);
}

/**
 * Delete a user and all their data
 */
export async function deleteUser(userId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  // Get all users
  const usersJson = localStorage.getItem('users');
  if (!usersJson) return;

  const users = JSON.parse(usersJson);
  
  // Remove user from list
  const updatedUsers = users.filter((u: any) => u.id !== userId);
  localStorage.setItem('users', JSON.stringify(updatedUsers));

  // Remove user-specific data
  localStorage.removeItem(`user_${userId}_settings`);
  localStorage.removeItem(`user_${userId}_theme`);
  localStorage.removeItem(`user_${userId}_bookmode`);

  // Note: IndexedDB entries are already scoped by encryption key
  // which becomes invalid when user is deleted
}

/**
 * Delete current user account
 */
export async function deleteAccount(userId: string): Promise<void> {
  await deleteUser(userId);
  
  // Clear current session
  localStorage.removeItem('currentUser');
  localStorage.removeItem('rememberUser');
}

/**
 * Delete ALL data (nuclear option)
 */
export async function deleteAllData(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // Clear all localStorage
    localStorage.clear();
    
    // Clear all sessionStorage
    sessionStorage.clear();
    
    // Delete IndexedDB
    await deleteAllIndexedDB();
    
    console.log('All data deleted successfully');
  } catch (error) {
    console.error('Error deleting all data:', error);
    throw new Error('Failed to delete all data');
  }
}

/**
 * Verify password for sensitive operations
 */
export async function verifyPasswordForDeletion(
  userId: string,
  password: string
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const usersJson = localStorage.getItem('users');
  if (!usersJson) return false;

  const users = JSON.parse(usersJson);
  const user = users.find((u: any) => u.id === userId);
  
  if (!user) return false;

  // Import verification function
  const { verifyPassword } = await import('./auth');
  return await verifyPassword(password, user.passwordHash);
}
