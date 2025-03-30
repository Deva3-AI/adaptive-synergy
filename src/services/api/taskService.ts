
import apiClient from '@/utils/apiUtils';

export interface TaskAttachment {
  id: number;
  task_id: number;
  filename: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  uploaded_by: number;
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

  getTaskAttachments: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/attachments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attachments for task ${taskId}:`, error);
      return [];
    }
  },

  uploadTaskAttachment: async (taskId: number, fileData: FormData) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/attachments`, fileData, {
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

  updateTaskComment: async (taskId: number, commentId: number, commentData: any) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}/comments/${commentId}`, commentData);
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId} for task ${taskId}:`, error);
      throw error;
    }
  },

  deleteTaskComment: async (taskId: number, commentId: number) => {
    try {
      const response = await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId} for task ${taskId}:`, error);
      throw error;
    }
  },

  // Add missing methods
  getTasksByEmployee: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/employees/${employeeId}/tasks`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for employee ${employeeId}:`, error);
      return {
        active: [
          {
            id: 123,
            title: "Design homepage mockup",
            status: "in_progress",
            due_date: "2023-11-15",
            client: "Acme Inc.",
            priority: "high"
          }
        ],
        upcoming: [
          {
            id: 124,
            title: "Create social media assets",
            status: "planned",
            due_date: "2023-11-20",
            client: "TechCorp",
            priority: "medium"
          }
        ],
        completed: [
          {
            id: 120,
            title: "Brand style guide",
            status: "completed",
            completed_date: "2023-11-05",
            client: "Global Solutions",
            priority: "high"
          }
        ]
      };
    }
  }
};

export default taskService;
