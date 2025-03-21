
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { toast } from "sonner";

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error for debugging
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface Client {
  client_id: number;
  client_name: string;
  description?: string;
  contact_info?: string;
  created_at?: string;
}

export interface Employee {
  user_id: number;
  name: string;
  email: string;
  role_name: string;
  joining_date?: string;
  emp_id?: string;
  dob?: string;
}

export interface Task {
  task_id: number;
  title: string;
  description?: string;
  client_id?: number;
  client_name?: string;
  assigned_to?: number;
  assignee_name?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at?: string;
  updated_at?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface Attendance {
  attendance_id: number;
  user_id: number;
  login_time: string;
  logout_time?: string;
  work_date: string;
  total_hours?: number;
}

// Helper function to fetch data with type
export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await apiClient.get(endpoint);
    return response.data as T;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

// React Query hooks for commonly used data

// Get clients
export function useClients() {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        // Try to fetch from the API
        const response = await apiClient.get('/clients');
        return response.data;
      } catch (error) {
        console.error('Error fetching clients, using fallback data:', error);
        
        // Fallback data if the API call fails
        return [
          { client_id: 1, client_name: "Social Land", description: "Social media marketing agency", contact_info: "Discord, Google docs, Asana" },
          { client_id: 2, client_name: "Koala Digital", description: "Digital marketing firm", contact_info: "Slack, Trello" },
          { client_id: 3, client_name: "AC Digital", description: "Full-service digital agency", contact_info: "Email" },
          { client_id: 4, client_name: "Muse Digital", description: "Creative digital services", contact_info: "Email, WhatsApp" },
          { client_id: 5, client_name: "Internet People", description: "Web development agency", contact_info: "WhatsApp, Base Camp" },
          { client_id: 6, client_name: "Philip", description: "Individual client", contact_info: "WhatsApp" },
          { client_id: 7, client_name: "Website Architect", description: "Website design and development", contact_info: "WhatsApp, Slack" },
          { client_id: 8, client_name: "Justin", description: "Individual client", contact_info: "Email, WhatsApp" },
          { client_id: 9, client_name: "Mark Intrinsic", description: "Brand strategy consultation", contact_info: "WhatsApp" },
          { client_id: 10, client_name: "Mario", description: "Individual client", contact_info: "WhatsApp, Email" },
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get client details by ID
export function useClientDetails(clientId: number) {
  const { data: clients } = useClients();
  
  return useQuery<Client>({
    queryKey: ['client', clientId],
    queryFn: async () => {
      try {
        // Try to fetch from the API
        const response = await apiClient.get(`/clients/${clientId}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching client ${clientId}, using fallback data:`, error);
        
        // Use client from the cache if available
        const cachedClient = clients?.find(c => c.client_id === clientId);
        if (cachedClient) return cachedClient;
        
        throw new Error(`Client not found: ${clientId}`);
      }
    },
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get employees
export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        // Try to fetch from the API
        const response = await apiClient.get('/employees');
        return response.data;
      } catch (error) {
        console.error('Error fetching employees, using fallback data:', error);
        
        // Fallback data if the API call fails
        return [
          { user_id: 1, name: "Raje", email: "raje.brandingbeez@gmail.com", role_name: "CEO", joining_date: "2023-05-23", emp_id: "2301", dob: "1998-06-23" },
          { user_id: 2, name: "Priya", email: "priya.brandingbeez@gmail.com", role_name: "Growth strategist", joining_date: "2023-10-09", emp_id: "2317", dob: "2000-03-12" },
          { user_id: 3, name: "Mani", email: "mani.brandingbeez@gmail.com", role_name: "Sr.Graphic Designer", joining_date: "2023-10-16", emp_id: "2402", dob: "2002-05-16" },
          { user_id: 4, name: "Dinesh", email: "dinesh.brandingbeez@gmail.com", role_name: "Sr.Video Editor", joining_date: "2023-10-30", emp_id: "2320", dob: "2000-08-22" },
          { user_id: 5, name: "Shadik", email: "shadik.brandingbeez@gmail.com", role_name: "Sr.Branding Expert", joining_date: "2021-12-27", emp_id: "2102", dob: "1998-08-28" },
          { user_id: 6, name: "Sanjay", email: "sanjay.brandingbeez@gmail.com", role_name: "Sr.Wordpress Developer", joining_date: "2023-12-04", emp_id: "2321", dob: "1999-01-28" },
          { user_id: 7, name: "Athira", email: "athira.brandingbeez@gmail.com", role_name: "Jr.HR", joining_date: "2025-05-20", emp_id: "2402", dob: "2000-06-29" },
          { user_id: 8, name: "Nijanthan", email: "niju.brandingbeez@gmail.com", role_name: "Jr.Wordpress Developer", joining_date: "2024-04-17", emp_id: "2322", dob: "2001-07-29" },
          { user_id: 9, name: "Yuva", email: "yuva.brandingbeez@gmail.com", role_name: "SEO expert", joining_date: "2024-03-18", emp_id: "2401", dob: "1999-10-14" },
          { user_id: 10, name: "Mithra", email: "mithra.brandingbeez@gmail.com", role_name: "Jr.Graphic Designer", joining_date: "2024-06-03", emp_id: "2403", dob: "2002-01-30" },
          { user_id: 11, name: "Kohila", email: "kohila.brandingbeez@gmail.com", role_name: "Sr.SEO Specialist", joining_date: "2024-07-01", emp_id: "2404", dob: "1996-12-30" },
          { user_id: 12, name: "Vishnu", email: "vishnu.brandingbeez@gmail.com", role_name: "Creative & accounts office", joining_date: "2022-06-04", emp_id: "2315", dob: "1996-01-15" },
          { user_id: 13, name: "Charan", email: "charan.brandingbeez@gmail.com", role_name: "Chief Visionary Growth officer", joining_date: "2025-10-21", emp_id: "2406", dob: "1995-12-19" },
          { user_id: 14, name: "Jayakumar", email: "jay.brandingbeez@gmail.com", role_name: "Senior website designer", joining_date: "2025-12-02", emp_id: "2408", dob: "2000-12-01" },
          { user_id: 15, name: "Gopal", email: "gopal.brandingbeez@gmail.com", role_name: "Operation Head", joining_date: "2025-01-02", emp_id: "2409", dob: "1991-06-12" },
          { user_id: 16, name: "Shalini", email: "shalini.brandingbeez@gmail.com", role_name: "Business development officer", joining_date: "2025-12-18", emp_id: "2401", dob: "2000-12-31" },
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get tasks
export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/tasks');
        return response.data;
      } catch (error) {
        console.error('Error fetching tasks, using fallback data:', error);
        
        // Fallback data if the API call fails
        return [
          { 
            task_id: 1, 
            title: "Website redesign", 
            description: "Complete website redesign for client homepage",
            client_id: 1,
            client_name: "Social Land",
            assigned_to: 3,
            assignee_name: "Mani",
            status: "in_progress",
            estimated_time: 15,
            priority: "high",
            created_at: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { 
            task_id: 2, 
            title: "SEO optimization", 
            description: "Implement SEO improvements on client's website",
            client_id: 2,
            client_name: "Koala Digital",
            assigned_to: 9,
            assignee_name: "Yuva",
            status: "pending",
            estimated_time: 8,
            priority: "medium",
            created_at: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { 
            task_id: 3, 
            title: "Social media campaign", 
            description: "Create and launch social media campaign for product launch",
            client_id: 3,
            client_name: "AC Digital",
            assigned_to: 5,
            assignee_name: "Shadik",
            status: "completed",
            estimated_time: 10,
            actual_time: 12,
            priority: "high",
            created_at: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            start_time: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { 
            task_id: 4, 
            title: "Video editing", 
            description: "Edit promotional video for client's new service",
            client_id: 1,
            client_name: "Social Land",
            assigned_to: 4,
            assignee_name: "Dinesh",
            status: "in_progress",
            estimated_time: 6,
            priority: "medium",
            created_at: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            start_time: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { 
            task_id: 5, 
            title: "Content creation", 
            description: "Write blog posts for client's website",
            client_id: 4,
            client_name: "Muse Digital",
            assigned_to: 2,
            assignee_name: "Priya",
            status: "pending",
            estimated_time: 4,
            priority: "low",
            created_at: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { 
            task_id: 6, 
            title: "WordPress development", 
            description: "Develop custom WordPress theme for client",
            client_id: 7,
            client_name: "Website Architect",
            assigned_to: 6,
            assignee_name: "Sanjay",
            status: "in_progress",
            estimated_time: 20,
            priority: "high",
            created_at: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            start_time: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get attendance
export function useAttendance() {
  return useQuery<Attendance[]>({
    queryKey: ['attendance'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/attendance');
        return response.data;
      } catch (error) {
        console.error('Error fetching attendance, using fallback data:', error);
        
        // Generate some sample attendance data for today
        const today = new Date().toISOString().split('T')[0];
        return [
          {
            attendance_id: 1,
            user_id: 1,
            login_time: `${today}T09:00:00.000Z`,
            logout_time: `${today}T17:30:00.000Z`,
            work_date: today,
            total_hours: 8.5
          },
          {
            attendance_id: 2,
            user_id: 2,
            login_time: `${today}T09:15:00.000Z`,
            logout_time: `${today}T18:00:00.000Z`,
            work_date: today,
            total_hours: 8.75
          },
          {
            attendance_id: 3,
            user_id: 3,
            login_time: `${today}T08:45:00.000Z`,
            work_date: today,
          },
        ];
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Task operations
export const taskOperations = {
  startTask: async (taskId: number) => {
    try {
      // In a real app, you would call the API
      // await apiClient.post(`/tasks/${taskId}/start`);
      
      // For demo, simulate API call success
      toast.success(`Task started successfully`);
      return { success: true, message: 'Task started successfully' };
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error('Failed to start task');
      throw error;
    }
  },
  
  stopTask: async (taskId: number) => {
    try {
      // In a real app, you would call the API
      // await apiClient.post(`/tasks/${taskId}/stop`);
      
      // For demo, simulate API call success
      toast.success(`Task stopped successfully`);
      return { success: true, message: 'Task stopped successfully' };
    } catch (error) {
      console.error('Error stopping task:', error);
      toast.error('Failed to stop task');
      throw error;
    }
  },
  
  completeTask: async (taskId: number) => {
    try {
      // In a real app, you would call the API
      // await apiClient.put(`/tasks/${taskId}`, { status: 'completed' });
      
      // For demo, simulate API call success
      toast.success(`Task marked as completed`);
      return { success: true, message: 'Task marked as completed' };
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId: number, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      // In a real app, you would call the API
      // await apiClient.put(`/tasks/${taskId}`, { status });
      
      // For demo, simulate API call success
      toast.success(`Task status updated to ${status}`);
      return { success: true, message: `Task status updated to ${status}` };
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
      throw error;
    }
  }
};

export default apiClient;
