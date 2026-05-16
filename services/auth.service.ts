import { apiClient } from '@/lib/api-client';
import { setTokens, clearTokens, getRefreshToken } from '@/lib/token-storage';
import {
  AuthResponse,
  User,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ChangePasswordPayload,
  UpdateProfilePayload,
} from '@/types';

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/register', {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
    }, { skipAuth: true });
    
    const accessToken = response.accessToken || response.token;
    if (accessToken) {
      await setTokens(accessToken, response.refreshToken);
    }
    return { ...response, accessToken };
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/login', data, { skipAuth: true });
    const accessToken = response.accessToken || response.token;
    if (accessToken) {
      await setTokens(accessToken, response.refreshToken);
    }
    return { ...response, accessToken };
  },

  async refresh(): Promise<AuthResponse> {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    const response = await apiClient.post<any>('/auth/refresh', { refreshToken }, { skipAuth: true });
    const accessToken = response.accessToken || response.token;
    if (accessToken) {
      await setTokens(accessToken, response.refreshToken);
    }
    return { ...response, accessToken };
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken }, { skipAuth: true });
      }
    } catch {
      // Ignore network errors — tokens will be cleared locally regardless
    } finally {
      await clearTokens();
    }
  },

  async forgotPassword(data: ForgotPasswordPayload): Promise<void> {
    await apiClient.post('/auth/forgot-password', data, { skipAuth: true });
  },

  async changePassword(data: ChangePasswordPayload): Promise<void> {
    await apiClient.post('/auth/change-password', {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  },

  async getMe(): Promise<User> {
    return apiClient.get<User>('/users/me');
  },

  async updateMe(data: UpdateProfilePayload): Promise<User> {
    return apiClient.patch<User>('/users/me', data);
  },

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/google', { idToken }, { skipAuth: true });
    const accessToken = response.accessToken || response.token;
    if (accessToken) {
      await setTokens(accessToken, response.refreshToken);
    }
    return { ...response, accessToken };
  },
};
