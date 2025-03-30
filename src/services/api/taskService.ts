
import { apiRequest } from "@/utils/apiUtils";
import { mockUserTasks, mockTaskStatistics, mockTaskAttachments } from "@/utils/mockData";

// Type for task attachments
export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  uploaded_by: number;
  upload_date: string;
  url: string;
  description?: string;
}

const taskService = {
  // Get all tasks or filter by criteria
  getTasks: async (filters?: any) => {
    return apiRequest('/tasks', 'get', undefined, []);
  },

  // Get a specific task by ID
  getTaskById: async (taskId: number) => {
    return apiRequest(`/tasks/${taskId}`, 'get', undefined, {});
  },

  // Get tasks assigned to a specific user
  getUserTasks: async (userId: number) => {
    return apiRequest(`/tasks/user/${userId}`, 'get', undefined, mockUserTasks);
  },

  // Create a new task
  createTask: async (taskData: any) => {
    return apiRequest('/tasks', 'post', taskData, {});
  },

  // Update an existing task
  updateTask: async (taskId: number, taskData: any) => {
    return apiRequest(`/tasks/${taskId}`, 'put', taskData, {});
  },

  // Delete a task
  deleteTask: async (taskId: number) => {
    return apiRequest(`/tasks/${taskId}`, 'delete', undefined, {});
  },

  // Get task attachments
  getTaskAttachments: async (taskId: number) => {
    return apiRequest(`/tasks/${taskId}/attachments`, 'get', undefined, mockTaskAttachments);
  },

  // Upload task attachment
  uploadTaskAttachment: async (taskId: number, file: File, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) {
      formData.append('description', description);
    }
    
    return apiRequest(`/tasks/${taskId}/attachments`, 'post', formData, {});
  },

  // Get task statistics
  getTaskStatistics: async (userId?: number, timeRange?: string) => {
    const url = userId 
      ? `/tasks/statistics?userId=${userId}${timeRange ? `&timeRange=${timeRange}` : ''}`
      : '/tasks/statistics';
    
    return apiRequest(url, 'get', undefined, mockTaskStatistics);
  }
};

export default taskService;
