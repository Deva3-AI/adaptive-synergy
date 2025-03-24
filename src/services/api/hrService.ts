
import apiClient from '@/utils/apiUtils';

// HR Service Types
export interface Attendance {
  attendance_id: number;
  user_id: number;
  employee_name: string;
  login_time: string;
  logout_time: string | null;
  work_date: string;
  total_hours?: number;
}

export interface Payslip {
  payslip_id: number;
  employee_id: number;
  employee_name: string;
  month: string;
  year: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'draft' | 'approved' | 'paid';
  generated_at: string;
}

export interface JobPosting {
  posting_id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  salary_range?: string;
  status: 'active' | 'filled' | 'closed';
  created_at: string;
  applications_count: number;
}

export interface JobCandidate {
  candidate_id: number;
  posting_id: number;
  name: string;
  email: string;
  phone: string;
  resume_url: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  applied_at: string;
  notes?: string;
}

export interface HRTask {
  task_id: number;
  title: string;
  description: string;
  type: 'recruitment' | 'payroll' | 'onboarding' | 'offboarding' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  assigned_to?: number;
  created_at: string;
}

const hrService = {
  // Attendance management
  getEmployeeAttendance: async (userId?: number, startDate?: string, endDate?: string) => {
    try {
      let url = '/hr/attendance';
      const params = new URLSearchParams();
      
      if (userId) params.append('user_id', userId.toString());
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get employee attendance error:', error);
      throw error;
    }
  },
  
  // Payroll management
  getPayroll: async (month?: string, year?: string) => {
    try {
      let url = '/hr/payroll';
      const params = new URLSearchParams();
      
      if (month) params.append('month', month);
      if (year) params.append('year', year);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get payroll error:', error);
      throw error;
    }
  },
  
  // Recruitment management
  getRecruitment: async () => {
    try {
      const response = await apiClient.get('/hr/recruitment');
      return response.data;
    } catch (error) {
      console.error('Get recruitment error:', error);
      throw error;
    }
  },
  
  createJobPosting: async (jobData: any) => {
    try {
      const response = await apiClient.post('/hr/recruitment', jobData);
      return response.data;
    } catch (error) {
      console.error('Create job posting error:', error);
      throw error;
    }
  },
};

export default hrService;
