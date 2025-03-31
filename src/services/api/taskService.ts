import { supabase } from '@/integrations/supabase/client';
import { Task, DetailedTask, TaskComment, TaskAttachment, TaskFilter } from '@/interfaces/tasks';
import { toast } from 'sonner';

/**
 * Service for managing tasks
 */
const taskService = {
  /**
   * Get all tasks
   */
  getTasks: async (filters?: TaskFilter) => {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users:assigned_to (name)
        `);
      
      if (filters) {
        if (filters.status) query = query.eq('status', filters.status);
        if (filters.priority) query = query.eq('priority', filters.priority);
        if (filters.assignedTo) query = query.eq('assigned_to', filters.assignedTo);
        if (filters.clientId) query = query.eq('client_id', filters.clientId);
        if (filters.search) query = query.ilike('title', `%${filters.search}%`);
        if (filters.startDate) query = query.gte('created_at', filters.startDate);
        if (filters.endDate) query = query.lte('created_at', filters.endDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform data to use proper structure
      const transformedTasks = data?.map(task => ({
        ...task,
        client: task.clients ? task.clients.client_name : 'Unknown',
        assignee_name: task.users ? task.users.name : 'Unassigned',
      })) || [];
      
      return transformedTasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      return [];
    }
  },

  /**
   * Get a task by ID
   * @param taskId - Task ID
   */
  getTaskById: async (taskId: number): Promise<Task | null> => {
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
      
      if (!data) return null;
      
      // Transform data to use proper structure
      const transformedTask = {
        ...data,
        client: data.clients ? data.clients.client_name : 'Unknown',
        assignee_name: data.users ? data.users.name : 'Unassigned',
      };
      
      return transformedTask;
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task details');
      return null;
    }
  },

  /**
   * Get detailed task by ID
   * @param taskId - Task ID
   */
  getDetailedTask: async (taskId: number): Promise<DetailedTask | null> => {
    try {
      // Fetch task data
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users:assigned_to (name)
        `)
        .eq('task_id', taskId)
        .single();
      
      if (taskError) throw taskError;
      
      if (!taskData) return null;
      
      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from('task_comments')
        .select(`
          *,
          users:user_id (name)
        `)
        .eq('task_id', taskId);
      
      if (commentsError) throw commentsError;
      
      // Fetch attachments
      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId);
      
      if (attachmentsError) throw attachmentsError;
      
      // Create detailed task object
      const detailedTask: DetailedTask = {
        id: taskData.task_id,
        task_id: taskData.task_id,
        title: taskData.title,
        description: taskData.description,
        client: taskData.clients ? taskData.clients.client_name : 'Unknown',
        priority: taskData.priority || 'medium',
        status: taskData.status,
        dueDate: taskData.end_time ? new Date(taskData.end_time) : undefined,
        startDate: taskData.start_time ? new Date(taskData.start_time) : undefined,
        progress: 0, // This needs to be calculated or stored somewhere
        estimatedHours: taskData.estimated_time || 0,
        actualHours: taskData.actual_time || 0,
        assignedTo: taskData.users ? taskData.users.name : 'Unassigned',
        comments: commentsData?.map(comment => ({
          id: comment.id,
          taskId: comment.task_id,
          userId: comment.user_id,
          userName: comment.users ? comment.users.name : 'Unknown User',
          comment: comment.comment,
          createdAt: comment.created_at
        })) || [],
        attachments: attachmentsData || [],
        tags: [],
        recentActivity: []
      };
      
      return detailedTask;
    } catch (error) {
      console.error('Error fetching detailed task:', error);
      toast.error('Failed to load task details');
      return null;
    }
  },

  /**
   * Create a new task
   * @param taskData - Task data
   */
  createTask: async (taskData: Partial<Task>): Promise<Task | null> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select(`
          *,
          clients (client_name),
          users:assigned_to (name)
        `)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Transform data to use proper structure
      const transformedTask = {
        ...data,
        client: data.clients ? data.clients.client_name : 'Unknown',
        assignee_name: data.users ? data.users.name : 'Unassigned',
      };
      
      toast.success('Task created successfully');
      return transformedTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      return null;
    }
  },

  /**
   * Update a task
   * @param taskId - Task ID
   * @param taskData - Updated task data
   */
  updateTask: async (taskId: number, taskData: Partial<Task>): Promise<Task | null> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('task_id', taskId)
        .select(`
          *,
          clients (client_name),
          users:assigned_to (name)
        `)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Transform data to use proper structure
      const transformedTask = {
        ...data,
        client: data.clients ? data.clients.client_name : 'Unknown',
        assignee_name: data.users ? data.users.name : 'Unassigned',
      };
      
      toast.success('Task updated successfully');
      return transformedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return null;
    }
  },

  /**
   * Delete a task
   * @param taskId - Task ID
   */
  deleteTask: async (taskId: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('task_id', taskId);
      
      if (error) throw error;
      
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  },

  /**
   * Update task status
   * @param taskId - Task ID
   * @param status - New status
   */
  updateTaskStatus: async (taskId: number, status: Task['status']): Promise<Task | null> => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('task_id', taskId)
        .select(`
          *,
          clients (client_name),
          users:assigned_to (name)
        `)
        .single();
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Transform data to use proper structure
      const transformedTask = {
        ...data,
        client: data.clients ? data.clients.client_name : 'Unknown',
        assignee_name: data.users ? data.users.name : 'Unassigned',
      };
      
      toast.success('Task status updated successfully');
      return transformedTask;
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
      return null;
    }
  },

  /**
   * Add a comment to a task
   * @param taskId - Task ID
   * @param userId - User ID
   * @param comment - Comment text
   */
  addTaskComment: async (commentData: any) => {
    try {
      // This would be an API call in a real application
      const response = {
        success: true,
        data: {
          id: Math.floor(Math.random() * 10000),
          task_id: commentData.task_id, // Use task_id instead of taskId
          user_id: commentData.user_id,
          comment: commentData.comment,
          created_at: new Date().toISOString()
        }
      };
      
      return response.data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  /**
   * Get tasks summary for dashboard
   * @param userId - User ID (optional)
   */
  getTasksSummary: async (userId?: number) => {
    try {
      // Get all tasks (optionally filtered by user)
      let query = supabase.from('tasks').select('*');
      
      if (userId) {
        query = query.eq('assigned_to', userId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data) return null;
      
      // Calculate task statistics
      const total = data.length;
      const pending = data.filter(task => task.status === 'pending').length;
      const inProgress = data.filter(task => task.status === 'in_progress').length;
      const completed = data.filter(task => task.status === 'completed').length;
      const cancelled = data.filter(task => task.status === 'cancelled').length;
      
      // Calculate overdue and due soon tasks
      const now = new Date();
      const overdueCount = data.filter(task => 
        task.status !== 'completed' && 
        task.status !== 'cancelled' && 
        task.end_time && 
        new Date(task.end_time) < now
      ).length;
      
      // Tasks due in the next 3 days
      const threeDaysLater = new Date();
      threeDaysLater.setDate(now.getDate() + 3);
      
      const dueSoonCount = data.filter(task => 
        task.status !== 'completed' && 
        task.status !== 'cancelled' && 
        task.end_time && 
        new Date(task.end_time) >= now && 
        new Date(task.end_time) <= threeDaysLater
      ).length;
      
      // Calculate completion rate
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        total,
        pending,
        inProgress,
        completed,
        cancelled,
        overdueCount,
        dueSoonCount,
        completionRate
      };
    } catch (error) {
      console.error('Error getting tasks summary:', error);
      return null;
    }
  }
};

export default taskService;
