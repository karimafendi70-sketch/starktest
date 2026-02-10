"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  
  if (pathSegments.length === 0) {
    return null;
  }

  // Map path segments to readable names
  const segmentNames: Record<string, string> = {
    home: '�� Home',
    journal: '📔 Diary',
    notes: '📝 Notes',
    dashboard: '📊 Dashboard',
    settings: '⚙️ Settings',
    statistics: '📊 Statistics',
    pricing: '💰 Pricing',
    onboarding: '👋 Onboarding',
    setup: '🔧 Setup',
    login: '🔐 Login',
    appearance: '🎨 Appearance',
    security: '🔒 Security',
    billing: '💳 Billing',
    frequency: '📅 Frequency',
    habits: '✅ Habits',
    goals: '🎯 Goals',
    restore: '💾 Restore',
  };

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const name = segmentNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { path, name };
  });

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href="/home"
        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        🏠 Home
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {crumb.name}
            </span>
          ) : (
            <Link
              href={crumb.path}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
