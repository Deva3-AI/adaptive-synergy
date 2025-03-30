
import apiClient from '@/utils/apiUtils';

export interface Attendance {
  attendance_id?: number;
  id?: number;
  user_id: number;
  login_time: string;
  logout_time?: string;
  work_date: string;
  total_hours?: number;
  status?: string;
  employee_name?: string;
}

export interface Payslip {
  payslip_id?: number;
  id?: number;
  user_id: number;
  employeeName: string;
  employee_name?: string; // For compatibility
  month: string;
  year: number;
  period_start?: string;
  period_end?: string;
  basicSalary: number;
  basic_salary?: number; // For compatibility
  allowances: number;
  deductions: number;
  netSalary: number;
  net_salary?: number; // For compatibility
  paidDate?: string;
  status: 'draft' | 'generated' | 'sent' | 'paid' | 'approved';
  document_url?: string;
}

export interface JobPosting {
  posting_id?: number;
  id?: number;
  title: string;
  department: string;
  description: string;
  requirements: string;
  salary_range?: string;
  location: string;
  posting_date: string;
  closing_date?: string;
  status: 'active' | 'filled' | 'closed' | 'open';
  applications_count?: number;
  platform?: string;
  created_at?: string;
}

export interface JobCandidate {
  candidate_id?: number;
  id?: number;
  name: string;
  email: string;
  phone?: string;
  resume_url?: string;
  applied_for: string;
  position_applied?: string; // For compatibility
  status: string;
  interview_date?: string;
  notes?: string;
  assessment_score?: number;
  application_date?: string;
  source?: string;
  skills?: string[];
  match_score?: number;
  interview_notes?: string;
}

export interface HRTask {
  task_id?: number;
  id?: number;
  title: string;
  description?: string;
  assigned_to?: number;
  assignee_name?: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  category?: string;
  due_date?: string;
}

export const hrService = {
  // Attendance
  getAttendance: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/hr/attendance';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get attendance error:', error);
      return [];
    }
  },
  
  markAttendance: async (data: { user_id: number; status: string; date: string }) => {
    try {
      const response = await apiClient.post('/hr/attendance', data);
      return response.data;
    } catch (error) {
      console.error('Mark attendance error:', error);
      throw error;
    }
  },
  
  getAttendanceRecords: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/hr/attendance/records';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get attendance records error:', error);
      return [];
    }
  },
  
  getAttendanceStats: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/hr/attendance/stats?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get attendance stats error:', error);
      return {
        total_workdays: 0,
        present: 0,
        absent: 0,
        late: 0,
        attendance_rate: 0
      };
    }
  },
  
  // Employees
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
      return [];
    }
  },
  
  createLeaveRequest: async (requestData: any) => {
    try {
      const response = await apiClient.post('/hr/leave-requests', requestData);
      return response.data;
    } catch (error) {
      console.error('Create leave request error:', error);
      throw error;
    }
  },
  
  updateLeaveRequestStatus: async (requestId: number, status: string) => {
    try {
      const response = await apiClient.put(`/hr/leave-requests/${requestId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update leave request status error:', error);
      throw error;
    }
  },
  
  // Payroll
  getPayslips: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/hr/payslips';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get payslips error:', error);
      return [];
    }
  },
  
  generatePayslip: async (employeeId: number, month: string) => {
    try {
      const response = await apiClient.post('/hr/payslips/generate', { employee_id: employeeId, month });
      return response.data;
    } catch (error) {
      console.error('Generate payslip error:', error);
      throw error;
    }
  },
  
  sendPayslip: async (payslipId: number) => {
    try {
      const response = await apiClient.post(`/hr/payslips/${payslipId}/send`);
      return response.data;
    } catch (error) {
      console.error('Send payslip error:', error);
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
      return [];
    }
  },
  
  createJobPosting: async (postingData: any) => {
    try {
      const response = await apiClient.post('/hr/job-postings', postingData);
      return response.data;
    } catch (error) {
      console.error('Create job posting error:', error);
      throw error;
    }
  },
  
  updateJobPostingStatus: async (postingId: number, status: string) => {
    try {
      const response = await apiClient.put(`/hr/job-postings/${postingId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Update job posting status error:', error);
      throw error;
    }
  },
  
  getCandidates: async (status?: string) => {
    try {
      let url = '/hr/candidates';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get candidates error:', error);
      return [];
    }
  },
  
  getJobCandidates: async (jobPostingId?: number) => {
    try {
      let url = '/hr/candidates';
      if (jobPostingId) {
        url += `?job_posting_id=${jobPostingId}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get job candidates error:', error);
      return [];
    }
  },
  
  updateCandidateStatus: async (candidateId: number, status: string, notes?: string) => {
    try {
      const data: any = { status };
      if (notes) {
        data.notes = notes;
      }
      const response = await apiClient.put(`/hr/candidates/${candidateId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Update candidate status error:', error);
      throw error;
    }
  },
  
  // HR tasks
  getHRTasks: async (status?: string) => {
    try {
      let url = '/hr/tasks';
      if (status) {
        url += `?status=${status}`;
      }
      const response = await apiClient.get(url);
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
  
  // HR metrics and reports
  getHRMetrics: async () => {
    try {
      const response = await apiClient.get('/hr/metrics');
      return response.data;
    } catch (error) {
      console.error('Get HR metrics error:', error);
      return {};
    }
  },
  
  getHRTrends: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/hr/trends?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get HR trends error:', error);
      return {};
    }
  }
};

export default hrService;
