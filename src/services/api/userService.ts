
import axios from 'axios';
import config from '@/config/config';
import { mockUserData } from '@/utils/mockData';

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.apiUrl,
});

const userService = {
  // Get user profile
  getUserProfile: async (userId: number) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/users/${userId}`);
      // return response.data;
      
      // For now, use mock data
      return mockUserData.users.find(user => user.id === userId) || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateUserProfile: async (userId: number, profileData: any) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.put(`/users/${userId}`, profileData);
      // return response.data;
      
      // For now, return mock success
      const user = mockUserData.users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      
      // Check if user has roles array and role_name property
      const userRoles = user.roles ? user.roles.map(r => r.role_name) : [];
      
      return {
        ...user,
        ...profileData,
        roles: userRoles
      };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Delete user
  deleteUser: async (userId: number) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.delete(`/users/${userId}`);
      // return response.data;
      
      // For now, return mock success
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  // Get user tasks
  getUserTasks: async (userId: number, status?: string) => {
    try {
      // In a real app, this would be an API call
      // let url = `/users/${userId}/tasks`;
      // if (status) url += `?status=${status}`;
      // const response = await api.get(url);
      // return response.data;
      
      // For now, use mock data
      let tasks = mockUserData.tasks.filter(task => task.assigned_to === userId);
      if (status) {
        tasks = tasks.filter(task => task.status === status);
      }
      return tasks;
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  },
  
  // Get user attendance
  getUserAttendance: async (userId: number, startDate?: string, endDate?: string) => {
    try {
      // In a real app, this would be an API call
      // let url = `/users/${userId}/attendance`;
      // const params = new URLSearchParams();
      // if (startDate) params.append('start_date', startDate);
      // if (endDate) params.append('end_date', endDate);
      // if (params.toString()) url += `?${params.toString()}`;
      // const response = await api.get(url);
      // return response.data;
      
      // For now, use mock data
      let attendance = mockUserData.attendance.filter(record => record.user_id === userId);
      if (startDate) {
        attendance = attendance.filter(record => new Date(record.work_date) >= new Date(startDate));
      }
      if (endDate) {
        attendance = attendance.filter(record => new Date(record.work_date) <= new Date(endDate));
      }
      return attendance;
    } catch (error) {
      console.error('Error fetching user attendance:', error);
      throw error;
    }
  },
  
  // Get user performance
  getUserPerformance: async (userId: number) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/users/${userId}/performance`);
      // return response.data;
      
      // For now, use mock data
      return mockUserData.performance.find(perf => perf.user_id === userId) || {
        user_id: userId,
        task_completion_rate: 85,
        quality_score: 92,
        efficiency_score: 88,
        responsiveness: 90,
        overall_score: 89,
        comparison_to_avg: 5, // 5% above average
        trends: [
          { period: 'Jan', score: 82 },
          { period: 'Feb', score: 84 },
          { period: 'Mar', score: 87 },
          { period: 'Apr', score: 89 },
        ],
      };
    } catch (error) {
      console.error('Error fetching user performance:', error);
      throw error;
    }
  },
  
  // Get user leave balances
  getUserLeaveBalances: async (userId: number) => {
    try {
      // In a real app, this would be an API call
      // const response = await api.get(`/users/${userId}/leave-balances`);
      // return response.data;
      
      // For now, use mock data
      return mockUserData.leaveBalances.find(leave => leave.user_id === userId) || {
        user_id: userId,
        annual: 20,
        sick: 10,
        used_annual: 5,
        used_sick: 2,
        remaining_annual: 15,
        remaining_sick: 8,
      };
    } catch (error) {
      console.error('Error fetching user leave balances:', error);
      throw error;
    }
  },
  
  // Get dashboard data
  getDashboardData: async (userId: number) => {
    try {
      // In a real app, this would aggregate data from multiple endpoints
      
      // For now, return mock data
      const tasks = await userService.getUserTasks(userId);
      const performance = await userService.getUserPerformance(userId);
      
      // For client users, get client data
      const clientData = mockUserData.clients.filter(client => {
        const clientExists = mockUserData.users.find(u => u.id === userId && u.client_name === client.client_name);
        return !!clientExists;
      });
      
      return {
        tasks: {
          total: tasks.length,
          pending: tasks.filter((t: any) => t.status === 'pending').length,
          in_progress: tasks.filter((t: any) => t.status === 'in_progress').length,
          completed: tasks.filter((t: any) => t.status === 'completed').length,
          recent: tasks.slice(0, 5),
        },
        performance,
        clients: clientData,
        metrics: {
          task_completion_rate: performance.task_completion_rate,
          quality_score: performance.quality_score,
          efficiency_score: performance.efficiency_score,
        },
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },
};

export default userService;
