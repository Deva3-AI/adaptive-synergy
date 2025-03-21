
import apiClient from '@/utils/apiUtils';

export interface Attendance {
  attendance_id: number;
  user_id: number;
  login_time: string;
  logout_time?: string;
  work_date: string;
  total_hours?: number;
}

const employeeService = {
  // Attendance
  startWork: async () => {
    try {
      const response = await apiClient.post('/employee/attendance/login');
      return response.data;
    } catch (error) {
      console.error('Start work error:', error);
      throw error;
    }
  },
  
  stopWork: async (attendanceId: number) => {
    try {
      const response = await apiClient.post('/employee/attendance/logout', {
        attendance_id: attendanceId,
      });
      return response.data;
    } catch (error) {
      console.error('Stop work error:', error);
      throw error;
    }
  },
  
  getTodayAttendance: async () => {
    try {
      const response = await apiClient.get('/employee/attendance/today');
      return response.data;
    } catch (error) {
      console.error('Get attendance error:', error);
      // Return null instead of throwing to prevent UI errors
      return null;
    }
  },
  
  getAttendanceHistory: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/employee/attendance/history';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get attendance history error:', error);
      throw error;
    }
  },
  
  // Get all employees
  getEmployees: async () => {
    try {
      const response = await apiClient.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Get employees error:', error);
      throw error;
    }
  },
  
  // Get employee by id
  getEmployeeById: async (id: number) => {
    try {
      const response = await apiClient.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get employee error:', error);
      throw error;
    }
  },
};

export default employeeService;
