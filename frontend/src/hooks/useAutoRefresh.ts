import { useEffect, useRef } from 'react';

export function useAutoRefresh(intervalMinutes: number, callback: () => void, enabled: boolean = true) {
  const savedCallback = useRef(callback);

  // Update ref when callback changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || intervalMinutes <= 0) {
      return;
    }

    const intervalMs = intervalMinutes * 60 * 1000;
    const timer = setInterval(() => {
      savedCallback.current();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMinutes, enabled]);
}
