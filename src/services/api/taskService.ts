
import apiClient from '@/utils/apiUtils';

export interface TaskAttachment {
  id: number;
  taskId: number;
  filename: string;
  fileType: string;
  fileUrl: string;
  uploadedBy: number;
  uploadedAt: string;
}

const taskService = {
  getTasks: async (filter?: string) => {
    try {
      const url = filter ? `/tasks?filter=${filter}` : '/tasks';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      return [];
    }
  },
  
  getTaskDetails: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Get task details error:', error);
      return null;
    }
  },
  
  createTask: async (taskData: any) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
  
  updateTask: async (taskId: number, taskData: any) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },
  
  deleteTask: async (taskId: number) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },
  
  getTasksByClient: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Get tasks by client error:', error);
      return [];
    }
  },
  
  getTasksByEmployee: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/employees/${employeeId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Get tasks by employee error:', error);
      return [];
    }
  },
  
  getTaskAttachments: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/attachments`);
      return response.data as TaskAttachment[];
    } catch (error) {
      console.error('Get task attachments error:', error);
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
      console.error('Upload task attachment error:', error);
      throw error;
    }
  },
  
  deleteTaskAttachment: async (taskId: number, attachmentId: number) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
      return response.data;
    } catch (error) {
      console.error('Delete task attachment error:', error);
      throw error;
    }
  }
};

export default taskService;
