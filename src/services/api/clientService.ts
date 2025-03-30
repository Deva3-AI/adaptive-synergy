
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

  getClientPreferences: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/preferences`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching preferences for client ${clientId}:`, error);
      return {
        designPreferences: {
          colorScheme: "Neutral tones with blue accent",
          typography: "Modern sans-serif",
          layoutStyle: "Clean and minimal"
        },
        communicationPreferences: {
          preferredChannel: "Slack",
          responseTime: "Within 24 hours",
          meetingFrequency: "Weekly"
        },
        projectPreferences: {
          revisionCycles: 2,
          deliveryFormat: "Figma links and PDF exports",
          feedbackStyle: "Direct and specific"
        },
        history: [
          {
            date: "2023-05-15",
            project: "Website Redesign",
            feedback: "Loved the minimalist approach and clear typography"
          },
          {
            date: "2023-03-22",
            project: "Brand Guidelines",
            feedback: "Requested more vibrant secondary colors"
          }
        ]
      };
    }
  }
};

export default clientService;
