import { User } from '../../types';

export interface IUserService {
  getCurrentUser(): Promise<User>;
  updateUsername(username: string): Promise<User>;
}
