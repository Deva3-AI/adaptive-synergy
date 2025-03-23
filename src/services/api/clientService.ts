
import apiClient from '@/utils/apiUtils';

export interface Client {
  client_id: number;
  client_name: string;
  description?: string;
  contact_info?: string;
  created_at?: string;
  logo?: string;
}

export interface ClientPreference {
  id: number;
  description: string;
  type: 'like' | 'dislike' | 'requirement';
  source: string;
  date: string;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
  client_id: number;
  description?: string;
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
      // Return mock data as fallback
      return {
        client_id: clientId,
        client_name: 'Client ' + clientId,
        description: 'Client description',
        contact_info: 'client@example.com',
        logo: '/placeholder.svg'
      };
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
  
  getClientHistory: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}/history`);
      return response.data;
    } catch (error) {
      console.error('Get client history error:', error);
      // Return empty array as fallback
      return [];
    }
  },
  
  getClientPreferences: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Get client preferences error:', error);
      // Return empty array as fallback
      return [];
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
  
  // New methods for brand management
  getClientBrands: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}/brands`);
      return response.data;
    } catch (error) {
      console.error('Get client brands error:', error);
      // Return sample data as fallback
      return [
        { id: 1, name: 'Brand X', client_id: clientId, logo: '/placeholder.svg' },
        { id: 2, name: 'Brand Y', client_id: clientId, logo: '/placeholder.svg' },
        { id: 3, name: 'Brand Z', client_id: clientId, logo: '/placeholder.svg' }
      ];
    }
  },
  
  getBrandDetails: async (brandId: number) => {
    try {
      const response = await apiClient.get(`/client/brands/${brandId}`);
      return response.data;
    } catch (error) {
      console.error('Get brand details error:', error);
      // Return sample data as fallback
      return {
        id: brandId,
        name: 'Brand ' + brandId,
        description: 'Brand description',
        client_id: 1,
        logo: '/placeholder.svg'
      };
    }
  },
  
  getBrandTasks: async (brandId: number) => {
    try {
      const response = await apiClient.get(`/client/brands/${brandId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Get brand tasks error:', error);
      // Return empty array as fallback
      return [];
    }
  },
  
  createBrand: async (clientId: number, brandData: any) => {
    try {
      const data = { ...brandData, client_id: clientId };
      const response = await apiClient.post('/client/brands', data);
      return response.data;
    } catch (error) {
      console.error('Create brand error:', error);
      throw error;
    }
  }
};

export default clientService;
