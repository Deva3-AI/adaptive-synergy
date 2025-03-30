
import apiClient from '@/utils/apiUtils';
import { supabase } from '@/integrations/supabase/client';
import { task } from './index';

// Task interfaces
export interface Task {
  id?: number;
  task_id?: number;
  title: string;
  description?: string;
  client_id?: number;
  client?: string;
  client_name?: string;
  assigned_to?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  due_date?: string;
  dueDate?: string;
  priority: 'high' | 'medium' | 'low';
  created_at?: string;
  updated_at?: string;
  progress?: number;
}

export interface DetailedTask extends Task {
  assignee?: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
  attachments?: {
    id: number;
    name: string;
    url: string;
    uploaded_at: string;
    file_type: string;
    file_size: number;
  }[];
  comments?: {
    id: number;
    user_id: number;
    user_name: string;
    text: string;
    created_at: string;
  }[];
  time_logs?: {
    id: number;
    start_time: string;
    end_time?: string;
    duration?: number;
    user_id: number;
    user_name: string;
    description?: string;
  }[];
}

// Mock data
const MOCK_TASKS = [
  {
    id: 1,
    title: 'Design homepage layout',
    description: 'Create a responsive homepage design for the new website',
    client_id: 1,
    client_name: 'Acme Corp',
    assigned_to: 1,
    status: 'in_progress',
    estimated_time: 8,
    actual_time: 4,
    start_time: '2023-03-15T09:00:00Z',
    end_time: null,
    due_date: '2023-03-20',
    priority: 'high',
    created_at: '2023-03-14T14:00:00Z',
    updated_at: '2023-03-15T10:30:00Z',
    progress: 50
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Set up user authentication system with login/signup functionality',
    client_id: 2,
    client_name: 'Beta Industries',
    assigned_to: 2,
    status: 'pending',
    estimated_time: 12,
    actual_time: 0,
    start_time: null,
    end_time: null,
    due_date: '2023-03-25',
    priority: 'medium',
    created_at: '2023-03-14T14:30:00Z',
    updated_at: '2023-03-14T14:30:00Z',
    progress: 0
  },
  {
    id: 3,
    title: 'Create marketing email templates',
    description: 'Design and implement HTML email templates for marketing campaigns',
    client_id: 1,
    client_name: 'Acme Corp',
    assigned_to: 3,
    status: 'completed',
    estimated_time: 6,
    actual_time: 5,
    start_time: '2023-03-10T10:00:00Z',
    end_time: '2023-03-12T16:00:00Z',
    due_date: '2023-03-15',
    priority: 'low',
    created_at: '2023-03-09T11:00:00Z',
    updated_at: '2023-03-12T16:15:00Z',
    progress: 100
  }
] as Task[];

