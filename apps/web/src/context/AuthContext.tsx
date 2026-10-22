import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { AuthResponse, UserProfile } from '../types';
import { useTranslation, Language } from '../i18n/context';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    display_name: string;
    preferred_language?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (data: {
    display_name?: string;
    preferred_language?: string;
  }) => Promise<UserProfile>;
  refetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('mira_token'));
  const [isLoading, setIsLoading] = useState(true);
  const { setLanguage } = useTranslation();

  const syncLanguageFromUser = useCallback((profile: UserProfile) => {
    if (profile.preferred_language === 'hi' || profile.preferred_language === 'en') {
      setLanguage(profile.preferred_language as Language);
    }
  }, [setLanguage]);

  const refetchProfile = useCallback(async () => {
    try {
      const res = await api.get<{ data: UserProfile }>('/auth/me');
      setUser(res.data);
      syncLanguageFromUser(res.data);
    } catch {
      // Token invalid or expired
      localStorage.removeItem('mira_token');
      setToken(null);
      setUser(null);
    }
  }, [syncLanguageFromUser]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('mira_token');
      if (storedToken) {
        await refetchProfile();
      }
      setIsLoading(false);
    };
    initAuth();
  }, [refetchProfile]);

  const login = async (email: string, password: string) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('mira_token', res.token);
    setToken(res.token);
    setUser(res.user);
    syncLanguageFromUser(res.user);
  };

  const register = async (data: {
    email: string;
    password: string;
    display_name: string;
    preferred_language?: string;
  }) => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('mira_token', res.token);
    setToken(res.token);
    setUser(res.user);
    syncLanguageFromUser(res.user);
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post('/auth/logout');
      }
    } catch {
      // Proceed with local logout regardless
    } finally {
      localStorage.removeItem('mira_token');
      setToken(null);
      setUser(null);
    }
  };

  const updatePreferences = async (data: {
    display_name?: string;
    preferred_language?: string;
  }) => {
    const res = await api.put<{ data: UserProfile }>('/profile/preferences', data);
    setUser(res.data);
    syncLanguageFromUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updatePreferences,
        refetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
