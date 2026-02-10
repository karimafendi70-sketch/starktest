"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Clock, FileText } from "lucide-react";
import { useState } from "react";

interface EntryCardModernProps {
  entry: {
    id: string;
    title?: string;
    content: string;
    createdAt: string | Date;
    mood?: string;
    tags?: string[];
    photos?: string[];
  };
  onDelete?: (id: string) => void;
}

export function EntryCardModern({ entry, onDelete }: EntryCardModernProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = entry.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Get mood emoji
  const getMoodEmoji = (mood?: string) => {
    if (!mood) return null;
    const moodMap: Record<string, string> = {
      happy: "😊",
      sad: "😢",
      neutral: "😐",
      excited: "🎉",
      angry: "😠",
      calm: "😌",
      anxious: "😰",
    };
    return moodMap[mood] || "😐";
  };

  // Tag colors
  const getTagColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-pink-100 text-pink-700",
      "bg-green-100 text-green-700",
      "bg-yellow-100 text-yellow-700",
    ];
    return colors[index % colors.length];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      onClick={() => router.push(`/journal/${entry.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group relative"
    >
      {/* Photo Thumbnails */}
      {entry.photos && entry.photos.length > 0 && (
        <div className="flex gap-1 p-1 bg-gray-50">
          {entry.photos.slice(0, 3).map((photo, index) => (
            <div
              key={index}
              className="w-20 h-20 rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
          {entry.photos.length > 3 && (
            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
              +{entry.photos.length - 3}
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900 truncate">
                {entry.title || "Untitled Entry"}
              </h3>
              {entry.mood && (
                <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(entry.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Hover Actions */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: showActions ? 1 : 0, x: showActions ? 0 : 10 }}
            className="flex gap-2"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/journal/${entry.id}/edit`);
              }}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry.id);
                }}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Content Preview */}
        <p className="text-gray-700 mb-4 truncate-2 leading-relaxed">
          {entry.content}
        </p>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`tag-pill ${getTagColor(index)}`}
              >
                #{tag}
              </span>
            ))}
            {entry.tags.length > 3 && (
              <span className="tag-pill bg-gray-100 text-gray-600">
                +{entry.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{wordCount} words</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Gradient Border on Hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-br from-purple-500 to-blue-500" style={{ zIndex: -1 }} />
      </div>
    </motion.div>
  );
}