const taskService = {
  // Get tasks with optional filtering
  getTasks: async (params?: { status?: string; assigned_to?: number; client_id?: number }): Promise<Task[]> => {
    try {
      // If using the real API
      if (true) {
        let url = '/tasks';
        const queryParams = [];
        
        if (params?.status) queryParams.push(`status=${params.status}`);
        if (params?.assigned_to) queryParams.push(`assignedTo=${params.assigned_to}`);
        if (params?.client_id) queryParams.push(`clientId=${params.client_id}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        // Uncomment when the API is ready
        // const response = await apiClient.get(url);
        // return response.data;
      }
      
      // Return mock data for now with filtering applied
      let filtered = [...MOCK_TASKS];
      
      if (params?.status) {
        filtered = filtered.filter(task => task.status === params.status);
      }
      
      if (params?.assigned_to) {
        filtered = filtered.filter(task => task.assigned_to === params.assigned_to);
      }
      
      if (params?.client_id) {
        filtered = filtered.filter(task => task.client_id === params.client_id);
      }
      
      return filtered;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },
  
  // Get a single task by ID
  getTaskById: async (taskId: number): Promise<DetailedTask | null> => {
    try {
      // If using the real API
      if (true) {
        const url = `/tasks/${taskId}`;
        
        // Uncomment when the API is ready
        // const response = await apiClient.get(url);
        // return response.data;
      }
      
      // Return mock data for now
      const task = MOCK_TASKS.find(t => t.id === taskId);
      if (!task) return null;
      
      // Add additional details for the detailed view
      return {
        ...task,
        assignee: {
          id: task.assigned_to || 0,
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'Designer'
        },
        attachments: [
          {
            id: 1,
            name: 'wireframe.pdf',
            url: '/uploads/wireframe.pdf',
            uploaded_at: '2023-03-15T11:30:00Z',
            file_type: 'application/pdf',
            file_size: 2048
          }
        ],
        comments: [
          {
            id: 1,
            user_id: 1,
            user_name: 'John Doe',
            text: 'Started working on the design',
            created_at: '2023-03-15T10:30:00Z'
          }
        ],
        time_logs: [
          {
            id: 1,
            start_time: '2023-03-15T09:00:00Z',
            end_time: '2023-03-15T12:00:00Z',
            duration: 3,
            user_id: 1,
            user_name: 'John Doe',
            description: 'Initial design work'
          },
          {
            id: 2,
            start_time: '2023-03-15T13:00:00Z',
            end_time: '2023-03-15T16:00:00Z',
            duration: 3,
            user_id: 1,
            user_name: 'John Doe',
            description: 'Refining design based on feedback'
          }
        ]
      };
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      return null;
    }
  },
  
  // Create a new task
  createTask: async (taskData: Partial<Task>): Promise<Task> => {
    try {
      // If using the real API
      if (true) {
        // Uncomment when the API is ready
        // const response = await apiClient.post('/tasks', taskData);
        // return response.data;
      }
      
      // Mock creating a new task
      const newTask: Task = {
        id: MOCK_TASKS.length + 1,
        title: taskData.title || 'New Task',
        description: taskData.description,
        client_id: taskData.client_id,
        client_name: taskData.client_name || 'Unknown Client',
        assigned_to: taskData.assigned_to,
        status: taskData.status || 'pending',
        estimated_time: taskData.estimated_time,
        actual_time: 0,
        start_time: null,
        end_time: null,
        due_date: taskData.due_date,
        priority: taskData.priority || 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        progress: 0
      };
      
      MOCK_TASKS.push(newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  // Update an existing task
  updateTask: async (taskId: number, taskData: Partial<Task>): Promise<Task> => {
    try {
      // If using the real API
      if (true) {
        // Uncomment when the API is ready
        // const response = await apiClient.put(`/tasks/${taskId}`, taskData);
        // return response.data;
      }
      
      // Mock updating a task
      const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      const updatedTask = {
        ...MOCK_TASKS[taskIndex],
        ...taskData,
        updated_at: new Date().toISOString()
      };
      
      MOCK_TASKS[taskIndex] = updatedTask;
      return updatedTask;
    } catch (error) {
      console.error(`Error updating task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Delete a task
  deleteTask: async (taskId: number): Promise<boolean> => {
    try {
      // If using the real API
      if (true) {
        // Uncomment when the API is ready
        // await apiClient.delete(`/tasks/${taskId}`);
        // return true;
      }
      
      // Mock deleting a task
      const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      MOCK_TASKS.splice(taskIndex, 1);
      return true;
    } catch (error) {
      console.error(`Error deleting task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Change task status
  updateTaskStatus: async (taskId: number, status: 'pending' | 'in_progress' | 'completed' | 'cancelled'): Promise<Task> => {
    try {
      // If using the real API
      if (true) {
        // Uncomment when the API is ready
        // const response = await apiClient.patch(`/tasks/${taskId}/status`, { status });
        // return response.data;
      }
      
      // Mock updating task status
      const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
      if (taskIndex === -1) {
        throw new Error(`Task with ID ${taskId} not found`);
      }
      
      const updatedTask = {
        ...MOCK_TASKS[taskIndex],
        status,
        updated_at: new Date().toISOString()
      };
      
      // If status is completed, set end_time and progress
      if (status === 'completed') {
        updatedTask.end_time = new Date().toISOString();
        updatedTask.progress = 100;
      }
      
      // If status is in_progress and there's no start_time, set it
      if (status === 'in_progress' && !updatedTask.start_time) {
        updatedTask.start_time = new Date().toISOString();
        updatedTask.progress = updatedTask.progress || 25;
      }
      
      MOCK_TASKS[taskIndex] = updatedTask;
      return updatedTask;
    } catch (error) {
      console.error(`Error updating task ${taskId} status:`, error);
      throw error;
    }
  },
  
  // Get tasks by client
  getTasksByClient: async (clientId: number): Promise<Task[]> => {
    try {
      // If using the real API
      if (true) {
        // Uncomment when the API is ready
        // const response = await apiClient.get(`/clients/${clientId}/tasks`);
        // return response.data;
      }
      
      // Return mock data filtered by client
      return MOCK_TASKS.filter(task => task.client_id === clientId);
    } catch (error) {
      console.error(`Error fetching tasks for client ${clientId}:`, error);
      return [];
    }
  },
  
  // Get tasks by employee
  getTasksByEmployee: async (employeeId: number): Promise<Task[]> => {
    try {
      // If using the real API
      if (true) {
        // Uncomment when the API is ready
        // const response = await apiClient.get(`/employees/${employeeId}/tasks`);
        // return response.data;
      }
      
      // Return mock data filtered by assigned employee
      return MOCK_TASKS.filter(task => task.assigned_to === employeeId);
    } catch (error) {
      console.error(`Error fetching tasks for employee ${employeeId}:`, error);
      return [];
    }
  },
  
  // Get task analytics
  getTaskAnalytics: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      // If using the real API
      if (true) {
        let url = '/tasks/analytics';
        const queryParams = [];
        
        if (startDate) queryParams.push(`startDate=${startDate}`);
        if (endDate) queryParams.push(`endDate=${endDate}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        // Uncomment when the API is ready
        // const response = await apiClient.get(url);
        // return response.data;
      }
      
      // Return mock analytics data
      return {
        total_tasks: MOCK_TASKS.length,
        completed_tasks: MOCK_TASKS.filter(t => t.status === 'completed').length,
        in_progress_tasks: MOCK_TASKS.filter(t => t.status === 'in_progress').length,
        pending_tasks: MOCK_TASKS.filter(t => t.status === 'pending').length,
        cancelled_tasks: MOCK_TASKS.filter(t => t.status === 'cancelled').length,
        average_completion_time: 2.5, // in days
        on_time_completion_rate: 85, // percentage
        by_priority: {
          high: MOCK_TASKS.filter(t => t.priority === 'high').length,
          medium: MOCK_TASKS.filter(t => t.priority === 'medium').length,
          low: MOCK_TASKS.filter(t => t.priority === 'low').length
        },
        by_client: MOCK_TASKS.reduce((acc, task) => {
          const clientId = task.client_id || 0;
          acc[clientId] = (acc[clientId] || 0) + 1;
          return acc;
        }, {} as Record<number, number>)
      };
    } catch (error) {
      console.error('Error fetching task analytics:', error);
      return null;
    }
  },
};

export default taskService;
