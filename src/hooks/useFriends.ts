import { useState, useEffect, useCallback } from 'react';
import { PublicUser } from '../types';
import { friendService } from '../services';

export function useFriends() {
  const [friends, setFriends] = useState<PublicUser[]>([]);
  const [requests, setRequests] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [f, r] = await Promise.all([
        friendService.getFriends(),
        friendService.getIncomingRequests(),
      ]);
      setFriends(f);
      setRequests(r);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const acceptRequest = useCallback(async (userId: string) => {
    await friendService.acceptRequest(userId);
    await refresh();
  }, [refresh]);

  const removeFriend = useCallback(async (userId: string) => {
    await friendService.removeFriend(userId);
    await refresh();
  }, [refresh]);

  return { friends, requests, loading, refresh, acceptRequest, removeFriend };
}
