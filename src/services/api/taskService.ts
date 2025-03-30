
import { apiRequest } from "@/utils/apiUtils";
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

// Mock data for task statistics
const mockTaskStatistics: TaskStatistics = {
  completed_tasks: 124,
  pending_tasks: 45,
  in_progress_tasks: 38,
  overdue_tasks: 12,
  completion_rate: 68.5,
  avg_completion_time: 3.2,
  on_time_completion: 78.5,
  average_task_duration: 4.5,
  monthly_trends: [
    { month: "Jan", completed: 42, assigned: 65 },
    { month: "Feb", completed: 38, assigned: 52 },
    { month: "Mar", completed: 45, assigned: 58 },
    { month: "Apr", completed: 55, assigned: 72 },
    { month: "May", completed: 48, assigned: 65 },
    { month: "Jun", completed: 60, assigned: 78 }
  ],
  task_distribution: [
    { category: "Design", count: 45 },
    { category: "Development", count: 65 },
    { category: "Content", count: 28 },
    { category: "QA", count: 15 },
    { category: "Admin", count: 12 }
  ],
  recent_completions: [
    { task_id: 1, title: "Homepage Redesign", completed_on: "2023-06-10", duration: 5.2 },
    { task_id: 2, title: "Blog Integration", completed_on: "2023-06-08", duration: 3.5 },
    { task_id: 3, title: "Contact Form Styling", completed_on: "2023-06-05", duration: 1.0 },
    { task_id: 4, title: "Mobile Navigation Fix", completed_on: "2023-06-02", duration: 2.8 },
    { task_id: 5, title: "SEO Optimization", completed_on: "2023-05-28", duration: 6.5 }
  ]
};

// Mock data for task attachments
const mockTaskAttachments: TaskAttachment[] = [
  {
    id: 1,
    task_id: 1,
    file_name: "design_mockup.png",
    file_type: "image/png",
    file_size: 2500000,
    uploaded_by: 1,
    upload_date: "2023-05-15T10:30:00Z",
    url: "https://example.com/uploads/design_mockup.png",
    description: "Homepage design mockup v1"
  },
  {
    id: 2,
    task_id: 1,
    file_name: "requirements.pdf",
    file_type: "application/pdf",
    file_size: 1200000,
    uploaded_by: 2,
    upload_date: "2023-05-14T14:45:00Z",
    url: "https://example.com/uploads/requirements.pdf",
    description: "Project requirements document"
  },
  {
    id: 3,
    task_id: 2,
    file_name: "api_documentation.docx",
    file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    file_size: 850000,
    uploaded_by: 3,
    upload_date: "2023-05-20T09:15:00Z",
    url: "https://example.com/uploads/api_documentation.docx",
    description: "API documentation for integration"
  }
];

// Mock data for user tasks
const mockUserTasks = [
  {
    task_id: 1,
    title: "Homepage redesign for Client A",
    description: "Redesign the homepage based on the approved mockups",
    status: "in_progress",
    client_id: 1,
    assigned_to: 1,
    due_date: "2023-12-15",
    priority: "high",
    client: { client_name: "Client A" }
  },
  {
    task_id: 2,
    title: "Implement contact form for Client B",
    description: "Create a custom contact form with validation and email notification",
    status: "pending",
    client_id: 2,
    assigned_to: 1,
    due_date: "2023-12-20",
    priority: "medium",
    client: { client_name: "Client B" }
  },
  {
    task_id: 3,
    title: "SEO optimization for Client A website",
    description: "Implement SEO recommendations from the audit report",
    status: "completed",
    client_id: 1,
    assigned_to: 1,
    due_date: "2023-11-30",
    completed_date: "2023-11-28",
    priority: "high",
    client: { client_name: "Client A" }
  }
];

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
      return mockTaskAttachments.filter(attachment => attachment.task_id === taskId);
    } catch (error) {
      console.error('Error fetching task attachments:', error);
      return apiRequest(`/tasks/${taskId}/attachments`, 'get', undefined, mockTaskAttachments.filter(attachment => attachment.task_id === taskId));
    }
  },

  // Upload task attachment
  uploadTaskAttachment: async (taskId: number, file: File, description?: string) => {
    try {
      // In a real implementation, this would upload to storage and then save metadata
      // For now, we'll simulate a success response
      const mockResponse: TaskAttachment = {
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
