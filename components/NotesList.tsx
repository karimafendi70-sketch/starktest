"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Search, FileText } from "lucide-react";
import { Note } from "@/lib/notes-context";

interface NotesListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
}

export function NotesList({ notes, onEdit, onDelete, onSearch }: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        />
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">No notes yet</h3>
            <p className="text-muted-foreground">
              Start taking notes by clicking the "New Note" button
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
                    {note.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(note.updatedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-foreground line-clamp-2">{note.content}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onEdit(note)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this note?")) {
                        onDelete(note.id);
                      }
                    }}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
