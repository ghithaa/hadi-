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
    
    const unwrapped = response.data || response;
    const accessToken = unwrapped.accessToken || unwrapped.access_token || unwrapped.token;
    const refreshToken = unwrapped.refreshToken || unwrapped.refresh_token;
    
    if (accessToken) {
      await setTokens(accessToken, refreshToken);
    }
    return { ...unwrapped, accessToken, refreshToken };
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/login', data, { skipAuth: true });
    const unwrapped = response.data || response;
    const accessToken = unwrapped.accessToken || unwrapped.access_token || unwrapped.token;
    const refreshToken = unwrapped.refreshToken || unwrapped.refresh_token;

    if (accessToken) {
      await setTokens(accessToken, refreshToken);
    }
    return { ...unwrapped, accessToken, refreshToken };
  },

  async refresh(): Promise<AuthResponse> {
    const currentRefreshToken = await getRefreshToken();
    if (!currentRefreshToken) throw new Error('No refresh token available');
    const response = await apiClient.post<any>('/auth/refresh', {}, {
      headers: {
        'Authorization': `Bearer ${currentRefreshToken}`,
      },
      skipAuth: true,
    });
    const unwrapped = response.data || response;
    const accessToken = unwrapped.accessToken || unwrapped.access_token || unwrapped.token;
    const newRefreshToken = unwrapped.refreshToken || unwrapped.refresh_token;

    if (accessToken) {
      await setTokens(accessToken, newRefreshToken);
    }
    return { ...unwrapped, accessToken, refreshToken: newRefreshToken };
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
          },
          skipAuth: true,
        });
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

  async deleteMe(): Promise<void> {
    await apiClient.delete('/users/me');
  },

  async googleLogin(idToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<any>('/auth/google', { idToken }, { skipAuth: true });
    const unwrapped = response.data || response;
    const accessToken = unwrapped.accessToken || unwrapped.access_token || unwrapped.token;
    const refreshToken = unwrapped.refreshToken || unwrapped.refresh_token;

    if (accessToken) {
      await setTokens(accessToken, refreshToken);
    }
    return { ...unwrapped, accessToken, refreshToken };
  },
};
