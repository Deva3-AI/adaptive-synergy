
import apiClient from '@/utils/apiUtils';

const userService = {
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  
  getUserProfile: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return null;
    }
  },
  
  updateUserProfile: async (userId: number, profileData: any) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },
  
  getUserSettings: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}/settings`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching settings for user ${userId}:`, error);
      return {};
    }
  },
  
  updateUserSettings: async (userId: number, settings: any) => {
    try {
      const response = await apiClient.put(`/users/${userId}/settings`, settings);
      return response.data;
    } catch (error) {
      console.error(`Error updating settings for user ${userId}:`, error);
      throw error;
    }
  }
};

export default userService;
