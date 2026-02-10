"use client";

import { AuthProvider } from "@/lib/auth-context";
import { JournalProvider } from "@/lib/journal-context";
import { ThemeProvider } from "@/lib/theme-context";
import { TrialProvider } from "@/lib/trial-context";
import { UserProvider } from "@/lib/user-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <TrialProvider>
          <AuthProvider>
            <JournalProvider>{children}</JournalProvider>
          </AuthProvider>
        </TrialProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
