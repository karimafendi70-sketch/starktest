"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useJournal } from "@/lib/journal-context";
import { useTheme } from "@/lib/theme-context";
import { motion, AnimatePresence } from "framer-motion";
import { JournalEntry, MoodType } from "@/types/journal.types";
import { deleteAllData, exportData, importData } from "@/lib/db";
import { calculateStreak } from "@/lib/streak";
import {
  Moon,
  Sun,
  Lock,
  Plus,
  Search,
  Calendar,
  BookOpen,
  Settings,
  Download,
  Upload,
  Trash2,
  Edit,
  X,
  Check,
  Smile,
  Frown,
  Meh,
  Zap,
  Cloud,
  List,
  Book,
  Camera,
  Mic,
  Image,
} from "lucide-react";
import { BookView } from "@/components/BookView";
import { PhotoUpload } from "@/components/PhotoUpload";
import { CameraCapture } from "@/components/CameraCapture";
import { VoiceInput } from "@/components/VoiceInput";
import { StreakCounter } from "@/components/StreakCounter";
import { CalendarHeatmap } from "@/components/CalendarHeatmap";

const MoodIcon = ({ mood, className = "w-5 h-5" }: { mood: MoodType; className?: string }) => {
  const icons = {
    happy: <Smile className={className} />,
    sad: <Frown className={className} />,
    neutral: <Meh className={className} />,
    excited: <Zap className={className} />,
    anxious: <Cloud className={className} />,
  };
  return icons[mood] || null;
};

