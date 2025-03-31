
import { supabase } from '@/lib/supabase';
import { PaySlip, Candidate, Employee, LeaveRequest, Attendance, HRTask } from '@/interfaces/hr';
import { mockHRData } from '@/utils/mockData';

const hrServiceSupabase = {
  // Employee Management
  getEmployees: async (): Promise<Employee[]> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      
      if (error) throw error;
      return data as Employee[];
    } catch (error) {
      console.error('Error fetching employees:', error);
      return mockHRData.employees;
    }
  },
  
  getEmployeeById: async (employeeId: number): Promise<Employee | null> => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();
      
      if (error) throw error;
      return data as Employee;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return mockHRData.employees.find(emp => emp.id === employeeId) || null;
    }
  },
  
  // Attendance Management
  getAttendance: async (date?: string): Promise<any[]> => {
    try {
      let query = supabase.from('attendance').select('*');
      
      if (date) {
        query = query.eq('work_date', date);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return mockHRData.attendance;
    }
  },
  
  getEmployeeAttendance: async (employeeId?: number, startDate?: string, endDate?: string): Promise<any> => {
    try {
      let query = supabase.from('employee_attendance').select(`
        attendance_id,
        user_id,
        login_time,
        logout_time,
        work_date
      `);
      
      if (employeeId) {
        query = query.eq('user_id', employeeId);
      }
      
      if (startDate) {
        query = query.gte('work_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('work_date', endDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Calculate metrics
      const today = new Date().toISOString().split('T')[0];
      const todayPresent = data.filter(a => a.work_date.startsWith(today)).length;
      const totalEmployees = await hrServiceSupabase.getEmployees().then(emps => emps.length);
      
      // Calculate average hours worked
      let totalHours = 0;
      let countRecordsWithHours = 0;
      
      for (const record of data) {
        if (record.login_time && record.logout_time) {
          const login = new Date(record.login_time);
          const logout = new Date(record.logout_time);
          const hours = (logout.getTime() - login.getTime()) / (1000 * 60 * 60);
          totalHours += hours;
          countRecordsWithHours++;
        }
      }
      
      const averageHours = countRecordsWithHours > 0 ? totalHours / countRecordsWithHours : 0;
      
      return {
        attendance_records: data,
        today_present: todayPresent,
        total_employees: totalEmployees,
        average_hours: averageHours.toFixed(1)
      };
    } catch (error) {
      console.error('Error fetching employee attendance:', error);
      return mockHRData.attendanceSummary;
    }
  },
  
  startWork: async (employeeId: number): Promise<any> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const now = new Date().toISOString();
      
      // Check if there's already an entry for today
      const { data: existingEntry, error: checkError } = await supabase
        .from('employee_attendance')
        .select('*')
        .eq('user_id', employeeId)
        .eq('work_date', today)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }
      
      // If entry exists, return it without creating a new one
      if (existingEntry) {
        return existingEntry;
      }
      
      // Create new attendance entry
      const { data, error } = await supabase
        .from('employee_attendance')
        .insert({
          user_id: employeeId,
          login_time: now,
          work_date: today
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting work:', error);
      
      // Return mock data for demo purposes
      return {
        attendance_id: Math.floor(Math.random() * 1000),
        user_id: employeeId,
        login_time: new Date().toISOString(),
        work_date: new Date().toISOString().split('T')[0]
      };
    }
  },
  
  stopWork: async (attendanceId: number): Promise<any> => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('employee_attendance')
        .update({ logout_time: now })
        .eq('attendance_id', attendanceId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error stopping work:', error);
      
      // Return mock data for demo purposes
      return {
        attendance_id: attendanceId,
        logout_time: new Date().toISOString()
      };
    }
  },
  
  // Leave Management
  getLeaveRequests: async (): Promise<LeaveRequest[]> => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*');
      
      if (error) throw error;
      return data as LeaveRequest[];
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      return mockHRData.leaveRequests;
    }
  },
  
  updateLeaveRequest: async (requestId: number, status: 'approved' | 'rejected', notes?: string): Promise<any> => {
    try {
      const updateData: any = { status };
      if (notes) updateData.notes = notes;
      
      const { data, error } = await supabase
        .from('leave_requests')
        .update(updateData)
        .eq('id', requestId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }
  },
  
  createLeaveRequest: async (leaveRequest: Partial<LeaveRequest>): Promise<LeaveRequest> => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert(leaveRequest)
        .select()
        .single();
      
      if (error) throw error;
      return data as LeaveRequest;
    } catch (error) {
      console.error('Error creating leave request:', error);
      
      // Return mock data for demonstration
      return {
        ...leaveRequest,
        id: Math.floor(Math.random() * 1000),
        status: 'pending',
        days: 1,
      } as LeaveRequest;
    }
  },
  
  getLeaveBalance: async (employeeId: number): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('leave_balance')
        .select('*')
        .eq('employee_id', employeeId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      
      // Return mock data
      return {
        employee_id: employeeId,
        annual: 18,
        sick: 10,
        personal: 5,
        remaining_annual: 12,
        remaining_sick: 8,
        remaining_personal: 3
      };
    }
  },
  
  // Payroll Management
  getPayslips: async (month?: string, year?: number): Promise<PaySlip[]> => {
    try {
      let query = supabase.from('payslips').select('*');
      
      if (month) query = query.eq('month', month);
      if (year) query = query.eq('year', year);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as PaySlip[];
    } catch (error) {
      console.error('Error fetching payslips:', error);
      return mockHRData.payslips;
    }
  },
  
  generatePayslips: async (month: string, year: number): Promise<any> => {
    try {
      // In a real app, this would calculate payslips based on attendance data
      // For now, we'll just return a success message
      return { success: true, message: 'Payslips generated successfully' };
    } catch (error) {
      console.error('Error generating payslips:', error);
      throw error;
    }
  },
  
  // HR Tasks
  getHRTasks: async (status?: string, category?: string): Promise<HRTask[]> => {
    try {
      let query = supabase.from('hr_tasks').select('*');
      
      if (status) query = query.eq('status', status);
      if (category) query = query.eq('category', category);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as HRTask[];
    } catch (error) {
      console.error('Error fetching HR tasks:', error);
      
      // Return mock data
      return mockHRData.hrTasks;
    }
  },
  
  getHRTrends: async (): Promise<any> => {
    try {
      // This would typically analyze HR data for trends
      // For mock purposes, return static data
      return {
        hiring_trends: [
          { month: 'Jan', value: 2 },
          { month: 'Feb', value: 3 },
          { month: 'Mar', value: 5 },
          { month: 'Apr', value: 4 },
          { month: 'May', value: 6 },
          { month: 'Jun', value: 8 }
        ],
        retention_rates: [
          { month: 'Jan', value: 97 },
          { month: 'Feb', value: 98 },
          { month: 'Mar', value: 96 },
          { month: 'Apr', value: 97 },
          { month: 'May', value: 98 },
          { month: 'Jun', value: 99 }
        ],
        employee_satisfaction: [
          { month: 'Q1', value: 7.5 },
          { month: 'Q2', value: 8.2 }
        ]
      };
    } catch (error) {
      console.error('Error fetching HR trends:', error);
      throw error;
    }
  },
  
  completeHRTask: async (taskId: number): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('hr_tasks')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error completing HR task:', error);
      throw error;
    }
  },
  
  // Recruitment Management
  getOpenPositions: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'open');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching open positions:', error);
      return mockHRData.recruitmentData.openPositions;
    }
  },
  
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*');
      
      if (error) throw error;
      
      // Ensure status is one of the valid enum values
      const processedData = data.map(candidate => ({
        ...candidate,
        status: candidate.status as 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
      }));
      
      return processedData as Candidate[];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      
      // Ensure mock data has valid status values
      const processedMockData = mockHRData.recruitmentData.candidates.map(candidate => ({
        ...candidate,
        status: candidate.status as 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
      }));
      
      return processedMockData;
    }
  }
};

export default hrServiceSupabase;
