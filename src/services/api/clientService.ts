
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

// Define types
export interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  client_id: number;
  website?: string;
  industry?: string;
  created_at?: string;
}

export interface ClientPreferences {
  id?: number;
  client_id?: number;
  preferred_contact_method?: string;
  communication_frequency?: string;
  design_preferences?: Record<string, any>;
  industry_specific_requirements?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  // Additional properties used in components
  communication_channel?: string;
  feedback_frequency?: string;
  dos?: string[];
  donts?: string[];
}

// Sample client data
const sampleClients = [
  {
    client_id: 1,
    client_name: "Social Land",
    description: "Digital marketing agency",
    contact_info: "contact@socialland.com"
  },
  {
    client_id: 2,
    client_name: "Koala Digital",
    description: "Web development company",
    contact_info: "info@koala-digital.com"
  }
];

// Sample brands data
const sampleBrands = [
  {
    id: 1,
    name: "SocialLand Main",
    description: "Main brand for SocialLand",
    logo: "/brands/socialland.png",
    client_id: 1,
    website: "https://socialland.com",
    industry: "Marketing"
  },
  {
    id: 2,
    name: "SocialLand Pro",
    description: "Professional solutions by SocialLand",
    logo: "/brands/socialland-pro.png",
    client_id: 1,
    website: "https://pro.socialland.com",
    industry: "B2B Services"
  }
];

// Sample preferences
const samplePreferences = {
  id: 1,
  client_id: 1,
  preferred_contact_method: "email",
  communication_frequency: "weekly",
  communication_channel: "Slack",
  feedback_frequency: "Weekly",
  design_preferences: {
    colors: ["#3498db", "#2ecc71", "#e74c3c"],
    style: "Minimalist",
    fonts: ["Roboto", "Open Sans"]
  },
  industry_specific_requirements: {
    target_audience: "Young professionals",
    key_competitors: ["Competitor A", "Competitor B"]
  },
  dos: [
    "Include brand colors in all designs",
    "Use high-quality images",
    "Send weekly progress reports"
  ],
  donts: [
    "Don't miss deadlines",
    "Don't use Comic Sans font",
    "Don't share project details publicly"
  ]
};

const clientService = {
  // Get all clients
  getClients: async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return apiRequest('/clients', 'get', undefined, sampleClients);
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
      return sampleClients.find(client => client.client_id === clientId) || null;
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
      return apiRequest('/clients', 'post', clientData, { ...clientData, client_id: Date.now() });
    }
  },
  
  // Update client details
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
      return apiRequest(`/clients/${clientId}`, 'put', clientData, { ...clientData, client_id: clientId });
    }
  },
  
  // Get client tasks
  getClientTasks: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          users (name)
        `)
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      // Format the data
      const formattedData = data.map(task => ({
        ...task,
        assignee_name: task.users?.name || 'Unassigned'
      }));
      
      return formattedData;
    } catch (error) {
      console.error('Error fetching client tasks:', error);
      return apiRequest(`/clients/${clientId}/tasks`, 'get', undefined, []);
    }
  },
  
  // Create a new task for client
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
      return apiRequest('/tasks', 'post', taskData, { ...taskData, task_id: Date.now() });
    }
  },
  
  // Get client preferences
  getClientPreferences: async (clientId: number): Promise<ClientPreferences> => {
    try {
      const { data, error } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Convert stored JSON into the expected format with dos and donts arrays
      const preferences: ClientPreferences = {
        ...data,
        communication_channel: data.preferred_contact_method || 'Email',
        feedback_frequency: data.communication_frequency || 'As needed',
        dos: (data.design_preferences as any)?.dos as string[] || [],
        donts: (data.design_preferences as any)?.donts as string[] || []
      };
      
      return preferences;
    } catch (error) {
      console.error('Error fetching client preferences:', error);
      // Return mock data if Supabase query fails
      return samplePreferences;
    }
  },
  
  // Get client brands
  getClientBrands: async (clientId: number): Promise<Brand[]> => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client brands:', error);
      return sampleBrands.filter(brand => brand.client_id === clientId);
    }
  },
  
  // Get brand tasks
  getBrandTasks: async (brandId: number) => {
    try {
      // In a real application, this would query tasks associated with specific brands
      // For now, we'll return mock data
      return [];
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
      return { ...brandData, id: Date.now(), created_at: new Date().toISOString() };
    }
  }
};

export default clientService;
