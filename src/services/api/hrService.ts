
import apiClient from '@/utils/apiUtils';

const hrService = {
  getEmployeeAttendance: async (userId?: number, startDate?: string, endDate?: string) => {
    try {
      let url = '/hr/attendance';
      const params = [];
      if (userId) params.push(`userId=${userId}`);
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get employee attendance error:', error);
      return [];
    }
  },
  
  getPayroll: async (month?: string, year?: string) => {
    try {
      let url = '/hr/payroll';
      const params = [];
      if (month) params.push(`month=${month}`);
      if (year) params.push(`year=${year}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get payroll error:', error);
      return [];
    }
  },
  
  getRecruitment: async () => {
    try {
      const response = await apiClient.get('/hr/recruitment');
      return response.data;
    } catch (error) {
      console.error('Get recruitment error:', error);
      return { job_openings: [], candidates: [] };
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
  
  getPayslips: async (month?: string, year?: string) => {
    try {
      let url = '/hr/payslips';
      const params = [];
      if (month) params.push(`month=${month}`);
      if (year) params.push(`year=${year}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get payslips error:', error);
      return [];
    }
  },
  
  generatePayslip: async (employeeId: number, month: string, year: string) => {
    try {
      const response = await apiClient.post('/hr/payslips/generate', { employeeId, month, year });
      return response.data;
    } catch (error) {
      console.error('Generate payslip error:', error);
      throw error;
    }
  },
  
  getJobOpenings: async () => {
    try {
      const response = await apiClient.get('/hr/job-openings');
      return response.data;
    } catch (error) {
      console.error('Get job openings error:', error);
      return [];
    }
  },
  
  getCandidates: async (jobId?: number) => {
    try {
      const url = jobId ? `/hr/candidates?jobId=${jobId}` : '/hr/candidates';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get candidates error:', error);
      return [];
    }
  }
};

export default hrService;
