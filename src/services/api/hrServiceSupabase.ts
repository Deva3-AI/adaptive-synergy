import { mockUserData } from '@/utils/mockData';

// Define HR service with Supabase integration
const hrService = {
  // Get all employees
  getEmployees: async () => {
    // This would be a Supabase query in a real app
    try {
      return mockUserData.users.filter(user => 
        user.role === 'employee' || user.role === 'developer' || user.role === 'designer'
      );
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },
  
  // Get employee by ID
  getEmployeeById: async (employeeId: number) => {
    try {
      return mockUserData.users.find(user => user.id === employeeId);
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },
  
  // Submit leave request
  submitLeaveRequest: async (leaveData: any) => {
    try {
      // This would be a Supabase insert in a real app
      console.log('Submitting leave request:', leaveData);
      return { success: true, data: leaveData };
    } catch (error) {
      console.error('Error submitting leave request:', error);
      return { success: false, error: error };
    }
  },
  
  // Get leave requests
  getLeaveRequests: async () => {
    try {
      // This would be a Supabase select in a real app
      const leaveRequests = [
        {
          id: 1,
          employee_id: 1,
          employee_name: "John Doe",
          start_date: "2023-03-10",
          end_date: "2023-03-12",
          reason: "Vacation",
          status: "pending"
        },
        {
          id: 2,
          employee_id: 2,
          employee_name: "Jane Smith",
          start_date: "2023-04-01",
          end_date: "2023-04-05",
          reason: "Sick leave",
          status: "approved"
        }
      ];
      return leaveRequests;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  },
  
  // Approve leave request
  approveLeaveRequest: async (leaveId: number) => {
    try {
      // This would be a Supabase update in a real app
      console.log(`Approving leave request with ID: ${leaveId}`);
      return { success: true, message: 'Leave request approved' };
    } catch (error) {
      console.error('Error approving leave request:', error);
      return { success: false, error: error };
    }
  },
  
  // Reject leave request
  rejectLeaveRequest: async (leaveId: number) => {
    try {
      // This would be a Supabase update in a real app
      console.log(`Rejecting leave request with ID: ${leaveId}`);
      return { success: true, message: 'Leave request rejected' };
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      return { success: false, error: error };
    }
  },
  
  // Start work
  startWork: async () => {
    try {
      // This would be a Supabase insert in a real app
      console.log('Starting work');
      return { success: true, data: { attendance_id: 123, login_time: new Date().toISOString() } };
    } catch (error) {
      console.error('Error starting work:', error);
      return { success: false, error: error };
    }
  },
  
  // Stop work
  stopWork: async (attendanceId: number) => {
    try {
      // This would be a Supabase update in a real app
      console.log(`Stopping work with attendance ID: ${attendanceId}`);
      return { success: true, message: 'Work session ended' };
    } catch (error) {
      console.error('Error stopping work:', error);
      return { success: false, error: error };
    }
  },
  
  // Get today attendance
  getTodayAttendance: async () => {
    try {
      // This would be a Supabase select in a real app
      const attendance = {
        attendance_id: 123,
        user_id: 1,
        employee_name: "John Doe",
        login_time: new Date().toISOString(),
        logout_time: null,
        work_date: new Date().toISOString().split('T')[0],
        status: "present"
      };
      return attendance;
    } catch (error) {
      console.error('Error getting today attendance:', error);
      return null;
    }
  },
  
  // Get attendance history
  getAttendanceHistory: async (startDate?: string, endDate?: string) => {
    try {
      // This would be a Supabase select in a real app
      console.log(`Fetching attendance history from ${startDate} to ${endDate}`);
      const attendanceHistory = [
        {
          attendance_id: 123,
          user_id: 1,
          employee_name: "John Doe",
          login_time: "2023-01-01T08:00:00Z",
          logout_time: "2023-01-01T17:00:00Z",
          work_date: "2023-01-01",
          total_hours: 9,
          status: "present"
        },
        {
          attendance_id: 124,
          user_id: 1,
          employee_name: "John Doe",
          login_time: null,
          logout_time: null,
          work_date: "2023-01-02",
          total_hours: 0,
          status: "absent"
        }
      ];
      return attendanceHistory;
    } catch (error) {
      console.error('Error getting attendance history:', error);
      throw error;
    }
  },
};

export default hrService;
