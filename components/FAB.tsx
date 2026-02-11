'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, Calendar, BarChart3, Settings } from 'lucide-react';

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const menuItems = [
    { icon: '📝', label: 'New Entry', path: '/journal', action: () => router.push('/journal') },
    { icon: '📅', label: 'Calendar', path: '/calendar', action: () => router.push('/calendar') },
    { icon: '📊', label: 'Analytics', path: '/analytics', action: () => router.push('/analytics') },
    { icon: '⚙️', label: 'Settings', path: '/settings', action: () => router.push('/settings') },
  ];
  
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 space-y-3">
          {menuItems.map((item, index) => (
            <button 
              key={item.path}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 shadow-lg rounded-full px-4 py-3 hover:scale-105 transition-transform animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium pr-2 text-gray-900 dark:text-white">{item.label}</span>
            </button>
          ))}
        </div>
      )}
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-all ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <Plus className="w-8 h-8" />
      </button>
    </>
  );
}

