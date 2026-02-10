"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { deriveKey, generateSalt, hashPassword, base64ToUint8Array, uint8ArrayToBase64 } from '@/lib/crypto';
import { getConfig, saveConfig, updateLastActivity, AppConfig } from '@/lib/db';

interface AuthContextType {
  isAuthenticated: boolean;
  isSetup: boolean;
  cryptoKey: CryptoKey | null;
  salt: Uint8Array | null;
  setupPassword: (password: string) => Promise<void>;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [salt, setSalt] = useState<Uint8Array | null>(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isMounted, setIsMounted] = useState(false);

  // Auto-lock after 15 minutes of inactivity
  const AUTO_LOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

  // Track if component is mounted (client-side)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if app is already setup
  useEffect(() => {
    if (!isMounted) return;
    
    const checkSetup = async () => {
      try {
        const config = await getConfig();
        setIsSetup(!!config?.isSetup);
        if (config?.salt) {
          setSalt(base64ToUint8Array(config.salt));
        }
      } catch (error) {
        console.error('Error checking setup:', error);
      }
    };
    checkSetup();
  }, [isMounted]);

  // Auto-lock timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkActivity = () => {
      const now = Date.now();
      if (now - lastActivity > AUTO_LOCK_DURATION) {
        logout();
      }
    };

    const interval = setInterval(checkActivity, 60000); // Check every minute

    // Update activity on user interaction
    const updateActivity = () => {
      setLastActivity(Date.now());
      updateLastActivity().catch(console.error);
    };

    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, [isAuthenticated, lastActivity]);

  const setupPassword = async (password: string) => {
    try {
      // Generate salt for this user
      const newSalt = generateSalt();
      
      // Derive key from password
      const key = await deriveKey(password, newSalt);
      
      // Hash password for verification
      const passHash = await hashPassword(password);
      
      // Save config
      const config: AppConfig = {
        salt: uint8ArrayToBase64(newSalt),
        passwordHash: passHash,
        isSetup: true,
        lastActivity: Date.now(),
      };
      
      await saveConfig(config);
      
      // Update state
      setSalt(newSalt);
      setCryptoKey(key);
      setIsSetup(true);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
    } catch (error) {
      console.error('Error setting up password:', error);
      throw error;
    }
  };

  const login = async (password: string): Promise<boolean> => {
    try {
      const config = await getConfig();
      if (!config || !config.isSetup) {
        return false;
      }

      // Derive key from password
      const userSalt = base64ToUint8Array(config.salt);
      const key = await deriveKey(password, userSalt);
      
      // Verify password by hashing
      const passHash = await hashPassword(password);
      
      if (passHash !== config.passwordHash) {
        return false;
      }
      
      // Update state
      setSalt(userSalt);
      setCryptoKey(key);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      
      // Update last activity in DB
      await updateLastActivity();
      
      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logout = useCallback(() => {
    setCryptoKey(null);
    setIsAuthenticated(false);
    setLastActivity(Date.now());
  }, []);

  const checkSession = async () => {
    const config = await getConfig();
    if (config?.lastActivity) {
      const timeSinceActivity = Date.now() - config.lastActivity;
      if (timeSinceActivity > AUTO_LOCK_DURATION) {
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isSetup,
        cryptoKey,
        salt,
        setupPassword,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
