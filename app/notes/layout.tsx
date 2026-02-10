"use client";

import { NotesProvider } from "@/lib/notes-context";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NotesProvider>{children}</NotesProvider>;
}
