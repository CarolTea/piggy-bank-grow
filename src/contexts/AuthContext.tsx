import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockPrivyAuth, User } from '@/services/mockWeb3Services';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (method: 'google' | 'apple' | 'email', email?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
