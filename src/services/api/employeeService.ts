
import { mockData } from '../mockData';
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
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        const attendance = mockData.attendance.find(
          a => a.user_id === employeeId && a.work_date === today
        );
        resolve(attendance || null);
      }, 500);
    });
  },

  getTodayWorkHours: async (employeeId: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        const attendance = mockData.attendance.find(
          a => a.user_id === employeeId && a.work_date === today
        );
        
        if (!attendance || !attendance.login_time) {
          resolve(0);
          return;
        }
        
        const loginTime = new Date(attendance.login_time);
        const logoutTime = attendance.logout_time ? new Date(attendance.logout_time) : new Date();
        const hours = (logoutTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        resolve(Math.round(hours * 10) / 10); // Round to 1 decimal place
      }, 500);
    });
  },

  startWork: async (employeeId: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        const newAttendance = {
          attendance_id: mockData.attendance.length + 1,
          user_id: employeeId,
          login_time: new Date().toISOString(),
          logout_time: null,
          work_date: today
        };
        
        mockData.attendance.push(newAttendance);
        resolve(newAttendance);
      }, 500);
    });
  },

  stopWork: async (attendanceId: number, userId?: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendanceIndex = mockData.attendance.findIndex(
          a => a.attendance_id === attendanceId
        );
        
        if (attendanceIndex >= 0) {
          mockData.attendance[attendanceIndex].logout_time = new Date().toISOString();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  },

  // This method is needed by EmployeeLeaveRequests
  submitLeaveRequest: async (leaveData: any) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, id: Math.floor(Math.random() * 1000) });
      }, 500);
    });
  },

  // Get all leave requests for the current user
  getLeaveRequests: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            employee_id: 1,
            employee_name: 'John Doe',
            start_date: '2023-06-15',
            end_date: '2023-06-20',
            reason: 'Vacation',
            status: 'pending',
            leaveType: 'annual',
            createdAt: '2023-06-01T10:30:00Z',
            updatedAt: '2023-06-01T10:30:00Z'
          },
          {
            id: 2,
            employee_id: 1,
            employee_name: 'John Doe',
            start_date: '2023-07-10',
            end_date: '2023-07-12',
            reason: 'Personal matters',
            status: 'approved',
            leaveType: 'personal',
            createdAt: '2023-06-20T14:45:00Z',
            updatedAt: '2023-06-21T09:15:00Z'
          }
        ]);
      }, 500);
    });
  }
};

export default employeeService;
