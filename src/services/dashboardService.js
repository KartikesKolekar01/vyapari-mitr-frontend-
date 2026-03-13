import api from './api';

const dashboardService = {
  // Get dashboard home data
  getDashboardHome: async () => {
    try {
      const response = await api.get('/dashboard/home');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dashboardService;
