import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { leaderboardService } from '../services';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardService.getLeaderboard({}).then((result) => {
      setEntries(result.entries);
      setLoading(false);
    });
  }, []);

  return { entries, loading };
}
