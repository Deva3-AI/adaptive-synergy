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
  drive_link?: string;
  progress_description?: string;
  attachments?: TaskAttachment[];
}

export interface TaskAttachment {
  attachment_id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  created_at: string;
  file_type: string;
  file_size: number;
}

export interface TaskTimeTracking {
  tracking_id: number;
  task_id: number;
  start_time: string;
  end_time?: string;
  duration?: number;
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

  // Task Time Tracking
  startTaskWork: async (taskId: number) => {
    try {
      const response = await apiClient.post(`/employee/tasks/${taskId}/start`);
      return response.data;
    } catch (error) {
      console.error('Start task work error:', error);
      throw error;
    }
  },
  
  stopTaskWork: async (taskId: number) => {
    try {
      const response = await apiClient.post(`/employee/tasks/${taskId}/stop`);
      return response.data;
    } catch (error) {
      console.error('Stop task work error:', error);
      throw error;
    }
  },
  
  getActiveTask: async () => {
    try {
      const response = await apiClient.get('/employee/tasks/active');
      return response.data;
    } catch (error) {
      console.error('Get active task error:', error);
      return null;
    }
  },
  
  getTaskTimeEntries: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/employee/tasks/${taskId}/time-entries`);
      return response.data;
    } catch (error) {
      console.error('Get task time entries error:', error);
      throw error;
    }
  },
  
  uploadTaskScreenshot: async (taskId: number, file: File, description?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (description) {
        formData.append('description', description);
      }
      
      const response = await apiClient.post(`/employee/tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload task screenshot error:', error);
      throw error;
    }
  },
  
  updateTaskProgress: async (taskId: number, progressData: { 
    progress_description: string;
    drive_link?: string;
  }) => {
    try {
      const response = await apiClient.put(`/employee/tasks/${taskId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error('Update task progress error:', error);
      throw error;
    }
  },
  
  getTaskAttachments: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/employee/tasks/${taskId}/attachments`);
      return response.data;
    } catch (error) {
      console.error('Get task attachments error:', error);
      throw error;
    }
  },
  
  analyzeTaskProgress: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/employee/tasks/${taskId}/analyze-progress`);
      return response.data;
    } catch (error) {
      console.error('Analyze task progress error:', error);
      return {
        analysis: "Unable to analyze task progress at this time.",
        suggestions: []
      };
    }
  }
};

export default taskService;
