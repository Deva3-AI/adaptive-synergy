
import axios from 'axios';
import { toast } from 'sonner';
import config from '@/config/config';
import hrService from './api/hrServiceSupabase';
import financeService from './api/financeService';
import marketingService from './api/marketingService';
import aiService from './api/aiService';
import userService from './api/userService';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: config.apiUrl,
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
    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect to login if not already there
      const currentPath = window.location.pathname;
      if (!['/login', '/signup', '/'].includes(currentPath)) {
        toast.error('Your session has expired. Please log in again.');
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      toast.error('Unable to connect to the server. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await api.post('/auth/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data.user_id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        }));
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error };
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error };
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },
  
  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },
  
  resetPassword: async (email: string) => {
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  },
  
  setNewPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password/confirm', {
      token,
      password,
    });
    return response.data;
  },
};

// Employee services
export const employeeService = {
  // Attendance
  startWork: async () => {
    try {
      const response = await api.post('/employee/attendance/login');
      return response.data;
    } catch (error) {
      console.error('Start work error:', error);
      throw error;
    }
  },
  
  stopWork: async (attendanceId: number) => {
    try {
      const response = await api.post('/employee/attendance/logout', {
        attendance_id: attendanceId,
      });
      return response.data;
    } catch (error) {
      console.error('Stop work error:', error);
      throw error;
    }
  },
  
  getTodayAttendance: async () => {
    try {
      const response = await api.get('/employee/attendance/today');
      return response.data;
    } catch (error) {
      console.error('Get attendance error:', error);
      // Return null instead of throwing to prevent UI errors
      return null;
    }
  },
  
  getAttendanceHistory: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/employee/attendance/history';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get attendance history error:', error);
      throw error;
    }
  },
  
  // Tasks
  getTasks: async (status?: string) => {
    try {
      let url = '/employee/tasks';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },
  
  getTaskDetails: async (taskId: number) => {
    try {
      const response = await api.get(`/employee/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Get task details error:', error);
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId: number, status: string) => {
    try {
      const response = await api.put(`/employee/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  },
};

// Client services
export const clientService = {
  getClients: async () => {
    try {
      const response = await api.get('/client/clients');
      return response.data;
    } catch (error) {
      console.error('Get clients error:', error);
      throw error;
    }
  },
  
  getClientDetails: async (clientId: number) => {
    try {
      const response = await api.get(`/client/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Get client details error:', error);
      throw error;
    }
  },
  
  createClient: async (clientData: any) => {
    try {
      const response = await api.post('/client/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Create client error:', error);
      throw error;
    }
  },
  
  updateClient: async (clientId: number, clientData: any) => {
    try {
      const response = await api.put(`/client/clients/${clientId}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Update client error:', error);
      throw error;
    }
  },
  
  // Tasks related to clients
  getClientTasks: async (clientId: number) => {
    try {
      const response = await api.get(`/client/clients/${clientId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Get client tasks error:', error);
      throw error;
    }
  },
  
  createTask: async (taskData: any) => {
    try {
      const response = await api.post('/client/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
};

// Export all our services
export { hrService, financeService, marketingService, aiService, userService };

// Export a default API object with all services
export default {
  auth: authService,
  employee: employeeService,
  client: clientService,
  hr: hrService,
  finance: financeService,
  marketing: marketingService,
  ai: aiService,
  user: userService,
};
