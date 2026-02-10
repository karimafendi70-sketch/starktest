"use client";

import { AuthProvider } from "@/lib/auth-context";
import { JournalProvider } from "@/lib/journal-context";
import { ThemeProvider } from "@/lib/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <JournalProvider>{children}</JournalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
