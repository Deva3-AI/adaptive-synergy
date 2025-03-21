
import apiClient from '@/utils/apiUtils';
import { toast } from 'sonner';

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

const userService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      const response = await apiClient.post('/auth/token', formData, {
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
  
  register: async (userData: RegisterData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
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
    const response = await apiClient.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },
  
  resetPassword: async (email: string) => {
    const response = await apiClient.post('/auth/reset-password', { email });
    return response.data;
  },
  
  setNewPassword: async (token: string, password: string) => {
    const response = await apiClient.post('/auth/reset-password/confirm', {
      token,
      password,
    });
    return response.data;
  },
};

export default userService;
