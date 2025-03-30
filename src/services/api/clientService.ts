
import { apiRequest } from "@/utils/apiUtils";
import { mockClientBrands, mockBrandTasks, mockClientPreferences } from "@/utils/mockData";
import { supabase } from '@/integrations/supabase/client';

// Brand type definition
export interface Brand {
  id: number;
  client_id: number;
  name: string;
  description?: string;
  logo_url?: string;
  created_at: string;
}

// Client Preferences type
export interface ClientPreferences {
  client_id: number;
  communication_channel: string;
  feedback_frequency: string;
  design_preferences: string;
  dos: string[];
  donts: string[];
}

const clientService = {
  // Get all clients
  getClients: async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('client_name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return apiRequest('/clients', 'get', undefined, []);
    }
  },

  // Get client details
  getClientDetails: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client details:', error);
      return apiRequest(`/clients/${clientId}`, 'get', undefined, {
        client_id: clientId,
        client_name: `Client ${clientId}`,
        description: "Client description",
        contact_info: "client@example.com"
      });
    }
  },

  // Create a new client
  createClient: async (clientData: any) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating client:', error);
      return apiRequest('/clients', 'post', clientData, {});
    }
  },

  // Update an existing client
  updateClient: async (clientId: number, clientData: any) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('client_id', clientId)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error updating client:', error);
      return apiRequest(`/clients/${clientId}`, 'put', clientData, {});
    }
  },

  // Get tasks associated with a client
  getClientTasks: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, users:assigned_to(name)')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client tasks:', error);
      return apiRequest(`/clients/${clientId}/tasks`, 'get', undefined, []);
    }
  },

  // Create a task for a client
  createTask: async (taskData: any) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating task:', error);
      return apiRequest('/tasks', 'post', taskData, {});
    }
  },

  // Get brands associated with a client
  getClientBrands: async (clientId: number) => {
    // In a real implementation, this would fetch from a brands table
    // For now, we'll use mock data
    return apiRequest(`/clients/${clientId}/brands`, 'get', undefined, mockClientBrands.filter(brand => brand.client_id === clientId));
  },

  // Get tasks associated with a brand
  getBrandTasks: async (brandId: number) => {
    // In a real implementation, this would fetch from tasks with brand_id
    // For now, we'll use mock data
    return apiRequest(`/brands/${brandId}/tasks`, 'get', undefined, mockBrandTasks.filter(task => task.brand_id === brandId));
  },

  // Create a new brand for a client
  createBrand: async (brandData: any) => {
    // In a real implementation, this would insert into a brands table
    // For now, we'll return mock data
    return apiRequest('/brands', 'post', brandData, {
      id: Math.floor(Math.random() * 1000),
      ...brandData,
      created_at: new Date().toISOString()
    });
  },

  // Get client preferences
  getClientPreferences: async (clientId: number) => {
    // In a real implementation, this would fetch from a client_preferences table
    // For now, we'll use mock data
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
