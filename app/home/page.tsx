"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/user-context';
import { useJournal } from '@/lib/journal-context';
import { UserAvatar } from '@/components/UserAvatar';
import {
  BookOpen,
  FileText,
  Settings,
  TrendingUp,
  Calendar,
  Lock,
  Image,
  Sparkles,
} from 'lucide-react';

// Constants
const ESTIMATED_WORDS_PER_ENTRY = 250;

export default function HomePage() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { entries, getStats } = useJournal();

  const stats = getStats();

  const quickActions = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Open Diary',
      description: 'Write in your encrypted journal',
      href: '/journal',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Quick Notes',
      description: 'Take fast, unencrypted notes',
      href: '/notes',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Statistics',
      description: 'View your writing stats',
      href: '/statistics',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: 'Settings',
      description: 'Customize your experience',
      href: '/settings',
      color: 'from-gray-500 to-slate-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            {currentUser && <UserAvatar user={currentUser} size="large" />}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Welcome back{currentUser ? `, ${currentUser.username}` : ''}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Ready to write today?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Entries
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalEntries}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Streak
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              0 days
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Words
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalEntries > 0 ? '~' + (stats.totalEntries * ESTIMATED_WORDS_PER_ENTRY).toLocaleString() : '0'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Encryption
              </span>
            </div>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              AES-256 ✓
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={() => router.push(action.href)}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Entries Preview */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Entries
              </h2>
              <button
                onClick={() => router.push('/journal')}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                View all →
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
              {entries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {entry.title || 'Untitled Entry'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {entry.mood && (
                      <span className="text-2xl">{entry.mood === 'happy' ? '😊' : entry.mood === 'sad' ? '😢' : '😐'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
