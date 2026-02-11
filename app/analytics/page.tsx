'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useJournal } from '@/lib/journal-context';
import { MoodType } from '@/types/journal.types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Smile, Frown, Meh, Zap, Cloud, TrendingUp, Calendar, BookOpen, Hash } from 'lucide-react';
import { format, startOfDay, subDays, differenceInDays } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

const MoodColors: Record<MoodType, string> = {
  happy: '#10b981',
  sad: '#3b82f6',
  neutral: '#6b7280',
  excited: '#ec4899',
  anxious: '#f97316',
  calm: '#8b5cf6',
};

const MoodIcon = ({ mood, className = 'w-5 h-5' }: { mood: MoodType; className?: string }) => {
  const icons: Record<MoodType, React.ReactNode> = {
    happy: <Smile className={className} />,
    sad: <Frown className={className} />,
    neutral: <Meh className={className} />,
    excited: <Zap className={className} />,
    anxious: <Cloud className={className} />,
    calm: <Cloud className={className} />,
  };
  return icons[mood];
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { entries, loading } = useJournal();
  
  const [dateRange, setDateRange] = useState(30); // days

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/journal/login');
      return;
    }
  }, [isAuthenticated, router]);

  // Calculate statistics
  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, entry) => sum + entry.content.split(/\s+/).filter(Boolean).length, 0);
  const avgWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

  // Mood distribution
  const moodCounts: Record<MoodType, number> = {
    happy: 0,
    sad: 0,
    neutral: 0,
    excited: 0,
    anxious: 0,
    calm: 0,
  };

  entries.forEach((entry) => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });

  const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood.charAt(0).toUpperCase() + mood.slice(1),
    value: count,
    color: MoodColors[mood as MoodType],
  }));

  // Most used mood
  const mostUsedMood = Object.entries(moodCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['neutral', 0])[0] as MoodType;

  // Streak calculation
  const calculateStreak = () => {
    if (entries.length === 0) return { current: 0, longest: 0 };
    
    const sortedDates = entries
      .map(e => new Date(e.date))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    const today = startOfDay(new Date());

    // Check if there's an entry today or yesterday
    const mostRecentEntry = startOfDay(sortedDates[0]);
    const daysSinceLast = differenceInDays(today, mostRecentEntry);

    if (daysSinceLast <= 1) {
      currentStreak = 1;
      
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = startOfDay(sortedDates[i - 1]);
        const currDate = startOfDay(sortedDates[i]);
        const diff = differenceInDays(prevDate, currDate);

        if (diff === 1) {
          currentStreak++;
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

    return { current: currentStreak, longest: longestStreak };
  };

  const streak = calculateStreak();

  // Mood over time (last N days)
  const getMoodOverTime = () => {
    const days = [];
    const now = new Date();
    
    for (let i = dateRange - 1; i >= 0; i--) {
      const date = subDays(now, i);
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayEntries = entries.filter(e => format(new Date(e.date), 'yyyy-MM-dd') === dateKey);
      
      const moodValues: Record<MoodType, number> = {
        happy: 5,
        excited: 4,
        calm: 3.5,
        neutral: 3,
        anxious: 2,
        sad: 1,
      };

      const avgMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + moodValues[e.mood], 0) / dayEntries.length
        : 0;

      days.push({
        date: format(date, 'MMM dd'),
        mood: avgMood,
        entries: dayEntries.length,
      });
    }

    return days.filter(d => d.entries > 0);
  };

  const moodTimeline = getMoodOverTime();

  // Tag frequency
  const tagFrequency: Record<string, number> = {};
  entries.forEach(entry => {
    entry.tags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Writing patterns
  const dayOfWeekCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
  entries.forEach(entry => {
    const day = new Date(entry.date).getDay();
    dayOfWeekCounts[day]++;
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const bestDayIndex = dayOfWeekCounts.indexOf(Math.max(...dayOfWeekCounts));
  const bestDay = dayNames[bestDayIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading analytics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 pb-16 md:pb-0">
      <Navbar />
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your mood and writing patterns</p>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setDateRange(days)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateRange === days
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {days} Days
            </button>
          ))}
          <button
            onClick={() => setDateRange(365)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              dateRange === 365
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All Time
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6" />
              <h3 className="font-semibold">Total Entries</h3>
            </div>
            <p className="text-4xl font-bold">{totalEntries}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-6 h-6" />
              <h3 className="font-semibold">Current Streak</h3>
            </div>
            <p className="text-4xl font-bold">{streak.current} days</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Hash className="w-6 h-6" />
              <h3 className="font-semibold">Total Words</h3>
            </div>
            <p className="text-4xl font-bold">{totalWords.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <MoodIcon mood={mostUsedMood} className="w-6 h-6" />
              <h3 className="font-semibold">Most Used Mood</h3>
            </div>
            <p className="text-4xl font-bold capitalize">{mostUsedMood}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mood Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Mood Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Mood Over Time</h2>
            {moodTimeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={moodTimeline}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Bar dataKey="mood" fill="#a855f7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No entries in selected period
              </div>
            )}
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Writing Patterns */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Writing Patterns</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average words per entry</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgWordsPerEntry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Longest streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{streak.longest} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Most productive day</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{bestDay}</p>
              </div>
              {totalEntries > 0 && (
                <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-sm text-purple-900 dark:text-purple-300">
                    💡 <strong>Insight:</strong> You write most on {bestDay}s!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tag Cloud */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Popular Tags</h2>
            {topTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topTags.map(({ tag, count }) => {
                  const size = Math.min(24, 12 + count * 2);
                  return (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
                      style={{ fontSize: `${size}px` }}
                    >
                      #{tag} ({count})
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
                No tags used yet
              </div>
            )}
          </div>
        </div>
      </div>
      
      <MobileBottomNav />
    </div>
  );
}
