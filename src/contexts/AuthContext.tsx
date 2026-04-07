import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  pixKey?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (method: 'google' | 'apple' | 'email', email?: string, password?: string) => Promise<string | null>;
  signup: (email: string, password: string, name?: string) => Promise<string | null>;
  logout: () => Promise<void>;
  setPixKey: (key: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mapUser = (user: User, profile?: { name?: string; avatar_url?: string; pix_key?: string } | null): AuthUser => ({
  id: user.id,
  name: profile?.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
  email: user.email || '',
  walletAddress: '0x' + user.id.replace(/-/g, '').slice(0, 12) + '...',
  pixKey: profile?.pix_key || undefined,
  avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || undefined,
});

const fetchProfile = async (userId: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('name, avatar_url, pix_key')
    .eq('id', userId)
    .single();
  return data;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(mapUser(session.user, profile));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setUser(mapUser(session.user, profile));
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (method: 'google' | 'apple' | 'email', email?: string, password?: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      if (method === 'google') {
        const result = await lovable.auth.signInWithOAuth('google', {
          redirect_uri: window.location.origin,
        });
        if (result.error) return result.error.message;
        return null;
      }

      if (method === 'email' && email && password) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return error.message;
        return null;
      }

      return 'Método de login inválido';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name?: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name || email.split('@')[0] },
        },
      });
      if (error) return error.message;
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const setPixKey = useCallback((key: string) => {
    setUser(prev => prev ? { ...prev, pixKey: key } : prev);
    if (user) {
      supabase.from('profiles').update({ pix_key: key }).eq('id', user.id).then();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, setPixKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
