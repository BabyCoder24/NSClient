import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook to track user activity (mouse, keyboard events).
 * Returns the last activity timestamp and a function to check if user is active within a given time window.
 */
export function useActivityTracker() {
  const [lastActivity, setLastActivity] = useState(Date.now());
  const lastActivityRef = useRef(Date.now());
  const throttleRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Throttle activity updates to prevent excessive re-renders
  const throttledSetActivity = useCallback((timestamp: number) => {
    lastActivityRef.current = timestamp;

    if (throttleRef.current) return;

    throttleRef.current = window.setTimeout(() => {
      setLastActivity(lastActivityRef.current);
      throttleRef.current = null;
    }, 100); // Update state at most every 100ms
  }, []);

  const updateActivity = useCallback(
    (event: Event) => {
      const elementTarget =
        event.target instanceof Element ? event.target : null;

      // More efficient filtering - check for ignored regions first
      if (elementTarget) {
        // Quick check for ignored regions
        if (elementTarget.closest('[data-activity-ignore="true"]')) {
          // Allow buttons and actionable elements even in ignored regions
          if (
            !elementTarget.closest(
              "button, [role='button'], input, textarea, select"
            )
          ) {
            return;
          }
        }
      }

      throttledSetActivity(Date.now());
    },
    [throttledSetActivity]
  );

  useEffect(() => {
    // Events to track - removed mousemove as it's too frequent
    const events = [
      "mousedown",
      "keypress",
      "scroll",
      "touchstart",
      "click", // Added click for better activity detection
    ];

    // Add event listeners with passive option for better performance
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, {
        capture: true,
        passive: true,
      });
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateActivity]);

  const isActive = useCallback((timeWindowMs: number) => {
    return Date.now() - lastActivityRef.current < timeWindowMs;
  }, []);

  return { lastActivity, isActive };
}
