import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthData = {
  user: any;
  token?: string;
  refreshToken?: string;
};

type AuthContextType = {
  user: any;
  authData: AuthData | null;
  signIn: (data?: AuthData) => void;
  signOut: () => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking stored auth
    const checkAuth = async () => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };
    checkAuth();
  }, []);

  const signIn = (data?: AuthData) => {
    setAuthData(data || { user: { name: 'User' }, token: 'mock-token' });
  };

  const signOut = () => {
    setAuthData(null);
  };

  const logout = () => {
    setAuthData(null);
  };

  const user = authData?.user || null;

  return (
    <AuthContext.Provider value={{ user, authData, signIn, signOut, logout, loading }}>
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