export default function JournalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, logout } = useAuth();
  const { entries, loading, addEntry, updateEntry, removeEntry, searchEntries, filterByTag, getStats } = useJournal();
  const { theme, toggleTheme } = useTheme();

  const [view, setView] = useState<"list" | "editor" | "calendar" | "book">("list");
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Editor state
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [editorMood, setEditorMood] = useState<MoodType>("neutral");
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [editorDate, setEditorDate] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [editorPhotos, setEditorPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/journal/login");
    }
  }, [isAuthenticated, router]);

  // Handle edit parameter from URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && entries.length > 0) {
      const entryToEdit = entries.find(e => e.id === editId);
      if (entryToEdit) {
        handleEditEntry(entryToEdit);
      }
    }
  }, [searchParams, entries]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setEditorTitle("");
    setEditorContent("");
    setEditorMood("neutral");
    setEditorTags([]);
    setEditorDate(new Date().toISOString().split("T")[0]);
    setEditorPhotos([]);
    setView("editor");
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setEditorTitle(entry.title);
    setEditorContent(entry.content);
    setEditorMood(entry.mood);
    setEditorTags(entry.tags);
    setEditorDate(entry.date);
    setEditorPhotos([]);
    setView("editor");
  };

  const handleSaveEntry = async () => {
    if (!editorTitle.trim() || !editorContent.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    try {
      if (selectedEntry) {
        await updateEntry(selectedEntry.id, {
          title: editorTitle,
          content: editorContent,
          mood: editorMood,
          tags: editorTags,
          date: editorDate,
          updatedAt: Date.now(),
        });
      } else {
        await addEntry({
          title: editorTitle,
          content: editorContent,
          mood: editorMood,
          tags: editorTags,
          date: editorDate,
        });
      }
      setView("list");
    } catch (error) {
      console.error("Error saving entry:", error);
      alert("Failed to save entry");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        await removeEntry(id);
        if (selectedEntry?.id === id) {
          setView("list");
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !editorTags.includes(tagInput.trim())) {
      setEditorTags([...editorTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditorTags(editorTags.filter((t) => t !== tag));
  };

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `journal-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data");
    }
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        await importData(text);
        window.location.reload();
      } catch (error) {
        console.error("Error importing data:", error);
        alert("Failed to import data. Please check the file format.");
      }
    };
    input.click();
  };

  const handleDeleteAll = async () => {
    if (
      confirm(
        "⚠️ WARNING: This will delete ALL your journal entries and reset the app. This action cannot be undone. Are you absolutely sure?"
      )
    ) {
      if (prompt('Type "DELETE" to confirm') === "DELETE") {
        try {
          await deleteAllData();
          logout();
          router.push("/");
        } catch (error) {
          console.error("Error deleting all data:", error);
          alert("Failed to delete data");
        }
      }
    }
  };

  // Filter entries
  let displayedEntries = entries;
  if (searchQuery) {
    displayedEntries = searchEntries(searchQuery);
  } else if (selectedTag) {
    displayedEntries = filterByTag(selectedTag);
  }

  // Get all unique tags
  const allTags = Array.from(new Set(entries.flatMap((e) => e.tags)));

  // Get stats
  const stats = getStats();
  
  // Calculate additional stats
  const streakData = calculateStreak(entries);
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const entriesThisMonth = entries.filter(entry => new Date(entry.date) >= oneMonthAgo).length;
  const averagePerWeek = entries.length > 0 ? (entries.length / Math.max(1, Math.ceil((now.getTime() - new Date(entries[entries.length - 1]?.date || now).getTime()) / (7 * 24 * 60 * 60 * 1000)))) : 0;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">My Journal</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              <Lock className="w-4 h-4" />
              Lock
            </button>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2 text-foreground">Statistics</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Entries:</span>
                      <span className="font-medium text-foreground">{stats.totalEntries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Words:</span>
                      <span className="font-medium text-foreground">{stats.totalWords}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleExport}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export Backup
                  </button>

                  <button
                    onClick={handleImport}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Import Backup
                  </button>

                  <button
                    onClick={handleDeleteAll}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All Data
                  </button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  All data is encrypted and stored locally on your device
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation & Actions */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
            <button
              onClick={() => setView("book")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === "book"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Book className="w-4 h-4" />
              Book View
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                view === "calendar"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
          </div>

          <button
            onClick={handleNewEntry}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </button>
        </div>

        {/* Search & Filters */}
        {view === "list" && (
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedTag(null);
                }}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Tags:</span>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setSearchQuery("");
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTag === tag
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        {view === "list" && (
          <div className="space-y-6">
            {/* Streak Counter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StreakCounter
                currentStreak={streakData.currentStreak}
                longestStreak={streakData.longestStreak}
              />
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Statistics</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Total Entries:</span>
                    <span className="font-semibold text-foreground">{stats.totalEntries || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-semibold text-foreground">{entriesThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg per Week:</span>
                    <span className="font-semibold text-foreground">{averagePerWeek.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Heatmap */}
            <div className="bg-card border border-border rounded-xl p-6">
              <CalendarHeatmap
                entries={entries}
                onDateClick={(date) => {
                  const entry = entries.find(e => e.date.startsWith(date));
                  if (entry) handleEditEntry(entry);
                }}
              />
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : displayedEntries.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2 text-foreground">No entries yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your journal by creating your first entry
                </p>
                <button
                  onClick={handleNewEntry}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create First Entry
                </button>
              </div>
            ) : (
              displayedEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MoodIcon mood={entry.mood} className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-foreground line-clamp-3">{entry.content}</p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEditEntry(entry)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-foreground" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>

                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}

        {view === "editor" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {selectedEntry ? "Edit Entry" : "New Entry"}
              </h2>
              <button
                onClick={() => setView("list")}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Title</label>
                <input
                  type="text"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder="Entry title..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Date</label>
                <input
                  type="date"
                  value={editorDate}
                  onChange={(e) => setEditorDate(e.target.value)}
                  className="px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Mood</label>
                <div className="flex gap-2">
                  {(["happy", "sad", "neutral", "excited", "anxious"] as MoodType[]).map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setEditorMood(mood)}
                      className={`p-3 rounded-lg border transition-colors ${
                        editorMood === mood
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border hover:bg-accent"
                      }`}
                      title={mood}
                    >
                      <MoodIcon mood={mood} className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Content</label>
                <div className="space-y-2">
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Write your thoughts..."
                    rows={12}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground"
                  />
                  
                  {/* Voice Input */}
                  <div className="flex gap-2">
                    <VoiceInput
                      onTranscript={(text) => setEditorContent(prev => prev + text)}
                      language="nl-NL"
                    />
                  </div>
                </div>
              </div>

              {/* Photos Section */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Photos</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Image className="w-4 h-4" />
                    Upload Photos
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCamera(!showCamera)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    Take Photo
                  </button>
                </div>

                {showPhotoUpload && (
                  <div className="mt-4">
                    <PhotoUpload
                      onUpload={(photos) => {
                        setEditorPhotos(prev => [...prev, ...photos]);
                        setShowPhotoUpload(false);
                      }}
                      maxPhotos={10}
                    />
                  </div>
                )}

                {showCamera && (
                  <div className="mt-4">
                    <CameraCapture
                      onCapture={(photo) => {
                        setEditorPhotos(prev => [...prev, photo]);
                        setShowCamera(false);
                      }}
                      onClose={() => setShowCamera(false)}
                    />
                  </div>
                )}

                {editorPhotos.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {editorPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => setEditorPhotos(prev => prev.filter((_, i) => i !== index))}
                          className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {editorTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editorTags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveEntry}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save Entry
                </button>
                <button
                  onClick={() => setView("list")}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === "calendar" && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Calendar View</h2>
            <CalendarHeatmap
              entries={entries}
              onDateClick={(date) => {
                const entry = entries.find(e => e.date.startsWith(date));
                if (entry) handleEditEntry(entry);
              }}
            />
          </div>
        )}

        {view === "book" && (
          <div>
            <BookView entries={displayedEntries} />
          </div>
        )}
      </div>
    </div>
  );
}
