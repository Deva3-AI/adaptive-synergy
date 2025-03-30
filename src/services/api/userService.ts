
import apiClient from '@/utils/apiUtils';

const userService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: any) => {
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
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  updateProfile: async (userId: number, profileData: any) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, profileData);
      
      if (response.data) {
        // Update the stored user data
        const currentUser = userService.getCurrentUser();
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify({
            ...currentUser,
            ...response.data
          }));
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  changePassword: async (userId: number, currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.post(`/users/${userId}/change-password`, {
        current_password: currentPassword,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
  
  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        new_password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  
  verifyEmail: async (token: string) => {
    try {
      const response = await apiClient.post('/auth/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },
  
  getUserSettings: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}/settings`);
      return response.data;
    } catch (error) {
      console.error('Get user settings error:', error);
      return null;
    }
  },
  
  updateUserSettings: async (userId: number, settings: any) => {
    try {
      const response = await apiClient.put(`/users/${userId}/settings`, settings);
      return response.data;
    } catch (error) {
      console.error('Update user settings error:', error);
      throw error;
    }
  },
  
  getNotificationPreferences: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}/notification-preferences`);
      return response.data;
    } catch (error) {
      console.error('Get notification preferences error:', error);
      return null;
    }
  },
  
  updateNotificationPreferences: async (userId: number, preferences: any) => {
    try {
      const response = await apiClient.put(`/users/${userId}/notification-preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Update notification preferences error:', error);
      throw error;
    }
  }
};

export default userService;
