import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockPrivyAuth, User } from '@/services/mockWeb3Services';

interface AuthUser extends User {
  pixKey?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (method: 'google' | 'apple' | 'email', email?: string) => Promise<void>;
  logout: () => void;
  setPixKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (method: 'google' | 'apple' | 'email', email?: string) => {
    setIsLoading(true);
    try {
      const u = await mockPrivyAuth(method, email);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const setPixKey = useCallback((key: string) => {
    setUser(prev => prev ? { ...prev, pixKey: key } : prev);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setPixKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
