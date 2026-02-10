"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Home, Moon, Sun, Lock } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { useUser } from '@/lib/user-context';
import { UserSwitcher } from './UserSwitcher';
import { Breadcrumbs } from './Breadcrumbs';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { currentUser } = useUser();

  // Don't show header on landing page, users, register, or login pages
  const hideHeader = pathname === '/' || pathname === '/users' || pathname === '/register' || pathname === '/login';
  
  if (hideHeader) {
    return null;
  }

  const handleLock = () => {
    logout();
    router.push('/users');
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Home Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/home')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Go to Home"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Home</span>
            </button>
            
            {/* Breadcrumbs */}
            <div className="hidden md:block">
              <Breadcrumbs />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Switcher (only if user is logged in) */}
            {currentUser && <UserSwitcher />}

            {/* Lock/Logout Button (only if authenticated to journal) */}
            {isAuthenticated && (
              <button
                onClick={handleLock}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Lock journal"
              >
                <Lock className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Breadcrumbs */}
        <div className="md:hidden pb-3">
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
}
