'use client';

import { useMemo, useState } from 'react';
import { useUser } from '@/lib/user-context';
import { useJournal } from '@/lib/journal-context';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import EntryCardModern from '@/components/EntryCardModern';
import FAB from '@/components/FAB';
import SearchBar from '@/components/SearchBar';
import { MoodType } from '@/types/journal.types';

const MOOD_FILTERS = [
  { value: 'all', emoji: '🌈', label: 'All Moods' },
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'excited', emoji: '🎉', label: 'Excited' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
];

type SortOption = 'newest' | 'oldest' | 'words';

export default function HomePage() {
  const { currentUser } = useUser();
  const { entries, loading } = useJournal();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  const totalWords = useMemo(() => {
    return entries.reduce((sum, e) => {
      const words = e.content.split(/\s+/).filter((w) => w.length > 0);
      return sum + words.length;
    }, 0);
  }, [entries]);

  // Filter and sort entries
  const displayedEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      const matchesSearch = 
        entry.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      
      const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
      
      return matchesSearch && matchesMood;
    });

    // Sort entries
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      if (sortBy === 'oldest') return a.createdAt - b.createdAt;
      if (sortBy === 'words') {
        const aWords = a.content.split(/\s+/).filter(w => w.length > 0).length;
        const bWords = b.content.split(/\s+/).filter(w => w.length > 0).length;
        return bWords - aWords;
      }
      return 0;
    });

    return sorted;
  }, [entries, debouncedSearchTerm, selectedMood, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedMood('all');
    setSortBy('newest');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⏳</div>
          <p className="text-xl text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }
  
  // EMPTY STATE (0 entries)
  if (entries.length === 0) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-3xl w-full text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome, {currentUser?.username || 'there'}! 👋
            </h1>
            <p className="text-xl text-gray-600 mb-12">Let's write your first entry</p>
            
            <Link href="/write">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl px-12 py-6 rounded-2xl hover:scale-105 transition-transform shadow-xl mb-16">
                ✍️ Write Your First Entry
              </button>
            </Link>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">1️⃣</div>
                <h3 className="font-semibold mb-2">Write your thoughts</h3>
                <p className="text-gray-600 text-sm">Use the rich editor</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">2️⃣</div>
                <h3 className="font-semibold mb-2">Add photos & voice</h3>
                <p className="text-gray-600 text-sm">Capture memories</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="text-4xl mb-4">3️⃣</div>
                <h3 className="font-semibold mb-2">Keep your streak</h3>
                <p className="text-gray-600 text-sm">Write daily</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-8 rounded-2xl text-left max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-4">✨ Pro Tips</h3>
              <ul className="space-y-3 text-gray-700">
                <li>🎤 Try voice-to-text for quick entries</li>
                <li>📖 Switch to book mode for cozy reading</li>
                <li>🏷️ Use tags like #work #travel to organize</li>
                <li>🔒 Your data is encrypted end-to-end</li>
              </ul>
            </div>
          </div>
        </div>
        <FAB />
      </>
    );
  }
  
  // ACTIVE STATE (has entries)
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Welcome back, {currentUser?.username || 'there'}! 👋</h1>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Link href="/write">
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
                    <span className="font-semibold">{entries.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">✍️ Words</span>
                    <span className="font-semibold">{totalWords.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📅 This Month</span>
                    <span className="font-semibold">{entries.filter(e => {
                      const entryDate = new Date(e.createdAt);
                      const now = new Date();
                      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
                    }).length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <SearchBar 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search entries..."
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
              {MOOD_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedMood(filter.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedMood === filter.value
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  <span>{filter.emoji}</span>
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Sort and Results Count */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-600">
                Showing {displayedEntries.length} {displayedEntries.length === 1 ? 'entry' : 'entries'}
                {(searchTerm || selectedMood !== 'all') && (
                  <button
                    onClick={handleClearFilters}
                    className="ml-3 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="words">Most Words</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">📅 Your Entries</h2>
              <Link href="/journal" className="text-blue-600 hover:underline font-medium">
                View All →
              </Link>
            </div>
            
            {displayedEntries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                <p className="text-xl text-gray-500 mb-2">No entries found</p>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedEntries.map(entry => (
                  <EntryCardModern key={entry.id} entry={entry} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <FAB />
    </>
  );
}
