
import apiClient from '@/utils/apiUtils';

const clientService = {
  getClients: async () => {
    try {
      const response = await apiClient.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Get clients error:', error);
      return [];
    }
  },
  
  getClientDetails: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Get client details error:', error);
      return null;
    }
  },
  
  getClientById: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Get client by id error:', error);
      return null;
    }
  },
  
  createClient: async (clientData: any) => {
    try {
      const response = await apiClient.post('/clients', clientData);
      return response.data;
    } catch (error) {
      console.error('Create client error:', error);
      throw error;
    }
  },
  
  updateClient: async (clientId: number, clientData: any) => {
    try {
      const response = await apiClient.put(`/clients/${clientId}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Update client error:', error);
      throw error;
    }
  },
  
  getClientTasks: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Get client tasks error:', error);
      return [];
    }
  },
  
  createTask: async (taskData: any) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },
  
  getClientPreferences: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Get client preferences error:', error);
      return [];
    }
  }
};

export default clientService;
