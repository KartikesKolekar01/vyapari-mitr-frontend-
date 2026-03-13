import api from './api';

const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/customers', customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search customers
  searchCustomers: async (keyword) => {
    try {
      const response = await api.get(`/customers/search?keyword=${keyword}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customers with balance
  getCustomersWithBalance: async () => {
    try {
      const response = await api.get('/customers/balance');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customers by village
  getCustomersByVillage: async (village) => {
    try {
      const response = await api.get(`/customers/village/${village}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer count
  getCustomerCount: async () => {
    try {
      const response = await api.get('/customers/count');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default customerService;