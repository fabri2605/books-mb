import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_LAST_OPEN = 'streak_last_open';
const KEY_COUNT = 'streak_count';

interface StreakState {
  streak: number;
  showModal: boolean;
  closeModal: () => void;
}

export function useStreak(): StreakState {
  const [streak, setStreak] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    checkStreak();
  }, []);

  async function checkStreak() {
    const today = new Date().toDateString();
    const [lastOpen, rawCount] = await Promise.all([
      AsyncStorage.getItem(KEY_LAST_OPEN),
      AsyncStorage.getItem(KEY_COUNT),
    ]);
    const stored = parseInt(rawCount ?? '0', 10);

    // Same day — nothing to do
    if (lastOpen === today) {
      setStreak(stored);
      return;
    }

    let next: number;
    if (!lastOpen) {
      // First ever open
      next = 1;
    } else {
      const prev = new Date(lastOpen);
      const now = new Date(today);
      const diffDays = Math.round((now.getTime() - prev.getTime()) / 86_400_000);
      next = diffDays === 1 ? stored + 1 : 1;
    }

    await Promise.all([
      AsyncStorage.setItem(KEY_LAST_OPEN, today),
      AsyncStorage.setItem(KEY_COUNT, String(next)),
    ]);

    setStreak(next);
    setShowModal(true);
  }

  return { streak, showModal, closeModal: () => setShowModal(false) };
}
