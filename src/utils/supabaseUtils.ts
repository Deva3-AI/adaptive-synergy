
// Utility function to help transform data from Supabase's nested jsonb objects
export const transformSupabaseData = {
  // Handle nested role data
  getRoleName: (roles: { role_name: any }[] | { role_name: any }): string => {
    if (!roles) return 'Unknown';
    if (Array.isArray(roles)) {
      return roles[0]?.role_name || 'Unknown';
    }
    return roles.role_name || 'Unknown';
  },
  
  // Handle nested employee details
  getEmployeeDetails: (details: any): { joining_date: string | null; employee_id: string | null; date_of_birth: string | null } => {
    if (!details) return { joining_date: null, employee_id: null, date_of_birth: null };
    if (Array.isArray(details)) {
      if (details.length === 0) return { joining_date: null, employee_id: null, date_of_birth: null };
      return {
        joining_date: details[0]?.joining_date || null,
        employee_id: details[0]?.employee_id || null,
        date_of_birth: details[0]?.date_of_birth || null
      };
    }
    return {
      joining_date: details.joining_date || null,
      employee_id: details.employee_id || null,
      date_of_birth: details.date_of_birth || null
    };
  }
};
