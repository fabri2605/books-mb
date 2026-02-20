import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens } from '../types';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  needsUsernameSetup: boolean;
  setAuth: (user: User, tokens: AuthTokens, isNewUser?: boolean) => void;
  setUser: (user: User) => void;
  clearUsernameSetup: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      needsUsernameSetup: false,
      setAuth: (user, tokens, isNewUser = false) =>
        set({ user, tokens, isAuthenticated: true, needsUsernameSetup: isNewUser }),
      setUser: (user) => set({ user }),
      clearUsernameSetup: () => set({ needsUsernameSetup: false }),
      clearAuth: () => set({ user: null, tokens: null, isAuthenticated: false, needsUsernameSetup: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
