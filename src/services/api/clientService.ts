
import { apiRequest } from "@/utils/apiUtils";
import { mockClientBrands, mockBrandTasks, mockClientPreferences } from "@/utils/mockData";

// Brand type definition
export interface Brand {
  id: number;
  client_id: number;
  name: string;
  description?: string;
  logo_url?: string;
  created_at: string;
}

const clientService = {
  // Get all clients
  getClients: async () => {
    return apiRequest('/clients', 'get', undefined, []);
  },

  // Get client details
  getClientDetails: async (clientId: number) => {
    return apiRequest(`/clients/${clientId}`, 'get', undefined, {});
  },

  // Create a new client
  createClient: async (clientData: any) => {
    return apiRequest('/clients', 'post', clientData, {});
  },

  // Update an existing client
  updateClient: async (clientId: number, clientData: any) => {
    return apiRequest(`/clients/${clientId}`, 'put', clientData, {});
  },

  // Get tasks associated with a client
  getClientTasks: async (clientId: number) => {
    return apiRequest(`/clients/${clientId}/tasks`, 'get', undefined, []);
  },

  // Create a task for a client
  createTask: async (taskData: any) => {
    return apiRequest('/tasks', 'post', taskData, {});
  },

  // Get brands associated with a client
  getClientBrands: async (clientId: number) => {
    return apiRequest(`/clients/${clientId}/brands`, 'get', undefined, mockClientBrands.filter(brand => brand.client_id === clientId));
  },

  // Get tasks associated with a brand
  getBrandTasks: async (brandId: number) => {
    return apiRequest(`/brands/${brandId}/tasks`, 'get', undefined, mockBrandTasks.filter(task => task.brand_id === brandId));
  },

  // Create a new brand for a client
  createBrand: async (brandData: any) => {
    return apiRequest('/brands', 'post', brandData, {
      id: Math.floor(Math.random() * 1000),
      ...brandData,
      created_at: new Date().toISOString()
    });
  },

  // Get client preferences
  getClientPreferences: async (clientId: number) => {
    return apiRequest(`/clients/${clientId}/preferences`, 'get', undefined, 
      mockClientPreferences.find(pref => pref.client_id === clientId) || {
        client_id: clientId,
        communication_channel: "Email",
        feedback_frequency: "As needed",
        design_preferences: "No specific preferences recorded",
        dos: [],
        donts: []
      }
    );
  }
};

export default clientService;
