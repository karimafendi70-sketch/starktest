'use client';

import { useUser } from '@/lib/user-context';
import { useJournal } from '@/lib/journal-context';
import EmptyStateDashboard from '@/components/dashboard/EmptyStateDashboard';
import ActiveStateDashboard from '@/components/dashboard/ActiveStateDashboard';
import LoadingState from '@/components/LoadingState';
import FAB from '@/components/FAB';

export default function HomePage() {
  const { currentUser } = useUser();
  const { entries, loading } = useJournal();
  
  if (loading) return <LoadingState />;
  
  if (!currentUser) {
    return <LoadingState />;
  }
  
  // Show different UI based on whether user has entries
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
