'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useJournal } from '@/lib/journal-context';
import { MoodType, Photo } from '@/types/journal.types';
import { WordCounter } from '@/components/WordCounter';
import { PhotoUpload } from '@/components/PhotoUpload';
import dynamic from 'next/dynamic';
import { Smile, Save, X, Image as ImageIcon, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';

// Dynamically import EmojiPicker to avoid SSR issues
const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface EntryForm {
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  photos: string[];
  date: Date;
}

const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'excited', emoji: '🎉', label: 'Excited' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
];

export default function WritePage() {
  const router = useRouter();
  const { addEntry } = useJournal();
  const [formData, setFormData] = useState<EntryForm>({
    title: '',
    content: '',
    mood: 'neutral',
    tags: [],
    photos: [],
    date: new Date(),
  });
  const [tagInput, setTagInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('draft_entry');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        if (window.confirm('You have an unsaved draft. Would you like to restore it?')) {
          setFormData({
            ...parsedDraft,
            date: new Date(parsedDraft.date),
          });
        } else {
          localStorage.removeItem('draft_entry');
        }
      } catch (error) {
        console.error('Failed to parse draft:', error);
        localStorage.removeItem('draft_entry');
      }
    }
  }, []);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    if (formData.title || formData.content) {
      setHasUnsavedChanges(true);
      
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      autoSaveTimerRef.current = setTimeout(() => {
        localStorage.setItem('draft_entry', JSON.stringify(formData));
        setLastSaved(new Date());
      }, 30000); // 30 seconds
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData]);

  // Warn on navigation if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      const wordCount = formData.content.split(/\s+/).filter((w) => w.length > 0).length;
      
      await addEntry({
        title: formData.title,
        content: formData.content,
        mood: formData.mood,
        tags: formData.tags,
        date: formData.date.toISOString().split('T')[0],
        // Note: Photos will be handled in future integration with storage
      });

      // Clear draft from localStorage
      localStorage.removeItem('draft_entry');
      setHasUnsavedChanges(false);

      // Redirect to home with success message
      router.push('/home');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry');
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        localStorage.removeItem('draft_entry');
        router.push('/home');
      }
    } else {
      router.push('/home');
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleEmojiClick = (emojiObject: any) => {
    setFormData({
      ...formData,
      content: formData.content + emojiObject.emoji,
    });
    setShowEmojiPicker(false);
  };

  const handlePhotoUpload = (photoDataUrls: string[]) => {
    if (formData.photos.length + photoDataUrls.length > 5) {
      alert('Maximum 5 photos allowed per entry');
      return;
    }
    setFormData({
      ...formData,
      photos: [...formData.photos, ...photoDataUrls],
    });
    setShowPhotoUpload(false);
  };

  const handleRemovePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-4">
              <WordCounter text={formData.content} showReadingTime={false} />
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Draft saved at {format(lastSaved, 'HH:mm')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Title Input */}
          <input
            type="text"
            placeholder="Entry Title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full text-3xl font-bold mb-6 border-none outline-none focus:ring-0 placeholder-gray-400"
          />

          {/* Content Textarea */}
          <textarea
            placeholder="Start writing your thoughts..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full min-h-[400px] border-none outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-4 resize-none placeholder-gray-400 transition-all duration-200"
          />
        </div>

        {/* Bottom Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mood Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How are you feeling?
              </label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value as MoodType })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {MOOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-purple-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowPhotoUpload(!showPhotoUpload)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <ImageIcon className="w-4 h-4" />
              Photos ({formData.photos.length}/5)
            </button>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200"
            >
              <Smile className="w-4 h-4" />
              Emoji
            </button>
          </div>

          {/* Photo Upload */}
          {showPhotoUpload && (
            <div className="mt-6">
              <PhotoUpload onUpload={handlePhotoUpload} maxPhotos={5 - formData.photos.length} />
            </div>
          )}

          {/* Photo Preview */}
          {formData.photos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Photos</h3>
              <div className="grid grid-cols-3 gap-3">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div className="mt-6 relative">
              <div className="absolute z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
