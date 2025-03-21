
import apiClient from '@/utils/apiUtils';

export interface Task {
  task_id: number;
  title: string;
  description?: string;
  client_id?: number;
  client_name?: string;
  assigned_to?: number;
  assignee_name?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
  priority?: 'low' | 'medium' | 'high';
}

const taskService = {
  // Tasks
  getTasks: async (status?: string) => {
    try {
      let url = '/employee/tasks';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },
  
  getTaskDetails: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/employee/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Get task details error:', error);
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId: number, status: string) => {
    try {
      const response = await apiClient.put(`/employee/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  },
  
  createTask: async (taskData: any) => {
    try {
      const response = await apiClient.post('/client/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
};

export default taskService;
