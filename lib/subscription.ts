/**
 * Trial and subscription management utilities
 */

const TRIAL_DURATION_DAYS = 3;
const TRIAL_START_KEY = 'trial_start_date';
const SUBSCRIPTION_STATUS_KEY = 'subscription_status';

export interface TrialStatus {
  startDate: string | null;
  daysRemaining: number;
  isActive: boolean;
  hasSubscription: boolean;
  isExpired: boolean;
}

/**
 * Initialize trial if not already started
 */
export function initializeTrial(): void {
  if (typeof window === 'undefined') return;
  
  const existingStart = localStorage.getItem(TRIAL_START_KEY);
  if (!existingStart) {
    const now = new Date().toISOString();
    localStorage.setItem(TRIAL_START_KEY, now);
  }
}

/**
 * Get current trial status
 */
export function getTrialStatus(): TrialStatus {
  if (typeof window === 'undefined') {
    return {
      startDate: null,
      daysRemaining: TRIAL_DURATION_DAYS,
      isActive: true,
      hasSubscription: false,
      isExpired: false,
    };
  }

  const startDateStr = localStorage.getItem(TRIAL_START_KEY);
  const hasSubscription = localStorage.getItem(SUBSCRIPTION_STATUS_KEY) === 'active';

  if (!startDateStr) {
    return {
      startDate: null,
      daysRemaining: TRIAL_DURATION_DAYS,
      isActive: true,
      hasSubscription,
      isExpired: false,
    };
  }

  const startDate = new Date(startDateStr);
  const now = new Date();
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.max(0, TRIAL_DURATION_DAYS - diffDays);

  const isExpired = daysRemaining === 0 && !hasSubscription;
  const isActive = daysRemaining > 0 || hasSubscription;

  return {
    startDate: startDateStr,
    daysRemaining,
    isActive,
    hasSubscription,
    isExpired,
  };
}

/**
 * Activate subscription (placeholder - integrate with payment provider)
 */
export function activateSubscription(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
}

/**
 * Check if user has access (trial active or has subscription)
 */
export function hasAccess(): boolean {
  const status = getTrialStatus();
  return status.isActive;
}

/**
 * Reset trial (for testing purposes only)
 */
export function resetTrial(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TRIAL_START_KEY);
  localStorage.removeItem(SUBSCRIPTION_STATUS_KEY);
}
