"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/lib/user-context';
import { useJournal } from '@/lib/journal-context';
import { UserAvatar } from '@/components/UserAvatar';
import { StreakCounter } from '@/components/StreakCounter';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { StreakBadges } from '@/components/StreakBadges';
import { getStreakBadges } from '@/lib/streak';
import {
  BookOpen,
  FileText,
  Settings,
  TrendingUp,
  Calendar,
  Lock,
  Image,
  Sparkles,
  Camera,
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
      icon: <Camera className="w-6 h-6" />,
      title: 'Gallery',
      description: 'View your photo memories',
      href: '/gallery',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  // Calculate streak (simple implementation - count consecutive days with entries)
  const calculateStreak = () => {
    if (entries.length === 0) return { current: 0, longest: 0 };
    
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    let lastDate = new Date(sortedEntries[0].date);
    
    // Check if today or yesterday has an entry
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const lastEntryStr = lastDate.toISOString().split('T')[0];
    
    if (lastEntryStr === todayStr || lastEntryStr === yesterdayStr) {
      currentStreak = 1;
      
      for (let i = 1; i < sortedEntries.length; i++) {
        const currentDate = new Date(sortedEntries[i].date);
        const prevDate = new Date(sortedEntries[i - 1].date);
        const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          currentStreak++;
          tempStreak++;
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < sortedEntries.length; i++) {
      const currentDate = new Date(sortedEntries[i].date);
      const prevDate = new Date(sortedEntries[i - 1].date);
      const dayDiff = Math.floor((prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    
    longestStreak = Math.max(longestStreak, currentStreak);
    
    return { current: currentStreak, longest: longestStreak };
  };

  const streak = calculateStreak();
  const badges = getStreakBadges(streak.current, streak.longest);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section with Streak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
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
            
            {/* Streak Counter - Prominent Display */}
            <div className="flex-shrink-0">
              <StreakCounter 
                currentStreak={streak.current}
                longestStreak={streak.longest}
              />
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
              {streak.current} {streak.current === 1 ? 'day' : 'days'}
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
              <Image className="w-5 h-5 text-pink-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Photos
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              0
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

        {/* Activity Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Writing Activity
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <CalendarHeatmap 
              entries={entries}
              onDateClick={(date) => {
                // Navigate to journal with date filter
                router.push(`/journal?date=${date}`);
              }}
            />
          </div>
        </motion.div>

        {/* Streak Badges */}
        {streak.current > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Achievements
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <StreakBadges badges={badges} />
            </div>
          </motion.div>
        )}

        {/* Recent Entries Preview */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
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
                <div key={entry.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => router.push('/journal')}>
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
