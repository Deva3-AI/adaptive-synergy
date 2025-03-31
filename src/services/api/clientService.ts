
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientPreferences {
  design_preferences?: {
    style?: string;
    colors?: string[];
    fonts?: string[];
  };
  communication_frequency?: string;
  preferred_contact_method?: string;
  feedback_frequency?: string;
  dos?: string[];
  donts?: string[];
  industry_specific_requirements?: {
    compliance?: string[];
    accessibility?: string;
    other?: string[];
  };
}

const clientService = {
  /**
   * Get all clients
   */
  getClients: async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
      return [];
    }
  },

  /**
   * Get a specific client by ID
   * @param clientId - Client ID
   */
  getClientById: async (clientId: number) => {
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
      toast.error('Failed to load client details');
      return null;
    }
  },

  /**
   * Get a specific client by ID
   * @param clientId - Client ID
   */
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
      toast.error('Failed to load client details');
      return null;
    }
  },

  /**
   * Create a new client
   * @param clientData - Client data
   */
  createClient: async (clientData: any) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Client created successfully');
      return data;
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
      throw error;
    }
  },

  /**
   * Update an existing client
   * @param clientId - Client ID
   * @param clientData - Updated client data
   */
  updateClient: async (clientId: number, clientData: any) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('client_id', clientId)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Client updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      throw error;
    }
  },

  /**
   * Get tasks for a specific client
   * @param clientId - Client ID
   */
  getClientTasks: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users:assigned_to (name)
        `)
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching client tasks:', error);
      toast.error('Failed to load client tasks');
      return [];
    }
  },

  /**
   * Get client preferences
   * @param clientId - Client ID
   */
  getClientPreferences: async (clientId: number): Promise<ClientPreferences> => {
    try {
      const { data, error } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (error) throw error;
      
      // If no preferences exist, return defaults
      return data || {
        design_preferences: {
          style: 'Modern',
          colors: ['#4287f5', '#f54242', '#42f5a7'],
          fonts: ['Roboto', 'Open Sans']
        },
        communication_frequency: 'Weekly',
        preferred_contact_method: 'Email',
        feedback_frequency: 'Bi-weekly',
        dos: ['Provide regular updates', 'Focus on user experience'],
        donts: ['Miss deadlines', 'Change scope without approval'],
        industry_specific_requirements: {
          compliance: ['GDPR', 'WCAG 2.1'],
          accessibility: 'AA standard'
        }
      };
    } catch (error) {
      console.error('Error fetching client preferences:', error);
      return {};
    }
  },

  /**
   * Update client preferences
   * @param clientId - Client ID
   * @param preferences - Client preferences
   */
  updateClientPreferences: async (clientId: number, preferences: ClientPreferences) => {
    try {
      // First check if preferences exist
      const { data: existing } = await supabase
        .from('client_preferences')
        .select('id')
        .eq('client_id', clientId)
        .single();
      
      let result;
      
      if (existing) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('client_preferences')
          .update(preferences)
          .eq('client_id', clientId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Insert new preferences
        const { data, error } = await supabase
          .from('client_preferences')
          .insert({ ...preferences, client_id: clientId })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      toast.success('Client preferences updated successfully');
      return result;
    } catch (error) {
      console.error('Error updating client preferences:', error);
      toast.error('Failed to update client preferences');
      throw error;
    }
  },

  /**
   * Get client billing history
   * @param clientId - Client ID
   */
  getClientBilling: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching client billing:', error);
      toast.error('Failed to load client billing');
      return [];
    }
  },

  /**
   * Get client communication logs
   * @param clientId - Client ID
   */
  getClientCommunication: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select(`
          *,
          users:sender_id (name)
        `)
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching client communication:', error);
      toast.error('Failed to load client communication');
      return [];
    }
  },

  /**
   * Get client brands
   * @param clientId - Client ID
   */
  getClientBrands: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching client brands:', error);
      toast.error('Failed to load client brands');
      return [];
    }
  },

  /**
   * Create a new brand for a client
   * @param brandData - Brand data
   */
  createBrand: async (brandData: any) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert(brandData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Brand created successfully');
      return data;
    } catch (error) {
      console.error('Error creating brand:', error);
      toast.error('Failed to create brand');
      throw error;
    }
  },

  /**
   * Get tasks for a specific brand
   * @param brandId - Brand ID
   */
  getBrandTasks: async (brandId: number) => {
    try {
      // Since we don't have a direct brand_id in tasks, we'll need to get the client_id first
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('client_id')
        .eq('id', brandId)
        .single();
      
      if (brandError) throw brandError;
      
      if (!brand) {
        throw new Error('Brand not found');
      }
      
      // Now get tasks for this client with brand metadata
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (client_name),
          users:assigned_to (name)
        `)
        .eq('client_id', brand.client_id);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching brand tasks:', error);
      toast.error('Failed to load brand tasks');
      return [];
    }
  },

  /**
   * Get client invoices
   * @param clientId - Client ID
   */
  getClientInvoices: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching client invoices:', error);
      toast.error('Failed to load client invoices');
      return [];
    }
  }
};

export default clientService;
