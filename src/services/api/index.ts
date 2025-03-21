
import axios from 'axios';
import userService from './userService';
import employeeService from './employeeService';
import clientService from './clientService';
import taskService from './taskService';
import financeService from './financeService';
import reportService from './reportService';
import aiService from './aiService';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Export a default API object with all services
export default {
  auth: userService,
  employee: employeeService,
  client: clientService,
  task: taskService,
  finance: financeService,
  report: reportService,
  ai: aiService,
  axios: api
};

// Re-export all services
export {
  userService,
  employeeService,
  clientService,
  taskService,
  financeService,
  reportService,
  aiService
};
