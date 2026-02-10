"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotes, Note } from "@/lib/notes-context";
import { useTheme } from "@/lib/theme-context";
import { NotesList } from "@/components/NotesList";
import { NoteEditor } from "@/components/NoteEditor";
import { Moon, Sun, FileText, Plus, Home } from "lucide-react";

export default function NotesPage() {
  const router = useRouter();
  const { notes, addNote, updateNote, deleteNote, searchNotes } = useNotes();
  const { theme, toggleTheme } = useTheme();

  const [view, setView] = useState<"list" | "editor">("list");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [displayedNotes, setDisplayedNotes] = useState<Note[]>(notes);

  // Update displayed notes when notes change
  useEffect(() => {
    setDisplayedNotes(notes);
  }, [notes]);

  const handleNewNote = () => {
    setSelectedNote(null);
    setView("editor");
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setView("editor");
  };

  const handleSaveNote = (title: string, content: string) => {
    if (selectedNote) {
      updateNote(selectedNote.id, { title, content });
    } else {
      addNote({ title, content });
    }
    setView("list");
  };

  const handleSearch = (query: string) => {
    if (query) {
      setDisplayedNotes(searchNotes(query));
    } else {
      setDisplayedNotes(notes);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Quick Notes</h1>
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
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {view === "list" && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Your Notes</h2>
              <button
                onClick={handleNewNote}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Note
              </button>
            </div>

            <NotesList
              notes={displayedNotes}
              onEdit={handleEditNote}
              onDelete={deleteNote}
              onSearch={handleSearch}
            />
          </>
        )}

        {view === "editor" && (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onCancel={() => setView("list")}
          />
        )}
      </div>
    </div>
  );
}
