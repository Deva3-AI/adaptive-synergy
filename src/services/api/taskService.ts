
import { Task } from '@/interfaces/tasks';
import { supabase } from '@/integrations/supabase/client';

export interface TaskFilter {
  status?: string;
  assigned_to?: number;
  client_id?: number;
}

const taskService = {
  getTasks: async (filters?: TaskFilter): Promise<Task[]> => {
    try {
      let query = supabase.from('tasks').select(`
        task_id,
        title,
        description,
        client_id,
        assigned_to,
        status,
        estimated_time,
        actual_time,
        start_time,
        end_time,
        created_at,
        updated_at
      `);

      // Apply filters if provided
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }
      if (filters?.client_id) {
        query = query.eq('client_id', filters.client_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Task[];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getTaskById: async (taskId: number): Promise<Task> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          task_id,
          title,
          description,
          client_id,
          clients (client_name),
          assigned_to,
          users:assigned_to (name),
          status,
          estimated_time,
          actual_time,
          start_time,
          end_time,
          created_at,
          updated_at
        `)
        .eq('task_id', taskId)
        .single();

      if (error) throw error;
      return data as Task;
    } catch (error) {
      console.error('Error fetching task details:', error);
      throw error;
    }
  },

  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

      if (error) throw error;
      return data[0] as Task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  updateTask: async (taskId: number, taskData: Partial<Task>): Promise<Task> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('task_id', taskId)
        .select();

      if (error) throw error;
      return data[0] as Task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  deleteTask: async (taskId: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Task Comments
  getTaskComments: async (taskId: number): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          id,
          task_id,
          user_id,
          users (name),
          comment,
          created_at
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching task comments:', error);
      throw error;
    }
  },

  addTaskComment: async (commentData: { task_id: number; user_id: number; comment: string }): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .insert([commentData])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding task comment:', error);
      throw error;
    }
  }
};

export default taskService;
