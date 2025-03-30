
import { apiRequest } from "@/utils/apiUtils";
import { mockUserTasks, mockTaskStatistics, mockTaskAttachments } from "@/utils/mockData";
import { supabase } from '@/integrations/supabase/client';

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

// Type for task statistics
export interface TaskStatistics {
  completed_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  avg_completion_time: number;
  on_time_completion: number;
  average_task_duration: number;
  monthly_trends: Array<{
    month: string;
    completed: number;
    assigned: number;
  }>;
  task_distribution: Array<{
    category: string;
    count: number;
  }>;
  recent_completions: Array<{
    task_id: number;
    title: string;
    completed_on: string;
    duration: number;
  }>;
}

const taskService = {
  // Get all tasks or filter by criteria
  getTasks: async (filters?: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, clients(client_name), users:assigned_to(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return apiRequest('/tasks', 'get', undefined, []);
    }
  },

  // Get a specific task by ID
  getTaskById: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients(client_name),
          users:assigned_to(name)
        `)
        .eq('task_id', taskId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching task details:', error);
      return apiRequest(`/tasks/${taskId}`, 'get', undefined, {});
    }
  },

  // Get tasks assigned to a specific user
  getUserTasks: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients(client_name)
        `)
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      return apiRequest(`/tasks/user/${userId}`, 'get', undefined, mockUserTasks);
    }
  },

  // Create a new task
  createTask: async (taskData: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating task:', error);
      return apiRequest('/tasks', 'post', taskData, {});
    }
  },

  // Update an existing task
  updateTask: async (taskId: number, taskData: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('task_id', taskId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating task:', error);
      return apiRequest(`/tasks/${taskId}`, 'put', taskData, {});
    }
  },

  // Delete a task
  deleteTask: async (taskId: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', taskId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return apiRequest(`/tasks/${taskId}`, 'delete', undefined, {});
    }
  },

  // Get task attachments
  getTaskAttachments: async (taskId: number) => {
    try {
      // In a real implementation, this would fetch from a task_attachments table
      // For now, we'll use mock data
      return mockTaskAttachments;
    } catch (error) {
      console.error('Error fetching task attachments:', error);
      return apiRequest(`/tasks/${taskId}/attachments`, 'get', undefined, mockTaskAttachments);
    }
  },

  // Upload task attachment
  uploadTaskAttachment: async (taskId: number, file: File, description?: string) => {
    try {
      // In a real implementation, this would upload to storage and then save metadata
      // For now, we'll simulate a success response
      const mockResponse = {
        id: Math.floor(Math.random() * 1000),
        task_id: taskId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: 1, // Hard-coded user ID
        upload_date: new Date().toISOString(),
        url: URL.createObjectURL(file),
        description: description
      };
      
      return mockResponse;
    } catch (error) {
      console.error('Error uploading task attachment:', error);
      
      const formData = new FormData();
      formData.append('file', file);
      if (description) {
        formData.append('description', description);
      }
      
      return apiRequest(`/tasks/${taskId}/attachments`, 'post', formData, {});
    }
  },

  // Get task statistics
  getTaskStatistics: async (userId?: number, timeRange?: string) => {
    try {
      // In a real implementation, this would be an aggregation query
      // For now, we'll use mock data
      return mockTaskStatistics;
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      const url = userId 
        ? `/tasks/statistics?userId=${userId}${timeRange ? `&timeRange=${timeRange}` : ''}`
        : '/tasks/statistics';
      
      return apiRequest(url, 'get', undefined, mockTaskStatistics);
    }
  }
};

export default taskService;
