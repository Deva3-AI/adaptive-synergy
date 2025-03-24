
import apiClient from '@/utils/apiUtils';

export interface Employee {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  role_name?: string;
  department?: string;
  joining_date?: string;
  status: 'active' | 'inactive' | 'onboarding' | 'offboarding';
  profile_image?: string;
}

export interface Attendance {
  attendance_id: number;
  user_id: number;
  employee_name?: string;
  login_time: string;
  logout_time?: string;
  work_date: string;
  total_hours?: number;
  status?: 'present' | 'absent' | 'late' | 'half-day';
}

export interface LeaveRequest {
  request_id: number;
  user_id: number;
  employee_name: string;
  leave_type: 'annual' | 'sick' | 'personal' | 'work_from_home' | 'other';
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  documents?: string[];
  created_at: string;
}

export interface JobPosting {
  posting_id: number;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  experience_level: string;
  location: string;
  salary_range?: string;
  status: 'open' | 'closed' | 'on_hold';
  created_at: string;
  applications_count: number;
  platform: 'indeed' | 'linkedin' | 'website' | 'other';
}

export interface JobCandidate {
  candidate_id: number;
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  cover_letter_url?: string;
  position_applied: string;
  job_posting_id: number;
  application_date: string;
  status: 'new' | 'screening' | 'interview' | 'technical' | 'offer' | 'hired' | 'rejected';
  source: 'indeed' | 'linkedin' | 'referral' | 'direct' | 'other';
  skills: string[];
  experience_years?: number;
  interview_notes?: string[];
  match_score?: number;
}

export interface Payslip {
  payslip_id: number;
  user_id: number;
  employee_name: string;
  period_start: string;
  period_end: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'draft' | 'generated' | 'sent' | 'paid';
  generated_at?: string;
  paid_at?: string;
  document_url?: string;
}

export interface HRTask {
  task_id: number;
  title: string;
  description: string;
  assignee_id: number;
  assignee_name?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  category: 'hiring' | 'onboarding' | 'benefits' | 'compliance' | 'training' | 'other';
  created_at: string;
}

export interface HRMetrics {
  time_to_hire: number; // days
  cost_per_hire: number;
  turnover_rate: number; // percentage
  headcount: number;
  open_positions: number;
  pending_leave_requests: number;
  employee_satisfaction: number; // percentage
  training_completion_rate: number; // percentage
  average_attendance_rate: number; // percentage
  average_tenure: number; // months
}

export interface HRTrend {
  id: number;
  title: string;
  description: string;
  source: string;
  relevance: 'low' | 'medium' | 'high';
  discovered_at: string;
  category: 'recruitment' | 'benefits' | 'workplace' | 'training' | 'compliance' | 'other';
  actionable: boolean;
  suggested_actions?: string[];
}

