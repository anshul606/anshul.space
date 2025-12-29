"use client";

import { useRouter } from "next/navigation";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { grantAdminAccess } from "@/lib/admin-access";

/**
 * Global keyboard shortcut listener component.
 * Listens for Ctrl + Shift + Alt + A to navigate to the admin panel.
 *
 * Requirements: 3.1, 3.2, 3.6
 */
export function KeyboardShortcut(): null {
  const router = useRouter();

  useKeyboardShortcut(
    {
      ctrlKey: true,
      shiftKey: true,
      altKey: true,
      key: "a",
    },
    () => {
      // Grant access before navigating
      grantAdminAccess();
      router.push("/admin");
    }
  );

  // This component doesn't render anything visible
  return null;
}

export default KeyboardShortcut;
