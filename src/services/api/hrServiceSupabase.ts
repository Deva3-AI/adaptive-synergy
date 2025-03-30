import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { transformSupabaseData } from "@/utils/supabaseUtils";

export interface Employee {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  role_name?: string;
  joining_date?: string;
  employee_id?: string;
  date_of_birth?: string;
}

export interface Attendance {
  attendance_id: number;
  user_id: number;
  login_time: string | null;
  logout_time: string | null;
  work_date: string;
  employee_name?: string;
  department?: string;
}

export interface HRDashboardStats {
  today_present: number;
  today_absent: number;
  today_on_leave: number;
  total_employees: number;
  average_hours: number;
  records: Attendance[];
}

const hrServiceSupabase = {
  getEmployees: async (): Promise<Employee[]> => {
    try {
      // Join users and roles tables to get employee data with roles
      const { data, error } = await supabase
        .from('users')
        .select(`
          user_id,
          name,
          email,
          role_id,
          roles(role_name),
          employee_details(joining_date, employee_id, date_of_birth)
        `);
      
      if (error) throw error;
      
      // Format the data to match our Employee interface
      return data.map(item => {
        const roleData = transformSupabaseData.getRoleName(item.roles);
        const employeeDetails = transformSupabaseData.getEmployeeDetails(item.employee_details);
        
        return {
          user_id: item.user_id,
          name: item.name,
          email: item.email,
          role_id: item.role_id,
          role_name: roleData,
          joining_date: employeeDetails.joining_date,
          employee_id: employeeDetails.employee_id,
          date_of_birth: employeeDetails.date_of_birth
        };
      });
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  },

  getEmployeeAttendance: async (startDate?: string, endDate?: string): Promise<HRDashboardStats> => {
    try {
      // Get current date in ISO format
      const today = new Date().toISOString().split('T')[0];
      
      // Use provided dates or default to the last 30 days
      const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const end = endDate || today;
      
      // Get all employees
      const { data: employees, error: employeesError } = await supabase
        .from('users')
        .select('user_id, name, role_id, roles(role_name)');
      
      if (employeesError) throw employeesError;
      
      // Get attendance records for the date range
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('employee_attendance')
        .select('*')
        .gte('work_date', start)
        .lte('work_date', end)
        .order('work_date', { ascending: false });
      
      if (attendanceError) throw attendanceError;
      
      // Create enriched attendance records
      const records = attendanceData.map(record => {
        const employee = employees.find(emp => emp.user_id === record.user_id);
        const roleName = employee ? transformSupabaseData.getRoleName(employee.roles) : 'Unknown';
        
        return {
          attendance_id: record.attendance_id,
          user_id: record.user_id,
          login_time: record.login_time,
          logout_time: record.logout_time,
          work_date: record.work_date,
          employee_name: employee?.name || 'Unknown Employee',
          department: roleName
        };
      });
      
      // Calculate stats
      const todayAttendance = attendanceData.filter(record => record.work_date === today);
      const totalEmployees = employees.length;
      const todayPresent = todayAttendance.length;
      const todayAbsent = totalEmployees - todayPresent;
      
      // Calculate average hours
      let totalHours = 0;
      let countRecordsWithHours = 0;
      
      attendanceData.forEach(record => {
        if (record.login_time && record.logout_time) {
          const login = new Date(record.login_time);
          const logout = new Date(record.logout_time);
          const diffHours = (logout.getTime() - login.getTime()) / (1000 * 60 * 60);
          totalHours += diffHours;
          countRecordsWithHours++;
        }
      });
      
      const averageHours = countRecordsWithHours > 0 
        ? (totalHours / countRecordsWithHours).toFixed(1) 
        : "0.0";
      
      return {
        today_present: todayPresent,
        today_absent: todayAbsent,
        today_on_leave: 0, // Would need additional data for this
        total_employees: totalEmployees,
        average_hours: parseFloat(averageHours),
        records
      };
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      return {
        today_present: 0,
        today_absent: 0,
        today_on_leave: 0,
        total_employees: 0,
        average_hours: 0,
        records: []
      };
    }
  },

  startWork: async (userId: number): Promise<Attendance | null> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      // Check if there's already an attendance record for today
      const { data: existingRecord, error: checkError } = await supabase
        .from('employee_attendance')
        .select('*')
        .eq('user_id', userId)
        .eq('work_date', today)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRecord) {
        // If there's a record but no login time, update it
        if (!existingRecord.login_time) {
          const { data, error } = await supabase
            .from('employee_attendance')
            .update({ login_time: now })
            .eq('attendance_id', existingRecord.attendance_id)
            .select()
            .single();
          
          if (error) throw error;
          return data;
        }
        // Otherwise return the existing record
        return existingRecord;
      } else {
        // Create a new attendance record
        const { data, error } = await supabase
          .from('employee_attendance')
          .insert({
            user_id: userId,
            login_time: now,
            work_date: today
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error starting work:', error);
      return null;
    }
  },

  stopWork: async (userId: number, attendanceId: number): Promise<Attendance | null> => {
    try {
      const now = new Date().toISOString();
      
      // Update the attendance record with logout time
      const { data, error } = await supabase
        .from('employee_attendance')
        .update({ logout_time: now })
        .eq('attendance_id', attendanceId)
        .eq('user_id', userId) // Additional safety check
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error stopping work:', error);
      return null;
    }
  },

  getPerformanceMetrics: async (userId?: number, period?: string): Promise<any> => {
    try {
      // In a full implementation, this would query a performance metrics table
      // For now, we'll return mock data
      return {
        productivity_score: 85,
        quality_score: 90,
        communication_score: 78,
        teamwork_score: 92,
        punctuality_score: 88,
        overall_score: 87,
        period: period || 'current_month',
        strengths: ['Task completion', 'Code quality', 'Team collaboration'],
        areas_for_improvement: ['Communication', 'Time tracking'],
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return null;
    }
  },

  getHRTasks: async (status?: string): Promise<any[]> => {
    try {
      // Mock implementation - would query a HR tasks table
      return [
        {
          id: 1,
          title: "Review John's productivity dip",
          description: "Analyze productivity metrics and schedule a check-in meeting",
          assigned_to: 4,
          assigned_to_name: "Sarah Williams",
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          estimated_time: 0.5,
          priority: "medium",
          status: "pending",
          related_to: {
            type: "employee",
            id: 1,
            name: "John Doe"
          }
        },
        {
          id: 2,
          title: "Interview candidate Sarah Thompson",
          description: "Conduct technical interview for the Senior Developer position",
          assigned_to: 4,
          assigned_to_name: "Sarah Williams",
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          estimated_time: 1,
          priority: "high",
          status: "pending",
          related_to: {
            type: "candidate",
            id: 5,
            name: "Sarah Thompson"
          }
        },
        {
          id: 3,
          title: "Finalize December payroll",
          description: "Review attendance and prepare payroll for processing",
          assigned_to: 4,
          assigned_to_name: "Sarah Williams",
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          estimated_time: 2,
          priority: "high",
          status: "pending",
          related_to: {
            type: "payroll",
            id: 12,
            name: "December 2023 Payroll"
          }
        }
      ].filter(task => !status || task.status === status);
    } catch (error) {
      console.error('Error fetching HR tasks:', error);
      return [];
    }
  },

  completeHRTask: async (taskId: number, notes?: string): Promise<boolean> => {
    try {
      // Mock implementation - would update the task status to completed
      console.log(`Task ${taskId} marked as completed. Notes: ${notes || 'None'}`);
      return true;
    } catch (error) {
      console.error('Error completing HR task:', error);
      return false;
    }
  },

  getJobOpenings: async (): Promise<any[]> => {
    try {
      // Mock implementation - would query job openings table
      return [
        {
          id: 1,
          title: "Senior React Developer",
          department: "Engineering",
          location: "Remote",
          type: "full_time",
          description: "We're looking for an experienced React developer...",
          requirements: ["5+ years React experience", "TypeScript", "Node.js"],
          responsibilities: ["Build user interfaces", "Optimize performance", "Mentor junior developers"],
          salary_range: {
            min: 90000,
            max: 120000
          },
          posted_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: "open",
          applicants_count: 8,
          source: "linkedin"
        },
        {
          id: 2,
          title: "UX/UI Designer",
          department: "Design",
          location: "Hybrid",
          type: "full_time",
          description: "Join our design team to create beautiful user experiences...",
          requirements: ["3+ years UI/UX experience", "Figma", "User research"],
          responsibilities: ["Create wireframes", "Conduct user testing", "Design system maintenance"],
          salary_range: {
            min: 75000,
            max: 95000
          },
          posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "open",
          applicants_count: 12,
          source: "indeed"
        },
        {
          id: 3,
          title: "Marketing Specialist",
          department: "Marketing",
          location: "Remote",
          type: "contract",
          description: "Drive growth through innovative marketing strategies...",
          requirements: ["Digital marketing experience", "Analytics", "Content creation"],
          responsibilities: ["Campaign management", "Performance tracking", "Social media strategy"],
          salary_range: {
            min: 60000,
            max: 80000
          },
          posted_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          status: "open",
          applicants_count: 5,
          source: "website"
        }
      ];
    } catch (error) {
      console.error('Error fetching job openings:', error);
      return [];
    }
  },

  getCandidates: async (jobId?: number): Promise<any[]> => {
    try {
      // Mock implementation - would query candidates table
      const allCandidates = [
        {
          id: 1,
          name: "Sarah Thompson",
          email: "sarah.t@example.com",
          phone: "555-123-4567",
          job_id: 1,
          job_title: "Senior React Developer",
          resume_url: "/resumes/sarah_thompson.pdf",
          application_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
          experience: 6,
          education: "Masters in Computer Science",
          status: "interview",
          match_score: 92,
          notes: "Strong technical background, excellent cultural fit",
          strengths: ["Frontend expertise", "System architecture", "Team leadership"],
          gaps: ["DevOps experience limited"],
          source: "linkedin",
          last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          name: "Michael Rivera",
          email: "m.rivera@example.com",
          phone: "555-987-6543",
          job_id: 1,
          job_title: "Senior React Developer",
          resume_url: "/resumes/michael_rivera.pdf",
          application_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ["React", "Redux", "JavaScript", "CSS", "Testing"],
          experience: 5,
          education: "Bachelors in Information Technology",
          status: "screening",
          match_score: 85,
          notes: "Good React experience, needs technical assessment",
          strengths: ["Frontend UI development", "Responsive design"],
          gaps: ["Limited TypeScript experience", "No cloud experience"],
          source: "indeed",
          last_contact: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          name: "Lisa Chen",
          email: "lisa.chen@example.com",
          phone: "555-456-7890",
          job_id: 2,
          job_title: "UX/UI Designer",
          resume_url: "/resumes/lisa_chen.pdf",
          application_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "UI Design"],
          experience: 4,
          education: "Bachelors in Design",
          status: "new",
          match_score: 94,
          notes: "Excellent portfolio, perfect match for our design needs",
          strengths: ["Visual design", "User testing", "Design systems"],
          gaps: [],
          source: "linkedin",
          last_contact: null
        }
      ];
      
      return jobId 
        ? allCandidates.filter(candidate => candidate.job_id === jobId)
        : allCandidates;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return [];
    }
  },

  generatePayslips: async (month: string, year: number): Promise<boolean> => {
    try {
      // Mock implementation - would generate payslips based on attendance
      console.log(`Generating payslips for ${month} ${year}`);
      return true;
    } catch (error) {
      console.error('Error generating payslips:', error);
      return false;
    }
  },

  getPayslips: async (month?: string, year?: number): Promise<any[]> => {
    try {
      // Mock implementation - would query payslips table
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      
      return [
        {
          id: 1,
          employeeId: 1,
          employeeName: "John Doe",
          month: month || currentMonth,
          year: year || currentYear,
          basicSalary: 5000,
          allowances: 800,
          deductions: 1200,
          netSalary: 4600,
          paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "paid"
        },
        {
          id: 2,
          employeeId: 2,
          employeeName: "Jane Smith",
          month: month || currentMonth,
          year: year || currentYear,
          basicSalary: 4500,
          allowances: 600,
          deductions: 1100,
          netSalary: 4000,
          paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "paid"
        },
        {
          id: 3,
          employeeId: 3,
          employeeName: "Mike Johnson",
          month: month || currentMonth,
          year: year || currentYear,
          basicSalary: 4200,
          allowances: 550,
          deductions: 900,
          netSalary: 3850,
          status: "pending"
        }
      ];
    } catch (error) {
      console.error('Error fetching payslips:', error);
      return [];
    }
  },

  getHRTrends: async (): Promise<any[]> => {
    try {
      // Mock implementation - would call an AI service to get HR trends
      return [
        {
          id: 1,
          title: "Remote Work Productivity Tools",
          description: "New productivity tracking tools showing 25% increase in remote team efficiency",
          relevance_score: 92,
          category: "remote_work",
          source: "industry_report",
          discovered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          actionable: true,
          suggested_actions: [
            "Evaluate top 3 new tools for our tech stack",
            "Run pilot with engineering team",
            "Compare with current productivity metrics"
          ]
        },
        {
          id: 2,
          title: "Flexible Work Hours",
          description: "Companies offering flexible work hours seeing 15% lower turnover rates",
          relevance_score: 88,
          category: "employee_retention",
          source: "competitor_analysis",
          discovered_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          actionable: true,
          suggested_actions: [
            "Survey employee interest in flexible schedules",
            "Draft potential policy updates",
            "Run 3-month pilot with selected teams"
          ]
        },
        {
          id: 3,
          title: "AI Resume Screening",
          description: "AI-powered applicant screening reducing hiring time by 30%",
          relevance_score: 85,
          category: "hiring",
          source: "tech_news",
          discovered_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          actionable: true,
          suggested_actions: [
            "Research top AI screening solutions",
            "Evaluate against diversity and inclusion goals",
            "Test with past applicants to verify accuracy"
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching HR trends:', error);
      return [];
    }
  },

  createHRPlan: async (planData: any): Promise<any> => {
    try {
      // Mock implementation - would create an HR plan
      console.log('Creating HR plan:', planData);
      return {
        id: Date.now(),
        ...planData,
        created_at: new Date().toISOString(),
        status: 'draft',
        progress: 0
      };
    } catch (error) {
      console.error('Error creating HR plan:', error);
      throw error;
    }
  },

  getHRMetrics: async (): Promise<any> => {
    try {
      // Mock implementation - would calculate HR metrics
      return {
        hiring: {
          time_to_hire: 18, // days
          cost_per_hire: 4500, // dollars
          offer_acceptance_rate: 85, // percentage
          application_completion_rate: 68, // percentage
          qualified_candidates_per_role: 4.5
        },
        retention: {
          employee_turnover_rate: 12, // percentage yearly
          average_tenure: 2.7, // years
          voluntary_turnover_rate: 9, // percentage
          involuntary_turnover_rate: 3, // percentage
          top_performer_retention_rate: 92 // percentage
        },
        productivity: {
          average_productivity_score: 84, // percentage
          tasks_completed_per_employee: 45, // monthly
          revenue_per_employee: 15000, // dollars monthly
          training_effectiveness: 78 // percentage
        },
        attendance: {
          attendance_rate: 96, // percentage
          absenteeism_rate: 4, // percentage
          average_working_hours: 7.8, // daily
          overtime_hours: 12 // monthly average
        },
        efficiency: {
          hr_task_completion_rate: 92, // percentage
          payroll_accuracy: 99.8, // percentage
          average_time_to_resolve_hr_issues: 2.3, // days
          hr_to_employee_ratio: 1/45 // 1 HR staff per 45 employees
        }
      };
    } catch (error) {
      console.error('Error fetching HR metrics:', error);
      return null;
    }
  }
};

export default hrServiceSupabase;
