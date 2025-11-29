import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { proactiveRefreshToken } from "../store/authThunks";
import { useActivityTracker } from "./useActivityTracker";
import type { RootState, AppDispatch } from "../store/store";

interface TokenRefreshOptions {
  enabled?: boolean;
  refreshIntervalMs?: number;
  refreshThresholdMs?: number;
}

/**
 * Hook to handle proactive token refresh.
 * Refreshes tokens before expiry if user is active.
 */
export function useTokenRefresh({
  enabled = true,
  refreshIntervalMs = 10 * 60 * 1000,
  refreshThresholdMs = 5 * 60 * 1000,
}: TokenRefreshOptions = {}) {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, expiresAt } = useSelector(
    (state: RootState) => state.auth
  );
  const { isActive } = useActivityTracker();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !accessToken || !expiresAt) return undefined;

    const checkAndRefresh = () => {
      const now = Date.now();
      const timeToExpiry = expiresAt - now;

      if (timeToExpiry < refreshThresholdMs && isActive(10 * 60 * 1000)) {
        // User active and token expiring soon, refresh
        dispatch(proactiveRefreshToken());
      }
    };

    // Initial check
    checkAndRefresh();

    // Set interval
    intervalRef.current = window.setInterval(
      checkAndRefresh,
      refreshIntervalMs
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    enabled,
    dispatch,
    accessToken,
    expiresAt,
    isActive,
    refreshIntervalMs,
    refreshThresholdMs,
  ]);
}
