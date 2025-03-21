
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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

// Generic fetch function with error handling
export const fetchData = async <T>(url: string, params?: Record<string, string | number | undefined>): Promise<T> => {
  try {
    // Build URL with params if provided
    let queryUrl = url;
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      
      if (queryParams.toString()) {
        queryUrl += `?${queryParams.toString()}`;
      }
    }
    
    // Make the API call
    const response = await apiClient.get(queryUrl);
    return response.data as T;
  } catch (error: any) {
    console.error(`Error fetching data from ${url}:`, error);
    
    // Show toast notification
    toast.error(
      error.response?.data?.detail || 
      'Failed to fetch data. Please try again later.'
    );
    
    throw error;
  }
};

// Generic post function with error handling
export const postData = async <T, D>(url: string, data: D): Promise<T> => {
  try {
    const response = await apiClient.post(url, data);
    return response.data as T;
  } catch (error: any) {
    console.error(`Error posting data to ${url}:`, error);
    
    toast.error(
      error.response?.data?.detail || 
      'Failed to save data. Please try again later.'
    );
    
    throw error;
  }
};

// Generic update function with error handling
export const updateData = async <T, D>(url: string, data: D): Promise<T> => {
  try {
    const response = await apiClient.put(url, data);
    return response.data as T;
  } catch (error: any) {
    console.error(`Error updating data at ${url}:`, error);
    
    toast.error(
      error.response?.data?.detail || 
      'Failed to update data. Please try again later.'
    );
    
    throw error;
  }
};

// Custom hook for fetching clients
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
          // In development, if backend is not available, use data from our seed script
          const response = await fetch('/data/clients.json').catch(() => null);
          
          if (response) {
            return await response.json();
          }
          
          // If JSON file is not available, use hardcoded data from our seed script
          return [
            { client_id: 1, client_name: 'Social Land', description: 'Uses Discord for communication and Google doc, Asana for tasks', contact_info: 'client@socialland.com' },
            { client_id: 2, client_name: 'Koala Digital', description: 'Uses Slack for communication and Trello for tasks', contact_info: 'client@koaladigital.com' },
            { client_id: 3, client_name: 'AC Digital', description: 'Uses Email for communication and tasks', contact_info: 'client@acdigital.com' },
            { client_id: 4, client_name: 'Muse Digital', description: 'Uses Email and Whatsapp for communication and Whatsapp for tasks', contact_info: 'client@musedigital.com' },
            { client_id: 5, client_name: 'Internet People', description: 'Uses Whatsapp for communication and Whatsapp, Base Camp for tasks', contact_info: 'client@internetpeople.com' },
            { client_id: 6, client_name: 'Philip', description: 'Uses Whatsapp for communication and tasks', contact_info: 'philip@client.com' },
            { client_id: 7, client_name: 'Website Architect', description: 'Uses Whatsapp, Slack for communication and Whatsapp and Slack for tasks', contact_info: 'client@websitearchitect.com' },
            { client_id: 8, client_name: 'Justin', description: 'Uses Email, Whatsapp for communication and Whatsapp for tasks', contact_info: 'justin@client.com' },
            { client_id: 9, client_name: 'Mark Intrinsic', description: 'Uses Whatsapp for communication and tasks', contact_info: 'mark@intrinsic.com' },
            { client_id: 10, client_name: 'Mario', description: 'Uses Whatsapp, Email for communication and Whatsapp, Email for tasks', contact_info: 'mario@client.com' }
          ];
        }
        
        // Regular API call
        const response = await apiClient.get('/client');
        return response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        
        // If API call fails, fallback to seeded data to ensure UI doesn't break
        return [
          { client_id: 1, client_name: 'Social Land', description: 'Uses Discord for communication and Google doc, Asana for tasks', contact_info: 'client@socialland.com' },
          { client_id: 2, client_name: 'Koala Digital', description: 'Uses Slack for communication and Trello for tasks', contact_info: 'client@koaladigital.com' },
          { client_id: 3, client_name: 'AC Digital', description: 'Uses Email for communication and tasks', contact_info: 'client@acdigital.com' },
          { client_id: 4, client_name: 'Muse Digital', description: 'Uses Email and Whatsapp for communication and Whatsapp for tasks', contact_info: 'client@musedigital.com' },
          { client_id: 5, client_name: 'Internet People', description: 'Uses Whatsapp for communication and Whatsapp, Base Camp for tasks', contact_info: 'client@internetpeople.com' },
          { client_id: 6, client_name: 'Philip', description: 'Uses Whatsapp for communication and tasks', contact_info: 'philip@client.com' },
          { client_id: 7, client_name: 'Website Architect', description: 'Uses Whatsapp, Slack for communication and Whatsapp and Slack for tasks', contact_info: 'client@websitearchitect.com' },
          { client_id: 8, client_name: 'Justin', description: 'Uses Email, Whatsapp for communication and Whatsapp for tasks', contact_info: 'justin@client.com' },
          { client_id: 9, client_name: 'Mark Intrinsic', description: 'Uses Whatsapp for communication and tasks', contact_info: 'mark@intrinsic.com' },
          { client_id: 10, client_name: 'Mario', description: 'Uses Whatsapp, Email for communication and Whatsapp, Email for tasks', contact_info: 'mario@client.com' }
        ];
      }
    }
  });
};

