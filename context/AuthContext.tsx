import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { clearTokens, getRefreshToken } from '@/lib/token-storage';
import { queryClient } from '@/lib/react-query';
import { User, LoginPayload, RegisterPayload } from '@/types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount: try to restore session via refresh token (access token is in-memory only)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          const response = await authService.refresh();
          setUser(response.user);
        }
      } catch {
        await clearTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (err: any) {
      const message = err?.message || 'فشل تسجيل الدخول. تحقق من بياناتك.';
      setError(message);
      throw err;
    }
  }, []);

  const signUp = useCallback(async (data: RegisterPayload) => {
    setError(null);
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (err: any) {
      const message = err?.message || 'فشل إنشاء الحساب. يرجى المحاولة مجدداً.';
      setError(message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      queryClient.clear(); // clear all cached data so next user starts fresh
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut, clearError }}>
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
