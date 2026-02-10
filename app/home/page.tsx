'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/lib/user-context';
import { useJournal } from '@/lib/journal-context';
import Link from 'next/link';
import EntryCardModern from '@/components/EntryCardModern';
import FAB from '@/components/FAB';

export default function HomePage() {
  const { currentUser } = useUser();
  const { entries, loading } = useJournal();
  
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
            
            <Link href="/journal/new">
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
  const recentEntries = entries.slice(0, 3);
  const totalWords = entries.reduce((sum, e) => {
    const words = e.content.split(/\s+/).filter((w) => w.length > 0);
    return sum + words.length;
  }, 0);
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-4xl font-bold">Welcome back, {currentUser?.username || 'there'}! 👋</h1>
            </div>
            
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
          </div>
          
          <div>
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
        </div>
      </div>
      <FAB />
    </>
  );
}
