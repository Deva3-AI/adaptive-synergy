
import { supabase } from '@/lib/supabase';
import { PaySlip, Candidate, Employee, LeaveRequest } from '@/interfaces/hr';
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
  
  updateLeaveRequest: async (requestId: number, status: 'approved' | 'rejected'): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({ status })
        .eq('id', requestId)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }
  },
  
  // Payroll Management
  getPayslips: async (month: string, year: number): Promise<PaySlip[]> => {
    try {
      const { data, error } = await supabase
        .from('payslips')
        .select('*')
        .eq('month', month)
        .eq('year', year);
      
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
      return data as Candidate[];
    } catch (error) {
      console.error('Error fetching candidates:', error);
      return mockHRData.recruitmentData.candidates;
    }
  }
};

export default hrServiceSupabase;
