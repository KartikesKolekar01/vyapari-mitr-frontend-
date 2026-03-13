import api from './api';

const transactionService = {
  // Add credit
  addCredit: async (transactionData) => {
    try {
      const response = await api.post('/transactions/credit', transactionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add payment
  addPayment: async (transactionData) => {
    try {
      const response = await api.post('/transactions/payment', transactionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer transactions
  getCustomerTransactions: async (customerId) => {
    try {
      const response = await api.get(`/transactions/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get today's transactions
  getTodayTransactions: async () => {
    try {
      const response = await api.get('/transactions/today');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending payments
  getPendingPayments: async () => {
    try {
      const response = await api.get('/transactions/pending');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get transactions between dates
  getTransactionsBetweenDates: async (start, end) => {
    try {
      const response = await api.get(`/transactions/between?start=${start}&end=${end}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default transactionService;