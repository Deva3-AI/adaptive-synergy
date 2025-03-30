
import apiClient from '@/utils/apiUtils';

export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  uploaded_by: number;
  uploaded_at: string;
}

const taskService = {
  getTasks: async (filters?: any) => {
    try {
      const response = await apiClient.get('/tasks', { params: filters });
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

  getTasksByEmployee: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/employees/${employeeId}/tasks`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for employee ${employeeId}:`, error);
      return [];
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

  addTaskComment: async (taskId: number, commentData: any) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to task ${taskId}:`, error);
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
      console.error(`Error uploading attachment to task ${taskId}:`, error);
      throw error;
    }
  },

  deleteTaskAttachment: async (taskId: number, attachmentId: number) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting attachment ${attachmentId} from task ${taskId}:`, error);
      throw error;
    }
  },

  deleteTaskComment: async (taskId: number, commentId: number) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId} from task ${taskId}:`, error);
      throw error;
    }
  }
};

export default taskService;
