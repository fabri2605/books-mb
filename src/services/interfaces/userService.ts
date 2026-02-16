import { User } from '../../types';

export interface IUserService {
  getCurrentUser(): Promise<User>;
}
