import { useState, useCallback } from 'react';
import { authService } from '../services';
import { useAuthStore } from './useAuthStore';

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const signIn = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with real expo-auth-session Google flow
      // For now, use mock auth directly
      const result = await authService.signInWithGoogle('mock-google-id-token');
      setAuth(result.user, result.tokens);
    } finally {
      setIsLoading(false);
    }
  }, [setAuth]);

  return { signIn, isLoading };
}
