"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTrialStatus, initializeTrial, activateSubscription, TrialStatus } from './subscription';

interface TrialContextType {
  trialStatus: TrialStatus;
  refreshStatus: () => void;
  activateSubscription: () => void;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export function TrialProvider({ children }: { children: React.ReactNode }) {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    startDate: null,
    daysRemaining: 3,
    isActive: true,
    hasSubscription: false,
    isExpired: false,
  });

  const refreshStatus = () => {
    const status = getTrialStatus();
    setTrialStatus(status);
  };

  useEffect(() => {
    // Initialize trial on first load
    initializeTrial();
    refreshStatus();

    // Refresh status every minute only if trial is active and not subscribed
    const interval = setInterval(() => {
      const currentStatus = getTrialStatus();
      if (!currentStatus.hasSubscription && currentStatus.isActive) {
        refreshStatus();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleActivateSubscription = () => {
    activateSubscription();
    refreshStatus();
  };

  return (
    <TrialContext.Provider
      value={{
        trialStatus,
        refreshStatus,
        activateSubscription: handleActivateSubscription,
      }}
    >
      {children}
    </TrialContext.Provider>
  );
}

export function useTrial() {
  const context = useContext(TrialContext);
  if (context === undefined) {
    throw new Error('useTrial must be used within a TrialProvider');
  }
  return context;
}
