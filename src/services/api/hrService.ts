
import apiClient from '@/utils/apiUtils';

// Define TypeScript interfaces for HR types
export interface Attendance {
  id: number;
  user_id: number;
  employee_name: string;
  date: string;
  login_time: string;
  logout_time: string | null;
  total_hours: number | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'work-from-home';
}

export interface Payslip {
  id: number;
  employee_id: number;
  employeeName: string;
  month: string;
  year: number;
  status: 'draft' | 'approved' | 'paid';
  amount: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  period_start: string;
  period_end: string;
  document_url: string;
}

export interface HRTask {
  task_id: number;
  title: string;
  description: string;
  assigned_to: number;
  assignee_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  due_date: string;
  category: 'hiring' | 'onboarding' | 'benefits' | 'compliance' | 'training' | 'other';
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements: string;
  status: 'active' | 'filled' | 'closed';
  department: string;
  location: string;
  created_at: string;
  updated_at: string;
  salary_range: string;
  application_deadline: string;
  platform: string;
}

export interface JobCandidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  job_id: number;
  status: 'new' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';
  created_at: string;
  updated_at: string;
  position_applied: string;
  application_date: string;
  source: string;
  skills: string[];
  match_score: number;
  interview_notes: string;
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
  
  // Leave management
  getLeaveRequests: async (status?: string) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/hr/leave-requests?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get leave requests error:', error);
      return [];
    }
  },
  
  createLeaveRequest: async (leaveData: any) => {
    try {
      const response = await apiClient.post('/hr/leave-requests', leaveData);
      return response.data;
    } catch (error) {
      console.error('Create leave request error:', error);
      throw error;
    }
  },
  
  updateLeaveStatus: async (leaveId: number, status: string, comments?: string) => {
    try {
      const response = await apiClient.put(`/hr/leave-requests/${leaveId}`, { status, comments });
      return response.data;
    } catch (error) {
      console.error('Update leave status error:', error);
      throw error;
    }
  },
  
  // Payroll management
  getPayslips: async (month?: string, year?: number) => {
    try {
      const params = new URLSearchParams();
      if (month) params.append('month', month);
      if (year) params.append('year', year.toString());
      
      const response = await apiClient.get(`/hr/payslips?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get payslips error:', error);
      return [];
    }
  },
  
  generatePayslip: async (payslipData: any) => {
    try {
      const response = await apiClient.post('/hr/payslips', payslipData);
      return response.data;
    } catch (error) {
      console.error('Generate payslip error:', error);
      throw error;
    }
  },
  
  approvePayslip: async (payslipId: number) => {
    try {
      const response = await apiClient.put(`/hr/payslips/${payslipId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Approve payslip error:', error);
      throw error;
    }
  },
  
  // HR Tasks management
  getHRTasks: async (status?: string) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/hr/tasks?${params.toString()}`);
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
  
  updateHRTaskStatus: async (taskId: number, status: string) => {
    try {
      const response = await apiClient.put(`/hr/tasks/${taskId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update HR task status error:', error);
      throw error;
    }
  },
  
  // Recruitment management
  getJobPostings: async (status?: string) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/hr/job-postings?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get job postings error:', error);
      return [];
    }
  },
  
  createJobPosting: async (jobData: any) => {
    try {
      const response = await apiClient.post('/hr/job-postings', jobData);
      return response.data;
    } catch (error) {
      console.error('Create job posting error:', error);
      throw error;
    }
  },
  
  getJobCandidates: async (jobId: number) => {
    try {
      const response = await apiClient.get(`/hr/job-postings/${jobId}/candidates`);
      return response.data;
    } catch (error) {
      console.error('Get job candidates error:', error);
      return [];
    }
  },
  
  updateCandidateStatus: async (candidateId: number, status: string, notes?: string) => {
    try {
      const response = await apiClient.put(`/hr/candidates/${candidateId}/status`, { status, notes });
      return response.data;
    } catch (error) {
      console.error('Update candidate status error:', error);
      throw error;
    }
  }
};

export default hrService;
