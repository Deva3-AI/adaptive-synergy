
import apiClient from '@/utils/apiUtils';

export interface Attendance {
  attendance_id: number;
  user_id: number;
  login_time: string;
  logout_time: string | null;
  work_date: string;
}

export interface WorkSession {
  session_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  date: string;
}

const employeeService = {
  getEmployees: async () => {
    try {
      const response = await apiClient.get('/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  getEmployeeDetails: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employee ${employeeId}:`, error);
      return null;
    }
  },

  updateEmployeeDetails: async (employeeId: number, employeeData: any) => {
    try {
      const response = await apiClient.put(`/employees/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${employeeId}:`, error);
      throw error;
    }
  },

  getEmployeeAttendance: async (employeeId: number, startDate?: string, endDate?: string) => {
    try {
      let url = `/employees/${employeeId}/attendance`;
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance for employee ${employeeId}:`, error);
      return [];
    }
  },

  startWorkSession: async (employeeId: number) => {
    try {
      const response = await apiClient.post(`/employees/${employeeId}/work-sessions/start`);
      return response.data;
    } catch (error) {
      console.error(`Error starting work session for employee ${employeeId}:`, error);
      throw error;
    }
  },

  endWorkSession: async (employeeId: number, sessionId: number) => {
    try {
      const response = await apiClient.post(`/employees/${employeeId}/work-sessions/${sessionId}/end`);
      return response.data;
    } catch (error) {
      console.error(`Error ending work session ${sessionId} for employee ${employeeId}:`, error);
      throw error;
    }
  },

  getWorkSessions: async (employeeId: number, startDate?: string, endDate?: string) => {
    try {
      let url = `/employees/${employeeId}/work-sessions`;
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching work sessions for employee ${employeeId}:`, error);
      return [];
    }
  },

  getEmployeePerformance: async (employeeId: number, timeframe?: string) => {
    try {
      let url = `/employees/${employeeId}/performance`;
      if (timeframe) {
        url += `?timeframe=${timeframe}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching performance for employee ${employeeId}:`, error);
      return null;
    }
  },

  // Methods for Dashboard.tsx
  getTodayAttendance: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/employees/${employeeId}/attendance/today`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching today's attendance for employee ${employeeId}:`, error);
      return null;
    }
  },

  getTodayWorkHours: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/employees/${employeeId}/work-hours/today`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching today's work hours for employee ${employeeId}:`, error);
      return null;
    }
  },

  startWork: async (employeeId: number) => {
    try {
      const response = await apiClient.post(`/employees/${employeeId}/attendance/start`);
      return response.data;
    } catch (error) {
      console.error(`Error starting work for employee ${employeeId}:`, error);
      throw error;
    }
  },

  stopWork: async (employeeId: number, attendanceId: number) => {
    try {
      const response = await apiClient.post(`/employees/${employeeId}/attendance/${attendanceId}/stop`);
      return response.data;
    } catch (error) {
      console.error(`Error stopping work for employee ${employeeId}:`, error);
      throw error;
    }
  }
};

export default employeeService;
