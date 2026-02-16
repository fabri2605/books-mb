import { LeaderboardEntry } from '../../types';

export interface ILeaderboardService {
  getLeaderboard(params: {
    page?: number;
    pageSize?: number;
  }): Promise<{ entries: LeaderboardEntry[]; total: number }>;
}
