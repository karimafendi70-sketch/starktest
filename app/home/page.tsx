"use client";

import { useUser } from "@/lib/user-context";
import { useJournal } from "@/lib/journal-context";
import { EmptyStateDashboard } from "@/components/dashboard/EmptyStateDashboard";
import { ActiveStateDashboard } from "@/components/dashboard/ActiveStateDashboard";
import { LoadingState } from "@/components/LoadingState";
import { FAB } from "@/components/FAB";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

export default function HomePage() {
  const { currentUser } = useUser();
  const { entries } = useJournal();

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Show loading state if no user
  if (!currentUser) {
    return <LoadingState message="Loading your dashboard..." />;
  }

  // Adaptive logic: Empty state vs Active state
  return (
    <>
      {entries.length === 0 ? (
        <EmptyStateDashboard user={currentUser} />
      ) : (
        <ActiveStateDashboard user={currentUser} entries={entries} />
      )}
      <FAB />
    </>
  );
}
