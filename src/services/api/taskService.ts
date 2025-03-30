
import axios from 'axios';
import config from '@/config/config';
import { Task, TaskComment, TaskAttachment, TaskStatistics } from '@/interfaces/task';

const api = axios.create({
  baseURL: config.apiUrl,
});

const taskService = {
  // Get all tasks with optional filters
  getTasks: async (filters?: {
    status?: string;
    assigned_to?: number;
    client_id?: number;
  }): Promise<Task[]> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.assigned_to) queryParams.append('assigned_to', filters.assigned_to.toString());
      if (filters?.client_id) queryParams.append('client_id', filters.client_id.toString());
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api.get(`/tasks${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  // Get task by ID
  getTaskById: async (taskId: number): Promise<Task | null> => {
    try {
      const response = await api.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      return null;
    }
  },

  // Create a new task
  createTask: async (taskData: Partial<Task>): Promise<Task | null> => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId: number, taskData: Partial<Task>): Promise<Task | null> => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId: number): Promise<boolean> => {
    try {
      await api.delete(`/tasks/${taskId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },

  // Update task status
  updateTaskStatus: async (taskId: number, status: Task['status']): Promise<Task | null> => {
    try {
      const response = await api.patch(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${taskId} status:`, error);
      throw error;
    }
  },

  // Get task comments
  getTaskComments: async (taskId: number): Promise<TaskComment[]> => {
    try {
      const response = await api.get(`/tasks/${taskId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
      return [];
    }
  },

  // Add a comment to a task
  addTaskComment: async (taskId: number, comment: string): Promise<TaskComment | null> => {
    try {
      const response = await api.post(`/tasks/${taskId}/comments`, { comment });
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to task ${taskId}:`, error);
      throw error;
    }
  },

  // Get task attachments
  getTaskAttachments: async (taskId: number): Promise<TaskAttachment[]> => {
    try {
      const response = await api.get(`/tasks/${taskId}/attachments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attachments for task ${taskId}:`, error);
      return [];
    }
  },

  // Add an attachment to a task
  addTaskAttachment: async (taskId: number, file: File): Promise<TaskAttachment | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error adding attachment to task ${taskId}:`, error);
      throw error;
    }
  },

  // Delete an attachment from a task
  deleteTaskAttachment: async (taskId: number, attachmentId: number): Promise<boolean> => {
    try {
      await api.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting attachment ${attachmentId} from task ${taskId}:`, error);
      throw error;
    }
  },

  // Get task statistics
  getTaskStatistics: async (filters?: {
    assigned_to?: number;
    client_id?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<TaskStatistics | null> => {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.assigned_to) queryParams.append('assigned_to', filters.assigned_to.toString());
      if (filters?.client_id) queryParams.append('client_id', filters.client_id.toString());
      if (filters?.start_date) queryParams.append('start_date', filters.start_date);
      if (filters?.end_date) queryParams.append('end_date', filters.end_date);
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api.get(`/tasks/statistics${query}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      return null;
    }
  }
};

export default taskService;