// Custom hook for fetching employees
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
          // In development, if backend is not available, use data from our seed script
          const response = await fetch('/data/employees.json').catch(() => null);
          
          if (response) {
            return await response.json();
          }
          
          // If JSON file is not available, use hardcoded data from our seed script
          return [
            { user_id: 1, name: 'Raje', email: 'raje.brandingbeez@gmail.com', role: { role_name: 'CEO' } },
            { user_id: 2, name: 'Priya', email: 'priya.brandingbeez@gmail.com', role: { role_name: 'Growth strategist' } },
            { user_id: 3, name: 'Mani', email: 'mani.brandingbeez@gmail.com', role: { role_name: 'Sr.Graphic Designer' } },
            { user_id: 4, name: 'Dinesh', email: 'dinesh.brandingbeez@gmail.com', role: { role_name: 'Sr.Video Editior' } },
            { user_id: 5, name: 'Shadik', email: 'shadik.brandingbeez@gmail.com', role: { role_name: 'Sr.Branding Expert' } },
            { user_id: 6, name: 'Sanjay', email: 'sanjay.brandingbeez@gmail.com', role: { role_name: 'Sr.Wordpress Developer' } },
            { user_id: 7, name: 'Athira', email: 'athira.brandingbeez@gmail.com', role: { role_name: 'Jr.HR' } },
            { user_id: 8, name: 'Nijanthan', email: 'niju.brandingbeez@gmail.com', role: { role_name: 'Jr.Wordpress Developer' } },
            { user_id: 9, name: 'Yuva', email: 'yuva.brandingbeez@gmail.com', role: { role_name: 'SEO expert' } },
            { user_id: 10, name: 'Mithra', email: 'mithra.brandingbeez@gmail.com', role: { role_name: 'Jr.Graphic Designer' } },
            { user_id: 11, name: 'Kohila', email: 'kohila.brandingbeez@gmail.com', role: { role_name: 'Sr.SEO Specalist' } },
            { user_id: 12, name: 'Vishnu', email: 'vishnu.brandingbeez@gmail.com', role: { role_name: 'Creative & accounts office' } },
            { user_id: 13, name: 'Charan', email: 'charan.brandingbeez@gmail.com', role: { role_name: 'Chief Visionary Growth officer' } },
            { user_id: 14, name: 'Jayakumar', email: 'jay.brandingbeez@gmail.com', role: { role_name: 'Senior website designer' } },
            { user_id: 15, name: 'Gopal', email: 'gopal.brandingbeez@gmail.com', role: { role_name: 'Operation Head' } },
            { user_id: 16, name: 'Shalini', email: 'shalini.brandingbeez@gmail.com', role: { role_name: 'Business development officer' } }
          ];
        }
        
        // Regular API call
        const response = await apiClient.get('/users');
        return response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        
        // If API call fails, fallback to seeded data to ensure UI doesn't break
        return [
          { user_id: 1, name: 'Raje', email: 'raje.brandingbeez@gmail.com', role: { role_name: 'CEO' } },
          { user_id: 2, name: 'Priya', email: 'priya.brandingbeez@gmail.com', role: { role_name: 'Growth strategist' } },
          { user_id: 3, name: 'Mani', email: 'mani.brandingbeez@gmail.com', role: { role_name: 'Sr.Graphic Designer' } },
          { user_id: 4, name: 'Dinesh', email: 'dinesh.brandingbeez@gmail.com', role: { role_name: 'Sr.Video Editior' } },
          { user_id: 5, name: 'Shadik', email: 'shadik.brandingbeez@gmail.com', role: { role_name: 'Sr.Branding Expert' } },
          { user_id: 6, name: 'Sanjay', email: 'sanjay.brandingbeez@gmail.com', role: { role_name: 'Sr.Wordpress Developer' } },
          { user_id: 7, name: 'Athira', email: 'athira.brandingbeez@gmail.com', role: { role_name: 'Jr.HR' } },
          { user_id: 8, name: 'Nijanthan', email: 'niju.brandingbeez@gmail.com', role: { role_name: 'Jr.Wordpress Developer' } },
          { user_id: 9, name: 'Yuva', email: 'yuva.brandingbeez@gmail.com', role: { role_name: 'SEO expert' } },
          { user_id: 10, name: 'Mithra', email: 'mithra.brandingbeez@gmail.com', role: { role_name: 'Jr.Graphic Designer' } },
          { user_id: 11, name: 'Kohila', email: 'kohila.brandingbeez@gmail.com', role: { role_name: 'Sr.SEO Specalist' } },
          { user_id: 12, name: 'Vishnu', email: 'vishnu.brandingbeez@gmail.com', role: { role_name: 'Creative & accounts office' } },
          { user_id: 13, name: 'Charan', email: 'charan.brandingbeez@gmail.com', role: { role_name: 'Chief Visionary Growth officer' } },
          { user_id: 14, name: 'Jayakumar', email: 'jay.brandingbeez@gmail.com', role: { role_name: 'Senior website designer' } },
          { user_id: 15, name: 'Gopal', email: 'gopal.brandingbeez@gmail.com', role: { role_name: 'Operation Head' } },
          { user_id: 16, name: 'Shalini', email: 'shalini.brandingbeez@gmail.com', role: { role_name: 'Business development officer' } }
        ];
      }
    }
  });
};

