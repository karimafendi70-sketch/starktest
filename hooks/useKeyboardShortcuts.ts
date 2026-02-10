"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseKeyboardShortcutsOptions {
  onSearch?: () => void;
  onToggleBookMode?: () => void;
}

export function useKeyboardShortcuts(options?: UseKeyboardShortcutsOptions) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Check for modifier key (Cmd on Mac, Ctrl on Windows/Linux)
      const isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (!modifier) {
        // Escape key - close modals/overlays
        if (e.key === 'Escape') {
          // This can be extended to close modals
          return;
        }
        return;
      }

      // Cmd/Ctrl + K - Search
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        if (options?.onSearch) {
          options.onSearch();
        }
      }

      // Cmd/Ctrl + N - New Entry
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        router.push('/journal/new');
      }

      // Cmd/Ctrl + B - Toggle Book Mode
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        if (options?.onToggleBookMode) {
          options.onToggleBookMode();
        }
      }

      // Cmd/Ctrl + H - Go to Home
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        router.push('/home');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, options]);
}
