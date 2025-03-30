
import { apiRequest } from "@/utils/apiUtils";
import { supabase } from '@/integrations/supabase/client';

// Define types
export interface Brand {
  id: number;
  name: string;
  client_id: number;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  created_at: string;
}

export interface ClientPreferences {
  id: number;
  client_id: number;
  communication_frequency: string;
  preferred_contact_method: string;
  design_preferences?: any;
  industry_specific_requirements?: any;
  created_at: string;
  updated_at: string;
}

// Mock data for brands
const mockBrands: Brand[] = [
  {
    id: 1,
    name: "Acme Products",
    client_id: 1,
    logo: "/logos/acme.png",
    description: "Main product line for Acme Corporation",
    website: "https://acme-products.com",
    industry: "Manufacturing",
    created_at: "2022-06-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Acme Professional Services",
    client_id: 1,
    logo: "/logos/acme-pro.png",
    description: "B2B services division of Acme",
    website: "https://acme-pro.com",
    industry: "Consulting",
    created_at: "2022-08-22T14:30:00Z"
  },
  {
    id: 3,
    name: "TechCorp Solutions",
    client_id: 2,
    logo: "/logos/techcorp.png",
    description: "Enterprise software solutions",
    website: "https://techcorp-solutions.com",
    industry: "Technology",
    created_at: "2023-01-10T09:15:00Z"
  },
  {
    id: 4,
    name: "TechCorp Cloud",
    client_id: 2,
    logo: "/logos/techcorp-cloud.png",
    description: "Cloud infrastructure services",
    website: "https://techcorp-cloud.com",
    industry: "Technology",
    created_at: "2023-02-05T11:45:00Z"
  },
  {
    id: 5,
    name: "Global Services Group",
    client_id: 3,
    logo: "/logos/global.png",
    description: "International business services",
    website: "https://globalservicesgroup.com",
    industry: "Consulting",
    created_at: "2022-11-18T15:20:00Z"
  }
];

const clientService = {
  getClients: async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return apiRequest('/client/clients', 'get', undefined, []);
    }
  },
  
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
      return apiRequest(`/client/clients/${clientId}`, 'get', undefined, {});
    }
  },
  
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
      return apiRequest('/client/clients', 'post', clientData, {});
    }
  },
  
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
      return apiRequest(`/client/clients/${clientId}`, 'put', clientData, {});
    }
  },
  
  getClientTasks: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client tasks:', error);
      return apiRequest(`/client/clients/${clientId}/tasks`, 'get', undefined, []);
    }
  },
  
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
      return apiRequest('/client/tasks', 'post', taskData, {});
    }
  },
  
  // Brand-related methods
  getClientBrands: async (clientId?: number) => {
    try {
      if (clientId) {
        return mockBrands.filter(brand => brand.client_id === clientId);
      }
      return mockBrands;
    } catch (error) {
      console.error('Error fetching client brands:', error);
      return apiRequest(`/client/brands${clientId ? `?clientId=${clientId}` : ''}`, 'get', undefined, []);
    }
  },
  
  getBrandTasks: async (brandId: number) => {
    try {
      // This is mock data - in reality, tasks would be associated with brands
      return [
        {
          task_id: 101,
          title: `Website update for brand ${brandId}`,
          description: "Update branding elements on the website",
          status: "in_progress",
          due_date: "2023-07-15",
          priority: "high"
        },
        {
          task_id: 102,
          title: `Social media content for brand ${brandId}`,
          description: "Create monthly social media content calendar",
          status: "pending",
          due_date: "2023-07-20",
          priority: "medium"
        },
        {
          task_id: 103,
          title: `Email newsletter for brand ${brandId}`,
          description: "Design and write content for monthly newsletter",
          status: "completed",
          due_date: "2023-06-30",
          priority: "medium"
        }
      ];
    } catch (error) {
      console.error('Error fetching brand tasks:', error);
      return apiRequest(`/client/brands/${brandId}/tasks`, 'get', undefined, []);
    }
  },
  
  createBrand: async (brandData: any) => {
    try {
      // This would create a brand in the database
      const newBrand: Brand = {
        id: Math.max(...mockBrands.map(b => b.id)) + 1,
        name: brandData.name,
        client_id: brandData.client_id,
        logo: brandData.logo || undefined,
        description: brandData.description || undefined,
        website: brandData.website || undefined,
        industry: brandData.industry || undefined,
        created_at: new Date().toISOString()
      };
      
      return newBrand;
    } catch (error) {
      console.error('Error creating brand:', error);
      return apiRequest('/client/brands', 'post', brandData, {});
    }
  }
};

export default clientService;
