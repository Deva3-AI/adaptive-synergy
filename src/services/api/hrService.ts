
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
      console.error('Error fetching employee attendance:', error);
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
      console.error('Error fetching payroll data:', error);
      return null;
    }
  },

  getRecruitment: async () => {
    try {
      const response = await apiClient.get('/hr/recruitment');
      return response.data;
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
      return null;
    }
  },

  createJobPosting: async (jobData: any) => {
    try {
      const response = await apiClient.post('/hr/job-postings', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    }
  },

  // Add these methods to fix the TypeScript errors
  getPayslips: async (startDate: string, endDate: string) => {
    try {
      const response = await apiClient.get(`/hr/payslips?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payslips:', error);
      return [];
    }
  },

  generatePayslip: async (employeeId: number, month: string) => {
    try {
      const response = await apiClient.post('/hr/payslips/generate', { employeeId, month });
      return response.data;
    } catch (error) {
      console.error('Error generating payslip:', error);
      throw error;
    }
  },

  getJobOpenings: async () => {
    try {
      const response = await apiClient.get('/hr/job-openings');
      return response.data;
    } catch (error) {
      console.error('Error fetching job openings:', error);
      return [];
    }
  },

  getCandidates: async (jobId?: number) => {
    try {
      let url = '/hr/candidates';
      if (jobId) {
        url += `?jobId=${jobId}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  }
};

export default hrService;
