
import axios from 'axios';
import { toast } from 'sonner';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      const currentPath = window.location.pathname;
      if (!['/login', '/signup', '/'].includes(currentPath)) {
        toast.error('Your session has expired. Please log in again.');
        window.location.href = '/login';
      }
    }
    
    // Handle server errors
    if (error.response && error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    // Handle network errors
    if (!error.response && error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
