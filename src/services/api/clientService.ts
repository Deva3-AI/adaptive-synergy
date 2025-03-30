
import apiClient from '@/utils/apiUtils';

export interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  client_id: number;
}

const clientService = {
  getClients: async () => {
    try {
      const response = await apiClient.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  getClientDetails: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client ${clientId}:`, error);
      return null;
    }
  },

  createClient: async (clientData: any) => {
    try {
      const response = await apiClient.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  updateClient: async (clientId: number, clientData: any) => {
    try {
      const response = await apiClient.put(`/clients/${clientId}`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Error updating client ${clientId}:`, error);
      throw error;
    }
  },

  getClientTasks: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/tasks`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for client ${clientId}:`, error);
      return [];
    }
  },

  createTask: async (taskData: any) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Methods for ClientBrandsList and ClientRequirementsPanel
  getClientBrands: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/brands`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brands for client ${clientId}:`, error);
      return [];
    }
  },

  getBrandTasks: async (clientId: number, brandId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/brands/${brandId}/tasks`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for brand ${brandId}:`, error);
      return [];
    }
  },

  createBrand: async (clientData: any) => {
    try {
      const response = await apiClient.post(`/clients/${clientData.client_id}/brands`, clientData);
      return response.data;
    } catch (error) {
      console.error(`Error creating brand for client ${clientData.client_id}:`, error);
      throw error;
    }
  },

  getClientPreferences: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/preferences`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching preferences for client ${clientId}:`, error);
      return null;
    }
  }
};

export default clientService;
