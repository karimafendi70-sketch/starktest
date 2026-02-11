'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useJournal } from '@/lib/journal-context';
import { MoodType } from '@/types/journal.types';
import { PhotoUpload } from '@/components/PhotoUpload';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Smile, Save, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EntryForm {
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  photos: string[];
  date: Date;
}

const MOODS = [
  { value: 'happy' as MoodType, emoji: '😊', label: 'Happy' },
  { value: 'sad' as MoodType, emoji: '😢', label: 'Sad' },
  { value: 'anxious' as MoodType, emoji: '😰', label: 'Anxious' },
  { value: 'calm' as MoodType, emoji: '😌', label: 'Calm' },
  { value: 'excited' as MoodType, emoji: '🎉', label: 'Excited' },
  { value: 'neutral' as MoodType, emoji: '😐', label: 'Neutral' },
];

export default function WritePage() {
  const router = useRouter();
  const { addEntry } = useJournal();
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [tagInput, setTagInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveInterval = useRef<NodeJS.Timeout | null>(null);

  const [form, setForm] = useState<EntryForm>({
    title: '',
    content: '',
    mood: 'neutral',
    tags: [],
    photos: [],
    date: new Date(),
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [form.content]);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('draft_entry');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setShowDraftModal(true);
        // Store draft temporarily
        (window as any).__tempDraft = draft;
      } catch (error) {
        console.error('Failed to parse draft:', error);
        localStorage.removeItem('draft_entry');
      }
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (hasUnsavedChanges) {
      autoSaveInterval.current = setInterval(() => {
        saveDraft();
      }, 30000);
    }

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [form, hasUnsavedChanges]);

  // Warn before leaving with unsaved changes
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

  const saveDraft = () => {
    const draft = {
      ...form,
      date: form.date.toISOString(),
    };
    localStorage.setItem('draft_entry', JSON.stringify(draft));
    setLastSavedAt(new Date());
  };

  const restoreDraft = () => {
    const draft = (window as any).__tempDraft;
    if (draft) {
      setForm({
        ...draft,
        date: new Date(draft.date),
      });
      setShowDraftModal(false);
      setHasUnsavedChanges(true);
      delete (window as any).__tempDraft;
    }
  };

  const discardDraft = () => {
    localStorage.removeItem('draft_entry');
    setShowDraftModal(false);
    delete (window as any).__tempDraft;
  };

  const handleContentChange = (value: string) => {
    setForm({ ...form, content: value });
    setHasUnsavedChanges(true);
  };

  const handleTitleChange = (value: string) => {
    setForm({ ...form, title: value });
    setHasUnsavedChanges(true);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = form.content.substring(0, start) + emojiData.emoji + form.content.substring(end);
      setForm({ ...form, content: newContent });
      setHasUnsavedChanges(true);
      
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emojiData.emoji.length;
        textarea.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !form.tags.includes(tag)) {
        setForm({ ...form, tags: [...form.tags, tag] });
        setTagInput('');
        setHasUnsavedChanges(true);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
    setHasUnsavedChanges(true);
  };

  const handlePhotoUpload = (photoUrls: string[]) => {
    if (form.photos.length + photoUrls.length > 5) {
      toast.error('Maximum 5 photos per entry');
      return;
    }
    setForm({ ...form, photos: [...form.photos, ...photoUrls] });
    setHasUnsavedChanges(true);
  };

  const removePhoto = (index: number) => {
    setForm({ ...form, photos: form.photos.filter((_, i) => i !== index) });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!form.content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsSaving(true);
    try {
      await addEntry({
        title: form.title,
        content: form.content,
        mood: form.mood,
        tags: form.tags,
        date: form.date.toISOString(),
        photos: form.photos,
        wordCount: form.content.split(/\s+/).filter(w => w.length > 0).length,
      });

      // Clear draft
      localStorage.removeItem('draft_entry');
      setHasUnsavedChanges(false);

      toast.success('Entry saved successfully!');
      router.push('/home');
    } catch (error) {
      console.error('Failed to save entry:', error);
      toast.error('Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    router.push('/home');
  };

  const wordCount = form.content.split(/\s+/).filter(w => w.length > 0).length;
  const charCount = form.content.length;

  return (
    <>
      {/* Draft Restore Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Draft Found</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You have an unsaved draft. Would you like to restore it?
            </p>
            <div className="flex gap-3">
              <button
                onClick={restoreDraft}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Restore Draft
              </button>
              <button
                onClick={discardDraft}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving || !form.title.trim() || !form.content.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Entry
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>{wordCount} words</div>
              <div>•</div>
              <div>{charCount} characters</div>
              {lastSavedAt && (
                <>
                  <div>•</div>
                  <div className="text-green-600 dark:text-green-400">
                    Draft saved at {lastSavedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Main Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Entry Title..."
              className="w-full text-3xl font-bold mb-4 border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
            
            <textarea
              ref={textareaRef}
              value={form.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Write your thoughts..."
              className="w-full min-h-[400px] border-none outline-none resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-lg leading-relaxed focus:ring-2 focus:ring-purple-600 rounded-lg p-4 -mx-4"
            />
          </div>

          {/* Bottom Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
            {/* Mood Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How are you feeling?
              </label>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => {
                      setForm({ ...form, mood: mood.value });
                      setHasUnsavedChanges(true);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      form.mood === mood.value
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-purple-900 dark:hover:text-purple-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add tags (press Enter or comma)"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Photos (max 5)
              </label>
              {form.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {form.photos.map((photo, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {form.photos.length < 5 && (
                <PhotoUpload onUpload={handlePhotoUpload} maxPhotos={5 - form.photos.length} />
              )}
            </div>

            {/* Emoji Picker */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Smile className="w-5 h-5" />
                Add Emoji
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
