
import apiClient, { handleApiError } from '@/utils/apiUtils';
import { supabase } from '@/integrations/supabase/client';

const clientService = {
  // Get all clients
  getClients: async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('client_name', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return handleApiError(error, []);
    }
  },
  
  // Get client by ID
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
      return handleApiError(error, null);
    }
  },
  
  // Create a new client
  createClient: async (clientData: any) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating client:', error);
      return handleApiError(error, null);
    }
  },
  
  // Update client
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
      return handleApiError(error, null);
    }
  },
  
  // Delete client
  deleteClient: async (clientId: number) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('client_id', clientId);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting client:', error);
      return handleApiError(error, { success: false });
    }
  },
  
  // Get client preferences
  getClientPreferences: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" which is fine
      
      return data || { client_id: clientId, design_preferences: {}, industry_specific_requirements: {} };
    } catch (error) {
      console.error('Error fetching client preferences:', error);
      return handleApiError(error, { client_id: clientId, design_preferences: {}, industry_specific_requirements: {} });
    }
  },
  
  // Update client preferences
  updateClientPreferences: async (clientId: number, preferencesData: any) => {
    try {
      // Check if preferences exist
      const { data: existingData, error: checkError } = await supabase
        .from('client_preferences')
        .select('id')
        .eq('client_id', clientId)
        .single();
      
      let result;
      
      if (existingData) {
        // Update existing preferences
        const { data, error } = await supabase
          .from('client_preferences')
          .update({
            ...preferencesData,
            updated_at: new Date().toISOString()
          })
          .eq('client_id', clientId)
          .select();
        
        if (error) throw error;
        result = data[0];
      } else {
        // Create new preferences
        const { data, error } = await supabase
          .from('client_preferences')
          .insert([{
            client_id: clientId,
            ...preferencesData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
        
        if (error) throw error;
        result = data[0];
      }
      
      return result;
    } catch (error) {
      console.error('Error updating client preferences:', error);
      return handleApiError(error, null);
    }
  },
  
  // Get client communication logs
  getClientCommunicationLogs: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select(`
          log_id,
          client_id,
          sender_id,
          users:sender_id (name),
          channel,
          message,
          created_at
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client communication logs:', error);
      return handleApiError(error, []);
    }
  },
  
  // Add client communication log
  addClientCommunicationLog: async (logData: any) => {
    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .insert([logData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding client communication log:', error);
      return handleApiError(error, null);
    }
  },
  
  // Get client brands
  getClientBrands: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('client_id', clientId)
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client brands:', error);
      return handleApiError(error, []);
    }
  },
  
  // Create client brand
  createClientBrand: async (brandData: any) => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .insert([brandData])
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating client brand:', error);
      return handleApiError(error, null);
    }
  },
  
  // Get client tasks
  getClientTasks: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          task_id,
          title,
          description,
          status,
          assigned_to,
          users:assigned_to (name),
          start_time,
          end_time,
          created_at
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client tasks:', error);
      return handleApiError(error, []);
    }
  },
  
  // Get client invoices
  getClientInvoices: async (clientId: number) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching client invoices:', error);
      return handleApiError(error, []);
    }
  }
};

export default clientService;
