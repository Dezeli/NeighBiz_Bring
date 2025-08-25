import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import TokenManager from '../utils/TokenManager';

type Role = 'guest' | 'owner' | null;

interface AuthUser {
  user_id: number;
  phone_number: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  role: Role;
  isAuthenticated: boolean;
  isGuest: boolean;
  isOwner: boolean;
  loading: boolean;
  login: (access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  apiCall: <T = any>(config: any) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const tokenManager = TokenManager.getInstance();

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const response = await tokenManager.makeAuthenticatedRequest({
        method: 'GET',
        url: '/auth/me',
      });

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      if (error.message.includes('login required')) {
        setUser(null);
      }
    }
  }, [tokenManager]);

  const apiCall = useCallback(async <T = any>(config: any): Promise<T> => {
    try {
      return await tokenManager.makeAuthenticatedRequest<T>(config);
    } catch (error: any) {
      if (error.message.includes('login required')) {
        setUser(null);
      }
      throw error;
    }
  }, [tokenManager]);

  const login = useCallback(async (access: string, refresh: string) => {
    try {
      tokenManager.saveTokens(access, refresh);
      await fetchUser();
    } catch (error) {
      tokenManager.clearTokens();
      setUser(null);
      throw error;
    }
  }, [tokenManager, fetchUser]);

  const logout = useCallback(async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          await tokenManager.makeAuthenticatedRequest({
            method: 'POST',
            url: '/auth/logout',
            data: { refresh: refreshToken },
          });
        } catch (e) {
          // 로그아웃 API 실패 무시
        }
      }
    } finally {
      tokenManager.clearTokens();
      setUser(null);
    }
  }, [tokenManager]);

  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken) {
        await fetchUser();
      }
      
      setLoading(false);
    };

    initAuth();
  }, [fetchUser, tokenManager]);

  const contextValue: AuthContextType = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isGuest: user?.role === 'guest',
    isOwner: user?.role === 'owner',
    loading,
    login,
    logout,
    apiCall,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};