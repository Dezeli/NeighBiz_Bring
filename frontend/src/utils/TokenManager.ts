import axios from 'axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const BASE_URL = 'http://localhost:8000/api/v1';

class TokenManager {
  private static instance: TokenManager;
  private refreshing = false;
  private refreshPromise: Promise<string | null> | null = null;

  static getInstance() {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  async refreshAccessToken(): Promise<string | null> {
    if (this.refreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    this.refreshing = true;
    this.refreshPromise = this._doRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshing = false;
      this.refreshPromise = null;
    }
  }

  private async _doRefresh(refreshToken: string): Promise<string | null> {
    try {
      const response = await axios.post(`${BASE_URL}/auth/refresh`, {
        refresh: refreshToken,
      });

      if (response.data?.success === true && response.data?.data?.access) {
        const newAccessToken = response.data.data.access;
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        return newAccessToken;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async makeAuthenticatedRequest<T = any>(config: any): Promise<T> {
    const makeRequest = async (token: string) => {
      return axios({
        ...config,
        baseURL: BASE_URL,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    };

    let accessToken = this.getAccessToken();
    
    // access token이 없으면 바로 갱신 시도
    if (!accessToken) {
      accessToken = await this.refreshAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available and refresh failed');
      }
    }

    try {
      const response = await makeRequest(accessToken);
      return response.data;
    } catch (error: any) {
      // 401 에러가 아니면 바로 throw
      if (error.response?.status !== 401) {
        throw error;
      }

      // 토큰 갱신 시도
      const newAccessToken = await this.refreshAccessToken();
      
      if (!newAccessToken) {
        this.clearTokens();
        throw new Error('Token refresh failed - login required');
      }

      // 새 토큰으로 재시도
      try {
        const retryResponse = await makeRequest(newAccessToken);
        return retryResponse.data;
      } catch (retryError: any) {
        if (retryError.response?.status === 401) {
          this.clearTokens();
          throw new Error('Authentication failed - login required');
        }
        throw retryError;
      }
    }
  }
}

export default TokenManager;