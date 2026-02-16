import { IUserService } from '../interfaces/userService';
import { User } from '../../types';
import { mockUser } from './mockData';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockUserService implements IUserService {
  async getCurrentUser(): Promise<User> {
    await delay(300);
    return mockUser;
  }
}
