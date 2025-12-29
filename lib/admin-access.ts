/**
 * Admin access control utilities.
 * Uses sessionStorage to track if admin access was granted via keyboard shortcut.
 * This ensures the admin route is only accessible after the secret shortcut is used.
 */

const ADMIN_ACCESS_KEY = "admin_access_granted";

/**
 * Grant admin access for the current session.
 * Called when the keyboard shortcut is successfully triggered.
 */
export function grantAdminAccess(): void {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(ADMIN_ACCESS_KEY, "true");
  }
}

/**
 * Check if admin access has been granted in the current session.
 */
export function hasAdminAccess(): boolean {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(ADMIN_ACCESS_KEY) === "true";
  }
  return false;
}

/**
 * Revoke admin access (e.g., on logout or session end).
 */
export function revokeAdminAccess(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(ADMIN_ACCESS_KEY);
  }
}
