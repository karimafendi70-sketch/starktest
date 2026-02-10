"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { JournalEntry } from "@/types/journal.types";

interface CalendarHeatmapProps {
  entries: JournalEntry[];
  onDateClick?: (date: string) => void;
}

export function CalendarHeatmap({ entries, onDateClick }: CalendarHeatmapProps) {
  // Calculate activity data for the past 365 days
  const heatmapData = useMemo(() => {
    const data: Record<string, number> = {};
    const today = new Date();
    
    // Initialize all dates in the past 365 days with 0
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      data[dateStr] = 0;
    }

    // Count entries per date
    entries.forEach(entry => {
      const dateStr = entry.date.split('T')[0];
      if (data.hasOwnProperty(dateStr)) {
        data[dateStr]++;
      }
    });

    return data;
  }, [entries]);

  // Get color based on activity level
  const getColor = (count: number): string => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 1) return 'bg-green-200 dark:bg-green-900';
    if (count === 2) return 'bg-green-400 dark:bg-green-700';
    if (count >= 3) return 'bg-green-600 dark:bg-green-500';
    return 'bg-gray-100 dark:bg-gray-800';
  };

  // Group dates by weeks
  const weeks = useMemo(() => {
    const dates = Object.keys(heatmapData).sort();
    const weeksArray: string[][] = [];
    let currentWeek: string[] = [];

    dates.forEach((date, index) => {
      const dayOfWeek = new Date(date).getDay();
      
      // Start a new week on Sunday
      if (index === 0) {
        // Fill in empty days at the start
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push('');
        }
      }

      currentWeek.push(date);

      // End of week (Saturday) or last date
      if (dayOfWeek === 6 || index === dates.length - 1) {
        // Fill in empty days at the end
        while (currentWeek.length < 7) {
          currentWeek.push('');
        }
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeksArray;
  }, [heatmapData]);

  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Activity Heatmap
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
            <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm" />
            <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Day labels */}
          <div className="flex gap-1 mb-2">
            <div className="w-8" /> {/* Space for day labels */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  if (date && dayIndex === 0) {
                    const month = new Date(date).getMonth();
                    return (
                      <div key={date} className="w-3 text-xs text-gray-500 dark:text-gray-400">
                        {monthLabels[month].charAt(0)}
                      </div>
                    );
                  }
                  return <div key={`${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                })}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-1">
            {/* Day of week labels */}
            <div className="flex flex-col gap-1 pr-2">
              {dayLabels.map(day => (
                <div
                  key={day}
                  className="h-3 text-xs text-gray-500 dark:text-gray-400 flex items-center"
                >
                  {day.charAt(0)}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date, dayIndex) => {
                  if (!date) {
                    return <div key={`${weekIndex}-${dayIndex}`} className="w-3 h-3" />;
                  }

                  const count = heatmapData[date] || 0;
                  const dateObj = new Date(date);
                  const tooltip = `${dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}: ${count} ${count === 1 ? 'entry' : 'entries'}`;

                  return (
                    <motion.div
                      key={date}
                      whileHover={{ scale: 1.5, zIndex: 10 }}
                      onClick={() => onDateClick?.(date)}
                      className={`w-3 h-3 rounded-sm cursor-pointer ${getColor(count)}`}
                      title={tooltip}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
