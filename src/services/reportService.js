import api from './api';

const reportService = {
  // Get daily report
  getDailyReport: async (date = null) => {
    try {
      let url = '/reports/daily';
      if (date) {
        url += `?date=${date}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get monthly report
  getMonthlyReport: async (year, month) => {
    try {
      const response = await api.get(`/reports/monthly?year=${year}&month=${month}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get yearly report
  getYearlyReport: async (year) => {
    try {
      const response = await api.get(`/reports/yearly?year=${year}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending report
  getPendingReport: async () => {
    try {
      const response = await api.get('/reports/pending');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer report
  getCustomerReport: async (customerId) => {
    try {
      const response = await api.get(`/reports/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reportService;
