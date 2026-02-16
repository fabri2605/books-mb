import { IAuthService } from '../interfaces/authService';
import { AuthTokens, User } from '../../types';
import { mockUser } from './mockData';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockAuthService implements IAuthService {
  async signInWithGoogle(_googleIdToken: string): Promise<{ user: User; tokens: AuthTokens }> {
    await delay(400);
    return {
      user: mockUser,
      tokens: { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' },
    };
  }

  async refreshToken(_refreshToken: string): Promise<AuthTokens> {
    await delay(300);
    return { accessToken: 'mock-access-token-refreshed' };
  }

  async signOut(): Promise<void> {
    await delay(200);
  }
}
