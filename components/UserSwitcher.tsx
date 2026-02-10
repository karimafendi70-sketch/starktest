"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { UserAvatar } from './UserAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, Users } from 'lucide-react';

export function UserSwitcher() {
  const { currentUser, logout } = useUser();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/users');
  };

  const handleSwitchUser = () => {
    logout();
    router.push('/users');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <UserAvatar user={currentUser} size="small" />
        <span className="text-sm font-medium hidden md:inline">{currentUser.username}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <UserAvatar user={currentUser} size="medium" />
                  <div>
                    <div className="font-medium">{currentUser.username}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser.settings.theme} theme
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="py-1">
                <button
                  onClick={handleSwitchUser}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Switch User
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
