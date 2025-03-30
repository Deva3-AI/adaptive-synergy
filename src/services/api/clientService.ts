
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

  // Add the missing methods
  getClientBrands: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/brands`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brands for client ${clientId}:`, error);
      // Return mock data for development
      return [
        {
          id: 1,
          name: "Brand Alpha",
          description: "Main brand identity",
          logo: "/brands/alpha-logo.png",
          client_id: clientId
        },
        {
          id: 2,
          name: "Brand Beta",
          description: "Secondary product line",
          logo: "/brands/beta-logo.png",
          client_id: clientId
        }
      ];
    }
  },

  getBrandTasks: async (clientId: number, brandId?: number) => {
    try {
      // Handle both function signatures
      let url;
      if (brandId) {
        url = `/clients/${clientId}/brands/${brandId}/tasks`;
      } else {
        // If brandId is not provided, assume clientId is the brandId
        url = `/brands/${clientId}/tasks`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tasks for brand:`, error);
      return [];
    }
  },

  createBrand: async (brandData: any) => {
    try {
      const response = await apiClient.post(`/clients/${brandData.client_id}/brands`, brandData);
      return response.data;
    } catch (error) {
      console.error(`Error creating brand for client ${brandData.client_id}:`, error);
      throw error;
    }
  },

  getClientPreferences: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/clients/${clientId}/preferences`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching preferences for client ${clientId}:`, error);
      // Return mock data for development
      return {
        designPreferences: {
          colorScheme: "Blue, White, Gray",
          typography: "Sans-serif, minimalist",
          layoutStyle: "Clean grid system with whitespace"
        },
        communicationPreferences: {
          preferredChannel: "Slack",
          responseTime: "Within 24 hours",
          meetingFrequency: "Weekly"
        },
        projectPreferences: {
          revisionCycles: "Maximum of 3 rounds",
          deliveryFormat: "PDF and source files",
          feedbackStyle: "Direct and constructive"
        },
        history: [
          {
            project: "Website Redesign",
            date: "Mar 2023",
            feedback: "Excellent work on the minimalist approach. Really captures our brand essence."
          },
          {
            project: "Logo Update",
            date: "Jan 2023",
            feedback: "The colors were perfect, but we'd prefer bolder typography in future projects."
          },
          {
            project: "Marketing Campaign",
            date: "Nov 2022",
            feedback: "Loved the creative direction. Would like more variety in social media formats next time."
          }
        ]
      };
    }
  }
};

export default clientService;
