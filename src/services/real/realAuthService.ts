import { AxiosInstance } from 'axios';
import { IAuthService } from '../interfaces/authService';
import { AuthTokens, User } from '../../types';

export class RealAuthService implements IAuthService {
  constructor(private client: AxiosInstance) {}

  async signInWithGoogle(googleIdToken: string): Promise<{ user: User; tokens: AuthTokens; isNewUser: boolean }> {
    const { data } = await this.client.post('/auth/google', { googleIdToken });
    return {
      user: data.user,
      tokens: data.tokens,
      isNewUser: data.isNewUser ?? false,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const { data } = await this.client.post(
      '/auth/refresh',
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } },
    );
    return { accessToken: data.accessToken, refreshToken };
  }

  async signOut(): Promise<void> {
    await this.client.post('/auth/signout');
  }
}
