"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserSettings, getUserById, updateUserLastLogin, updateUserSettings } from './multi-user';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'current_user_id';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load current user from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (userId) {
      const user = getUserById(userId);
      if (user) {
        setCurrentUserState(user);
        updateUserLastLogin(userId);
      } else {
        // User not found, clear the stored ID
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
  }, []);

  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, user.id);
      updateUserLastLogin(user.id);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    if (currentUser) {
      updateUserSettings(currentUser.id, settings);
      // Reload user to get updated settings
      const updatedUser = getUserById(currentUser.id);
      if (updatedUser) {
        setCurrentUserState(updatedUser);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Prevent hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateSettings,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
