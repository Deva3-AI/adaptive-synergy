
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { LeaveRequest, PaySlip } from '@/services/api';

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
            clients (client_name)
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

// Custom hook to fetch employees
export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select(`
            *,
            roles (role_name),
            employee_details (
              joining_date,
              employee_id,
              date_of_birth
            )
          `)
          .eq('roles.role_name', 'employee');

        if (error) throw error;
        
        return data.map(employee => ({
          id: employee.user_id,
          name: employee.name,
          email: employee.email,
          role: employee.roles?.role_name,
          joiningDate: employee.employee_details?.joining_date,
          employeeId: employee.employee_details?.employee_id,
          dateOfBirth: employee.employee_details?.date_of_birth
        }));
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    }
  });
};

// Custom function to fetch financial data
export const fetchData = async (endpoint: string, params: any = {}) => {
  // Mock function to simulate API calls
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Revenue',
            data: [12, 19, 13, 15, 22, 27],
          },
          {
            label: 'Expenses',
            data: [8, 12, 8, 9, 15, 20],
          },
        ],
      });
    }, 1000);
  });
};

// Export types that don't have circular dependencies
export interface DateRange {
  from: Date;
  to: Date;
}
