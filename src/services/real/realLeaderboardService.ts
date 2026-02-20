import { AxiosInstance } from 'axios';
import { ILeaderboardService } from '../interfaces/leaderboardService';
import { LeaderboardEntry } from '../../types';

export class RealLeaderboardService implements ILeaderboardService {
  constructor(private client: AxiosInstance) {}

  async getLeaderboard(params: {
    page?: number;
    pageSize?: number;
    scope?: 'global' | 'friends';
  }): Promise<{ entries: LeaderboardEntry[]; total: number }> {
    const { data } = await this.client.get('/leaderboard', { params });
    return data;
  }
}
