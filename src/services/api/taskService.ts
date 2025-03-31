
import { toast } from "sonner";
import { mockUserData } from "@/utils/mockData";

// Define Task interface
export interface Task {
  id?: number;
  task_id: number;
  title: string;
  description: string;
  client_id?: number;
  client_name?: string;
  client?: string;
  assigned_to?: number;
  assignee_name?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  progress: number;
  estimated_hours?: number;
  actual_hours?: number;
  comments?: any[];
}

export interface TaskComment {
  id?: number;
  task_id: number;
  user_id: number;
  user_name: string;
  content: string;
  created_at: string;
}

// Mock tasks data
const mockTasks = [
  {
    task_id: 1,
    id: 1,
    title: "Create homepage design",
    description: "Design the homepage layout for the new website",
    client_id: 1,
    client_name: "Acme Corp",
    assigned_to: 2,
    assignee_name: "John Designer",
    status: "in_progress",
    priority: "high",
    due_date: "2023-06-15",
    created_at: "2023-06-01",
    updated_at: "2023-06-05",
    progress: 65,
    estimated_hours: 10,
    actual_hours: 6.5,
    comments: [
      {
        id: 1,
        task_id: 1,
        user_id: 1,
        user_name: "Admin User",
        content: "Please make sure to follow the brand guidelines",
        created_at: "2023-06-02T10:30:00"
      }
    ]
  },
  {
    task_id: 2,
    id: 2,
    title: "Implement user authentication",
    description: "Create login and registration functionality",
    client_id: 2,
    client_name: "TechStart Inc",
    assigned_to: 3,
    assignee_name: "Jane Developer",
    status: "pending",
    priority: "medium",
    due_date: "2023-06-20",
    created_at: "2023-06-03",
    updated_at: "2023-06-03",
    progress: 0,
    estimated_hours: 15,
    actual_hours: 0,
    comments: []
  },
  {
    task_id: 3,
    id: 3,
    title: "Create content for about page",
    description: "Write copy for the about us section",
    client_id: 1,
    client_name: "Acme Corp",
    assigned_to: 4,
    assignee_name: "David Writer",
    status: "completed",
    priority: "low",
    due_date: "2023-06-10",
    created_at: "2023-06-01",
    updated_at: "2023-06-08",
    progress: 100,
    estimated_hours: 5,
    actual_hours: 4.5,
    comments: [
      {
        id: 2,
        task_id: 3,
        user_id: 4,
        user_name: "David Writer",
        content: "First draft completed, awaiting feedback",
        created_at: "2023-06-05T15:45:00"
      },
      {
        id: 3,
        task_id: 3,
        user_id: 1,
        user_name: "Admin User",
        content: "Looks good, just minor edits needed",
        created_at: "2023-06-06T11:20:00"
      }
    ]
  }
];

// Task service functions
export const taskService = {
  // Get all tasks
  getTasks: async () => {
    try {
      // In a real app, this would be an API call
      return [...mockTasks];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (taskId: number) => {
    try {
      const task = mockTasks.find(t => t.task_id === taskId || t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      console.error(`Error fetching task #${taskId}:`, error);
      throw error;
    }
  },

  // Get tasks by status
  getTasksByStatus: async (status: string) => {
    try {
      return mockTasks.filter(task => task.status === status);
    } catch (error) {
      console.error(`Error fetching tasks with status "${status}":`, error);
      throw error;
    }
  },

  // Get tasks by assigned user
  getTasksByUser: async (userId: number) => {
    try {
      return mockTasks.filter(task => task.assigned_to === userId);
    } catch (error) {
      console.error(`Error fetching tasks for user #${userId}:`, error);
      throw error;
    }
  },

  // Get tasks by client
  getTasksByClient: async (clientId: number) => {
    try {
      return mockTasks.filter(task => task.client_id === clientId);
    } catch (error) {
      console.error(`Error fetching tasks for client #${clientId}:`, error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData: Partial<Task>) => {
    try {
      const newTask = {
        task_id: Math.max(...mockTasks.map(t => t.task_id)) + 1,
        id: Math.max(...mockTasks.map(t => t.id || 0)) + 1,
        title: taskData.title || '',
        description: taskData.description || '',
        client_id: taskData.client_id,
        client_name: taskData.client_name || 'Unknown Client',
        assigned_to: taskData.assigned_to,
        assignee_name: taskData.assignee_name || 'Unassigned',
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        due_date: taskData.due_date,
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0],
        progress: taskData.progress || 0,
        estimated_hours: taskData.estimated_hours,
        actual_hours: taskData.actual_hours || 0,
        comments: []
      };
      
      // In a real app, this would be an API call
      mockTasks.push(newTask as any);
      
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (taskId: number, taskData: Partial<Task>) => {
    try {
      const taskIndex = mockTasks.findIndex(t => t.task_id === taskId || t.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      // Update task
      mockTasks[taskIndex] = {
        ...mockTasks[taskIndex],
        ...taskData,
        updated_at: new Date().toISOString().split('T')[0]
      };
      
      return mockTasks[taskIndex];
    } catch (error) {
      console.error(`Error updating task #${taskId}:`, error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (taskId: number) => {
    try {
      const taskIndex = mockTasks.findIndex(t => t.task_id === taskId || t.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      // Remove task
      mockTasks.splice(taskIndex, 1);
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting task #${taskId}:`, error);
      throw error;
    }
  },

  // Add a comment to a task
  addTaskComment: async (taskId: number, comment: Omit<TaskComment, 'id' | 'created_at'>) => {
    try {
      const taskIndex = mockTasks.findIndex(t => t.task_id === taskId || t.id === taskId);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      const newComment = {
        id: Math.max(...mockTasks.flatMap(t => t.comments?.map(c => c.id) || [0])) + 1,
        task_id: taskId,
        user_id: comment.user_id,
        user_name: comment.user_name,
        content: comment.content,
        created_at: new Date().toISOString()
      };
      
      // Add comment
      if (!mockTasks[taskIndex].comments) {
        mockTasks[taskIndex].comments = [];
      }
      
      mockTasks[taskIndex].comments?.push(newComment);
      
      return newComment;
    } catch (error) {
      console.error(`Error adding comment to task #${taskId}:`, error);
      throw error;
    }
  }
};
