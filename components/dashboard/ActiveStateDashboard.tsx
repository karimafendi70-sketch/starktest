"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { EntryCardModern } from "@/components/EntryCardModern";

interface ActiveStateDashboardProps {
  user: {
    username: string;
  };
  entries: any[];
  streak?: number;
}

export function ActiveStateDashboard({
  user,
  entries,
  streak = 0,
}: ActiveStateDashboardProps) {
  const router = useRouter();
  const [showStats, setShowStats] = useState(false);

  const stats = {
    totalEntries: entries.length,
    totalWords: entries.reduce(
      (acc, entry) => acc + (entry.content?.split(/\s+/).length || 0),
      0
    ),
    currentStreak: streak,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome back, {user.username}! 👋
            </h1>
            {stats.currentStreak > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full font-bold">
                🔥 {stats.currentStreak} day streak
              </div>
            )}
          </div>
          <p className="text-gray-600">Ready to continue your journaling journey?</p>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* New Entry Card */}
          <motion.button
            onClick={() => router.push("/journal/new")}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-8 text-white text-left shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Write New Entry</h3>
            <p className="text-white/80">
              Capture your thoughts and moments
            </p>
          </motion.button>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Your Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {stats.totalEntries}
                </div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.totalWords.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Words</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Entries</h2>
            <button
              onClick={() => router.push("/journal")}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.slice(0, 3).map((entry) => (
              <EntryCardModern key={entry.id} entry={entry} />
            ))}
          </div>
        </motion.div>

        {/* Collapsible Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                Detailed Statistics
              </h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {stats.totalEntries} entries
              </span>
            </div>
            {showStats ? (
              <ChevronUp className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            )}
          </button>

          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-8 pb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalEntries}
                  </div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-4xl mb-2">✍️</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalWords.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Words Written</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <div className="text-4xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.currentStreak}
                  </div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
