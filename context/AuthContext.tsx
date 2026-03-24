import React, { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  user: any;
  signIn: () => void;
  signOut: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
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

  const signIn = () => {
    setUser({ name: 'User' });
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
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
