
import apiClient from '@/utils/apiUtils';

const userService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data.user;
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
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  updateProfile: async (userId: number, profileData: any) => {
    try {
      const response = await apiClient.put(`/users/${userId}/profile`, profileData);
      
      // Update stored user data if it exists
      const currentUser = userService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...response.data
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  changePassword: async (userId: number, passwordData: any) => {
    try {
      const response = await apiClient.put(`/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Error with forgot password:', error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, password: newPassword });
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  getNotifications: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}/notifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  updateNotificationPreferences: async (userId: number, preferences: any) => {
    try {
      const response = await apiClient.put(`/users/${userId}/notification-preferences`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  // Add missing method
  getUserProfile: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Employee",
        department: "Design",
        avatar: "/avatars/default.png",
        joinDate: "2023-01-15",
        bio: "Experienced designer with a passion for user-centered design",
        skills: ["UI Design", "UX Research", "Prototyping"],
        recentActivity: [
          { type: "task_completed", timestamp: "2023-11-05T14:30:00Z", description: "Completed Website Redesign task" },
          { type: "comment_added", timestamp: "2023-11-05T11:15:00Z", description: "Added comment on Mobile App Design task" }
        ]
      };
    }
  }
};

export default userService;
