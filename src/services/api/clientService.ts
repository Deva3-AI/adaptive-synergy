
import { supabase } from '@/lib/supabase';
import { Json } from '@/types/supabase';

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
  preferred_contact_method: string | null;
  communication_frequency: string | null;
  design_preferences: Record<string, any> | null;
  industry_specific_requirements: Record<string, any> | null;
  created_at: string | null;
  updated_at: string | null;
  // Additional fields for compatibility
  communication_channel?: string;
  feedback_frequency?: string;
  dos?: string[];
  donts?: string[];
}

const clientService = {
  getClients: async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      
      // Fallback to mock data
      return [
        {
          client_id: 1,
          client_name: "Social Land",
          description: "Digital marketing agency. Uses Slack for communication and Google doc for tasks",
          contact_info: "contact@socialland.com",
          created_at: new Date().toISOString()
        },
        {
          client_id: 2,
          client_name: "Koala Digital",
          description: "Web development company. Uses Discord and Trello for project management",
          contact_info: "info@koala-digital.com",
          created_at: new Date().toISOString()
        },
        {
          client_id: 3,
          client_name: "AC Digital",
          description: "E-commerce solutions provider. Uses Email and Asana for tasks",
          contact_info: "support@acdigital.com",
          created_at: new Date().toISOString()
        }
      ];
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
      console.error(`Error fetching client ${clientId}:`, error);
      return null;
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
      throw error;
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
      throw error;
    }
  },
  
  getClientTasks: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          task_id,
          title,
          description,
          status,
          estimated_time,
          actual_time,
          start_time,
          end_time,
          created_at,
          updated_at,
          assigned_to,
          users:assigned_to (name)
        `)
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      return data.map((task: any) => ({
        ...task,
        assignee_name: task.users?.name
      }));
    } catch (error) {
      console.error(`Error fetching tasks for client ${clientId}:`, error);
      return [];
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
      throw error;
    }
  },
  
  getClientPreferences: async (clientId: number) => {
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
            preferred_contact_method: 'email',
            communication_frequency: 'weekly',
            communication_channel: 'email',
            feedback_frequency: 'bi-weekly',
            design_preferences: {
              colors: ['#3B82F6', '#10B981', '#6366F1'],
              style: 'modern',
              fonts: ['Inter', 'Roboto']
            },
            industry_specific_requirements: {
              compliance: ['GDPR', 'CCPA'],
              accessibility: 'WCAG 2.1 AA'
            },
            dos: [
              'Respond within 24 hours',
              'Provide detailed progress reports',
              'Schedule video calls for major milestones'
            ],
            donts: [
              'Use technical jargon in communications',
              'Schedule meetings on Fridays',
              'Make design decisions without approval'
            ],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          } as ClientPreferences;
        }
        throw error;
      }
      
      // Convert JSON data to add additional fields
      const preferences: ClientPreferences = {
        ...data,
        communication_channel: data.preferred_contact_method,
        feedback_frequency: data.communication_frequency,
        dos: data.design_preferences?.dos || ['Respond within 24 hours', 'Provide weekly updates', 'Document all decisions'],
        donts: data.industry_specific_requirements?.donts || ['Miss deadlines', 'Change scope without approval', 'Use technical jargon']
      };
      
      return preferences;
    } catch (error) {
      console.error(`Error fetching preferences for client ${clientId}:`, error);
      
      // Return default preferences if there's an error
      return {
        id: 0,
        client_id: clientId,
        preferred_contact_method: 'email',
        communication_frequency: 'weekly',
        communication_channel: 'email',
        feedback_frequency: 'bi-weekly',
        design_preferences: {
          colors: ['#3B82F6', '#10B981', '#6366F1'],
          style: 'modern',
          fonts: ['Inter', 'Roboto']
        },
        industry_specific_requirements: {
          compliance: ['GDPR', 'CCPA'],
          accessibility: 'WCAG 2.1 AA'
        },
        dos: [
          'Respond within 24 hours',
          'Provide detailed progress reports',
          'Schedule video calls for major milestones'
        ],
        donts: [
          'Use technical jargon in communications',
          'Schedule meetings on Fridays',
          'Make design decisions without approval'
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ClientPreferences;
    }
  },
  
  // Methods for brand management
  getClientBrands: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      return data as Brand[];
    } catch (error) {
      console.error(`Error fetching brands for client ${clientId}:`, error);
      
      // Mock data for fallback
      return [
        {
          id: 1,
          name: 'Brand A',
          client_id: clientId,
          logo: 'https://placehold.co/200x200?text=BrandA',
          description: 'Main brand for digital presence',
          website: 'https://branda.example.com',
          industry: 'Technology',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Brand B',
          client_id: clientId,
          logo: 'https://placehold.co/200x200?text=BrandB',
          description: 'Secondary brand for product line',
          website: 'https://brandb.example.com',
          industry: 'Retail',
          created_at: new Date().toISOString()
        }
      ];
    }
  },
  
  getBrandTasks: async (brandId: number) => {
    // In a real app, we would have a dedicated table for brand tasks
    // For now, return mock data
    return [
      {
        task_id: 101,
        title: 'Social Media Calendar',
        description: 'Create monthly social media calendar for brand',
        status: 'in_progress',
        assigned_to: 2,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        task_id: 102,
        title: 'Website Update',
        description: 'Update product listings on website',
        status: 'pending',
        assigned_to: 1,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  },
  
  createBrand: async (brandData: Omit<Brand, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert({
          name: brandData.name,
          client_id: brandData.client_id,
          logo: brandData.logo || '',
          description: brandData.description || '',
          website: brandData.website || '',
          industry: brandData.industry || ''
        })
        .select();
      
      if (error) throw error;
      return data[0] as Brand;
    } catch (error) {
      console.error('Error creating brand:', error);
      
      // Mock successful creation
      return {
        id: Math.floor(Math.random() * 1000) + 10,
        ...brandData,
        created_at: new Date().toISOString()
      };
    }
  }
};

export default clientService;
