
import { apiRequest } from "@/utils/apiUtils";
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

// Mock data for client brands
const mockClientBrands = [
  {
    id: 1,
    client_id: 1,
    name: "Acme Main Brand",
    description: "Primary brand identity for Acme Corporation",
    logo_url: "/assets/logos/acme-main.png",
    created_at: "2022-05-15T10:30:00Z"
  },
  {
    id: 2,
    client_id: 1,
    name: "Acme Premium",
    description: "Premium product line branding",
    logo_url: "/assets/logos/acme-premium.png",
    created_at: "2022-07-22T14:15:00Z"
  },
  {
    id: 3,
    client_id: 2,
    name: "TechStart",
    description: "Main brand for TechStart Inc",
    logo_url: "/assets/logos/techstart.png",
    created_at: "2022-03-10T09:45:00Z"
  },
  {
    id: 4,
    client_id: 3,
    name: "Global Logistics",
    description: "Corporate brand identity",
    logo_url: "/assets/logos/global-logistics.png",
    created_at: "2022-06-05T11:20:00Z"
  }
];

// Mock data for brand tasks
const mockBrandTasks = [
  {
    id: 101,
    brand_id: 1,
    title: "Website Homepage Redesign",
    status: "in_progress",
    due_date: "2023-12-15",
    assigned_to: "Jane Cooper",
    priority: "high"
  },
  {
    id: 102,
    brand_id: 1,
    title: "Social Media Graphics Package",
    status: "pending",
    due_date: "2023-12-20",
    assigned_to: "Alex Johnson",
    priority: "medium"
  },
  {
    id: 103,
    brand_id: 2,
    title: "Premium Catalog Design",
    status: "completed",
    due_date: "2023-11-28",
    assigned_to: "Sarah Williams",
    priority: "high"
  },
  {
    id: 104,
    brand_id: 3,
    title: "Brand Style Guide Update",
    status: "in_progress",
    due_date: "2023-12-10",
    assigned_to: "Michael Brown",
    priority: "medium"
  }
];

// Mock data for client preferences
const mockClientPreferences = [
  {
    client_id: 1,
    communication_channel: "Email",
    feedback_frequency: "Weekly",
    design_preferences: "Modern, minimalist design with blue and grey color scheme. Prefers clean layouts with ample white space.",
    dos: [
      "Include stakeholders in all milestone reviews",
      "Provide detailed weekly progress reports",
      "Schedule calls during morning hours (9-11 AM EST)"
    ],
    donts: [
      "Don't use bright red or orange in designs",
      "Avoid highly technical language in client-facing documents",
      "Don't schedule meetings on Fridays"
    ]
  },
  {
    client_id: 2,
    communication_channel: "Slack",
    feedback_frequency: "Bi-weekly",
    design_preferences: "Bold, innovative designs with emphasis on illustrations and animations. Prefers vibrant colors.",
    dos: [
      "Share creative references and inspiration",
      "Present multiple design options",
      "Include interactive elements where possible"
    ],
    donts: [
      "Don't use stock photography if avoidable",
      "Avoid formal business language",
      "Don't overuse gradients"
    ]
  },
  {
    client_id: 3,
    communication_channel: "Microsoft Teams",
    feedback_frequency: "As needed",
    design_preferences: "Professional, corporate aesthetic with navy blue and gold accents. Emphasizes data visualization and clarity.",
    dos: [
      "Include data sources for all metrics",
      "Maintain consistent branding across all materials",
      "Provide print-ready files for all deliverables"
    ],
    donts: [
      "Don't miss deadlines",
      "Avoid experimental layouts for corporate materials",
      "Don't change approved design elements without consultation"
    ]
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
