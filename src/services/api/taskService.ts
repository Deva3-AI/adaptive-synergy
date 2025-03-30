
import apiClient from '@/utils/apiUtils';

export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  uploaded_by: number;
}

export interface Task {
  task_id: number;
  title: string;
  description?: string;
  client_id?: number;
  assigned_to?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
  progress?: number; // Add progress field
  priority?: 'High' | 'Medium' | 'Low'; // Add priority field
}

const taskService = {
  getTasks: async (filters?: any) => {
    try {
      let url = '/tasks';
      if (filters) {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value as string);
        });
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  getTaskById: async (taskId: number) => {
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

  getTaskAttachments: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/attachments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attachments for task ${taskId}:`, error);
      return [];
    }
  },

  uploadTaskAttachment: async (taskId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
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
      const response = await apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting attachment ${attachmentId} for task ${taskId}:`, error);
      throw error;
    }
  }
};

export default taskService;
