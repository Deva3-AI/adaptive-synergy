
import apiClient from '@/utils/apiUtils';

export interface Task {
  id: number;
  task_id?: number;
  title: string;
  description: string;
  client_id?: number;
  client_name?: string;
  assigned_to?: number;
  assignee_name?: string;
  status: string;
  priority: string;
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at?: string;
  progress?: number;
  progress_description?: string;
  drive_link?: string;
  comments?: any[];
  attachments?: any[];
}

const taskService = {
  getTasks: async (status?: string, assignedTo?: number) => {
    try {
      let url = '/tasks';
      const params = new URLSearchParams();
      
      if (status) params.append('status', status);
      if (assignedTo) params.append('assigned_to', assignedTo.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
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
      // Return mock data for preview/development purpose
      return {
        id: taskId,
        title: "Sample Task",
        description: "This is a sample task description.",
        client: "Sample Client",
        assignedTo: "John Doe",
        priority: "medium",
        status: "in_progress",
        progress: 50,
        estimatedHours: 10,
        actualHours: 5,
        comments: []
      };
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
  
  updateTaskStatus: async (taskId: number, status: string) => {
    try {
      const response = await apiClient.put(`/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  },
  
  addTaskComment: async (taskId: number, comment: string) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/comments`, { comment });
      return response.data;
    } catch (error) {
      console.error('Add task comment error:', error);
      throw error;
    }
  },
  
  startTaskWork: async (taskId: number) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/start`);
      return response.data;
    } catch (error) {
      console.error('Start task work error:', error);
      throw error;
    }
  },
  
  stopTaskWork: async (taskId: number) => {
    try {
      const response = await apiClient.post(`/tasks/${taskId}/stop`);
      return response.data;
    } catch (error) {
      console.error('Stop task work error:', error);
      throw error;
    }
  },
  
  getTaskTimeEntries: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/time-entries`);
      return response.data;
    } catch (error) {
      console.error('Get task time entries error:', error);
      return [];
    }
  },
  
  getActiveTask: async () => {
    try {
      const response = await apiClient.get('/tasks/active');
      return response.data;
    } catch (error) {
      console.error('Get active task error:', error);
      return null;
    }
  },
  
  getTaskAttachments: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/tasks/${taskId}/attachments`);
      return response.data;
    } catch (error) {
      console.error('Get task attachments error:', error);
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
      console.error('Upload task attachment error:', error);
      throw error;
    }
  },
  
  updateTaskProgress: async (taskId: number, progress: number, notes?: string) => {
    try {
      const data: any = { progress };
      if (notes) {
        data.notes = notes;
      }
      const response = await apiClient.put(`/tasks/${taskId}/progress`, data);
      return response.data;
    } catch (error) {
      console.error('Update task progress error:', error);
      throw error;
    }
  }
};

export default taskService;
