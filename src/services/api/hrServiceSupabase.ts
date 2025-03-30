import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';

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
      return data.map(item => ({
        user_id: item.user_id,
        name: item.name,
        email: item.email,
        role_id: item.role_id,
        role_name: item.roles?.role_name,
        joining_date: item.employee_details?.joining_date,
        employee_id: item.employee_details?.employee_id,
        date_of_birth: item.employee_details?.date_of_birth
      }));
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
        return {
          attendance_id: record.attendance_id,
          user_id: record.user_id,
          login_time: record.login_time,
          logout_time: record.logout_time,
          work_date: record.work_date,
          employee_name: employee?.name || 'Unknown Employee',
          department: employee?.roles?.role_name || 'Unassigned'
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

  // Add more methods as needed for HR dashboard
};

export default hrServiceSupabase;
