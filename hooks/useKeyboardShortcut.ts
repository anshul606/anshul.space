"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcutOptions {
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  key: string;
}

/**
 * Custom hook to listen for a specific keyboard shortcut combination.
 *
 * @param options - The keyboard shortcut configuration
 * @param callback - Function to call when the shortcut is triggered
 */
export function useKeyboardShortcut(
  options: KeyboardShortcutOptions,
  callback: () => void
): void {
  const { ctrlKey = false, shiftKey = false, altKey = false, key } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Guard against undefined event.key (can happen with some keyboard events)
      if (!event.key) return;

      // Validate all modifier keys are pressed simultaneously
      const ctrlMatch = ctrlKey
        ? event.ctrlKey || event.metaKey
        : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shiftKey ? event.shiftKey : !event.shiftKey;
      const altMatch = altKey ? event.altKey : !event.altKey;

      // Use event.code for reliable key detection (handles special chars from modifier combos)
      const keyCode = `Key${key.toUpperCase()}`;
      const keyMatch =
        event.code === keyCode || event.key.toLowerCase() === key.toLowerCase();

      // Only trigger if ALL conditions match exactly
      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        callback();
      }
    },
    [ctrlKey, shiftKey, altKey, key, callback]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}

export default useKeyboardShortcut;