const hrService = {
  // Employee management
  getEmployees: async () => {
    try {
      const response = await apiClient.get('/hr/employees');
      return response.data;
    } catch (error) {
      console.error('Get employees error:', error);
      throw error;
    }
  },
  
  getEmployeeById: async (employeeId: number) => {
    try {
      const response = await apiClient.get(`/hr/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Get employee error:', error);
      throw error;
    }
  },
  
  updateEmployee: async (employeeId: number, data: Partial<Employee>) => {
    try {
      const response = await apiClient.put(`/hr/employees/${employeeId}`, data);
      return response.data;
    } catch (error) {
      console.error('Update employee error:', error);
      throw error;
    }
  },
  
  // Attendance
  getAttendanceRecords: async (startDate?: string, endDate?: string, employeeId?: number) => {
    try {
      let url = '/hr/attendance';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (employeeId) params.append('employee_id', employeeId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get attendance records error:', error);
      throw error;
    }
  },
  
  getAttendanceStats: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/hr/attendance-stats';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get attendance stats error:', error);
      throw error;
    }
  },
  
  // Leave requests
  getLeaveRequests: async (status?: string) => {
    try {
      let url = '/hr/leave-requests';
      if (status) {
        url += `?status=${status}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get leave requests error:', error);
      throw error;
    }
  },
  
  updateLeaveRequest: async (requestId: number, status: 'approved' | 'rejected', comments?: string) => {
    try {
      const response = await apiClient.put(`/hr/leave-requests/${requestId}`, {
        status,
        comments
      });
      return response.data;
    } catch (error) {
      console.error('Update leave request error:', error);
      throw error;
    }
  },
  
  // Recruitment
  getJobPostings: async (status?: string) => {
    try {
      let url = '/hr/job-postings';
      if (status) {
        url += `?status=${status}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get job postings error:', error);
      throw error;
    }
  },
  
  createJobPosting: async (jobData: Omit<JobPosting, 'posting_id' | 'created_at' | 'applications_count'>) => {
    try {
      const response = await apiClient.post('/hr/job-postings', jobData);
      return response.data;
    } catch (error) {
      console.error('Create job posting error:', error);
      throw error;
    }
  },
  
  getJobCandidates: async (jobPostingId?: number, status?: string) => {
    try {
      let url = '/hr/candidates';
      const params = new URLSearchParams();
      
      if (jobPostingId) params.append('job_posting_id', jobPostingId.toString());
      if (status) params.append('status', status);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get job candidates error:', error);
      throw error;
    }
  },
  
  updateCandidateStatus: async (candidateId: number, status: JobCandidate['status'], notes?: string) => {
    try {
      const response = await apiClient.put(`/hr/candidates/${candidateId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Update candidate status error:', error);
      throw error;
    }
  },
  
  analyzeResume: async (resumeFile: File, jobPostingId: number) => {
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_posting_id', jobPostingId.toString());
      
      const response = await apiClient.post('/hr/resume-analysis', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Analyze resume error:', error);
      throw error;
    }
  },
  
  // Payroll
  getPayslips: async (periodStart?: string, periodEnd?: string, employeeId?: number) => {
    try {
      let url = '/hr/payslips';
      const params = new URLSearchParams();
      
      if (periodStart) params.append('period_start', periodStart);
      if (periodEnd) params.append('period_end', periodEnd);
      if (employeeId) params.append('employee_id', employeeId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get payslips error:', error);
      throw error;
    }
  },
  
  generatePayslips: async (periodStart: string, periodEnd: string) => {
    try {
      const response = await apiClient.post('/hr/generate-payslips', {
        period_start: periodStart,
        period_end: periodEnd
      });
      return response.data;
    } catch (error) {
      console.error('Generate payslips error:', error);
      throw error;
    }
  },
  
  // HR tasks
  getHRTasks: async (status?: string, assigneeId?: number) => {
    try {
      let url = '/hr/tasks';
      const params = new URLSearchParams();
      
      if (status) params.append('status', status);
      if (assigneeId) params.append('assignee_id', assigneeId.toString());
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get HR tasks error:', error);
      throw error;
    }
  },
  
  createHRTask: async (taskData: Omit<HRTask, 'task_id' | 'created_at'>) => {
    try {
      const response = await apiClient.post('/hr/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Create HR task error:', error);
      throw error;
    }
  },
  
  updateHRTask: async (taskId: number, taskData: Partial<HRTask>) => {
    try {
      const response = await apiClient.put(`/hr/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Update HR task error:', error);
      throw error;
    }
  },
  
  // Analytics and insights
  getHRMetrics: async (timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    try {
      const response = await apiClient.get(`/hr/metrics?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Get HR metrics error:', error);
      throw error;
    }
  },
  
  getHRTrends: async () => {
    try {
      const response = await apiClient.get('/hr/trends');
      return response.data;
    } catch (error) {
      console.error('Get HR trends error:', error);
      throw error;
    }
  },
  
  analyzeEmployeePerformance: async (employeeId: number, startDate?: string, endDate?: string) => {
    try {
      let url = `/hr/analyze-performance?user_id=${employeeId}`;
      
      if (startDate) url += `&start_date=${startDate}`;
      if (endDate) url += `&end_date=${endDate}`;
      
      const response = await apiClient.post(url);
      return response.data;
    } catch (error) {
      console.error('Analyze employee performance error:', error);
      throw error;
    }
  }
};

export default hrService;
