'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface EntryCardModernProps {
  entry: {
    id: string;
    title: string;
    content: string;
    createdAt: number;
    mood?: string;
    tags?: string[];
    photos?: Array<{ thumbnailUrl?: string }>;
  };
}

export default function EntryCardModern({ entry }: EntryCardModernProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    excited: '🤩',
    calm: '😌',
    anxious: '😰',
    angry: '😠',
    loved: '🥰',
    grateful: '🙏',
  };
  
  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate word count
  const wordCount = entry.content.split(/\s+/).filter((w) => w.length > 0).length;
  const readTime = Math.ceil(wordCount / 250);
  
  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 cursor-pointer relative"
      onClick={() => router.push(`/journal/${entry.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Photo Thumbnails */}
          {entry.photos && entry.photos.length > 0 && (
            <div className="flex -space-x-2">
              {entry.photos.slice(0, 3).map((photo, i) => (
                <div 
                  key={i}
                  className="w-10 h-10 rounded-lg bg-gray-200 border-2 border-white overflow-hidden"
                >
                  {photo.thumbnailUrl && (
                    <img 
                      src={photo.thumbnailUrl} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
              {entry.photos.length > 3 && (
                <div className="w-10 h-10 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold">
                  +{entry.photos.length - 3}
                </div>
              )}
            </div>
          )}
          
          <div className="flex-1">
            <div className="text-sm text-gray-500 mb-1">
              {formatDate(entry.createdAt)}
            </div>
            <h3 className="text-xl font-semibold line-clamp-1">
              {entry.title}
            </h3>
          </div>
        </div>
        
        {/* Mood Emoji */}
        <div className="text-3xl">
          {entry.mood ? moodEmojis[entry.mood] || '😊' : '😊'}
        </div>
      </div>
      
      {/* Content Preview */}
      <p className="text-gray-600 mb-4 line-clamp-2">
        {entry.content}
      </p>
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {entry.tags.slice(0, 3).map(tag => (
              <span 
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Meta Info */}
        <div className="text-sm text-gray-500">
          {wordCount} words · {readTime} min read
        </div>
      </div>
      
      {/* Hover Actions */}
      {isHovered && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/journal/${entry.id}/edit`);
            }}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Edit entry"
          >
            ✏️
          </button>
        </div>
      )}
    </motion.div>
  );
}
