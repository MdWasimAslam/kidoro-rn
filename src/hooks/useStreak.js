import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = '@kidoro_streak';
const LAST_VISIT_KEY = '@kidoro_last_visit';

/**
 * Formats a Date to a YYYY-MM-DD string for date comparison.
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns yesterday's date as YYYY-MM-DD.
 */
function getYesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}

/**
 * useStreak — a hook that automatically manages the daily streak.
 *
 * On mount, it reads the stored streak and last visit date from AsyncStorage.
 * Then it determines whether to:
 *   - Keep the streak (same day visit)
 *   - Increment the streak (consecutive day visit)
 *   - Reset the streak to 1 (gap > 1 day or first visit)
 *
 * Returns { streak, loading } where loading is true until storage is read.
 */
export default function useStreak() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    // Prevent double-execution in StrictMode
    if (hasChecked.current) return;
    hasChecked.current = true;

    (async () => {
      try {
        const [storedStreak, storedLastVisit] = await Promise.all([
          AsyncStorage.getItem(STREAK_KEY),
          AsyncStorage.getItem(LAST_VISIT_KEY),
        ]);

        const today = formatDate(new Date());
        const currentStreak = storedStreak ? parseInt(storedStreak, 10) : 0;

        if (storedLastVisit === null) {
          if (currentStreak > 0) {
            // ── Legacy user: streak from older app version — preserve it ──
            await AsyncStorage.setItem(LAST_VISIT_KEY, today);
            setStreak(currentStreak);
          } else {
            // ── Truly first visit ever ──
            await AsyncStorage.setItem(STREAK_KEY, '1');
            await AsyncStorage.setItem(LAST_VISIT_KEY, today);
            setStreak(1);
          }
        } else if (storedLastVisit === today) {
          // ── Already visited today — keep streak as-is ──
          setStreak(Math.max(currentStreak, 1));
        } else if (storedLastVisit === getYesterday()) {
          // ── Consecutive day — increment ──
          const newStreak = currentStreak + 1;
          await AsyncStorage.setItem(STREAK_KEY, String(newStreak));
          await AsyncStorage.setItem(LAST_VISIT_KEY, today);
          setStreak(newStreak);
        } else {
          // ── Gap of more than 1 day — reset to 1 ──
          await AsyncStorage.setItem(STREAK_KEY, '1');
          await AsyncStorage.setItem(LAST_VISIT_KEY, today);
          setStreak(1);
        }
      } catch (e) {
        // Silent fail — streak defaults to 0
      }
      setLoading(false);
    })();
  }, []);

  return { streak, loading };
}
