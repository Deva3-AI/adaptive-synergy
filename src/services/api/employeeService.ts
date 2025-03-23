
import apiClient from '@/utils/apiUtils';

export interface Attendance {
  attendance_id: number;
  user_id: number;
  login_time: string;
  logout_time?: string;
  work_date: string;
  total_hours?: number;
}

export interface WorkSession {
  session_id: number;
  user_id: number;
  start_time: string;
  end_time?: string;
  total_duration?: number;
  active_task_id?: number;
  tasks?: {
    task_id: number;
    title: string;
    duration: number;
  }[];
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

  // Get total worked hours for today
  getTodayWorkHours: async () => {
    try {
      const response = await apiClient.get('/employee/attendance/today/hours');
      return response.data;
    } catch (error) {
      console.error('Get today work hours error:', error);
      return { total_hours: 0 };
    }
  },

  // Get worked hours for a specific date range
  getWorkHoursByDateRange: async (startDate: string, endDate: string) => {
    try {
      const response = await apiClient.get(`/employee/attendance/hours?start_date=${startDate}&end_date=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Get work hours by date range error:', error);
      throw error;
    }
  },
  
  // Get current work session
  getCurrentWorkSession: async () => {
    try {
      const response = await apiClient.get('/employee/work-session/current');
      return response.data;
    } catch (error) {
      console.error('Get current work session error:', error);
      return null;
    }
  },
  
  // Get work session history
  getWorkSessionHistory: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/employee/work-session/history';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get work session history error:', error);
      throw error;
    }
  },
  
  // Get task time distribution
  getTaskTimeDistribution: async (timeframe: 'day' | 'week' | 'month' = 'week') => {
    try {
      const response = await apiClient.get(`/employee/analytics/task-time-distribution?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Get task time distribution error:', error);
      // Return mock data for development
      return {
        total_hours: 35,
        distribution: [
          { category: 'Design', hours: 12, percentage: 34 },
          { category: 'Development', hours: 15, percentage: 43 },
          { category: 'Content', hours: 5, percentage: 14 },
          { category: 'Other', hours: 3, percentage: 9 }
        ]
      };
    }
  }
};

export default employeeService;
