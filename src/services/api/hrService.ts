
import apiClient from '@/utils/apiUtils';
import { mockUserData } from '@/utils/mockData';

// Mock data for development
const mockAttendance = [
  {
    id: 1,
    user_id: 1,
    employee_name: 'John Doe',
    date: '2023-06-01',
    login_time: '09:00:00',
    logout_time: '17:30:00',
    total_hours: 8.5,
    status: 'present'
  },
  {
    id: 2,
    user_id: 1,
    employee_name: 'John Doe',
    date: '2023-06-02',
    login_time: '08:45:00',
    logout_time: '17:15:00',
    total_hours: 8.5,
    status: 'present'
  }
];

const mockLeaveRequests = [
  {
    id: 1,
    employee_id: 1,
    employee_name: 'John Doe',
    start_date: '2023-07-10',
    end_date: '2023-07-14',
    reason: 'Annual vacation',
    status: 'pending',
    leaveType: 'vacation'
  }
];

const hrService = {
  getEmployeeAttendance: async (userId?: number, startDate?: string, endDate?: string) => {
    try {
      return mockAttendance.filter(record => 
        (!userId || record.user_id === userId) &&
        (!startDate || record.date >= startDate) &&
        (!endDate || record.date <= endDate)
      );
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      return [];
    }
  },

  getPayroll: async (month?: string, year?: string) => {
    try {
      // Mock payroll data
      return {
        month: month || 'June',
        year: year || '2023',
        employees: [
          {
            id: 1,
            name: 'John Doe',
            position: 'Software Developer',
            basic_salary: 5000,
            allowances: 1000,
            deductions: 800,
            net_salary: 5200
          },
          {
            id: 2,
            name: 'Jane Smith',
            position: 'UX Designer',
            basic_salary: 4500,
            allowances: 800,
            deductions: 700,
            net_salary: 4600
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      return null;
    }
  },

  getRecruitment: async () => {
    try {
      return {
        openPositions: [
          {
            id: 1,
            title: 'Frontend Developer',
            department: 'Engineering',
            status: 'open',
            candidates: 12,
            posted_date: '2023-05-15'
          },
          {
            id: 2,
            title: 'UX Designer',
            department: 'Design',
            status: 'open',
            candidates: 8,
            posted_date: '2023-05-20'
          }
        ],
        recentApplications: [
          {
            id: 1,
            name: 'Alice Johnson',
            position: 'Frontend Developer',
            applied_date: '2023-06-01',
            status: 'screening'
          },
          {
            id: 2,
            name: 'Bob Wilson',
            position: 'UX Designer',
            applied_date: '2023-05-28',
            status: 'interview'
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
      return null;
    }
  },

  createJobPosting: async (jobData: any) => {
    try {
      // Normally would post to API
      console.log('Creating job posting:', jobData);
      return {
        id: Math.floor(Math.random() * 1000),
        ...jobData,
        posted_date: new Date().toISOString().split('T')[0],
        status: 'open',
        candidates: 0
      };
    } catch (error) {
      console.error('Error creating job posting:', error);
      throw error;
    }
  },

  getPayslips: async (startDate: string, endDate: string) => {
    try {
      return [
        {
          id: 1,
          employee_id: 1,
          employee_name: 'John Doe',
          month: 'June',
          year: '2023',
          gross_salary: 6000,
          deductions: 800,
          net_salary: 5200,
          generated_date: '2023-06-30'
        },
        {
          id: 2,
          employee_id: 2,
          employee_name: 'Jane Smith',
          month: 'June',
          year: '2023',
          gross_salary: 5300,
          deductions: 700,
          net_salary: 4600,
          generated_date: '2023-06-30'
        }
      ];
    } catch (error) {
      console.error('Error fetching payslips:', error);
      return [];
    }
  },

  generatePayslip: async (employeeId: number, month: string) => {
    try {
      console.log(`Generating payslip for employee ${employeeId} for ${month}`);
      return {
        id: Math.floor(Math.random() * 1000),
        employee_id: employeeId,
        employee_name: 'John Doe',
        month: month,
        year: '2023',
        gross_salary: 6000,
        deductions: 800,
        net_salary: 5200,
        generated_date: new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Error generating payslip:', error);
      throw error;
    }
  },

  getJobOpenings: async () => {
    try {
      return [
        {
          id: 1,
          title: 'Frontend Developer',
          department: 'Engineering',
          status: 'open',
          candidates: 12,
          posted_date: '2023-05-15',
          description: 'We are looking for a talented frontend developer...',
          requirements: ['3+ years React experience', 'TypeScript knowledge', 'UI/UX skills']
        },
        {
          id: 2,
          title: 'UX Designer',
          department: 'Design',
          status: 'open',
          candidates: 8,
          posted_date: '2023-05-20',
          description: 'We are seeking a creative UX Designer...',
          requirements: ['3+ years design experience', 'Figma proficiency', 'User research skills']
        }
      ];
    } catch (error) {
      console.error('Error fetching job openings:', error);
      return [];
    }
  },

  getCandidates: async (jobId?: number) => {
    try {
      const candidates = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '123-456-7890',
          job_id: 1,
          job_title: 'Frontend Developer',
          resume_url: '/resumes/alice.pdf',
          application_date: '2023-06-01',
          skills: ['React', 'TypeScript', 'CSS'],
          experience: 4,
          education: 'BS Computer Science',
          status: 'screening',
          notes: 'Strong portfolio, good communication skills',
          interview_date: '2023-06-15',
          feedback: 'Positive initial screening',
          last_contact: '2023-06-05'
        },
        {
          id: 2,
          name: 'Bob Wilson',
          email: 'bob@example.com',
          phone: '123-456-7891',
          job_id: 2,
          job_title: 'UX Designer',
          resume_url: '/resumes/bob.pdf',
          application_date: '2023-05-28',
          skills: ['Figma', 'User Research', 'UI Design'],
          experience: 3,
          education: 'BA Graphic Design',
          status: 'interview',
          notes: 'Excellent portfolio, previous experience at design agency',
          interview_date: '2023-06-10',
          feedback: 'Great culture fit, strong skills',
          last_contact: '2023-06-02'
        }
      ];
      
      if (jobId) {
        return candidates.filter(c => c.job_id === jobId);
      }
      
      return candidates;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  },
  
  // Additional methods for HR tasks
  getHRTasks: async () => {
    try {
      return [
        {
          id: 1,
          title: 'Review job applications',
          description: 'Review applications for Frontend Developer position',
          due_date: '2023-06-15',
          priority: 'high',
          status: 'pending'
        },
        {
          id: 2,
          title: 'Prepare payroll',
          description: 'Process monthly payroll for all employees',
          due_date: '2023-06-30',
          priority: 'high',
          status: 'pending'
        }
      ];
    } catch (error) {
      console.error('Error fetching HR tasks:', error);
      return [];
    }
  },
  
  getHRTrends: async () => {
    try {
      return {
        employeeGrowth: [
          { month: 'Jan', employees: 24 },
          { month: 'Feb', employees: 25 },
          { month: 'Mar', employees: 27 },
          { month: 'Apr', employees: 29 },
          { month: 'May', employees: 30 },
          { month: 'Jun', employees: 32 }
        ],
        turnoverRate: [
          { month: 'Jan', rate: 3.2 },
          { month: 'Feb', rate: 2.8 },
          { month: 'Mar', rate: 2.5 },
          { month: 'Apr', rate: 2.2 },
          { month: 'May', rate: 2.0 },
          { month: 'Jun', rate: 1.8 }
        ],
        insights: [
          'Employee growth trending positively at 5% per month',
          'Turnover rate has decreased by 43% since January',
          'Most common reason for leaving: better opportunities',
          'Top performing department: Engineering'
        ]
      };
    } catch (error) {
      console.error('Error fetching HR trends:', error);
      return [];
    }
  },
  
  completeHRTask: async (taskId: number) => {
    try {
      console.log(`Completing HR task ${taskId}`);
      return {
        id: taskId,
        status: 'completed',
        completed_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error completing HR task:', error);
      throw error;
    }
  },
  
  getLeaveRequests: async () => {
    return mockLeaveRequests;
  },
  
  getEmployees: async () => {
    return mockUserData.users;
  },
  
  getAttendanceHistory: async (startDate?: string, endDate?: string) => {
    return mockAttendance;
  }
};

export default hrService;
