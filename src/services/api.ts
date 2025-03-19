
import axios from 'axios';

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
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
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
    
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
};

// Employee services
export const employeeService = {
  // Attendance
  startWork: async () => {
    const response = await api.post('/employee/attendance/login');
    return response.data;
  },
  
  stopWork: async (attendanceId: number) => {
    const response = await api.post('/employee/attendance/logout', {
      attendance_id: attendanceId,
    });
    return response.data;
  },
  
  getTodayAttendance: async () => {
    const response = await api.get('/employee/attendance/today');
    return response.data;
  },
  
  getAttendanceHistory: async (startDate?: string, endDate?: string) => {
    let url = '/employee/attendance/history';
    const params = new URLSearchParams();
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },
  
  // Tasks
  getTasks: async (status?: string) => {
    let url = '/employee/tasks';
    if (status) {
      url += `?status=${status}`;
    }
    const response = await api.get(url);
    return response.data;
  },
  
  getTaskDetails: async (taskId: number) => {
    const response = await api.get(`/employee/tasks/${taskId}`);
    return response.data;
  },
  
  updateTaskStatus: async (taskId: number, status: string) => {
    const response = await api.put(`/employee/tasks/${taskId}/status`, { status });
    return response.data;
  },
};

// Client services
export const clientService = {
  getClients: async () => {
    const response = await api.get('/client/clients');
    return response.data;
  },
  
  getClientDetails: async (clientId: number) => {
    const response = await api.get(`/client/clients/${clientId}`);
    return response.data;
  },
  
  createClient: async (clientData: any) => {
    const response = await api.post('/client/clients', clientData);
    return response.data;
  },
  
  updateClient: async (clientId: number, clientData: any) => {
    const response = await api.put(`/client/clients/${clientId}`, clientData);
    return response.data;
  },
  
  // Tasks related to clients
  getClientTasks: async (clientId: number) => {
    const response = await api.get(`/client/clients/${clientId}/tasks`);
    return response.data;
  },
  
  createTask: async (taskData: any) => {
    const response = await api.post('/client/tasks', taskData);
    return response.data;
  },
};

// Export a default API object with all services
export default {
  auth: authService,
  employee: employeeService,
  client: clientService,
};
