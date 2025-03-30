
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
        console.log('Fetched clients in useClients hook:', data);
        return data;
      } catch (error) {
        console.error('Error fetching clients:', error);
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
            roles(role_name),
            employee_details(joining_date, employee_id, date_of_birth)
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
            clients(client_name)
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
