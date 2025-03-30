
import axios from 'axios';
import apiClient from '@/utils/apiUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const authService = {
  login: async (email: string, password: string) => {
    try {
      // For development, provide mock data if API is not available
      if (!API_URL || API_URL === 'http://localhost:8000/api') {
        console.log('Using mock login data for development');
        
        // Store mock user data - determine role based on email
        let role = 'employee';
        if (email.includes('admin')) {
          role = 'admin';
        } else if (email.includes('hr')) {
          role = 'hr';
        } else if (email.includes('finance')) {
          role = 'finance';
        } else if (email.includes('marketing')) {
          role = 'marketing';
        } else if (email.includes('client')) {
          role = 'client';
        }
        
        const mockUser = {
          id: 1,
          name: email.split('@')[0],
          email,
          role,
        };
        
        localStorage.setItem('token', 'mock-token-for-development');
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        console.log('Mock login successful:', mockUser);
        
        return {
          access_token: 'mock-token-for-development',
          user_id: 1,
          name: mockUser.name,
          email,
          role
        };
      }
      
      // If API URL is available, call the real API
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const data = response.data;
      
      // Store user data and token in local storage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
      }));
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password. Please try again.');
    }
  },
  
  register: async (name: string, email: string, password: string, role: string = 'employee') => {
    try {
      // For development, provide mock data if API is not available
      if (!API_URL || API_URL === 'http://localhost:8000/api') {
        console.log('Using mock registration for development');
        return {
          user_id: 2,
          name,
          email,
          role
        };
      }
      
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role
      });
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed. This email may already be in use.');
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: (): User | null => {
    try {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        return JSON.parse(userJson);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem('user');
    }
    return null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('user');
  },
  
  hasRole: (role: string | string[]): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  },
  
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh-token');
      
      const data = response.data;
      
      // Update token in local storage
      localStorage.setItem('token', data.access_token);
      
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      
      // If token refresh fails, log the user out
      authService.logout();
      throw error;
    }
  },
  
  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
  
  verifyEmail: async (token: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, { token });
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }
};

export default authService;
