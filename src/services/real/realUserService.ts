import { AxiosInstance } from 'axios';
import { IUserService } from '../interfaces/userService';
import { User, PublicUser, Achievement, AchievementNextHint } from '../../types';

interface AchievementsResponse {
  achievements: Achievement[];
  nextHint: AchievementNextHint | null;
}

export class RealUserService implements IUserService {
  constructor(private client: AxiosInstance) {}

  async getCurrentUser(): Promise<User> {
    const { data } = await this.client.get('/users/me');
    return data;
  }

  async updateUsername(username: string): Promise<User> {
    const { data } = await this.client.patch('/users/me/username', { username });
    return data;
  }

  async searchUsers(username: string): Promise<PublicUser[]> {
    const { data } = await this.client.get('/users/search', { params: { username } });
    return data;
  }

  async getUserProfile(userId: string): Promise<PublicUser> {
    const { data } = await this.client.get(`/users/${userId}/profile`);
    return data;
  }

  async getAchievements(): Promise<AchievementsResponse> {
    const { data } = await this.client.get('/users/me/achievements');
    return data;
  }
}
