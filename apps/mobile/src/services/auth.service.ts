import { api, tokenStorage } from './api';
import * as LocalAuthentication from 'expo-local-authentication';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    tenantId: string;
    twoFactorEnabled: boolean;
  };
  accessToken: string;
  refreshToken: string;
  requiresTwoFactor?: boolean;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/api/auth/login', credentials);

    if (!data.requiresTwoFactor) {
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    }

    return data;
  },

  async verifyTwoFactor(token: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/api/auth/2fa/verify', { token });
    await tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = await tokenStorage.getAccessToken();
      if (refreshToken) {
        await api.post('/api/auth/logout', { refreshToken });
      }
    } catch (e) {
      console.warn('Logout API failed', e);
    }
    await tokenStorage.clearTokens();
  },

  async enableBiometric(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return false;

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) return false;

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authentifiez-vous pour activer la biométrie',
      fallbackLabel: 'Utiliser le mot de passe',
    });

    return result.success;
  },

  async authenticateWithBiometric(): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Déverrouiller BeeCarbonIT',
    });
    return result.success;
  },
};
