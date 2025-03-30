
import { apiRequest } from "@/utils/apiUtils";
import { supabase } from '@/integrations/supabase/client';

// Define types
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

export interface TaskPriority {
  task_id: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  updated_at: string;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  comment: string;
  created_at: string;
  attachments?: TaskAttachment[];
}

// Create a mock task attachments array
const mockTaskAttachments: TaskAttachment[] = [
  {
    id: 1,
    task_id: 101,
    file_name: "requirements.pdf",
    file_size: 1245000,
    file_type: "application/pdf",
    url: "https://example.com/files/requirements.pdf",
    uploaded_at: "2023-06-20T14:30:00Z",
    uploaded_by: "John Doe"
  },
  {
    id: 2,
    task_id: 101,
    file_name: "mockup.jpg",
    file_size: 3450000,
    file_type: "image/jpeg",
    url: "https://example.com/files/mockup.jpg",
    uploaded_at: "2023-06-21T09:15:00Z",
    uploaded_by: "Jane Smith"
  },
  {
    id: 3,
    task_id: 102,
    file_name: "data.xlsx",
    file_size: 875000,
    file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    url: "https://example.com/files/data.xlsx",
    uploaded_at: "2023-06-22T11:45:00Z",
    uploaded_by: "Mike Johnson"
  }
];

// Mock task comments
const mockTaskComments: TaskComment[] = [
  {
    id: 1,
    task_id: 101,
    user_id: 1,
    user_name: "John Doe",
    comment: "I've started working on the first section of this task.",
    created_at: "2023-06-21T10:30:00Z"
  },
  {
    id: 2,
    task_id: 101,
    user_id: 2,
    user_name: "Jane Smith",
    comment: "Just uploaded the mockup file for review.",
    created_at: "2023-06-21T14:20:00Z",
    attachments: [mockTaskAttachments[1]]
  },
  {
    id: 3,
    task_id: 102,
    user_id: 3,
    user_name: "Mike Johnson",
    comment: "Here's the data file we'll use for the analysis.",
    created_at: "2023-06-22T11:50:00Z",
    attachments: [mockTaskAttachments[2]]
  }
];

