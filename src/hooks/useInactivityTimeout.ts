import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authThunks";
import { useActivityTracker } from "./useActivityTracker";
import type { AppDispatch } from "../store/store";

interface InactivityTimeoutOptions {
  enabled?: boolean;
  timeoutMs?: number;
  warningTimeMs?: number;
}

/**
 * Hook to handle inactivity timeout with dialog.
 * Shows warning dialog before logout and logs out user after specified period of inactivity.
 *
 * @param timeoutMs - Inactivity timeout in milliseconds (default: 30 minutes)
 * @param warningTimeMs - Time before timeout to show warning dialog (default: 2 minutes)
 */
export function useInactivityTimeout({
  enabled = true,
  timeoutMs = 3 * 60 * 1000, // configurable timeout, default 3 minutes
  warningTimeMs = 2 * 60 * 1000,
}: InactivityTimeoutOptions = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { isActive, lastActivity } = useActivityTracker();
  const timeoutRef = useRef<number | null>(null);
  const warningRef = useRef<number | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearInterval(warningRef.current);
      warningRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(() => {
    clearTimers();
    setDialogOpen(false);
    setRemainingTime(0);
    dispatch(logoutUser());
  }, [dispatch, clearTimers]);

  const handleStayLoggedIn = useCallback(() => {
    setDialogOpen(false);
    // Activity will be updated automatically by useActivityTracker
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      setDialogOpen(false);
      setRemainingTime(0);
      return undefined;
    }

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const timeToTimeout = timeoutMs - timeSinceActivity;
      const timeToWarning = timeoutMs - warningTimeMs - timeSinceActivity;

      if (timeSinceActivity >= timeoutMs) {
        // User inactive, logout
        handleLogout();
      } else if (timeToWarning <= 0 && !dialogOpen) {
        // Show warning dialog
        const warningSeconds = Math.ceil(timeToTimeout / 1000);
        setRemainingTime(warningSeconds > 0 ? warningSeconds : 0);
        setDialogOpen(true);
      }

      // Schedule next check
      timeoutRef.current = setTimeout(checkInactivity, 60 * 1000); // Check every minute
    };

    // Start checking
    timeoutRef.current = window.setTimeout(checkInactivity, 60 * 1000);

    return () => {
      clearTimers();
    };
  }, [
    enabled,
    dispatch,
    isActive,
    timeoutMs,
    warningTimeMs,
    lastActivity,
    dialogOpen,
    handleLogout,
    clearTimers,
  ]);

  // Update remaining time every second when dialog is open
  useEffect(() => {
    if (!enabled || !dialogOpen) return undefined;

    const updateRemainingTime = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const timeToTimeout = timeoutMs - timeSinceActivity;
      const remainingSeconds = Math.ceil(timeToTimeout / 1000);

      if (remainingSeconds <= 0) {
        handleLogout();
      } else {
        setRemainingTime(remainingSeconds);
      }
    };

    updateRemainingTime(); // Initial update
    warningRef.current = window.setInterval(updateRemainingTime, 1000);

    return () => {
      if (warningRef.current) {
        clearInterval(warningRef.current);
        warningRef.current = null;
      }
    };
  }, [enabled, dialogOpen, lastActivity, timeoutMs, handleLogout]);

  if (!enabled) {
    return null;
  }

  return {
    dialogOpen,
    remainingTime,
    totalWarningTime: Math.ceil(warningTimeMs / 1000),
    onStayLoggedIn: handleStayLoggedIn,
    onLogout: handleLogout,
  };
}
