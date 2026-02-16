import { AuthTokens, User } from '../../types';

export interface IAuthService {
  signInWithGoogle(googleIdToken: string): Promise<{ user: User; tokens: AuthTokens }>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  signOut(): Promise<void>;
}
