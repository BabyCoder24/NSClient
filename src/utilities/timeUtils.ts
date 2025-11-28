/**
 * Utility functions for time-related operations.
 */

/**
 * Formats a date as a relative time string (e.g., "2 seconds ago", "5 minutes ago").
 * If the date is null, undefined, or invalid, returns the fallback string.
 *
 * @param date - The date to format (string, Date, null, or undefined).
 * @param options - Configuration options.
 * @param options.fallback - The string to return if date is invalid or null (default: "NA").
 * @param options.now - The reference date for calculation (default: new Date()).
 * @returns The formatted relative time string.
 */
export function formatRelativeTime(
  date: string | Date | null | undefined,
  options: { fallback?: string; now?: Date } = {}
): string {
  const { fallback = "NA", now = new Date() } = options;

  if (!date) return fallback;

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return fallback;

  const diffMs = now.getTime() - dateObj.getTime();
  if (diffMs < 0) return "in the future"; // Handle future dates gracefully

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"} ago`;
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (weeks < 4) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  return `${years} year${years === 1 ? "" : "s"} ago`;
}
