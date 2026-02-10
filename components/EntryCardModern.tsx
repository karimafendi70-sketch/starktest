'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { JournalEntry } from '@/types/journal.types';

export default function EntryCardModern({ entry }: { entry: JournalEntry }) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  
  const moodEmojis = {
    happy: '😊', sad: '😢', excited: '🤩', calm: '😌',
    anxious: '😰', angry: '😠', loved: '🥰', grateful: '🙏', neutral: '😐'
  };
  
  const wordCount = useMemo(() => {
    return entry.content.split(/\s+/).filter((w) => w.length > 0).length;
  }, [entry.content]);
  
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push(`/journal/${entry.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 cursor-pointer relative"
      style={{ transform: isHovered ? 'translateY(-4px)' : 'translateY(0)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="text-sm text-gray-500 mb-1">
            {new Date(entry.createdAt).toLocaleDateString('en-US', { 
              weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
            })}
          </div>
          <h3 className="text-xl font-semibold">{entry.title}</h3>
        </div>
        <div className="text-3xl">{moodEmojis[entry.mood as keyof typeof moodEmojis] || '😊'}</div>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{entry.content}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {entry.tags?.slice(0, 3).map((tag: string) => (
            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-500">
          {wordCount} words
        </div>
      </div>
      
      {isHovered && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); router.push(`/journal/${entry.id}/edit`); }}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
          >
            ✏️
          </button>
        </div>
      )}
    </div>
  );
}
