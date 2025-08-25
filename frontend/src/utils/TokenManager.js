import axios from 'axios';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
// const BASE_URL = 'http://localhost:8000/api/v1';
const BASE_URL = 'http://15.164.211.115/api/v1';

class TokenManager {
  static instance = null;
  refreshing = false;
  refreshPromise = null;

  static getInstance() {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  saveTokens(access, refresh) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }

  clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  async refreshAccessToken() {
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

  async _doRefresh(refreshToken) {
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

  async makeAuthenticatedRequest(config) {
    const makeRequest = async (token) => {
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

    if (!accessToken) {
      accessToken = await this.refreshAccessToken();

      if (!accessToken) {
        throw new Error('No access token available and refresh failed');
      }
    }

    try {
      const response = await makeRequest(accessToken);
      return response.data;
    } catch (error) {
      if (error.response?.status !== 401) {
        throw error;
      }

      const newAccessToken = await this.refreshAccessToken();

      if (!newAccessToken) {
        this.clearTokens();
        throw new Error('Token refresh failed - login required');
      }

      try {
        const retryResponse = await makeRequest(newAccessToken);
        return retryResponse.data;
      } catch (retryError) {
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
