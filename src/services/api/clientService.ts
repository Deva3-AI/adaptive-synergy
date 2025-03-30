
import { supabase } from '@/integrations/supabase/client';

/**
 * Client service for managing client-related operations
 */
const clientService = {
  /**
   * Get all clients
   */
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
      return [];
    }
  },
  
  /**
   * Get client details by ID
   */
  getClientDetails: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          brands (*)
        `)
        .eq('client_id', clientId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching client ${clientId}:`, error);
      return null;
    }
  },
  
  /**
   * Create a new client
   */
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
  
  /**
   * Update client details
   */
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
      console.error(`Error updating client ${clientId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get tasks for a specific client
   */
  getClientTasks: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          users (name, email)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error fetching tasks for client ${clientId}:`, error);
      return [];
    }
  },
  
  /**
   * Create a new task
   */
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
  
  /**
   * Get client preferences
   */
  getClientPreferences: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
        
      if (error) throw error;
      
      // Format preferences with default values if needed
      const formattedPreferences = {
        ...data,
        design_preferences: data.design_preferences || {
          colors: [],
          style: 'Modern',
          fonts: []
        },
        industry_specific_requirements: data.industry_specific_requirements || {},
        dos: data.dos || [],
        donts: data.donts || []
      };
      
      return formattedPreferences;
    } catch (error) {
      console.error(`Error fetching preferences for client ${clientId}:`, error);
      
      // Return default preferences structure
      return {
        id: 0,
        client_id: clientId,
        preferred_contact_method: 'Email',
        communication_frequency: 'Weekly',
        design_preferences: {
          colors: [],
          style: 'Modern',
          fonts: []
        },
        industry_specific_requirements: {},
        dos: [],
        donts: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }
};

export default clientService;
