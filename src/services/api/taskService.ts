
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  user_name?: string;
  comment: string;
  created_at: string;
}

export interface TaskStatistics {
  completed_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  overdue_tasks: number;
  completion_rate: number;
  avg_completion_time: number;
  on_time_completion: number;
  average_task_duration: number;
  monthly_trends: {
    month: string;
    completed: number;
    assigned: number;
  }[];
  task_distribution: {
    name: string;
    value: number;
  }[];
  recent_completions: {
    task_id: number;
    title: string;
    completed_on: string;
    duration: number;
  }[];
}

export interface TaskWithDetails {
  task_id: number;
  title: string;
  description: string;
  client_id: number;
  client_name?: string;
  assigned_to: number;
  assignee_name?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time: number;
  actual_time: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}

// Mock data for task statistics
const mockTaskStatistics: TaskStatistics = {
  completed_tasks: 87,
  pending_tasks: 24,
  in_progress_tasks: 31,
  overdue_tasks: 7,
  completion_rate: 68,
  avg_completion_time: 4.2,
  on_time_completion: 85,
  average_task_duration: 3.5,
  monthly_trends: [
    { month: 'Jan', completed: 12, assigned: 15 },
    { month: 'Feb', completed: 16, assigned: 20 },
    { month: 'Mar', completed: 14, assigned: 17 },
    { month: 'Apr', completed: 18, assigned: 22 },
    { month: 'May', completed: 21, assigned: 25 },
    { month: 'Jun', completed: 19, assigned: 20 }
  ],
  task_distribution: [
    { name: 'Design', value: 32 },
    { name: 'Development', value: 45 },
    { name: 'Content', value: 18 },
    { name: 'QA', value: 15 }
  ],
  recent_completions: [
    { task_id: 1, title: 'Website Redesign for Client X', completed_on: '2023-06-10', duration: 5 },
    { task_id: 2, title: 'Mobile App UI Updates', completed_on: '2023-06-08', duration: 3 },
    { task_id: 3, title: 'Logo Design for New Client', completed_on: '2023-06-05', duration: 2 },
    { task_id: 4, title: 'Social Media Graphics Pack', completed_on: '2023-06-03', duration: 4 },
    { task_id: 5, title: 'Email Newsletter Template', completed_on: '2023-06-01', duration: 1 }
  ]
};

const taskService = {
  // Get all tasks or filter by status
  getTasks: async (status?: string) => {
    try {
      let query = supabase.from('tasks').select(`
        *,
        clients (client_name),
        users (name)
      `);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data to match our interface
      const formattedData = data.map(task => ({
        ...task,
        client_name: task.clients?.client_name,
        assignee_name: task.users?.name
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return apiRequest('/tasks', 'get', undefined, []);
    }
  },
  
  // Get task by ID with all details
  getTaskDetails: async (taskId: number) => {
    try {
      // Get the task
      const { data: task, error: taskError } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users (name)
        `)
        .eq('task_id', taskId)
        .single();
      
      if (taskError) throw taskError;
      
      // Get task attachments
      // Use separate queries for attachments and comments as Supabase doesn't recognize these tables yet
      const attachments = await taskService.getTaskAttachments(taskId);
      const comments = await taskService.getTaskComments(taskId);
      
      // Format the data
      const formattedTask = {
        ...task,
        client_name: task.clients?.client_name,
        assignee_name: task.users?.name,
        attachments: attachments || [],
        comments: comments || []
      };
      
      return formattedTask;
    } catch (error) {
      console.error('Error fetching task details:', error);
      return apiRequest(`/tasks/${taskId}`, 'get', undefined, {});
    }
  },
  
  // Update task status
  updateTaskStatus: async (taskId: number, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const updateData: any = { status };
      
      // If changing to in_progress and no start_time, set it
      if (status === 'in_progress') {
        const { data: task } = await supabase
          .from('tasks')
          .select('start_time')
          .eq('task_id', taskId)
          .single();
        
        if (!task.start_time) {
          updateData.start_time = new Date().toISOString();
        }
      }
      
      // If completing task, set end_time
      if (status === 'completed') {
        updateData.end_time = new Date().toISOString();
        
        // Calculate actual time
        const { data: task } = await supabase
          .from('tasks')
          .select('start_time')
          .eq('task_id', taskId)
          .single();
        
        if (task.start_time) {
          const startTime = new Date(task.start_time);
          const endTime = new Date();
          const diffInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          updateData.actual_time = Math.round(diffInHours * 10) / 10; // Round to 1 decimal place
        }
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('task_id', taskId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating task status:', error);
      return apiRequest(`/tasks/${taskId}/status`, 'put', { status }, {});
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
  
  // Get task attachments
  getTaskAttachments: async (taskId: number) => {
    try {
      // Use apiRequest as fallback since Supabase doesn't have the table yet
      const { data, error } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching task attachments:', error);
      // Mock data as fallback
      return apiRequest(`/tasks/${taskId}/attachments`, 'get', undefined, []);
    }
  },
  
  // Get task comments
  getTaskComments: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          users (name)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data
      const formattedData = data.map(comment => ({
        ...comment,
        user_name: comment.users ? comment.users.name : 'Unknown User'
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching task comments:', error);
      return apiRequest(`/tasks/${taskId}/comments`, 'get', undefined, []);
    }
  },
  
  // Add attachment to a task
  addTaskAttachment: async (taskId: number, attachment: Omit<TaskAttachment, 'id' | 'task_id' | 'uploaded_at'>) => {
    try {
      const { data, error } = await supabase
        .from('task_attachments')
        .insert({
          task_id: taskId,
          ...attachment
        })
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding task attachment:', error);
      return apiRequest(`/tasks/${taskId}/attachments`, 'post', attachment, {});
    }
  },
  
  // Upload task attachment (handles file upload + attachment creation)
  uploadTaskAttachment: async (taskId: number, file: File, userId: number) => {
    try {
      // 1. Upload the file to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `tasks/${taskId}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // 2. Get the public URL
      const { data: urlData } = await supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);
      
      // 3. Create the task attachment record
      const attachmentData = {
        file_name: fileName,
        file_size: file.size,
        file_type: file.type,
        url: urlData.publicUrl,
        uploaded_by: userId.toString()
      };
      
      return await taskService.addTaskAttachment(taskId, attachmentData);
    } catch (error) {
      console.error('Error uploading task attachment:', error);
      // Mock response
      return {
        id: Date.now(),
        task_id: taskId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        url: URL.createObjectURL(file),
        uploaded_at: new Date().toISOString(),
        uploaded_by: userId.toString()
      };
    }
  },
  
  // Add comment to a task
  addTaskComment: async (taskId: number, userId: number, comment: string) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .insert({
          task_id: taskId,
          user_id: userId,
          comment
        })
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding task comment:', error);
      return apiRequest(`/tasks/${taskId}/comments`, 'post', { user_id: userId, comment }, {});
    }
  },
  
  // Get task statistics
  getTaskStatistics: async (userId?: number) => {
    try {
      if (userId) {
        // Get user-specific statistics
        // This would be a complex query in real implementation
        // For now, we'll return mock data
        return mockTaskStatistics;
      }
      
      // Get overall statistics
      return mockTaskStatistics;
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      return mockTaskStatistics;
    }
  },
  
  // Search tasks
  searchTasks: async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users (name)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data
      const formattedData = data.map(task => ({
        ...task,
        client_name: task.clients?.client_name,
        assignee_name: task.users?.name
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error searching tasks:', error);
      return [];
    }
  }
};

export default taskService;
