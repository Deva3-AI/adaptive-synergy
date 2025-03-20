
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

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
    const response = await api.get(queryUrl);
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
    const response = await api.post(url, data);
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
    const response = await api.put(url, data);
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
        // In development, create mock data if backend is not available
        if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
          return [
            { client_id: 1, client_name: 'Social Land', description: 'Uses Discord for communication', contact_info: 'client@socialland.com' },
            { client_id: 2, client_name: 'Koala Digital', description: 'Uses Slack for communication', contact_info: 'client@koaladigital.com' },
            // Add more mock clients if needed
          ];
        }
        
        // Regular API call
        const response = await api.get('/client');
        return response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
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
        // In development, create mock data if backend is not available
        if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
          return [
            { user_id: 1, name: 'Raje', email: 'raje.brandingbeez@gmail.com', role: { role_name: 'CEO' } },
            { user_id: 2, name: 'Priya', email: 'priya.brandingbeez@gmail.com', role: { role_name: 'Growth strategist' } },
            // Add more mock employees if needed
          ];
        }
        
        // Regular API call
        const response = await api.get('/users');
        return response.data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    }
  });
};

export default {
  fetchData,
  postData,
  updateData,
  useClients,
  useEmployees
};
