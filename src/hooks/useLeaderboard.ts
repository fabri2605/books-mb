import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { LeaderboardEntry } from '../types';
import { leaderboardService } from '../services';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      leaderboardService.getLeaderboard({}).then((result) => {
        setEntries(result.entries);
        setLoading(false);
      });
    }, []),
  );

  return { entries, loading };
}
