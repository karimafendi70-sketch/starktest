'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useJournal } from '@/lib/journal-context';
import { JournalEntry, MoodType } from '@/types/journal.types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ChevronLeft, ChevronRight, X, Smile, Frown, Meh, Zap, Cloud } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

const MoodColors: Record<MoodType, string> = {
  happy: 'bg-green-500',
  sad: 'bg-blue-500',
  neutral: 'bg-gray-500',
  excited: 'bg-pink-500',
  anxious: 'bg-orange-500',
};

const MoodIcon = ({ mood, className = 'w-4 h-4' }: { mood: MoodType; className?: string }) => {
  const icons: Record<MoodType, JSX.Element> = {
    happy: <Smile className={className} />,
    sad: <Frown className={className} />,
    neutral: <Meh className={className} />,
    excited: <Zap className={className} />,
    anxious: <Cloud className={className} />,
  };
  return icons[mood];
};

interface DayEntriesModalProps {
  date: Date | null;
  entries: JournalEntry[];
  onClose: () => void;
  onEntryClick: (id: string) => void;
}

function DayEntriesModal({ date, entries, onClose, onEntryClick }: DayEntriesModalProps) {
  if (!date || entries.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {format(date, 'MMMM d, yyyy')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  onClose();
                  onEntryClick(entry.id);
                }}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${MoodColors[entry.mood]}`}>
                    <MoodIcon mood={entry.mood} className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {entry.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {entry.content}
                    </p>
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {entry.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{entry.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { entries, loading } = useJournal();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entriesByDate, setEntriesByDate] = useState<Record<string, JournalEntry[]>>({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/journal/login');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Group entries by date
    const grouped: Record<string, JournalEntry[]> = {};
    entries.forEach((entry) => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(entry);
    });
    setEntriesByDate(grouped);
  }, [entries]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the starting day of the week (0 = Sunday)
  const startDayOfWeek = monthStart.getDay();
  
  // Create empty cells for days before month start
  const emptyCells = Array(startDayOfWeek).fill(null);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayEntries = entriesByDate[dateKey] || [];
    if (dayEntries.length > 0) {
      setSelectedDate(day);
    }
  };

  const handleEntryClick = (id: string) => {
    router.push(`/entry/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading calendar..." />
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400">View your journal entries by date</p>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Weekday Headers */}
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2"
              >
                {day}
              </div>
            ))}

            {/* Empty cells before month starts */}
            {emptyCells.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Calendar days */}
            {daysInMonth.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayEntries = entriesByDate[dateKey] || [];
              const hasEntries = dayEntries.length > 0;
              const isCurrentDay = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  className={`aspect-square p-2 rounded-lg border-2 ${
                    isCurrentDay
                      ? 'border-purple-500 dark:border-purple-400'
                      : 'border-gray-200 dark:border-gray-700'
                  } ${
                    hasEntries
                      ? 'cursor-pointer hover:border-purple-300 dark:hover:border-purple-600'
                      : ''
                  } transition-colors`}
                >
                  <div className="h-full flex flex-col">
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isCurrentDay
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    
                    {hasEntries && (
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {dayEntries.slice(0, 3).map((entry, index) => (
                          <div
                            key={entry.id}
                            className={`w-2 h-2 rounded-full ${MoodColors[entry.mood]}`}
                            title={entry.title}
                          />
                        ))}
                        {dayEntries.length > 3 && (
                          <div className="text-xs text-gray-500">+{dayEntries.length - 3}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${MoodColors.happy}`} />
                <span className="text-gray-600 dark:text-gray-400">Happy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${MoodColors.sad}`} />
                <span className="text-gray-600 dark:text-gray-400">Sad</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${MoodColors.anxious}`} />
                <span className="text-gray-600 dark:text-gray-400">Anxious</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${MoodColors.excited}`} />
                <span className="text-gray-600 dark:text-gray-400">Excited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${MoodColors.neutral}`} />
                <span className="text-gray-600 dark:text-gray-400">Neutral</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Entries Modal */}
      {selectedDate && (
        <DayEntriesModal
          date={selectedDate}
          entries={entriesByDate[format(selectedDate, 'yyyy-MM-dd')] || []}
          onClose={() => setSelectedDate(null)}
          onEntryClick={handleEntryClick}
        />
      )}
    </div>
  );
}
