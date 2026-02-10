"use client";

import { motion } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { StreakBadge as StreakBadgeType } from "@/lib/streak";

interface StreakBadgesProps {
  badges: StreakBadgeType[];
}

export function StreakBadges({ badges }: StreakBadgesProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Achievements
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative p-4 rounded-xl border-2 transition-all
              ${badge.achieved
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400 dark:border-yellow-600'
                : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
              }
            `}
          >
            {/* Badge icon */}
            <div className="flex items-start gap-3">
              <div
                className={`
                  text-4xl
                  ${badge.achieved ? '' : 'grayscale opacity-50'}
                `}
              >
                {badge.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {badge.name}
                  </h4>
                  {badge.achieved ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {badge.description}
                </p>

                {!badge.achieved && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {badge.daysRequired} days required
                  </p>
                )}
              </div>
            </div>

            {/* Achievement overlay */}
            {badge.achieved && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
