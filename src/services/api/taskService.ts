
import { Task, DetailedTask, TaskComment, TaskAttachment } from '@/interfaces/tasks';
import { supabase } from '@/integrations/supabase/client';

export interface TaskFilter {
  status?: string;
  assigned_to?: number;
  client_id?: number;
  priority?: string;
  search?: string;
  start_date?: string;
  end_date?: string;
}

const taskService = {
  getTasks: async (filters?: TaskFilter): Promise<Task[]> => {
    try {
      let query = supabase.from('tasks').select(`
        task_id,
        title,
        description,
        client_id,
        clients (client_name),
        assigned_to,
        users:assigned_to (name),
        status,
        priority,
        estimated_time,
        actual_time,
        start_time,
        end_time,
        due_date,
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
      if (filters?.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.start_date) {
        query = query.gte('created_at', filters.start_date);
      }
      if (filters?.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform data to match Task interface
      return data.map(item => ({
        task_id: item.task_id,
        title: item.title,
        description: item.description,
        client_id: item.client_id,
        client_name: item.clients?.client_name,
        assigned_to: item.assigned_to,
        assignee_name: item.users?.name,
        status: item.status,
        priority: item.priority || 'medium',
        estimated_time: item.estimated_time,
        actual_time: item.actual_time,
        start_time: item.start_time,
        end_time: item.end_time,
        due_date: item.due_date,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
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
          priority,
          estimated_time,
          actual_time,
          start_time,
          end_time,
          due_date,
          created_at,
          updated_at
        `)
        .eq('task_id', taskId)
        .single();

      if (error) throw error;
      
      return {
        task_id: data.task_id,
        title: data.title,
        description: data.description,
        client_id: data.client_id,
        client_name: data.clients?.client_name,
        assigned_to: data.assigned_to,
        assignee_name: data.users?.name,
        status: data.status,
        priority: data.priority || 'medium',
        estimated_time: data.estimated_time,
        actual_time: data.actual_time,
        start_time: data.start_time,
        end_time: data.end_time,
        due_date: data.due_date,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching task details:', error);
      throw error;
    }
  },

  getTaskDetails: async (taskId: number): Promise<DetailedTask> => {
    try {
      // Get task data
      const taskData = await taskService.getTaskById(taskId);
      
      // Get task comments
      const { data: commentsData, error: commentsError } = await supabase
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
        
      if (commentsError) throw commentsError;
      
      // Get task attachments
      const { data: attachmentsData, error: attachmentsError } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('uploaded_at', { ascending: false });
        
      if (attachmentsError) throw attachmentsError;
      
      // Format comments
      const comments: TaskComment[] = commentsData.map(comment => ({
        id: comment.id,
        taskId: comment.task_id,
        userId: comment.user_id,
        userName: comment.users?.name || 'Unknown User',
        comment: comment.comment,
        createdAt: comment.created_at
      }));
      
      // Format attachments
      const attachments: TaskAttachment[] = attachmentsData.map(attachment => ({
        id: attachment.id,
        taskId: attachment.task_id,
        fileName: attachment.file_name,
        fileType: attachment.file_type || '',
        fileSize: attachment.file_size,
        url: attachment.url,
        uploadedBy: attachment.uploaded_by || 'Unknown User',
        uploadedAt: attachment.uploaded_at
      }));
      
      // Build the detailed task object
      const detailedTask: DetailedTask = {
        id: taskData.task_id,
        title: taskData.title,
        description: taskData.description,
        client: taskData.client_name || 'Unknown Client',
        priority: taskData.priority as 'high' | 'medium' | 'low',
        status: taskData.status,
        dueDate: taskData.due_date ? new Date(taskData.due_date) : new Date(),
        estimatedHours: taskData.estimated_time || 0,
        actualHours: taskData.actual_time || 0,
        assignedTo: taskData.assignee_name || 'Unassigned',
        comments,
        attachments
      };
      
      return detailedTask;
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
      // Add updated_at timestamp
      const updatedData = {
        ...taskData,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updatedData)
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
  getTaskComments: async (taskId: number): Promise<TaskComment[]> => {
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
      
      return data.map(comment => ({
        id: comment.id,
        taskId: comment.task_id,
        userId: comment.user_id,
        userName: comment.users?.name || 'Unknown User',
        comment: comment.comment,
        createdAt: comment.created_at
      }));
    } catch (error) {
      console.error('Error fetching task comments:', error);
      throw error;
    }
  },

  addTaskComment: async (commentData: { task_id: number; user_id: number; comment: string }): Promise<TaskComment> => {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .insert([commentData])
        .select(`
          id,
          task_id,
          user_id,
          users (name),
          comment,
          created_at
        `);

      if (error) throw error;
      
      const comment = data[0];
      return {
        id: comment.id,
        taskId: comment.task_id,
        userId: comment.user_id,
        userName: comment.users?.name || 'Unknown User',
        comment: comment.comment,
        createdAt: comment.created_at
      };
    } catch (error) {
      console.error('Error adding task comment:', error);
      throw error;
    }
  },
  
  // Task Attachments
  getTaskAttachments: async (taskId: number): Promise<TaskAttachment[]> => {
    try {
      const { data, error } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      
      return data.map(attachment => ({
        id: attachment.id,
        taskId: attachment.task_id,
        fileName: attachment.file_name,
        fileType: attachment.file_type || '',
        fileSize: attachment.file_size,
        url: attachment.url,
        uploadedBy: attachment.uploaded_by || 'Unknown User',
        uploadedAt: attachment.uploaded_at
      }));
    } catch (error) {
      console.error('Error fetching task attachments:', error);
      throw error;
    }
  },

  addTaskAttachment: async (attachmentData: {
    task_id: number;
    file_name: string;
    file_type?: string;
    file_size: number;
    url: string;
    uploaded_by?: string;
  }): Promise<TaskAttachment> => {
    try {
      const { data, error } = await supabase
        .from('task_attachments')
        .insert([attachmentData])
        .select();

      if (error) throw error;
      
      const attachment = data[0];
      return {
        id: attachment.id,
        taskId: attachment.task_id,
        fileName: attachment.file_name,
        fileType: attachment.file_type || '',
        fileSize: attachment.file_size,
        url: attachment.url,
        uploadedBy: attachment.uploaded_by || 'Unknown User',
        uploadedAt: attachment.uploaded_at
      };
    } catch (error) {
      console.error('Error adding task attachment:', error);
      throw error;
    }
  },
  
  deleteTaskAttachment: async (attachmentId: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('task_attachments')
        .delete()
        .eq('id', attachmentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting task attachment:', error);
      throw error;
    }
  }
};

export default taskService;
