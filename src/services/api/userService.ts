
import apiClient from '@/utils/apiUtils';

const userService = {
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      // Return mock data for preview
      return {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'Employee',
        department: 'Development',
        avatar: null
      };
    }
  },
  
  getUserProfile: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },
  
  updateUserProfile: async (userData: any) => {
    try {
      const response = await apiClient.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },
  
  uploadAvatar: async (formData: FormData) => {
    try {
      const response = await apiClient.post('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw error;
    }
  },
  
  changePassword: async (data: { current_password: string; new_password: string }) => {
    try {
      const response = await apiClient.put('/users/me/password', data);
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },
  
  getUserNotifications: async () => {
    try {
      const response = await apiClient.get('/users/me/notifications');
      return response.data;
    } catch (error) {
      console.error('Get user notifications error:', error);
      return [];
    }
  },
  
  markNotificationAsRead: async (notificationId: number) => {
    try {
      const response = await apiClient.put(`/users/me/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },
  
  getUserTasks: async (status?: string) => {
    try {
      let url = '/users/me/tasks';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get user tasks error:', error);
      return [];
    }
  },
  
  getUserPerformance: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/users/me/performance?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get user performance error:', error);
      return {
        tasks_completed: 0,
        on_time_completion: 0,
        average_rating: 0,
        performance_trend: []
      };
    }
  }
};

export default userService;
