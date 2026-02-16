import { ILeaderboardService } from '../interfaces/leaderboardService';
import { LeaderboardEntry } from '../../types';
import { mockLeaderboard } from './mockData';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockLeaderboardService implements ILeaderboardService {
  async getLeaderboard(params: {
    page?: number;
    pageSize?: number;
  }): Promise<{ entries: LeaderboardEntry[]; total: number }> {
    await delay(350);
    const { page = 1, pageSize = 20 } = params;
    const start = (page - 1) * pageSize;
    const entries = mockLeaderboard.slice(start, start + pageSize);
    return { entries, total: mockLeaderboard.length };
  }
}
