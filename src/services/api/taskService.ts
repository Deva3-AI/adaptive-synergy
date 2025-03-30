
import apiClient from '@/utils/apiUtils';

export interface TaskAttachment {
  id: number;
  task_id: number;
  filename: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: number;
  upload_date: string;
  description?: string;
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

  getUserTasks: async (userId: number) => {
    try {
      const response = await apiClient.get(`/tasks/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for user ${userId}:`, error);
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
      await apiClient.delete(`/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },

  getTaskAttachments: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/attachments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attachments for task ${taskId}:`, error);
      return [];
    }
  },

  uploadTaskAttachment: async (taskId: number, formData: FormData) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error uploading attachment for task ${taskId}:`, error);
      throw error;
    }
  },

  deleteTaskAttachment: async (taskId: number, attachmentId: number) => {
    try {
      await apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting attachment ${attachmentId}:`, error);
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
  }
};

export default taskService;
