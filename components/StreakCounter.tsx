"use client";

import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import { getStreakMessage } from "@/lib/streak";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  const message = getStreakMessage(currentStreak);

  return (
    <div className="space-y-4">
      {/* Current Streak */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6 text-white shadow-lg"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Current Streak</h3>
            <Flame className="w-6 h-6" />
          </div>
          
          <div className="flex items-baseline gap-2">
            <motion.span
              key={currentStreak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl font-bold"
            >
              {currentStreak}
            </motion.span>
            <span className="text-2xl font-medium">
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>

          <p className="mt-4 text-white/90">{message}</p>
        </div>

        {/* Decorative flames */}
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Flame className="w-32 h-32" />
        </div>
      </motion.div>

      {/* Longest Streak */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500 rounded-lg">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Best Streak</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
