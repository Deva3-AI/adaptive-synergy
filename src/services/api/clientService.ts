
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
  // Additional fields needed by components
  communication_channel?: string;
  feedback_frequency?: string;
  dos?: string[];
  donts?: string[];
}

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
      let query = supabase.from('brands').select('*');
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client brands:', error);
      
      // Fallback to mock data
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
      
      if (clientId) {
        return mockBrands.filter(brand => brand.client_id === clientId);
      }
      
      return mockBrands;
    }
  },
  
  getBrandTasks: async (brandId: number) => {
    try {
      // In a real implementation, we would have a relation between tasks and brands
      // For now, we'll return mock data
      
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
      const { data, error } = await supabase
        .from('brands')
        .insert(brandData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating brand:', error);
      
      // Fallback to mock data
      const newBrand: Brand = {
        id: Math.floor(Math.random() * 1000) + 6,
        name: brandData.name,
        client_id: brandData.client_id,
        logo: brandData.logo || undefined,
        description: brandData.description || undefined,
        website: brandData.website || undefined,
        industry: brandData.industry || undefined,
        created_at: new Date().toISOString()
      };
      
      return newBrand;
    }
  },
  
  // Client preferences methods
  getClientPreferences: async (clientId: number): Promise<ClientPreferences | null> => {
    try {
      const { data, error } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No data found, return default preferences
          return {
            id: 0,
            client_id: clientId,
            communication_frequency: 'weekly',
            preferred_contact_method: 'email',
            communication_channel: 'email',
            feedback_frequency: 'weekly',
            design_preferences: {},
            industry_specific_requirements: {},
            dos: ['Respond promptly', 'Provide detailed updates', 'Follow brand guidelines'],
            donts: ['Miss deadlines', 'Change scope without approval', 'Ignore feedback'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }
        throw error;
      }
      
      // Add extra fields needed by components
      return {
        ...data,
        communication_channel: data.preferred_contact_method,
        feedback_frequency: data.communication_frequency,
        dos: ['Respond promptly', 'Provide detailed updates', 'Follow brand guidelines'],
        donts: ['Miss deadlines', 'Change scope without approval', 'Ignore feedback']
      };
    } catch (error) {
      console.error('Error fetching client preferences:', error);
      
      // Fallback to mock data
      const mockClientPreferences: ClientPreferences[] = [
        {
          id: 1,
          client_id: 1,
          communication_frequency: "weekly",
          preferred_contact_method: "email",
          communication_channel: "email",
          feedback_frequency: "weekly",
          design_preferences: { 
            color_scheme: "blue",
            style: "modern",
            font_preference: "sans-serif"
          },
          industry_specific_requirements: {
            compliance: ["GDPR", "CCPA"],
            features: ["inventory management", "customer portal"]
          },
          dos: ['Respond promptly', 'Provide detailed updates', 'Follow brand guidelines'],
          donts: ['Miss deadlines', 'Change scope without approval', 'Ignore feedback'],
          created_at: "2022-06-15T10:00:00Z",
          updated_at: "2023-01-10T15:30:00Z"
        },
        {
          id: 2,
          client_id: 2,
          communication_frequency: "daily",
          preferred_contact_method: "slack",
          communication_channel: "slack",
          feedback_frequency: "daily",
          design_preferences: { 
            color_scheme: "dark",
            style: "minimalist",
            font_preference: "monospace"
          },
          industry_specific_requirements: {
            compliance: ["SOC2", "HIPAA"],
            features: ["real-time monitoring", "audit logs"]
          },
          dos: ['Provide daily updates', 'Follow coding standards', 'Document all changes'],
          donts: ['Make changes without tests', 'Deploy on Fridays', 'Ignore security protocols'],
          created_at: "2023-01-10T09:15:00Z",
          updated_at: "2023-02-20T11:45:00Z"
        },
        {
          id: 3,
          client_id: 3,
          communication_frequency: "monthly",
          preferred_contact_method: "phone",
          communication_channel: "phone",
          feedback_frequency: "monthly",
          design_preferences: { 
            color_scheme: "neutral",
            style: "corporate",
            font_preference: "serif"
          },
          industry_specific_requirements: {
            compliance: ["ISO9001"],
            features: ["multi-language support", "currency conversion"]
          },
          dos: ['Schedule calls in advance', 'Provide written summaries', 'Focus on ROI metrics'],
          donts: ['Contact outside business hours', 'Miss monthly reports', 'Change pricing without notice'],
          created_at: "2022-11-18T15:20:00Z",
          updated_at: "2023-03-05T10:00:00Z"
        }
      ];
      
      const preferences = mockClientPreferences.find(p => p.client_id === clientId);
      
      if (preferences) {
        return preferences;
      }
      
      // If no preferences found for this client, create default ones
      return {
        id: mockClientPreferences.length + 1,
        client_id: clientId,
        communication_frequency: 'weekly',
        preferred_contact_method: 'email',
        communication_channel: 'email',
        feedback_frequency: 'weekly',
        design_preferences: {},
        industry_specific_requirements: {},
        dos: ['Respond promptly', 'Provide detailed updates', 'Follow brand guidelines'],
        donts: ['Miss deadlines', 'Change scope without approval', 'Ignore feedback'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  },
  
  updateClientPreferences: async (clientId: number, preferencesData: Partial<ClientPreferences>): Promise<ClientPreferences> => {
    try {
      // Check if preferences exist for this client
      const { data: existing, error: checkError } = await supabase
        .from('client_preferences')
        .select('id')
        .eq('client_id', clientId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let result;
      
      if (existing) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('client_preferences')
          .update({
            ...preferencesData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('client_preferences')
          .insert({
            client_id: clientId,
            communication_frequency: preferencesData.communication_frequency || 'weekly',
            preferred_contact_method: preferencesData.preferred_contact_method || 'email',
            design_preferences: preferencesData.design_preferences || {},
            industry_specific_requirements: preferencesData.industry_specific_requirements || {}
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      // Add extra fields needed by components
      return {
        ...result,
        communication_channel: result.preferred_contact_method,
        feedback_frequency: result.communication_frequency,
        dos: ['Respond promptly', 'Provide detailed updates', 'Follow brand guidelines'],
        donts: ['Miss deadlines', 'Change scope without approval', 'Ignore feedback']
      };
    } catch (error) {
      console.error('Error updating client preferences:', error);
      
      // Fallback to mock data
      const mockClientPreferences: ClientPreferences[] = [
        {
          id: 1,
          client_id: 1,
          communication_frequency: "weekly",
          preferred_contact_method: "email",
          communication_channel: "email",
          feedback_frequency: "weekly",
          design_preferences: { 
            color_scheme: "blue",
            style: "modern",
            font_preference: "sans-serif"
          },
          industry_specific_requirements: {
            compliance: ["GDPR", "CCPA"],
            features: ["inventory management", "customer portal"]
          },
          dos: ['Respond promptly', 'Provide detailed updates', 'Follow brand guidelines'],
          donts: ['Miss deadlines', 'Change scope without approval', 'Ignore feedback'],
          created_at: "2022-06-15T10:00:00Z",
          updated_at: "2023-01-10T15:30:00Z"
        }
      ];
      
      const index = mockClientPreferences.findIndex(p => p.client_id === clientId);
      
      if (index >= 0) {
        mockClientPreferences[index] = {
          ...mockClientPreferences[index],
          ...preferencesData,
          updated_at: new Date().toISOString()
        };
        return mockClientPreferences[index];
      }
      
      // If no preferences exist yet, create them
      const newPreferences: ClientPreferences = {
        id: mockClientPreferences.length + 1,
        client_id: clientId,
        communication_frequency: preferencesData.communication_frequency || 'weekly',
        preferred_contact_method: preferencesData.preferred_contact_method || 'email',
        communication_channel: preferencesData.preferred_contact_method || 'email',
        feedback_frequency: preferencesData.communication_frequency || 'weekly',
        design_preferences: preferencesData.design_preferences || {},
        industry_specific_requirements: preferencesData.industry_specific_requirements || {},
        dos: ['Respond promptly', 'Provide detailed updates', 'Follow brand guidelines'],
        donts: ['Miss deadlines', 'Change scope without approval', 'Ignore feedback'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return newPreferences;
    }
  }
};

export default clientService;
