import { useState, useEffect, useCallback } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { authService } from '../services';
import { useAuthStore } from './useAuthStore';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID =
  '821408212211-ghprct2fficcqetr7npbj497lcb9sbr2.apps.googleusercontent.com';

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (request?.redirectUri) {
      console.log('[GoogleAuth] redirectUri:', request.redirectUri);
    }
  }, [request]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      setIsLoading(true);
      authService
        .signInWithGoogle(id_token)
        .then((result) => setAuth(result.user, result.tokens, result.isNewUser))
        .finally(() => setIsLoading(false));
    }
  }, [response]);

  const signIn = useCallback(async () => {
    await promptAsync();
  }, [promptAsync]);

  return { signIn, isLoading: isLoading || !request };
}
