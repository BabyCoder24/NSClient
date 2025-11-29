import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook to track user activity (mouse, keyboard events).
 * Returns the last activity timestamp and a function to check if user is active within a given time window.
 */
export function useActivityTracker() {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const timeoutRef = useRef<number | null>(null);
  const updateActivity = useCallback((event: Event) => {
    const elementTarget = event.target instanceof Element ? event.target : null;

    if (elementTarget) {
      const insideIgnoredRegion = elementTarget.closest(
        '[data-activity-ignore="true"]'
      );
      const actionableTarget = elementTarget.closest("button, [role='button']");

      if (insideIgnoredRegion && !actionableTarget) {
        return;
      }
    }

    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    // Events to track
    const events = [
      "mousedown",
      //   "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateActivity]);

  const isActive = useCallback(
    (timeWindowMs: number) => {
      return Date.now() - lastActivity < timeWindowMs;
    },
    [lastActivity]
  );

  return { lastActivity, isActive };
}
