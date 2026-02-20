import { AxiosInstance } from 'axios';
import { Season, LeaderboardEntry } from '../../types';

interface SeasonLeaderboard {
  entries: LeaderboardEntry[];
  total: number;
  season: Season | null;
}

export class RealSeasonService {
  constructor(private client: AxiosInstance) {}

  async getCurrentSeason(): Promise<Season> {
    const res = await this.client.get<Season>('/seasons/current');
    return res.data;
  }

  async getSeasonLeaderboard(page = 1, pageSize = 50): Promise<SeasonLeaderboard> {
    const res = await this.client.get<SeasonLeaderboard>('/seasons/leaderboard', {
      params: { page, pageSize },
    });
    return res.data;
  }
}
