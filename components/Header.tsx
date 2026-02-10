"use client";

import { useRouter, usePathname } from 'next/navigation';
import { Home, Moon, Sun, Lock, BookOpen, Camera, TrendingUp, DollarSign, Settings } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { useUser } from '@/lib/user-context';
import { UserSwitcher } from './UserSwitcher';
import { Breadcrumbs } from './Breadcrumbs';
import { TrialBanner } from './TrialBanner';

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

  const navLinks = [
    { href: '/journal', label: 'Journal', icon: <BookOpen className="w-4 h-4" /> },
    { href: '/gallery', label: 'Gallery', icon: <Camera className="w-4 h-4" /> },
    { href: '/statistics', label: 'Stats', icon: <TrendingUp className="w-4 h-4" /> },
    { href: '/pricing', label: 'Premium', icon: <DollarSign className="w-4 h-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Trial Banner */}
      <TrialBanner />
      
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Home Button + Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/home')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Go to Home"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Home</span>
              </button>
              
              {/* Navigation Links - Desktop */}
              <nav className="hidden lg:flex items-center gap-1 ml-4">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => router.push(link.href)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      pathname === link.href
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    title={link.label}
                  >
                    {link.icon}
                    <span className="text-sm font-medium">{link.label}</span>
                  </button>
                ))}
              </nav>
              
              {/* Breadcrumbs - Tablet */}
              <div className="hidden md:block lg:hidden ml-4">
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
    </>
  );
}
