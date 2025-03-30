
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

  // Adding missing methods

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
  },

  getClientBrands: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/brands`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brands for client ${clientId}:`, error);
      return [
        {
          id: 1,
          name: "Brand One",
          description: "Main consumer brand",
          logo: "/logos/brand1.png",
          client_id: clientId
        },
        {
          id: 2,
          name: "Brand Two",
          description: "B2B services brand",
          logo: "/logos/brand2.png",
          client_id: clientId
        }
      ];
    }
  },

  getBrandTasks: async (brandId: number) => {
    try {
      const response = await apiClient.get(`/brands/${brandId}/tasks`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for brand ${brandId}:`, error);
      return [
        {
          id: 101,
          title: "Brand refresh",
          status: "in_progress",
          due_date: "2023-11-30",
          assigned_to: "Designer Team"
        },
        {
          id: 102,
          title: "Social media assets",
          status: "pending",
          due_date: "2023-12-15",
          assigned_to: "Marketing Team"
        }
      ];
    }
  },

  createBrand: async (brandData: any) => {
    try {
      const response = await apiClient.post('/brands', brandData);
      return response.data;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }
};

export default clientService;
