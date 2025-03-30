
import apiClient from '@/utils/apiUtils';

const userService = {
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  },
  
  updateUserProfile: async (userData: any) => {
    try {
      const response = await apiClient.put('/users/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },
  
  getNotifications: async () => {
    try {
      const response = await apiClient.get('/users/notifications');
      return response.data;
    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  },
  
  markNotificationAsRead: async (notificationId: number) => {
    try {
      const response = await apiClient.put(`/users/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },
  
  getUserPreferences: async () => {
    try {
      const response = await apiClient.get('/users/preferences');
      return response.data;
    } catch (error) {
      console.error('Get user preferences error:', error);
      return {};
    }
  },
  
  updateUserPreferences: async (preferences: any) => {
    try {
      const response = await apiClient.put('/users/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Update user preferences error:', error);
      throw error;
    }
  }
};

export default userService;
