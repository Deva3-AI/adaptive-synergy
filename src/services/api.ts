
import axios from 'axios';
import { toast } from 'sonner';
import config from '@/config/config';

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
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
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

// HR services
export const hrService = {
  getEmployeeAttendance: async (userId?: number, startDate?: string, endDate?: string) => {
    try {
      let url = '/hr/attendance';
      const params = new URLSearchParams();
      
      if (userId) params.append('user_id', userId.toString());
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get employee attendance error:', error);
      throw error;
    }
  },
  
  getPayroll: async (month?: string, year?: string) => {
    try {
      let url = '/hr/payroll';
      const params = new URLSearchParams();
      
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get payroll error:', error);
      throw error;
    }
  },
  
  getRecruitment: async () => {
    try {
      const response = await api.get('/hr/recruitment');
      return response.data;
    } catch (error) {
      console.error('Get recruitment error:', error);
      throw error;
    }
  },
  
  createJobPosting: async (jobData: any) => {
    try {
      const response = await api.post('/hr/recruitment', jobData);
      return response.data;
    } catch (error) {
      console.error('Create job posting error:', error);
      throw error;
    }
  },
};

// Finance services
export const financeService = {
  getInvoices: async (status?: string) => {
    try {
      let url = '/finance/invoices';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get invoices error:', error);
      throw error;
    }
  },
  
  getInvoiceDetails: async (invoiceId: number) => {
    try {
      const response = await api.get(`/finance/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      console.error('Get invoice details error:', error);
      throw error;
    }
  },
  
  createInvoice: async (invoiceData: any) => {
    try {
      const response = await api.post('/finance/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Create invoice error:', error);
      throw error;
    }
  },
  
  updateInvoiceStatus: async (invoiceId: number, status: string) => {
    try {
      const response = await api.put(`/finance/invoices/${invoiceId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update invoice status error:', error);
      throw error;
    }
  },
  
  getRevenueReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/revenue';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get revenue reports error:', error);
      throw error;
    }
  },
  
  getExpenseReports: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/finance/reports/expenses';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get expense reports error:', error);
      throw error;
    }
  },
};

// Marketing services
export const marketingService = {
  getCampaigns: async () => {
    try {
      const response = await api.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Get campaigns error:', error);
      throw error;
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const response = await api.post('/marketing/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Create campaign error:', error);
      throw error;
    }
  },
  
  getMeetings: async () => {
    try {
      const response = await api.get('/marketing/meetings');
      return response.data;
    } catch (error) {
      console.error('Get meetings error:', error);
      throw error;
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const response = await api.post('/marketing/meetings', meetingData);
      return response.data;
    } catch (error) {
      console.error('Create meeting error:', error);
      throw error;
    }
  },
  
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/marketing/analytics';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  },
};

// Export a default API object with all services
export default {
  auth: authService,
  employee: employeeService,
  client: clientService,
  hr: hrService,
  finance: financeService,
  marketing: marketingService,
};
