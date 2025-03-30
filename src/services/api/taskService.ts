import { supabase } from '@/integrations/supabase/client';

export interface Task {
  task_id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at: string | Date;
  updated_at: string | Date;
  assigned_to?: number;
  client_id?: number;
  client_name?: string;
  due_date?: string;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
  description?: string;
}

export interface TaskStatistics {
  completed: number;
  inProgress: number;
  pending: number;
  cancelled: number;
  totalTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  tasksByDay: {
    date: string;
    count: number;
  }[];
  tasksByPriority: {
    priority: string;
    count: number;
  }[];
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  comment: string;
  created_at: string;
}

export interface TaskWithDetails extends Task {
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
  history?: {
    id: number;
    user: string;
    action: string;
    timestamp: string;
    details?: string;
  }[];
}

const taskService = {
  getTasks: async (filters: any = {}) => {
    try {
      let query = supabase.from('tasks').select(`
        task_id,
        title,
        description,
        status,
        estimated_time,
        actual_time,
        start_time,
        end_time,
        created_at,
        updated_at,
        assigned_to,
        client_id,
        clients (client_name)
      `);

      // Apply filters if any
      if (filters.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((task: any) => ({
        task_id: task.task_id,
        title: task.title,
        description: task.description,
        status: task.status,
        estimated_time: task.estimated_time,
        actual_time: task.actual_time,
        start_time: task.start_time,
        end_time: task.end_time,
        created_at: task.created_at,
        updated_at: task.updated_at,
        assigned_to: task.assigned_to,
        client_id: task.client_id,
        client_name: task.clients?.client_name,
        due_date: task.end_time // For compatibility with existing code
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  getTaskById: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          task_id,
          title,
          description,
          status,
          estimated_time,
          actual_time,
          start_time,
          end_time,
          created_at,
          updated_at,
          assigned_to,
          client_id,
          users:assigned_to (name),
          clients (client_name)
        `)
        .eq('task_id', taskId)
        .single();

      if (error) throw error;

      return {
        ...data,
        client_name: data.clients?.client_name,
        assignee_name: data.users?.name
      };
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      return null;
    }
  },

  createTask: async (taskData: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating task:', error);
      return apiClient.post('/tasks', taskData).then(res => res.data);
    }
  },

  updateTask: async (taskId: number, taskData: Partial<Task>) => {
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
      return apiClient.put(`/tasks/${taskId}`, taskData).then(res => res.data);
    }
  },

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
      // Use status parameter directly rather than passing it inside an object
      return apiClient.put(`/tasks/${taskId}/status`, { status });
    }
  },

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
      return apiClient.delete(`/tasks/${taskId}`).then(res => res.data);
    }
  },

  getTaskComments: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          id,
          comment,
          created_at,
          user_id,
          users:user_id (name)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map((comment: any) => ({
        id: comment.id,
        task_id: taskId,
        user_id: comment.user_id,
        user_name: comment.users?.name || 'Unknown User',
        comment: comment.comment,
        created_at: comment.created_at
      }));
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
      return apiClient.get(`/tasks/${taskId}/comments`).then(res => res.data);
    }
  },

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
      console.error('Error adding comment:', error);
      return apiClient.post(`/tasks/${taskId}/comments`, { userId, comment }).then(res => res.data);
    }
  },

  getTaskAttachments: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data as TaskAttachment[];
    } catch (error) {
      console.error(`Error fetching attachments for task ${taskId}:`, error);
      return apiClient.get(`/tasks/${taskId}/attachments`).then(res => res.data);
    }
  },

  uploadTaskAttachment: async (taskId: number, file: File, userId: number) => {
    try {
      // In a real application, we would upload the file to a storage service
      // like Supabase Storage or S3, then record the metadata in the database
      
      // For now, let's simulate a successful upload
      const filePath = `tasks/${taskId}/${file.name}`;
      const fileUrl = `https://example.com/storage/${filePath}`;
      
      const { data, error } = await supabase
        .from('task_attachments')
        .insert({
          task_id: taskId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          url: fileUrl,
          uploaded_by: userId.toString(),
          uploaded_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error uploading attachment:', error);
      
      // Simulate API fallback
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId.toString());
      
      return apiClient.post(`/tasks/${taskId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => res.data);
    }
  },

  getTaskStatistics: async (userId?: number) => {
    try {
      // In a real app, we would make a single query to get all statistics
      // For now, let's simulate statistics with dummy data
      
      const statistics: TaskStatistics = {
        completed: 12,
        inProgress: 5,
        pending: 8,
        cancelled: 2,
        totalTasks: 27,
        completionRate: 44.4, // (12/27) * 100
        averageCompletionTime: 3.5, // days
        tasksByDay: [
          { date: '2023-07-01', count: 3 },
          { date: '2023-07-02', count: 5 },
          { date: '2023-07-03', count: 2 },
          { date: '2023-07-04', count: 4 },
          { date: '2023-07-05', count: 6 },
          { date: '2023-07-06', count: 3 },
          { date: '2023-07-07', count: 4 }
        ],
        tasksByPriority: [
          { priority: 'High', count: 8 },
          { priority: 'Medium', count: 12 },
          { priority: 'Low', count: 7 }
        ]
      };
      
      return statistics;
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      return {
        completed: 0,
        inProgress: 0,
        pending: 0,
        cancelled: 0,
        totalTasks: 0,
        completionRate: 0,
        averageCompletionTime: 0,
        tasksByDay: [],
        tasksByPriority: []
      };
    }
  }
};

export default taskService;
