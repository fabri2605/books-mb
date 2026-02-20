import { AxiosInstance } from 'axios';
import { Challenge } from '../../types';

export class RealChallengeService {
  constructor(private client: AxiosInstance) {}

  async listChallenges(): Promise<Challenge[]> {
    const res = await this.client.get<Challenge[]>('/challenges');
    return res.data;
  }

  async createChallenge(bookId: string, challengedId: string): Promise<Challenge> {
    const res = await this.client.post<Challenge>('/challenges', { bookId, challengedId });
    return res.data;
  }

  async declineChallenge(challengeId: string): Promise<Challenge> {
    const res = await this.client.post<Challenge>(`/challenges/${challengeId}/decline`);
    return res.data;
  }
}
