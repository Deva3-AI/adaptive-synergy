
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskAttachment, TaskComment, TaskStatistics } from './index';

// Get all tasks or filtered by status
export const getTasks = async (filters: { assignedTo?: number, clientId?: number, status?: string } = {}) => {
  try {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        clients (client_name),
        users:assigned_to (name)
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
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId: number) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        clients (client_name),
        users:assigned_to (name)
      `)
      .eq('task_id', taskId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData: Partial<Task>) => {
  try {
    // Format dates if they're Date objects
    if (taskData.created_at instanceof Date) {
      taskData.created_at = taskData.created_at.toISOString();
    }
    if (taskData.updated_at instanceof Date) {
      taskData.updated_at = taskData.updated_at.toISOString();
    }
    if (taskData.start_time instanceof Date) {
      taskData.start_time = taskData.start_time.toISOString();
    }
    if (taskData.end_time instanceof Date) {
      taskData.end_time = taskData.end_time.toISOString();
    }
    
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
};

// Update a task
export const updateTask = async (taskId: number, taskData: Partial<Task>) => {
  try {
    // Format dates if they're Date objects
    if (taskData.updated_at instanceof Date) {
      taskData.updated_at = taskData.updated_at.toISOString();
    }
    if (taskData.start_time instanceof Date) {
      taskData.start_time = taskData.start_time.toISOString();
    }
    if (taskData.end_time instanceof Date) {
      taskData.end_time = taskData.end_time.toISOString();
    }
    
    const { data, error } = await supabase
      .from('tasks')
      .update(taskData)
      .eq('task_id', taskId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Update a task's status
export const updateTaskStatus = async (taskId: number, status: string) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('task_id', taskId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId: number) => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('task_id', taskId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Start working on a task
export const startTask = async (taskId: number) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status: 'in_progress',
        start_time: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('task_id', taskId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error starting task:', error);
    throw error;
  }
};

// Complete a task
export const completeTask = async (taskId: number, actualTime: number) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        status: 'completed',
        end_time: new Date().toISOString(),
        actual_time: actualTime,
        updated_at: new Date().toISOString()
      })
      .eq('task_id', taskId)
      .select();
    
    if (error) throw error;
    
    return data[0];
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
};

// Get task attachments
export const getTaskAttachments = async (taskId: number) => {
  try {
    const { data, error } = await supabase
      .from('task_attachments')
      .select('*')
      .eq('task_id', taskId);
    
    if (error) throw error;
    
    return data as TaskAttachment[];
  } catch (error) {
    console.error('Error fetching task attachments:', error);
    throw error;
  }
};

// Add a task attachment
export const addTaskAttachment = async (attachment: Omit<TaskAttachment, 'id' | 'uploaded_at'>) => {
  try {
    const { data, error } = await supabase
      .from('task_attachments')
      .insert({
        ...attachment,
        uploaded_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    return data[0] as TaskAttachment;
  } catch (error) {
    console.error('Error adding task attachment:', error);
    throw error;
  }
};

// Get task comments
export const getTaskComments = async (taskId: number) => {
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
    
    return data as (TaskComment & { users: { name: string } })[];
  } catch (error) {
    console.error('Error fetching task comments:', error);
    throw error;
  }
};

// Add a task comment
export const addTaskComment = async (comment: Omit<TaskComment, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('task_comments')
      .insert({
        ...comment,
        created_at: new Date().toISOString()
      })
      .select();
    
    if (error) throw error;
    
    return data[0] as TaskComment;
  } catch (error) {
    console.error('Error adding task comment:', error);
    throw error;
  }
};

// Get task statistics for a user
export const getTaskStatistics = async (userId?: number) => {
  try {
    // Get all tasks for user if userId is provided, otherwise get all tasks
    let query = supabase.from('tasks').select('*');
    
    if (userId) {
      query = query.eq('assigned_to', userId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Calculate statistics
    const total = data.length;
    const completed = data.filter(t => t.status === 'completed').length;
    const inProgress = data.filter(t => t.status === 'in_progress').length;
    const pending = data.filter(t => t.status === 'pending').length;
    const cancelled = data.filter(t => t.status === 'cancelled').length;
    
    // Calculate average completion time from completed tasks
    const completedTasks = data.filter(t => t.status === 'completed' && t.start_time && t.end_time);
    const avgCompletionTime = completedTasks.length > 0
      ? completedTasks.reduce((sum, task) => {
          const startTime = new Date(task.start_time!).getTime();
          const endTime = new Date(task.end_time!).getTime();
          return sum + (endTime - startTime) / (1000 * 60 * 60); // Convert to hours
        }, 0) / completedTasks.length
      : 0;
    
    return {
      total,
      completed,
      in_progress: inProgress,
      pending,
      cancelled,
      avg_completion_time: avgCompletionTime,
      completion_rate: total > 0 ? (completed / total) * 100 : 0
    } as TaskStatistics;
  } catch (error) {
    console.error('Error getting task statistics:', error);
    throw error;
  }
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  startTask,
  completeTask,
  getTaskAttachments,
  addTaskAttachment,
  getTaskComments,
  addTaskComment,
  getTaskStatistics
};
