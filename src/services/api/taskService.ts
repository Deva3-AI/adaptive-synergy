
import { supabase } from '@/integrations/supabase/client';
import { Task } from './index';

/**
 * Service for task-related operations
 */
const taskService = {
  /**
   * Get all tasks with optional filters
   */
  getTasks: async (filters: { assignedTo?: number; clientId?: number; status?: string } = {}) => {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          clients (client_id, client_name),
          users (user_id, name, email)
        `);
        
      if (filters.assignedTo) {
        query = query.eq('assigned_to', filters.assignedTo);
      }
      
      if (filters.clientId) {
        query = query.eq('client_id', filters.clientId);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },
  
  /**
   * Get a specific task by ID
   */
  getTaskById: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_id, client_name),
          users (user_id, name, email),
          task_attachments (*),
          task_comments (*)
        `)
        .eq('task_id', taskId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new task
   */
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
      throw error;
    }
  },
  
  /**
   * Update a task
   */
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
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Update task status
   */
  updateTaskStatus: async (taskId: number, status: string) => {
    return taskService.updateTask(taskId, { status: status as any });
  },
  
  /**
   * Delete a task
   */
  deleteTask: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', taskId);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get task attachments
   */
  getTaskAttachments: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching attachments for task ${taskId}:`, error);
      return [];
    }
  },
  
  /**
   * Add task attachment
   */
  addTaskAttachment: async (attachmentData: any) => {
    try {
      const { data, error } = await supabase
        .from('task_attachments')
        .insert(attachmentData)
        .select();
        
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding task attachment:', error);
      throw error;
    }
  },
  
  /**
   * Get task comments
   */
  getTaskComments: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          users (name)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching comments for task ${taskId}:`, error);
      return [];
    }
  },
  
  /**
   * Add task comment
   */
  addTaskComment: async (commentData: any) => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .insert(commentData)
        .select();
        
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding task comment:', error);
      throw error;
    }
  },
  
  /**
   * Get task statistics
   */
  getTaskStatistics: async (userId?: number, clientId?: number, dateRange?: { start: string; end: string }) => {
    try {
      // Base query to get all tasks
      let query = supabase.from('tasks').select('*');
      
      // Apply filters
      if (userId) {
        query = query.eq('assigned_to', userId);
      }
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      if (dateRange) {
        query = query.gte('created_at', dateRange.start).lte('created_at', dateRange.end);
      }
      
      // Execute query
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Calculate statistics
      const total = data.length;
      const completed = data.filter(task => task.status === 'completed').length;
      const inProgress = data.filter(task => task.status === 'in_progress').length;
      const pending = data.filter(task => task.status === 'pending').length;
      const cancelled = data.filter(task => task.status === 'cancelled').length;
      
      // Calculate completion rate
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      
      // Calculate average completion time (for completed tasks with actual_time)
      const completedTasksWithTime = data.filter(task => 
        task.status === 'completed' && task.actual_time !== null && task.actual_time !== undefined
      );
      
      const avgCompletionTime = completedTasksWithTime.length > 0
        ? completedTasksWithTime.reduce((sum, task) => sum + (task.actual_time || 0), 0) / completedTasksWithTime.length
        : 0;
      
      return {
        total,
        completed,
        in_progress: inProgress,
        pending,
        cancelled,
        completion_rate: completionRate,
        avg_completion_time: avgCompletionTime
      };
    } catch (error) {
      console.error('Error getting task statistics:', error);
      return {
        total: 0,
        completed: 0,
        in_progress: 0,
        pending: 0,
        cancelled: 0,
        completion_rate: 0,
        avg_completion_time: 0
      };
    }
  }
};

export default taskService;
