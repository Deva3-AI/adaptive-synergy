
// HR Service API functions

const hrService = {
  // Attendance related functions
  getEmployeeAttendance: async (userId?: number, startDate?: string, endDate?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          user_id: 1,
          login_time: '2023-06-01T09:00:00',
          logout_time: '2023-06-01T17:30:00',
          work_date: '2023-06-01'
        },
        {
          id: 2,
          user_id: 1,
          login_time: '2023-06-02T08:45:00',
          logout_time: '2023-06-02T17:15:00',
          work_date: '2023-06-02'
        },
        {
          id: 3,
          user_id: 2,
          login_time: '2023-06-01T09:15:00',
          logout_time: '2023-06-01T18:00:00',
          work_date: '2023-06-01'
        }
      ];
    } catch (error) {
      console.error('Error getting employee attendance:', error);
      throw error;
    }
  },
  
  // Payroll related functions
  getPayrollData: async (month?: string, year?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          employee_id: 1,
          employee_name: 'John Doe',
          salary: 5000,
          bonus: 500,
          deductions: 1000,
          net_pay: 4500,
          payment_date: '2023-06-30',
          status: 'processed'
        },
        {
          id: 2,
          employee_id: 2,
          employee_name: 'Jane Smith',
          salary: 6000,
          bonus: 600,
          deductions: 1200,
          net_pay: 5400,
          payment_date: '2023-06-30',
          status: 'processed'
        }
      ];
    } catch (error) {
      console.error('Error getting payroll data:', error);
      throw error;
    }
  },
  
  generatePayslips: async (month: string, year: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        success: true,
        message: 'Payslips generated successfully',
        count: 25
      };
    } catch (error) {
      console.error('Error generating payslips:', error);
      throw error;
    }
  },
  
  // Recruitment related functions
  getRecruitmentData: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          position: 'Frontend Developer',
          department: 'Engineering',
          status: 'open',
          applications: 12,
          shortlisted: 5,
          interviewed: 3,
          created_at: '2023-05-15'
        },
        {
          id: 2,
          position: 'UX Designer',
          department: 'Design',
          status: 'closed',
          applications: 20,
          shortlisted: 8,
          interviewed: 4,
          created_at: '2023-04-10'
        }
      ];
    } catch (error) {
      console.error('Error getting recruitment data:', error);
      throw error;
    }
  },
  
  getCandidates: async (positionId?: number) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          position_id: 1,
          status: 'shortlisted',
          applied_date: '2023-05-20',
          resume_url: 'https://example.com/resume/alice.pdf'
        },
        {
          id: 2,
          name: 'Bob Williams',
          email: 'bob@example.com',
          position_id: 1,
          status: 'interviewed',
          applied_date: '2023-05-22',
          resume_url: 'https://example.com/resume/bob.pdf'
        }
      ];
    } catch (error) {
      console.error('Error getting candidates:', error);
      throw error;
    }
  },
  
  // HR tasks management
  getHRTasks: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          title: 'Review job applications',
          description: 'Review applications for the Frontend Developer position',
          status: 'in_progress',
          assignee_id: 3,
          due_date: '2023-06-10',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Prepare monthly payroll',
          description: 'Process payroll for June 2023',
          status: 'pending',
          assignee_id: 3,
          due_date: '2023-06-25',
          priority: 'high'
        }
      ];
    } catch (error) {
      console.error('Error getting HR tasks:', error);
      throw error;
    }
  },
  
  // Reports
  getAttendanceReports: async (startDate?: string, endDate?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        summary: {
          total_working_days: 22,
          avg_attendance: 94,
          avg_working_hours: 7.8
        },
        departments: [
          { name: 'Engineering', attendance_rate: 96, avg_hours: 8.1 },
          { name: 'Design', attendance_rate: 92, avg_hours: 7.6 },
          { name: 'Marketing', attendance_rate: 90, avg_hours: 7.5 }
        ],
        employees: [
          { id: 1, name: 'John Doe', attendance_rate: 100, avg_hours: 8.5 },
          { id: 2, name: 'Jane Smith', attendance_rate: 95, avg_hours: 8.0 }
        ]
      };
    } catch (error) {
      console.error('Error getting attendance reports:', error);
      throw error;
    }
  },
  
  getRecruitmentReports: async (year?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        summary: {
          total_positions: 10,
          filled_positions: 7,
          open_positions: 3,
          avg_time_to_hire: 32 // days
        },
        departments: [
          { name: 'Engineering', positions: 5, filled: 4, time_to_hire: 35 },
          { name: 'Design', positions: 3, filled: 2, time_to_hire: 28 },
          { name: 'Marketing', positions: 2, filled: 1, time_to_hire: 40 }
        ]
      };
    } catch (error) {
      console.error('Error getting recruitment reports:', error);
      throw error;
    }
  }
};

export default hrService;
