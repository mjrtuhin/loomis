import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoRefreshOptions {
  intervalMinutes: number;
  onRefresh: () => Promise<void>;
  enabled?: boolean;
}

export function useAutoRefresh({ 
  intervalMinutes, 
  onRefresh, 
  enabled = true 
}: UseAutoRefreshOptions) {
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(intervalMinutes * 60);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastRefreshTime(new Date());
      setSecondsUntilRefresh(intervalMinutes * 60);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [intervalMinutes, onRefresh, isRefreshing]);

  // Countdown timer
  useEffect(() => {
    if (!enabled) return;

    timerRef.current = setInterval(() => {
      setSecondsUntilRefresh(prev => {
        if (prev <= 1) {
          refresh();
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, intervalMinutes, refresh]);

  // Format countdown
  const formatCountdown = useCallback(() => {
    const minutes = Math.floor(secondsUntilRefresh / 60);
    const seconds = secondsUntilRefresh % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [secondsUntilRefresh]);

  return {
    secondsUntilRefresh,
    isRefreshing,
    lastRefreshTime,
    refresh,
    formatCountdown
  };
}
