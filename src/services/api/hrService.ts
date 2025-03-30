
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
      return null;
    }
  },

  getPayroll: async (month?: string, year?: string) => {
    try {
      let url = '/hr/payroll';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
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
      const response = await apiClient.post('/hr/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    }
  },
  
  getPayslips: async (month?: string, year?: string) => {
    try {
      let url = '/hr/payslips';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching payslips:', error);
      return [];
    }
  },
  
  generatePayslip: async (employeeId: number, month: string, year: number) => {
    try {
      const response = await apiClient.post('/hr/payslips/generate', {
        employeeId,
        month,
        year
      });
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
      const url = jobId ? `/hr/candidates?jobId=${jobId}` : '/hr/candidates';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  }
};

export default hrService;
