
import api from '../api';
import { mockUserData } from '@/utils/mockData';

const userService = {
  getUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      return mockUserData.users;
    }
  },
  
  getUserById: async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      const user = mockUserData.users.find(u => u.id === userId);
      return user || null;
    }
  },
  
  updateUser: async (userId: number, userData: any) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },
  
  deleteUser: async (userId: number) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  },
  
  getUserRoles: async () => {
    try {
      const response = await api.get('/users/roles');
      return response.data;
    } catch (error) {
      console.error('Get user roles error:', error);
      return mockUserData.roles;
    }
  },
  
  getUserPermissions: async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      console.error('Get user permissions error:', error);
      return mockUserData.permissions;
    }
  },
  
  getUserActivity: async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}/activity`);
      return response.data;
    } catch (error) {
      console.error('Get user activity error:', error);
      return mockUserData.activity;
    }
  },
  
  getUserTasks: async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Get user tasks error:', error);
      return mockUserData.tasks;
    }
  },
  
  getDashboardData: async (userId?: number) => {
    try {
      let url = '/users/dashboard';
      if (userId) {
        url += `?user_id=${userId}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Get dashboard data error:', error);
      return mockUserData.dashboardData;
    }
  }
};

export default userService;
