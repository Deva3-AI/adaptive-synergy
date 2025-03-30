import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

// Define types
export interface Brand {
  id: number;
  name: string;
  client_id: number;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  created_at?: string;
}

export interface ClientPreferences {
  id: number;
  client_id: number | null;
  communication_frequency: string | null;
  preferred_contact_method: string | null;
  design_preferences: Record<string, any> | any;
  industry_specific_requirements: Record<string, any> | any;
  created_at: string | null;
  updated_at: string | null;
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
  getClientBrands: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data as Brand[];
    } catch (error) {
      console.error('Error fetching client brands:', error);
      return apiRequest(`/clients/${clientId}/brands`, 'get', undefined, []);
    }
  },
  
  getBrandTasks: async (brandId: number) => {
    return apiRequest(`/brands/${brandId}/tasks`, 'get', undefined, [
      // Mock brand tasks
      {
        task_id: 1,
        title: 'Website Redesign',
        description: 'Redesign the brand website with new brand guidelines',
        status: 'in_progress',
        assigned_to: 2,
        created_at: '2023-06-01T10:00:00'
      },
      // More mock tasks
    ]);
  },
  
  // Create a new brand
  createBrand: async (brandData: Omit<Brand, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert(brandData)
        .select();
      
      if (error) throw error;
      return data[0] as Brand;
    } catch (error) {
      console.error('Error creating brand:', error);
      return apiRequest('/brands', 'post', brandData, {
        id: Date.now(),
        ...brandData,
        created_at: new Date().toISOString()
      });
    }
  }
};

export default clientService;
