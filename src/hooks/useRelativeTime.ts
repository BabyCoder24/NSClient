import { useState, useEffect, useCallback } from "react";
import { formatRelativeTime } from "../utilities/timeUtils";

/**
 * Hook for displaying relative time with optional real-time updates.
 * Useful for timestamps that need to update periodically (e.g., "2 seconds ago" -> "3 seconds ago").
 *
 * @param date - The date to format.
 * @param options - Configuration options.
 * @param options.fallback - Fallback string for invalid/null dates.
 * @param options.updateInterval - Interval in ms for updates (default: 1000ms). Set to 0 to disable updates.
 * @returns The current relative time string.
 */
export function useRelativeTime(
  date: string | Date | null | undefined,
  options: { fallback?: string; updateInterval?: number } = {}
): string {
  const { updateInterval = 1000, fallback } = options;

  const formatTime = useCallback(
    (referenceDate?: Date) =>
      formatRelativeTime(date, { fallback, now: referenceDate }),
    [date, fallback]
  );

  const [timeString, setTimeString] = useState(() => formatTime());

  useEffect(() => {
    setTimeString(formatTime());
  }, [formatTime]);

  useEffect(() => {
    if (updateInterval <= 0) return undefined;

    const interval = setInterval(() => {
      setTimeString(formatTime(new Date()));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [formatTime, updateInterval]);

  return timeString;
}
