import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const getApiBaseUrl = (): string => {
  if (__DEV__) {
    const hostUri = Constants.expoConfig?.hostUri;
    const host = hostUri?.split(':')[0];
    if (host) return `http://${host}:5000`;
  }
  return 'http://192.168.54.172:5000'; // fallback / producción
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Lee los tokens guardados por Zustand en AsyncStorage
async function getStoredTokens(): Promise<{ accessToken?: string; refreshToken?: string }> {
  try {
    const stored = await AsyncStorage.getItem('auth-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      return {
        accessToken: state?.tokens?.accessToken,
        refreshToken: state?.tokens?.refreshToken,
      };
    }
  } catch {}
  return {};
}

// Actualiza solo el accessToken en el store de Zustand persistido
async function updateAccessToken(newToken: string): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.state.tokens.accessToken = newToken;
      await AsyncStorage.setItem('auth-storage', JSON.stringify(parsed));
    }
  } catch {}
}

// Request interceptor: agrega el access token
apiClient.interceptors.request.use(async (config) => {
  const { accessToken } = await getStoredTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: refresh automático ante 401
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeToRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function broadcastNewToken(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;

    // Solo reintentar una vez, y no reintentar el propio endpoint de refresh
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === '/auth/refresh'
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Esperar a que otro request termine el refresh
      return new Promise((resolve) => {
        subscribeToRefresh((token) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };
          originalRequest._retry = true;
          resolve(apiClient(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = await getStoredTokens();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
        headers: { Authorization: `Bearer ${refreshToken}` },
      });

      const newAccessToken: string = data.accessToken;
      await updateAccessToken(newAccessToken);
      broadcastNewToken(newAccessToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      return apiClient(originalRequest);
    } catch {
      // Refresh falló: limpiar sesión para forzar re-login
      await AsyncStorage.removeItem('auth-storage');
      refreshSubscribers = [];
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
