/**
 * Google Drive URL utility functions.
 * Converts share links to embeddable/direct/download URLs.
 */

/**
 * Extracts the file ID from a Google Drive share link.
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/open?id=FILE_ID
 * - https://docs.google.com/document/d/FILE_ID/...
 */
export function extractDriveFileId(shareLink: string): string | null {
  if (!shareLink) return null;

  // Pattern: /file/d/FILE_ID/ or /d/FILE_ID/
  const filePattern = /\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/;
  const fileMatch = shareLink.match(filePattern);
  if (fileMatch) return fileMatch[1];

  // Pattern: ?id=FILE_ID
  const idPattern = /[?&]id=([a-zA-Z0-9_-]+)/;
  const idMatch = shareLink.match(idPattern);
  if (idMatch) return idMatch[1];

  return null;
}

/**
 * Converts a Google Drive share link to an embeddable iframe URL (for PDF preview).
 */
export function driveShareToEmbed(shareLink: string): string | null {
  const fileId = extractDriveFileId(shareLink);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Converts a Google Drive share link to a direct image/thumbnail URL.
 */
export function driveShareToDirectImage(shareLink: string): string | null {
  const fileId = extractDriveFileId(shareLink);
  if (!fileId) return null;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

/**
 * Converts a Google Drive share link to a download URL.
 */
export function driveShareToDownload(shareLink: string): string | null {
  const fileId = extractDriveFileId(shareLink);
  if (!fileId) return null;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Validates that a string looks like a Google Drive share link.
 */
export function isValidDriveLink(link: string): boolean {
  if (!link) return false;
  return extractDriveFileId(link) !== null;
}

/**
 * Gets the original Drive view link from a file ID or share link.
 */
export function driveShareToViewLink(shareLink: string): string | null {
  const fileId = extractDriveFileId(shareLink);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/view`;
}
