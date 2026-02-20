import { IUserService } from '../interfaces/userService';
import { User, PublicUser } from '../../types';
import { mockUser } from './mockData';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockUserService implements IUserService {
  async getCurrentUser(): Promise<User> {
    await delay(300);
    return mockUser;
  }

  async updateUsername(username: string): Promise<User> {
    return { ...mockUser, username };
  }

  async searchUsers(_q: string): Promise<PublicUser[]> {
    return [];
  }

  async getUserProfile(_id: string): Promise<PublicUser> {
    return { ...mockUser };
  }

  async getAchievements() {
    return { achievements: [], nextHint: null };
  }
}
