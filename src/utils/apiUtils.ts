
// Custom hooks to fetch data from Supabase
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Custom hook to fetch clients from Supabase
export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('client_name');

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }
    }
  });
};

// Custom hook to fetch tasks
export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            clients (client_id, client_name),
            users (user_id, name)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    }
  });
};

// Custom hook to fetch employees from Supabase
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            role_id,
            roles (role_name),
            employee_details (joining_date, employee_id, date_of_birth)
          `);

        if (error) throw error;
        
        // Format the data to match the expected structure
        return data.map(employee => ({
          user_id: employee.user_id,
          name: employee.name,
          email: employee.email,
          role_id: employee.role_id,
          role_name: employee.roles?.role_name || 'Unknown Role',
          joining_date: employee.employee_details?.joining_date,
          employee_id: employee.employee_details?.employee_id,
          date_of_birth: employee.employee_details?.date_of_birth
        }));
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    }
  });
};

// Fetch a specific client by ID
export const useClientById = (clientId: number) => {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
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
        throw error;
      }
    },
    enabled: !!clientId
  });
};

// Fetch brands for a specific client
export const useClientBrands = (clientId: number) => {
  return useQuery({
    queryKey: ['client-brands', clientId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('client_id', clientId);

        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error fetching brands for client ${clientId}:`, error);
        throw error;
      }
    },
    enabled: !!clientId
  });
};

// Fetch tasks for a specific employee
export const useEmployeeTasks = (userId: number) => {
  return useQuery({
    queryKey: ['employee-tasks', userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            clients (client_id, client_name)
          `)
          .eq('assigned_to', userId);

        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error fetching tasks for employee ${userId}:`, error);
        throw error;
      }
    },
    enabled: !!userId
  });
};

// Fetch employee attendance
export const useEmployeeAttendance = (userId: number) => {
  return useQuery({
    queryKey: ['employee-attendance', userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', userId)
          .order('work_date', { ascending: false });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error(`Error fetching attendance for employee ${userId}:`, error);
        throw error;
      }
    },
    enabled: !!userId
  });
};

// Utility for generic data fetching
export const fetchData = async (table: string, options = {}) => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*', options);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${table}:`, error);
    throw error;
  }
};

// Utility for API requests
export const apiRequest = async (endpoint: string, options = {}) => {
  try {
    const response = await fetch(`/api/${endpoint}`, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

// Types for common entities
export interface LeaveRequest {
  id: number;
  user_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface PaySlip {
  id: number;
  user_id: number;
  month: string;
  year: number;
  base_salary: number;
  bonuses: number;
  deductions: number;
  net_salary: number;
  generated_at: string;
  status: 'draft' | 'final' | 'paid';
}
