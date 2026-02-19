import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.54.192:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    // El token lo persiste Zustand en AsyncStorage bajo la clave 'auth-storage'
    const stored = await AsyncStorage.getItem('auth-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      const token = state?.tokens?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Si no hay token simplemente no se agrega el header
  }
  return config;
});

export default apiClient;
