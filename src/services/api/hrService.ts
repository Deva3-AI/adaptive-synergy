
import apiClient from '@/utils/apiUtils';

const hrService = {
  getEmployeeAttendance: async (userId?: number, startDate?: string, endDate?: string) => {
    try {
      const params = { user_id: userId, start_date: startDate, end_date: endDate };
      const response = await apiClient.get('/hr/attendance', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      return [];
    }
  },

  getPayroll: async (month?: string, year?: string) => {
    try {
      const params = { month, year };
      const response = await apiClient.get('/hr/payroll', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      return [];
    }
  },

  getRecruitment: async () => {
    try {
      const response = await apiClient.get('/hr/recruitment');
      return response.data;
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
      return {
        openPositions: [],
        applicationStats: { total: 0, screening: 0, interview: 0, offer: 0 }
      };
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

  getPayslips: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const response = await apiClient.get('/hr/payslips', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payslips:', error);
      return [
        {
          payslip_id: 1,
          user_id: 101,
          employeeName: "John Doe",
          periodStart: "2023-10-01",
          periodEnd: "2023-10-31",
          basicSalary: 5000,
          allowances: 500,
          deductions: 750,
          netSalary: 4750,
          status: "paid",
          document_url: "/payslips/oct2023-101.pdf"
        },
        {
          payslip_id: 2,
          user_id: 102,
          employeeName: "Jane Smith",
          periodStart: "2023-10-01",
          periodEnd: "2023-10-31",
          basicSalary: 5500,
          allowances: 600,
          deductions: 825,
          netSalary: 5275,
          status: "paid",
          document_url: "/payslips/oct2023-102.pdf"
        }
      ];
    }
  },

  generatePayslip: async (employeeId: number, month: string) => {
    try {
      const response = await apiClient.post('/hr/payslips', { employee_id: employeeId, month });
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
      return [
        {
          id: 1,
          title: "Senior Developer",
          department: "Engineering",
          location: "Remote",
          postedDate: "2023-10-15T00:00:00Z",
          applications: 12,
          status: "open"
        },
        {
          id: 2,
          title: "UX Designer",
          department: "Design",
          location: "New York",
          postedDate: "2023-10-10T00:00:00Z",
          applications: 8,
          status: "open"
        },
        {
          id: 3,
          title: "Marketing Specialist",
          department: "Marketing",
          location: "Chicago",
          postedDate: "2023-09-25T00:00:00Z",
          applications: 15,
          status: "closed"
        }
      ];
    }
  },

  getCandidates: async () => {
    try {
      const response = await apiClient.get('/hr/candidates');
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [
        {
          id: 101,
          name: "Alex Johnson",
          email: "alex@example.com",
          position: "Senior Developer",
          appliedDate: "2023-10-20T00:00:00Z",
          source: "LinkedIn",
          status: "screening"
        },
        {
          id: 102,
          name: "Maria Garcia",
          email: "maria@example.com",
          position: "UX Designer",
          appliedDate: "2023-10-18T00:00:00Z",
          source: "Indeed",
          status: "interview"
        },
        {
          id: 103,
          name: "James Wilson",
          email: "james@example.com",
          position: "Senior Developer",
          appliedDate: "2023-10-15T00:00:00Z",
          source: "Referral",
          status: "new"
        }
      ];
    }
  }
};

export default hrService;
