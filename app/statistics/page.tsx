"use client";

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useJournal } from '@/lib/journal-context';
import { calculateStreak } from '@/lib/streak';
import { StreakCounter } from '@/components/StreakCounter';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { 
  Calendar, 
  FileText, 
  Clock, 
  TrendingUp, 
  Smile, 
  Award,
  BarChart3
} from 'lucide-react';

export default function StatisticsPage() {
  const router = useRouter();
  const { entries, getStats } = useJournal();
  const stats = getStats();

  // Calculate streak data
  const streakData = calculateStreak(entries);

  // Calculate additional stats
  const totalWords = entries.reduce((sum, entry) => {
    const wordCount = entry.content?.split(/\s+/).filter(Boolean).length || 0;
    return sum + wordCount;
  }, 0);

  const avgWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;
  const totalReadingTime = Math.round(totalWords / 250); // 250 words per minute

  // Mood distribution
  const moodCounts = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const moodData = [
    { mood: 'happy', icon: '😊', count: moodCounts.happy || 0, color: 'from-yellow-400 to-orange-400' },
    { mood: 'excited', icon: '⚡', count: moodCounts.excited || 0, color: 'from-purple-400 to-pink-400' },
    { mood: 'neutral', icon: '😐', count: moodCounts.neutral || 0, color: 'from-gray-400 to-gray-500' },
    { mood: 'anxious', icon: '☁️', count: moodCounts.anxious || 0, color: 'from-blue-400 to-indigo-400' },
    { mood: 'sad', icon: '😢', count: moodCounts.sad || 0, color: 'from-blue-600 to-blue-700' },
  ];

  const maxMoodCount = Math.max(...moodData.map(m => m.count), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Your Journaling Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your writing journey and insights
          </p>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.totalEntries}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Words</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalWords.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reading Time</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {totalReadingTime}m
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Words</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {avgWordsPerEntry}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Streak Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-12"
        >
          <StreakCounter
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
          />
        </motion.div>

        {/* Calendar Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mb-12"
        >
          <CalendarHeatmap entries={entries} />
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <Smile className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mood Distribution
            </h2>
          </div>

          <div className="space-y-4">
            {moodData.map((mood) => (
              <div key={mood.mood}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{mood.icon}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {mood.mood}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mood.count} entries
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${mood.color} rounded-full transition-all duration-500`}
                    style={{ width: `${(mood.count / maxMoodCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Achievements
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {entries.length >= 10 ? 'Committed Writer' : 'Getting Started'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {entries.length >= 10 ? '10+ entries written' : `${10 - entries.length} more to unlock`}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl text-center">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {totalWords >= 5000 ? 'Wordsmith' : 'Building Vocabulary'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalWords >= 5000 ? '5000+ words written' : `${5000 - totalWords} more to unlock`}
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl text-center">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                Streak Starter
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start a daily writing streak
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
