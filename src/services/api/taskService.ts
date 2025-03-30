
import apiClient from '@/utils/apiUtils';

export interface TaskAttachment {
  id: number;
  task_id: number;
  filename: string;
  file_path: string;
  file_type: string;
  uploaded_by: number;
  uploaded_at: string;
}

const taskService = {
  getTasks: async () => {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  getTaskDetails: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      return null;
    }
  },

  createTask: async (taskData: any) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (taskId: number, taskData: any) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },

  deleteTask: async (taskId: number) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },

  getTaskComments: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
      return [];
    }
  },

  addTaskComment: async (taskId: number, comment: string) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/comments`, { comment });
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to task ${taskId}:`, error);
      throw error;
    }
  },

  getTaskStatistics: async (timeframe?: string) => {
    try {
      let url = '/tasks/statistics';
      if (timeframe) {
        url += `?timeframe=${timeframe}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      return null;
    }
  },

  // Method for TaskRecommendations component
  getUserTasks: async (userId: number) => {
    try {
      const response = await apiClient.get(`/tasks/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for user ${userId}:`, error);
      return [];
    }
  }
};

export default taskService;
