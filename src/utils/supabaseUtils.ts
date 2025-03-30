
export const transformSupabaseData = {
  // Handle getting role name from roles object or array
  getRoleName: (roles: any): string => {
    if (!roles) return 'Unknown';
    
    // If roles is an array with a role_name property directly
    if (Array.isArray(roles) && roles.length > 0) {
      return roles[0].role_name || 'Unknown';
    }
    
    // If roles is a simple object with a role_name property
    if (typeof roles === 'object' && roles.role_name) {
      return roles.role_name;
    }
    
    return 'Unknown';
  },
  
  // Handle getting employee details from employee_details object or array
  getEmployeeDetails: (employeeDetails: any): { 
    joining_date: string | null; 
    employee_id: string | null; 
    date_of_birth: string | null; 
  } => {
    const defaultDetails = {
      joining_date: null,
      employee_id: null,
      date_of_birth: null
    };
    
    if (!employeeDetails) return defaultDetails;
    
    // If employee_details is an array with the needed properties
    if (Array.isArray(employeeDetails) && employeeDetails.length > 0) {
      return {
        joining_date: employeeDetails[0].joining_date || null,
        employee_id: employeeDetails[0].employee_id || null,
        date_of_birth: employeeDetails[0].date_of_birth || null
      };
    }
    
    // If employee_details is a simple object with the needed properties
    if (typeof employeeDetails === 'object') {
      return {
        joining_date: employeeDetails.joining_date || null,
        employee_id: employeeDetails.employee_id || null,
        date_of_birth: employeeDetails.date_of_birth || null
      };
    }
    
    return defaultDetails;
  },
  
  // Format date for display
  formatDate: (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid Date';
    }
  },

  // Calculate work hours between login and logout times
  calculateWorkHours: (loginTime: string | null, logoutTime: string | null): number => {
    if (!loginTime || !logoutTime) return 0;
    
    try {
      const login = new Date(loginTime);
      const logout = new Date(logoutTime);
      const diffMs = logout.getTime() - login.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return parseFloat(diffHours.toFixed(2));
    } catch (e) {
      console.error('Error calculating work hours:', e);
      return 0;
    }
  }
};
