
import apiClient from '@/utils/apiUtils';

// Define the Brand type that is referenced in the code
export interface Brand {
  id: number;
  name: string;
  description: string;
  logo?: string;
  client_id: number;
  created_at?: string;
}

const clientService = {
  getClients: async () => {
    try {
      const response = await apiClient.get('/client/clients');
      return response.data;
    } catch (error) {
      console.error('Get clients error:', error);
      throw error;
    }
  },
  
  getClientDetails: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Get client details error:', error);
      throw error;
    }
  },
  
  getClientById: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Get client by ID error:', error);
      throw error;
    }
  },
  
  getClientPreferences: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Get client preferences error:', error);
      return []; // Return empty array to prevent UI errors
    }
  },
  
  createClient: async (clientData: any) => {
    try {
      const response = await apiClient.post('/client/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Create client error:', error);
      throw error;
    }
  },
  
  updateClient: async (clientId: number, clientData: any) => {
    try {
      const response = await apiClient.put(`/client/clients/${clientId}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Update client error:', error);
      throw error;
    }
  },
  
  // Tasks related to clients
  getClientTasks: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Get client tasks error:', error);
      throw error;
    }
  },
  
  createTask: async (taskData: any) => {
    try {
      const response = await apiClient.post('/client/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  // Brand related methods
  getClientBrands: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}/brands`);
      return response.data;
    } catch (error) {
      console.error('Get client brands error:', error);
      // Return mock data to prevent UI errors
      return [];
    }
  },

  getBrandTasks: async (brandId: number) => {
    try {
      const response = await apiClient.get(`/client/brands/${brandId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Get brand tasks error:', error);
      // Return mock data to prevent UI errors
      return [];
    }
  },

  createBrand: async (clientId: number, brandData: { name: string, description: string }) => {
    try {
      const response = await apiClient.post(`/client/clients/${clientId}/brands`, brandData);
      return response.data;
    } catch (error) {
      console.error('Create brand error:', error);
      throw error;
    }
  }
};

export default clientService;
