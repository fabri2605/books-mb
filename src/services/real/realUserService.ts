import { AxiosInstance } from 'axios';
import { IUserService } from '../interfaces/userService';
import { User } from '../../types';

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
}
