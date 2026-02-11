'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useJournal } from '@/lib/journal-context';
import { JournalEntry } from '@/types/journal.types';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  ChevronLeft,
  ChevronRight,
  Smile,
  Frown,
  Meh,
  Zap,
  Cloud,
  Calendar,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';

const MoodIcon = ({ mood, className = 'w-6 h-6' }: { mood: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    happy: <Smile className={className} />,
    sad: <Frown className={className} />,
    neutral: <Meh className={className} />,
    excited: <Zap className={className} />,
    anxious: <Cloud className={className} />,
  };
  return icons[mood] || <Meh className={className} />;
};

const MoodColors: Record<string, string> = {
  happy: 'bg-green-100 text-green-700 border-green-300',
  sad: 'bg-blue-100 text-blue-700 border-blue-300',
  neutral: 'bg-gray-100 text-gray-700 border-gray-300',
  excited: 'bg-pink-100 text-pink-700 border-pink-300',
  anxious: 'bg-orange-100 text-orange-700 border-orange-300',
};

export default function EntryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const { entries, removeEntry, getEntryById } = useJournal();
  
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const entryId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/journal/login');
      return;
    }

    const loadEntry = async () => {
      setLoading(true);
      try {
        const foundEntry = await getEntryById(entryId);
        setEntry(foundEntry);
      } catch (error) {
        console.error('Error loading entry:', error);
        toast.error('Failed to load entry');
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [entryId, isAuthenticated, router, getEntryById]);

  const handleDelete = async () => {
    if (!entry) return;
    
    try {
      await removeEntry(entry.id);
      toast.success('Entry deleted successfully');
      router.push('/journal');
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error('Failed to delete entry');
    }
  };

  const handleEdit = () => {
    router.push(`/journal?edit=${entryId}`);
  };

  const handleShare = () => {
    if (!entry) return;
    
    const shareText = `${entry.title}\n\n${entry.content}`;
    navigator.clipboard.writeText(shareText);
    toast.success('Entry copied to clipboard!');
  };

  // Navigation between entries
  const currentIndex = entries.findIndex((e) => e.id === entryId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < entries.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      router.push(`/entry/${entries[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      router.push(`/entry/${entries[currentIndex + 1].id}`);
    }
  };

  // Calculate word count and read time
  const wordCount = entry ? entry.content.split(/\s+/).filter(Boolean).length : 0;
  const readTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading entry..." />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Entry not found</h1>
          <button
            onClick={() => router.push('/journal')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Journal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/journal')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                aria-label="Edit entry"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                aria-label="Share entry"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="Delete entry"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Mood and Date */}
        <div className="flex items-center gap-4 mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${MoodColors[entry.mood]}`}>
            <MoodIcon mood={entry.mood} className="w-5 h-5" />
            <span className="font-medium capitalize">{entry.mood}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(entry.date), 'MMMM d, yyyy')}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {entry.title}
        </h1>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
          <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
            {entry.content}
          </p>
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">Word Count</div>
              <div>{wordCount} words</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">Read Time</div>
              <div>{readTimeMinutes} min</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">Created</div>
              <div>{format(new Date(entry.createdAt), 'MMM d, yyyy')}</div>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white mb-1">Updated</div>
              <div>{format(new Date(entry.updatedAt), 'MMM d, yyyy')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-between border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Previous Entry</span>
        </button>
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span>Next Entry</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        entryTitle={entry.title}
      />
      
      <MobileBottomNav />
    </div>
  );
}
