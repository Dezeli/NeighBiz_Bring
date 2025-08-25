import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import TokenManager from '../utils/TokenManager';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const tokenManager = TokenManager.getInstance();

  const fetchUser = useCallback(async () => {
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
    } catch (error) {
      if (error.message.includes('login required')) {
        setUser(null);
      }
    }
  }, [tokenManager]);

  const apiCall = useCallback(async (config) => {
    try {
      return await tokenManager.makeAuthenticatedRequest(config);
    } catch (error) {
      if (error.message.includes('login required')) {
        setUser(null);
      }
      throw error;
    }
  }, [tokenManager]);

  const login = useCallback(async (access, refresh) => {
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
          // 로그아웃 실패 무시
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

  const contextValue = {
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
