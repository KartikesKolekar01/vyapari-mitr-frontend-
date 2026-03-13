// API Base URL
export const API_BASE_URL = 'http://localhost:8080/api';

// Transaction Types
export const TRANSACTION_TYPES = {
  CREDIT: 'CREDIT',
  PAYMENT: 'PAYMENT'
};

// Transaction Type Names in Marathi
export const TRANSACTION_TYPE_NAMES = {
  [TRANSACTION_TYPES.CREDIT]: 'उधारी',
  [TRANSACTION_TYPES.PAYMENT]: 'पैसे भरले'
};

// Default page size for pagination
export const DEFAULT_PAGE_SIZE = 20;

// Validation constants
export const MOBILE_LENGTH = 10;
export const PIN_LENGTH = 4;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'dd/MM/yyyy HH:mm';

// Route paths
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  CUSTOMERS: '/customers',
  CUSTOMER_NEW: '/customers/new',
  CUSTOMER_EDIT: '/customers/edit',
  CUSTOMER_DETAIL: '/customers',
  TRANSACTIONS: '/transactions',
  TRANSACTION_CREDIT: '/transactions/credit',
  TRANSACTION_PAYMENT: '/transactions/payment',
  REPORTS: '/reports'
};

// Colors
export const COLORS = {
  PRIMARY: '#1E4A5F',
  SECONDARY: '#F9B234',
  SUCCESS: '#28A745',
  ERROR: '#DC3545',
  WARNING: '#FFC107',
  INFO: '#17A2B8',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#6C757D',
  LIGHT_GRAY: '#F8F9FA'
};

// Messages in Marathi
export const MESSAGES = {
  // Success messages
  LOGIN_SUCCESS: 'लॉगिन यशस्वी! 🚀',
  REGISTER_SUCCESS: 'नोंदणी यशस्वी! 🎉',
  CUSTOMER_ADDED: 'ग्राहक यशस्वीरित्या जोडला गेला! ✅',
  CUSTOMER_UPDATED: 'ग्राहक माहिती अद्यावत केली! ✏️',
  CUSTOMER_DELETED: 'ग्राहक हटवला गेला! 🗑️',
  CREDIT_ADDED: 'उधारी यशस्वीरित्या नोंदली! 📝',
  PAYMENT_ADDED: 'पैसे यशस्वीरित्या नोंदले! 💰',
  
  // Error messages
  ERROR_GENERIC: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
  ERROR_NETWORK: 'नेटवर्क त्रुटी. कृपया इंटरनेट कनेक्शन तपासा.',
  ERROR_UNAUTHORIZED: 'कृपया प्रथम लॉगिन करा! 🔑',
  ERROR_INVALID_PIN: 'चुकीचा पिन! 🔐',
  ERROR_INVALID_MOBILE: 'चुकीचा मोबाईल नंबर! 📱',
  
  // Confirm messages
  CONFIRM_DELETE: 'तुम्हाला खात्री आहे? ही क्रिया पूर्ववत होऊ शकत नाही.',
  CONFIRM_LOGOUT: 'तुम्हाला लॉगआउट करायचे आहे का?'
};