const taskService = {
  getTasks: async (status?: string, assignedTo?: number) => {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users (name)
        `);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (assignedTo) {
        query = query.eq('assigned_to', assignedTo);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map(task => ({
        ...task,
        client_name: task.clients?.client_name,
        assigned_to_name: task.users?.name,
        clients: undefined,
        users: undefined
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      
      // Mock response
      return [
        {
          task_id: 101,
          title: "Redesign client website homepage",
          description: "Update the homepage design to match new branding guidelines",
          client_id: 1,
          client_name: "Acme Inc",
          assigned_to: 1,
          assigned_to_name: "John Doe",
          status: "in_progress",
          estimated_time: 8.5,
          actual_time: 4.2,
          start_time: "2023-06-20T09:00:00Z",
          end_time: null,
          created_at: "2023-06-19T15:30:00Z",
          updated_at: "2023-06-21T10:15:00Z"
        },
        {
          task_id: 102,
          title: "Create monthly analytics report",
          description: "Compile and analyze website and social media performance data",
          client_id: 2,
          client_name: "TechCorp",
          assigned_to: 2,
          assigned_to_name: "Jane Smith",
          status: "pending",
          estimated_time: 4.0,
          actual_time: null,
          start_time: null,
          end_time: null,
          created_at: "2023-06-20T11:45:00Z",
          updated_at: "2023-06-20T11:45:00Z"
        },
        {
          task_id: 103,
          title: "Develop email newsletter template",
          description: "Create responsive HTML email template based on client branding",
          client_id: 1,
          client_name: "Acme Inc",
          assigned_to: 3,
          assigned_to_name: "Mike Johnson",
          status: "completed",
          estimated_time: 6.0,
          actual_time: 5.5,
          start_time: "2023-06-15T13:00:00Z",
          end_time: "2023-06-18T15:30:00Z",
          created_at: "2023-06-15T10:30:00Z",
          updated_at: "2023-06-18T15:35:00Z"
        }
      ];
    }
  },
  
  getTaskDetails: async (taskId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users (name)
        `)
        .eq('task_id', taskId)
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        client_name: data.clients?.client_name,
        assigned_to_name: data.users?.name,
        clients: undefined,
        users: undefined
      };
    } catch (error) {
      console.error('Error fetching task details:', error);
      
      // Mock response
      return {
        task_id: taskId,
        title: "Redesign client website homepage",
        description: "Update the homepage design to match new branding guidelines. Focus on responsive design and improved user experience. Incorporate new color scheme and typography from brand guidelines.",
        client_id: 1,
        client_name: "Acme Inc",
        assigned_to: 1,
        assigned_to_name: "John Doe",
        status: "in_progress",
        estimated_time: 8.5,
        actual_time: 4.2,
        start_time: "2023-06-20T09:00:00Z",
        end_time: null,
        created_at: "2023-06-19T15:30:00Z",
        updated_at: "2023-06-21T10:15:00Z",
        priority: "high",
        tags: ["design", "frontend", "responsive"]
      };
    }
  },
  
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
      
      // Mock response
      return {
        task_id: 110,
        ...taskData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },
  
  updateTaskStatus: async (taskId: number, status: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...(status === 'in_progress' && !data?.start_time ? { start_time: new Date().toISOString() } : {}),
          ...(status === 'completed' ? { end_time: new Date().toISOString() } : {})
        })
        .eq('task_id', taskId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating task status:', error);
      
      // Mock response
      return {
        task_id: taskId,
        status,
        updated_at: new Date().toISOString()
      };
    }
  },
  
  // Task attachments methods
  getTaskAttachments: async (taskId: number): Promise<TaskAttachment[]> => {
    try {
      // In a real implementation, this would fetch from the database
      return mockTaskAttachments.filter(attachment => attachment.task_id === taskId);
    } catch (error) {
      console.error('Error fetching task attachments:', error);
      return [];
    }
  },
  
  uploadTaskAttachment: async (taskId: number, file: File, userId: number, userName: string): Promise<TaskAttachment> => {
    try {
      // In a real implementation, this would upload to storage and save in the database
      console.log(`Uploading file ${file.name} (${file.size} bytes) for task ${taskId}`);
      
      const newAttachment: TaskAttachment = {
        id: Math.max(...mockTaskAttachments.map(a => a.id)) + 1,
        task_id: taskId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        url: `https://example.com/files/${file.name}`,
        uploaded_at: new Date().toISOString(),
        uploaded_by: userName
      };
      
      mockTaskAttachments.push(newAttachment);
      return newAttachment;
    } catch (error) {
      console.error('Error uploading task attachment:', error);
      throw error;
    }
  },
  
  deleteTaskAttachment: async (attachmentId: number): Promise<boolean> => {
    try {
      // In a real implementation, this would delete from storage and database
      const index = mockTaskAttachments.findIndex(a => a.id === attachmentId);
      
      if (index >= 0) {
        mockTaskAttachments.splice(index, 1);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error deleting task attachment:', error);
      return false;
    }
  },
  
  // Task comments methods
  getTaskComments: async (taskId: number): Promise<TaskComment[]> => {
    try {
      // In a real implementation, this would fetch from the database
      return mockTaskComments.filter(comment => comment.task_id === taskId);
    } catch (error) {
      console.error('Error fetching task comments:', error);
      return [];
    }
  },
  
  addTaskComment: async (taskId: number, userId: number, userName: string, comment: string, attachments?: TaskAttachment[]): Promise<TaskComment> => {
    try {
      // In a real implementation, this would save to the database
      const newComment: TaskComment = {
        id: Math.max(...mockTaskComments.map(c => c.id)) + 1,
        task_id: taskId,
        user_id: userId,
        user_name: userName,
        comment,
        created_at: new Date().toISOString(),
        attachments
      };
      
      mockTaskComments.push(newComment);
      return newComment;
    } catch (error) {
      console.error('Error adding task comment:', error);
      throw error;
    }
  },
  
  // Task statistics and analytics
  getTaskStatistics: async (userId?: number): Promise<TaskStatistics> => {
    try {
      // In a real implementation, this would do complex queries on the database
      // Here we return mock data
      return {
        completed_tasks: 32,
        pending_tasks: 8,
        in_progress_tasks: 12,
        overdue_tasks: 3,
        completion_rate: 65,
        avg_completion_time: 4.5, // days
        on_time_completion: 82, // percentage
        average_task_duration: 3.8, // days
        monthly_trends: [
          { month: 'Jan', completed: 22, assigned: 25 },
          { month: 'Feb', completed: 24, assigned: 28 },
          { month: 'Mar', completed: 20, assigned: 22 },
          { month: 'Apr', completed: 25, assigned: 30 },
          { month: 'May', completed: 28, assigned: 32 },
          { month: 'Jun', completed: 32, assigned: 35 }
        ],
        task_distribution: [
          { name: 'Design', value: 35 },
          { name: 'Development', value: 25 },
          { name: 'Content', value: 20 },
          { name: 'SEO', value: 10 },
          { name: 'Other', value: 10 }
        ],
        recent_completions: [
          { task_id: 95, title: 'Website Redesign for XYZ Company', completed_on: '2023-06-25', duration: 5 },
          { task_id: 87, title: 'Monthly SEO Analysis for ABC Corp', completed_on: '2023-06-22', duration: 2 },
          { task_id: 92, title: 'Social Media Strategy for 123 Industries', completed_on: '2023-06-20', duration: 4 },
          { task_id: 88, title: 'Email Newsletter Design', completed_on: '2023-06-18', duration: 3 },
          { task_id: 85, title: 'Landing Page Creation for Summer Campaign', completed_on: '2023-06-15', duration: 6 }
        ]
      };
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      return {
        completed_tasks: 0,
        pending_tasks: 0,
        in_progress_tasks: 0,
        overdue_tasks: 0,
        completion_rate: 0,
        avg_completion_time: 0,
        on_time_completion: 0,
        average_task_duration: 0,
        monthly_trends: [],
        task_distribution: [],
        recent_completions: []
      };
    }
  },
  
  setTaskPriority: async (taskId: number, priority: 'low' | 'medium' | 'high' | 'urgent'): Promise<TaskPriority> => {
    try {
      // In a real implementation, this would update the database
      return {
        task_id: taskId,
        priority,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error setting task priority:', error);
      throw error;
    }
  }
};

export default taskService;
