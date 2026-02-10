'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EntryCardModern from '@/components/EntryCardModern';
import { CalendarHeatmap } from '@/components/CalendarHeatmap';
import { StreakBadges } from '@/components/StreakBadges';
import { JournalEntry } from '@/types/journal.types';
import { getStreakBadges } from '@/lib/streak';

interface User {
  id: string;
  username: string;
  createdAt: string;
}

interface ActiveStateDashboardProps {
  user: User;
  entries: JournalEntry[];
}

export default function ActiveStateDashboard({ user, entries }: ActiveStateDashboardProps) {
  const [showFullStats, setShowFullStats] = useState(false);
  const router = useRouter();
  
  // Calculate stats
  const stats = {
    totalEntries: entries.length,
    totalWords: entries.reduce((sum, e) => {
      const words = e.content.split(/\s+/).filter((w) => w.length > 0);
      return sum + words.length;
    }, 0),
    currentStreak: calculateStreak(entries),
    longestStreak: calculateLongestStreak(entries),
    memberDays: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  };
  
  const recentEntries = entries.slice(0, 3);
  const badges = getStreakBadges(stats.currentStreak, stats.longestStreak);
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user.username}! 👋
              </h1>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">
                🔥 {stats.currentStreak}
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
          
          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/journal/new">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer shadow-lg">
                <div className="text-3xl mb-2">✍️</div>
                <div className="text-xl font-semibold">New Entry</div>
              </div>
            </Link>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">📊 Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">📝 Entries</span>
                  <span className="font-semibold">{stats.totalEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">✍️ Words</span>
                  <span className="font-semibold">{stats.totalWords.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">📅 Member</span>
                  <span className="font-semibold">{stats.memberDays} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Entries */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">📅 Recent Entries</h2>
            <Link href="/journal" className="text-blue-600 hover:underline font-medium">
              View All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentEntries.map(entry => (
              <EntryCardModern key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
        
        {/* Collapsible Stats Section */}
        <div className="bg-white rounded-xl shadow-sm">
          <button 
            onClick={() => setShowFullStats(!showFullStats)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">📊</span>
              <span className="font-semibold text-lg">Your Activity</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {stats.currentStreak}-day streak 🔥 | {stats.totalEntries} entries 📝
              </span>
              <span className={`transform transition-transform ${showFullStats ? 'rotate-180' : ''}`}>
                🔽
              </span>
            </div>
          </button>
          
          {showFullStats && (
            <div className="p-6 pt-0 border-t">
              <CalendarHeatmap entries={entries} />
              <div className="mt-6">
                <h3 className="font-semibold mb-4">🏆 Achievements Earned</h3>
                <StreakBadges badges={badges} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0;
  
  // Sort by date descending
  const sorted = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const entry of sorted) {
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);
    const dayDiff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (dayDiff === streak) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dayDiff > streak) {
      break;
    }
  }
  return streak;
}

function calculateLongestStreak(entries: JournalEntry[]): number {
  // Simplified for now - just return current streak
  return calculateStreak(entries);
}
