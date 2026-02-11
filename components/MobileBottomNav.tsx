'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Calendar, BarChart3, Settings } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
      <div className="grid grid-cols-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center py-3 transition-colors ${
              isActive(href)
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Icon className={`w-6 h-6 mb-1 ${isActive(href) ? 'stroke-2' : ''}`} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
