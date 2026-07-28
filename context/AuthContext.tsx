import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import {
  clearTokens,
  DEMO_ACCESS_TOKEN,
  DEMO_REFRESH_TOKEN,
  getRefreshToken,
  getPersistedAccessToken,
  getPersistedUser,
  setPersistedUser,
} from '@/lib/token-storage';
import { queryClient } from '@/lib/react-query';
import { User, LoginPayload, RegisterPayload } from '@/types';

type AuthData = {
  user: User;
  token: string;
};

type AuthContextType = {
  user: User | null;
  authData: AuthData | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateUser: (updatedUser: User) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    promise
      .then((value) => {
        clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount: try to restore session
  useEffect(() => {
    const checkAuth = async () => {
      let persistedUser: User | null = null;
      try {
        const [accessToken, refreshToken, storedUser] = await Promise.all([
          getPersistedAccessToken(),
          getRefreshToken(),
          getPersistedUser(),
        ]);
        persistedUser = storedUser;

        if (accessToken === DEMO_ACCESS_TOKEN || refreshToken === DEMO_REFRESH_TOKEN) {
          await clearTokens();
          setUser(null);
          setAuthData(null);
          return;
        }

        if (accessToken) {
          if (persistedUser) {
            setUser(persistedUser);
            setAuthData({ user: persistedUser, token: accessToken });
          }

          // Verify via getMe, the apiClient handles auto-refresh if token is expired
          try {
            const userData = await withTimeout(authService.getMe(), 8000);
            setUser(userData);
            setAuthData({ user: userData, token: accessToken });
            await setPersistedUser(userData);
            return;
          } catch (e: any) {
             // If it's a network error or 500, we should keep the user logged in with cached data.
             // Only clear session if it's explicitly a 401/403 meaning token is dead.
             if (e?.statusCode === 401 || e?.statusCode === 403) {
               throw e;
             }
             if (persistedUser) return; // Silent fail, we already set the cached user
             throw e; // If we don't have a cached user and getMe fails, we must logout
          }
        } 
        
        if (refreshToken) {
          const response = await withTimeout(authService.refresh(), 8000);
          const token = response.accessToken;
          let userData = response.user ?? persistedUser;

          if (!userData && token) {
            try {
              userData = await withTimeout(authService.getMe(), 8000);
            } catch (e: any) {
              if (e?.statusCode === 401 || e?.statusCode === 403) throw e;
              if (!persistedUser) throw e;
            }
          }

          if (token && userData) {
            setUser(userData);
            setAuthData({ user: userData, token });
            await setPersistedUser(userData);
          }
        }
      } catch (e: any) {
        if (e?.statusCode === 401 || e?.statusCode === 403) {
          await clearTokens();
          setUser(null);
          setAuthData(null);
          return;
        }
        if (!persistedUser) {
          setUser(null);
          setAuthData(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const translateError = (err: any) => {
      // Get the message from error body or string
      let message = '';
      if (typeof err === 'string') {
        message = err;
      } else if (err?.errorBody?.message) {
        message = Array.isArray(err.errorBody.message) ? err.errorBody.message[0] : err.errorBody.message;
      } else {
        message = err?.message || '';
      }

      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('invalid credentials')) {
        return 'بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.';
      }
      if (lowerMessage.includes('user already exists') || lowerMessage.includes('already registered')) {
        return 'هذا البريد الإلكتروني مسجل مسبقاً.';
      }
      if (lowerMessage.includes('network') || lowerMessage.includes('failed to fetch') || lowerMessage.includes('network request failed')) {
        return 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
      }
      if (lowerMessage.includes('unauthorized')) {
        return 'غير مصرح لك بالقيام بهذا الإجراء.';
      }
      if (lowerMessage.includes('forbidden')) {
        return 'ليس لديك صلاحية للوصول إلى هذا المورد.';
      }
      if (lowerMessage.includes('not found')) {
        return 'المورد المطلوب غير موجود.';
      }
      if (lowerMessage.includes('too many requests')) {
        return 'لقد قمت بالكثير من المحاولات. يرجى المحاولة لاحقاً.';
      }
      return message || 'حدث خطأ ما. يرجى المحاولة مجدداً.';
    };

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
      setAuthData({ user: response.user, token: response.accessToken });
      await setPersistedUser(response.user);
    } catch (err: any) {
      setError(translateError(err));
      throw err;
    }
  }, []);

  const signUp = useCallback(async (data: RegisterPayload) => {
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setAuthData({ user: response.user, token: response.accessToken });
      await setPersistedUser(response.user);
    } catch (err: any) {
      setError(translateError(err));
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setAuthData(null);
      queryClient.clear(); // clear all cached data so next user starts fresh
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const updateUser = useCallback(async (updatedUser: User) => {
    setUser(updatedUser);
    setAuthData(prev => prev ? { ...prev, user: updatedUser } : null);
    await setPersistedUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, authData, loading, error, signIn, signUp, signOut, clearError, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
