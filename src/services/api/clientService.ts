
import apiClient from '@/utils/apiUtils';

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
    return clientService.getClientDetails(clientId);
  },
  
  getClientPreferences: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/client/clients/${clientId}/preferences`);
      return response.data;
    } catch (error) {
      console.error('Get client preferences error:', error);
      throw error;
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
};

export default clientService;
