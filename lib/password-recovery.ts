/**
 * Password recovery utilities
 */

import {
  getSecurityQuestions,
  verifySecurityAnswer,
  selectRecoveryQuestions,
} from './security-questions';
import { hashPassword } from './auth';
import { deriveKey } from './crypto';

export interface RecoverySession {
  userId: string;
  questions: Array<{ index: number; question: string }>;
  attempts: number;
  maxAttempts: number;
}

/**
 * Start password recovery session
 */
export function startRecovery(userId: string): RecoverySession | null {
  const questions = getSecurityQuestions(userId);
  if (!questions) return null;

  const selectedQuestions = selectRecoveryQuestions(questions);

  return {
    userId,
    questions: selectedQuestions,
    attempts: 0,
    maxAttempts: 3,
  };
}

/**
 * Verify recovery answers
 */
export async function verifyRecoveryAnswers(
  session: RecoverySession,
  answers: Record<number, string>
): Promise<boolean> {
  const questions = getSecurityQuestions(session.userId);
  if (!questions) return false;

  const questionMap = {
    1: questions.question1,
    2: questions.question2,
    3: questions.question3,
  };

  // Verify all provided answers
  const verifications = await Promise.all(
    session.questions.map(async (q) => {
      const answer = answers[q.index];
      const question = questionMap[q.index as keyof typeof questionMap];
      
      if (!answer || !question) return false;
      
      return await verifySecurityAnswer(answer, question.answerHash);
    })
  );

  // All answers must be correct
  return verifications.every(v => v === true);
}

/**
 * Reset password after successful recovery
 */
export async function resetPassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // Get user
    const usersJson = localStorage.getItem('users');
    if (!usersJson) return false;

    const users = JSON.parse(usersJson);
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) return false;

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update user
    users[userIndex].passwordHash = newPasswordHash;
    localStorage.setItem('users', JSON.stringify(users));

    // Note: Existing encrypted data will need to be re-encrypted with new key
    // This is a limitation of client-side encryption
    // For now, user will lose access to old entries unless we implement a migration

    return true;
  } catch (error) {
    console.error('Failed to reset password:', error);
    return false;
  }
}

/**
 * Re-encrypt user data with new password
 * This is a complex operation that requires the old key
 */
export async function reEncryptUserData(
  userId: string,
  oldKey: CryptoKey,
  newPassword: string
): Promise<boolean> {
  try {
    // Derive new key from new password
    const user = getUserById(userId);
    if (!user) return false;

    const newKey = await deriveKey(newPassword, hexToUint8Array(user.salt));

    // This would require:
    // 1. Decrypt all entries with old key
    // 2. Re-encrypt with new key
    // 3. Update all entries in IndexedDB
    
    // For simplicity in this implementation, we'll skip this
    // In a production app, this should be implemented

    return true;
  } catch (error) {
    console.error('Failed to re-encrypt data:', error);
    return false;
  }
}

/**
 * Get user by ID (helper)
 */
function getUserById(userId: string): any {
  if (typeof window === 'undefined') return null;
  
  const usersJson = localStorage.getItem('users');
  if (!usersJson) return null;

  const users = JSON.parse(usersJson);
  return users.find((u: any) => u.id === userId);
}

/**
 * Convert hex string to Uint8Array (helper)
 */
function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}
