import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // ✅ ही line add करा - JSESSIONID cookie साठी
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'सर्व्हर प्रतिसाद देत नाही. कृपया पुन्हा प्रयत्न करा.' });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('owner');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 500) {
      console.error('Server Error Details:', error.response.data);
      return Promise.reject({ message: `सर्व्हर त्रुटी: ${error.response.data?.message || 'अज्ञात त्रुटी'}. कृपया नंतर प्रयत्न करा.` });
    }
    
    return Promise.reject(error.response?.data || { message: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.' });
  }
);

export default api;
