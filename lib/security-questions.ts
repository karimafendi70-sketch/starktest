/**
 * Security questions management
 */

import { hashPassword } from './auth';

export interface SecurityQuestion {
  question: string;
  answerHash: string;
}

export interface SecurityQuestions {
  question1: SecurityQuestion;
  question2: SecurityQuestion;
  question3: SecurityQuestion;
}

export const AVAILABLE_QUESTIONS = [
  "What is your mother's maiden name?",
  "What city were you born in?",
  "What was the name of your first pet?",
  "What was your childhood nickname?",
  "What street did you grow up on?",
  "What was your first car's make/model?",
  "What is your favorite book?",
  "What was the name of your elementary school?",
  "What is your father's middle name?",
  "What was your dream job as a child?",
  "What is your favorite movie?",
  "What was the name of your first teacher?",
];

/**
 * Hash security answer
 */
export async function hashSecurityAnswer(answer: string): Promise<string> {
  // Normalize answer (lowercase, trim)
  const normalized = answer.toLowerCase().trim();
  return await hashPassword(normalized);
}

/**
 * Verify security answer
 */
export async function verifySecurityAnswer(
  answer: string,
  storedHash: string
): Promise<boolean> {
  const normalized = answer.toLowerCase().trim();
  const { verifyPassword } = await import('./auth');
  return await verifyPassword(normalized, storedHash);
}

/**
 * Save security questions for user
 */
export function saveSecurityQuestions(
  userId: string,
  questions: SecurityQuestions
): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`user_${userId}_security_questions`, JSON.stringify(questions));
}

/**
 * Get security questions for user
 */
export function getSecurityQuestions(userId: string): SecurityQuestions | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(`user_${userId}_security_questions`);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if user has security questions set up
 */
export function hasSecurityQuestions(userId: string): boolean {
  return getSecurityQuestions(userId) !== null;
}

/**
 * Select random questions for recovery (2 out of 3)
 * Uses Fisher-Yates shuffle for proper randomization
 */
export function selectRecoveryQuestions(
  questions: SecurityQuestions
): Array<{ index: number; question: string }> {
  const allQuestions = [
    { index: 1, question: questions.question1.question },
    { index: 2, question: questions.question2.question },
    { index: 3, question: questions.question3.question },
  ];

  // Fisher-Yates shuffle
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
  }

  return allQuestions.slice(0, 2);
}