// Custom hook for fetching tasks
export const useTasks = (status?: string) => {
  return useQuery({
    queryKey: ['tasks', status],
    queryFn: async () => {
      try {
        let url = '/employee/tasks';
        if (status) {
          url += `?status=${status}`;
        }
        
        const response = await apiClient.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    }
  });
};

// Custom hook for fetching task details
export const useTaskDetails = (taskId: number) => {
  return useQuery({
    queryKey: ['taskDetails', taskId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/employee/tasks/${taskId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching task details:', error);
        throw error;
      }
    },
    enabled: !!taskId
  });
};

// Custom hook for updating task status
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: number, status: string }) => {
      const response = await apiClient.put(`/employee/tasks/${taskId}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task status updated successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || 
        'Failed to update task status. Please try again.'
      );
    }
  });
};

// Custom hook for starting a task
export const useStartTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiClient.post('/employee/tasks/start', { task_id: taskId });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activeTask'] });
      toast.success(`Started work on task #${data.task_id}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || 
        'Failed to start task. Please try again.'
      );
    }
  });
};

// Custom hook for stopping a task
export const useStopTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: number) => {
      const response = await apiClient.post('/employee/tasks/stop', { task_id: taskId });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['activeTask'] });
      toast.success(`Stopped work on task #${data.task_id}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || 
        'Failed to stop task. Please try again.'
      );
    }
  });
};

export default {
  fetchData,
  postData,
  updateData,
  useClients,
  useEmployees,
  useTasks,
  useTaskDetails,
  useUpdateTaskStatus,
  useStartTask,
  useStopTask
};
