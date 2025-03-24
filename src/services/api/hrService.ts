
import apiClient from '@/utils/apiUtils';

export interface Attendance {
  attendance_id: number;
  user_id: number;
  employee_name?: string;
  login_time?: string;
  logout_time?: string;
  work_date: string;
  hours_worked?: number;
  status?: string;
}

export interface Payslip {
  payslip_id: number;
  user_id: number;
  employeeName: string;
  period_start: string;
  period_end: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'draft' | 'approved' | 'paid' | 'generated';
  document_url?: string;
  created_at: string;
}

export interface JobPosting {
  posting_id: number;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  status: 'active' | 'filled' | 'closed';
  location: string;
  salary_range: string;
  created_at: string;
  applications_count: number;
  platform?: string;
}

export interface JobCandidate {
  candidate_id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  resume_url?: string;
  position_applied: string;
  application_date: string;
  source: string;
  skills: string[];
  match_score: number;
  interview_notes?: string;
}

export interface HRTask {
  task_id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  priority: string;
  assignee_id?: number;
  assignee_name?: string;
  category: string;
  created_at: string;
}

export const hrService = {
  // Attendance management
  getAttendance: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiClient.get(`/hr/attendance?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get attendance error:', error);
      return [];
    }
  },
  
  markAttendance: async (data: { user_id: number, status: string, date: string }) => {
    try {
      const response = await apiClient.post('/hr/attendance', data);
      return response.data;
    } catch (error) {
      console.error('Mark attendance error:', error);
      throw error;
    }
  },
  
  // Employee management
  getEmployees: async () => {
    try {
      const response = await apiClient.get('/hr/employees');
      return response.data;
    } catch (error) {
      console.error('Get employees error:', error);
      return [];
    }
  },
  
  getEmployeeDetails: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/hr/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Get employee details error:', error);
      throw error;
    }
  },
  
  updateEmployee: async (employeeId: number, data: any) => {
    try {
      const response = await apiClient.put(`/hr/employees/${employeeId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update employee error:', error);
      throw error;
    }
  },
  
  // Payroll management
  getPayslips: async (status?: string, month?: string) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (month) params.append('month', month);
      
      const response = await apiClient.get(`/hr/payroll/payslips?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get payslips error:', error);
      return [];
    }
  },
  
  generatePayslip: async (employeeId: number, month: string) => {
    try {
      const response = await apiClient.post('/hr/payroll/generate', { employee_id: employeeId, month });
      return response.data;
    } catch (error) {
      console.error('Generate payslip error:', error);
      throw error;
    }
  },
  
  approvePayslip: async (payslipId: number) => {
    try {
      const response = await apiClient.patch(`/hr/payroll/payslips/${payslipId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Approve payslip error:', error);
      throw error;
    }
  },
  
  // Recruitment management
  getJobPostings: async (status?: string) => {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await apiClient.get(`/hr/recruitment/postings${params}`);
      return response.data;
    } catch (error) {
      console.error('Get job postings error:', error);
      return [];
    }
  },
  
  createJobPosting: async (postingData: any) => {
    try {
      const response = await apiClient.post('/hr/recruitment/postings', postingData);
      return response.data;
    } catch (error) {
      console.error('Create job posting error:', error);
      throw error;
    }
  },
  
  getCandidates: async (postingId?: number) => {
    try {
      const params = postingId ? `?posting_id=${postingId}` : '';
      const response = await apiClient.get(`/hr/recruitment/candidates${params}`);
      return response.data;
    } catch (error) {
      console.error('Get candidates error:', error);
      return [];
    }
  },
  
  updateCandidateStatus: async (candidateId: number, status: string, notes?: string) => {
    try {
      const response = await apiClient.patch(`/hr/recruitment/candidates/${candidateId}`, { 
        status, 
        interview_notes: notes 
      });
      return response.data;
    } catch (error) {
      console.error('Update candidate status error:', error);
      throw error;
    }
  },

  // HR Tasks
  getHRTasks: async (status?: string) => {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await apiClient.get(`/hr/tasks${params}`);
      return response.data;
    } catch (error) {
      console.error('Get HR tasks error:', error);
      return [];
    }
  },

  createHRTask: async (taskData: any) => {
    try {
      const response = await apiClient.post('/hr/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create HR task error:', error);
      throw error;
    }
  },

  updateHRTask: async (taskId: number, taskData: any) => {
    try {
      const response = await apiClient.put(`/hr/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Update HR task error:', error);
      throw error;
    }
  },

  // HR Metrics and Stats
  getAttendanceStats: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/hr/stats/attendance?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get attendance stats error:', error);
      return {};
    }
  },

  getHRMetrics: async () => {
    try {
      const response = await apiClient.get('/hr/metrics');
      return response.data;
    } catch (error) {
      console.error('Get HR metrics error:', error);
      return {};
    }
  },

  getHRTrends: async () => {
    try {
      const response = await apiClient.get('/hr/trends');
      return response.data;
    } catch (error) {
      console.error('Get HR trends error:', error);
      return [];
    }
  },
  
  getAttendanceRecords: async (startDate?: string, endDate?: string) => {
    return hrService.getAttendance(startDate, endDate);
  }
};

export default hrService;
