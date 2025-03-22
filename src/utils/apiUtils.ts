import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create a custom axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add Authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        // If token refresh is successful, update token and retry the original request
        const newToken = response.data.access_token;
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, log the user out
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to make API requests with fallback to mock data
export const apiRequest = async <T>(
  endpoint: string,
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  data?: any,
  mockData?: T,
  config?: any
): Promise<T> => {
  try {
    let response;
    
    switch (method) {
      case 'get':
        response = await apiClient.get(endpoint, config);
        break;
      case 'post':
        response = await apiClient.post(endpoint, data, config);
        break;
      case 'put':
        response = await apiClient.put(endpoint, data, config);
        break;
      case 'delete':
        response = await apiClient.delete(endpoint, config);
        break;
    }
    
    return response.data;
  } catch (error) {
    console.error(`API ${method.toUpperCase()} request to ${endpoint} failed:`, error);
    
    // If mockData is provided, use it as fallback
    if (mockData !== undefined) {
      console.log(`Using mock data for ${endpoint}`);
      return mockData;
    }
    
    // Otherwise, throw the error
    throw error;
  }
};

// Helper function to fetch data that can be used outside of React components
export const fetchData = async <T>(
  endpoint: string,
  mockData?: T
): Promise<T> => {
  return apiRequest<T>(endpoint, 'get', undefined, mockData);
};

// Types for our data models
export interface Employee {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  client_id: number;
  client_name: string;
  description: string;
  contact_info: string;
  created_at?: string;
}

export interface Task {
  task_id: number;
  title: string;
  description: string;
  client_id?: number;
  client_name?: string;
  assigned_to?: number;
  assignee_name?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
  updated_at?: string;
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'wfh' | 'halfDay' | 'other';
  startDate: string;
  endDate?: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaySlip {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paidDate?: string;
  status: 'pending' | 'paid';
}

// Mock data for clients
const MOCK_CLIENTS: Client[] = [
  {
    client_id: 1,
    client_name: "Social Land",
    description: "Digital marketing agency. Uses Slack for communication and Google doc for tasks",
    contact_info: "contact@socialland.com"
  },
  {
    client_id: 2,
    client_name: "Koala Digital",
    description: "Web development company. Uses Discord and Trello for project management",
    contact_info: "info@koala-digital.com"
  },
  {
    client_id: 3,
    client_name: "AC Digital",
    description: "E-commerce solutions provider. Uses Email and Asana for tasks",
    contact_info: "support@acdigital.com"
  },
  {
    client_id: 4,
    client_name: "Muse Digital",
    description: "Content creation studio. Uses Whatsapp and Base Camp for communication",
    contact_info: "hello@musedigital.com"
  }
];

// Mock data for employees
const MOCK_EMPLOYEES: Employee[] = [
  {
    user_id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role_id: 2,
    role_name: "Sr. Developer"
  },
  {
    user_id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role_id: 3,
    role_name: "UI/UX Designer"
  },
  {
    user_id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    role_id: 4,
    role_name: "Marketing Specialist"
  },
  {
    user_id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role_id: 5,
    role_name: "HR Manager"
  }
];

// Mock data for tasks
const MOCK_TASKS: Task[] = [
  {
    task_id: 1,
    title: "Website Redesign",
    description: "Complete redesign of the client's website",
    client_id: 1,
    client_name: "Social Land",
    assigned_to: 2,
    assignee_name: "Jane Smith",
    status: "in_progress",
    estimated_time: 40,
    actual_time: 22,
    start_time: "2023-09-01T09:00:00",
    created_at: "2023-08-28T14:00:00",
    updated_at: "2023-09-05T11:30:00"
  },
  {
    task_id: 2,
    title: "API Integration",
    description: "Integrate payment gateway API",
    client_id: 3,
    client_name: "AC Digital",
    assigned_to: 1,
    assignee_name: "John Doe",
    status: "pending",
    estimated_time: 16,
    created_at: "2023-09-02T10:00:00"
  },
  {
    task_id: 3,
    title: "Content Strategy",
    description: "Develop Q4 content strategy",
    client_id: 4,
    client_name: "Muse Digital",
    assigned_to: 3,
    assignee_name: "Mike Johnson",
    status: "completed",
    estimated_time: 24,
    actual_time: 20,
    start_time: "2023-08-25T09:00:00",
    end_time: "2023-09-01T17:00:00",
    created_at: "2023-08-20T11:00:00",
    updated_at: "2023-09-01T17:00:00"
  }
];

// Custom hooks for data fetching
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        return await apiRequest<Client[]>('/clients', 'get', undefined, MOCK_CLIENTS);
      } catch (error) {
        console.error('Error fetching clients, using fallback data:', error);
        return MOCK_CLIENTS;
      }
    }
  });
};

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        return await apiRequest<Employee[]>('/employees', 'get', undefined, MOCK_EMPLOYEES);
      } catch (error) {
        console.error('Error fetching employees, using fallback data:', error);
        return MOCK_EMPLOYEES;
      }
    }
  });
};

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        return await apiRequest<Task[]>('/tasks', 'get', undefined, MOCK_TASKS);
      } catch (error) {
        console.error('Error fetching tasks, using fallback data:', error);
        return MOCK_TASKS;
      }
    }
  });
};

export default apiClient;
