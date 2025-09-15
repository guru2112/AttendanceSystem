import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
});

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Logout failed' };
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/api/auth/check');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Auth check failed' };
    }
  }
};

export default authService;