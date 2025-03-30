
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

export interface Brand {
  id: number;
  name: string;
  client_id: number;
  logo: string;
  description: string;
  website: string;
  industry: string;
  created_at: string;
}

export interface ClientPreferences {
  id: number;
  client_id: number;
  communication_frequency: string;
  preferred_contact_method: string;
  design_preferences: Record<string, any>;
  industry_specific_requirements: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Mock data for brands
const mockBrands: Brand[] = [
  {
    id: 1,
    name: "Social Land Digital",
    client_id: 1,
    logo: "/logos/social-land.png",
    description: "Primary brand for Social Land client",
    website: "https://socialland.com",
    industry: "Digital Marketing",
    created_at: "2023-01-15T00:00:00Z"
  },
  {
    id: 2,
    name: "Social Land Events",
    client_id: 1,
    logo: "/logos/social-events.png",
    description: "Events division of Social Land",
    website: "https://socialland.com/events",
    industry: "Event Management",
    created_at: "2023-02-10T00:00:00Z"
  },
  {
    id: 3,
    name: "Koala Web",
    client_id: 2,
    logo: "/logos/koala-digital.png",
    description: "Web development division",
    website: "https://koala-digital.com",
    industry: "Web Development",
    created_at: "2023-03-05T00:00:00Z"
  },
  {
    id: 4,
    name: "Koala Apps",
    client_id: 2,
    logo: "/logos/koala-apps.png",
    description: "Mobile app development division",
    website: "https://koala-digital.com/apps",
    industry: "Mobile Development",
    created_at: "2023-03-15T00:00:00Z"
  }
];

// Mock data for client preferences
const mockClientPreferences: ClientPreferences[] = [
  {
    id: 1,
    client_id: 1,
    communication_frequency: "weekly",
    preferred_contact_method: "email",
    design_preferences: {
      color_scheme: "blue",
      style: "modern",
      font_preference: "sans-serif"
    },
    industry_specific_requirements: {
      compliance: ["GDPR", "CCPA"],
      certifications: ["ISO 27001"]
    },
    created_at: "2023-01-15T00:00:00Z",
    updated_at: "2023-06-10T00:00:00Z"
  },
  {
    id: 2,
    client_id: 2,
    communication_frequency: "daily",
    preferred_contact_method: "slack",
    design_preferences: {
      color_scheme: "dark",
      style: "minimalist",
      font_preference: "monospace"
    },
    industry_specific_requirements: {
      compliance: ["HIPAA"],
      certifications: ["SOC 2"]
    },
    created_at: "2023-02-20T00:00:00Z",
    updated_at: "2023-05-15T00:00:00Z"
  }
];

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
  
  // Get client details by ID
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
      return apiRequest(`/clients/${clientId}`, 'get', undefined, {});
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
  
  // Get client tasks
  getClientTasks: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users (name)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data
      const formattedData = data.map(task => ({
        ...task,
        client_name: task.clients?.client_name,
        assignee_name: task.users?.name
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching client tasks:', error);
      return apiRequest(`/clients/${clientId}/tasks`, 'get', undefined, []);
    }
  },
  
  // Create a new task for a client
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
      return apiRequest(`/clients/${taskData.client_id}/tasks`, 'post', taskData, {});
    }
  },
  
  // Get client brands
  getClientBrands: async (clientId: number) => {
    try {
      // Query the brands table from Supabase
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data;
      }
      
      // Fallback to mock data
      return mockBrands.filter(brand => brand.client_id === clientId);
    } catch (error) {
      console.error('Error fetching client brands:', error);
      // Fallback to mock data
      return mockBrands.filter(brand => brand.client_id === clientId);
    }
  },
  
  // Get brand tasks
  getBrandTasks: async (brandId: number) => {
    try {
      // This is a mock implementation since we don't have a direct relationship between brands and tasks
      // In a real implementation, we would query tasks with brand_id or use a junction table
      const brand = mockBrands.find(b => b.id === brandId);
      
      if (!brand) {
        throw new Error('Brand not found');
      }
      
      // Get client tasks and filter/mark them as related to this brand
      // This is just a mock implementation
      const clientTasks = await clientService.getClientTasks(brand.client_id);
      
      // In a real app, we would filter tasks specifically for this brand
      // Here we're just returning all client tasks as if they were brand tasks
      return clientTasks;
    } catch (error) {
      console.error('Error fetching brand tasks:', error);
      return [];
    }
  },
  
  // Create a new brand
  createBrand: async (brandData: Omit<Brand, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert(brandData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating brand:', error);
      
      // Mock creation
      const newBrand: Brand = {
        id: Math.max(...mockBrands.map(b => b.id)) + 1,
        ...brandData,
        created_at: new Date().toISOString()
      };
      
      mockBrands.push(newBrand);
      return newBrand;
    }
  },
  
  // Get client preferences
  getClientPreferences: async (clientId: number) => {
    try {
      // Query the client_preferences table from Supabase
      const { data, error } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (error) {
        // If no preferences found, return a default
        if (error.code === 'PGRST116') {
          // Fallback to mock data for this client
          const mockPref = mockClientPreferences.find(p => p.client_id === clientId);
          if (mockPref) return mockPref;
          
          // Generate default preferences
          return {
            id: 0,
            client_id: clientId,
            communication_frequency: 'weekly',
            preferred_contact_method: 'email',
            design_preferences: {},
            industry_specific_requirements: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching client preferences:', error);
      
      // Fallback to mock data
      const mockPref = mockClientPreferences.find(p => p.client_id === clientId);
      if (mockPref) return mockPref;
      
      // Generate default preferences
      return {
        id: 0,
        client_id: clientId,
        communication_frequency: 'weekly',
        preferred_contact_method: 'email',
        design_preferences: {},
        industry_specific_requirements: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },
  
  // Update client preferences
  updateClientPreferences: async (clientId: number, preferencesData: Partial<ClientPreferences>) => {
    try {
      // Check if preferences exist
      const { data: existingData, error: checkError } = await supabase
        .from('client_preferences')
        .select('id')
        .eq('client_id', clientId)
        .maybeSingle();
      
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      if (existingData) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('client_preferences')
          .update({
            ...preferencesData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id)
          .select();
        
        if (error) throw error;
        return data[0];
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('client_preferences')
          .insert({
            client_id: clientId,
            ...preferencesData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();
        
        if (error) throw error;
        return data[0];
      }
    } catch (error) {
      console.error('Error updating client preferences:', error);
      
      // Mock update
      const prefIndex = mockClientPreferences.findIndex(p => p.client_id === clientId);
      
      if (prefIndex >= 0) {
        mockClientPreferences[prefIndex] = {
          ...mockClientPreferences[prefIndex],
          ...preferencesData,
          updated_at: new Date().toISOString()
        };
        return mockClientPreferences[prefIndex];
      } else {
        const newPref: ClientPreferences = {
          id: Math.max(...mockClientPreferences.map(p => p.id)) + 1,
          client_id: clientId,
          communication_frequency: preferencesData.communication_frequency || 'weekly',
          preferred_contact_method: preferencesData.preferred_contact_method || 'email',
          design_preferences: preferencesData.design_preferences || {},
          industry_specific_requirements: preferencesData.industry_specific_requirements || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockClientPreferences.push(newPref);
        return newPref;
      }
    }
  }
};

export default clientService;
