import api from './api';

const authService = {
  // Register new owner
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        // Generate simple token (in real app, JWT would come from backend)
        const token = btoa(JSON.stringify({ mobile: credentials.mobile, timestamp: Date.now() }));
        localStorage.setItem('token', token);
        localStorage.setItem('owner', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check if owner exists
  checkOwner: async () => {
    try {
      const response = await api.get('/auth/check-owner');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get owner details
  getOwnerDetails: async () => {
    try {
      const response = await api.get('/auth/owner-details');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('owner');
    window.location.href = '/login';
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('owner');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;