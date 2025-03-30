
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
  },
  
  // Tasks
  getTasks: async (status?: string) => {
    try {
      let url = '/employee/tasks';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },
  
  getTaskDetails: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/employee/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Get task details error:', error);
      throw error;
    }
  },
  
  updateTaskStatus: async (taskId: number, status: string) => {
    try {
      const response = await apiClient.put(`/employee/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update task status error:', error);
      throw error;
    }
  },
  
  // Add missing method
  getEmployeeDetails: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee details for ID ${employeeId}:`, error);
      return {
        id: employeeId,
        name: "Employee Name",
        position: "Job Title",
        department: "Department",
        email: "employee@example.com",
        phone: "123-456-7890",
        avatar: null,
        joined_date: "2023-01-15",
        stats: {
          tasks_completed: 24,
          tasks_in_progress: 3,
          average_task_completion_time: 2.5
        }
      };
    }
  }
};

export default employeeService;
