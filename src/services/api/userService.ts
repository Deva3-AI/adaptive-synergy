
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { mockUserData } from '@/utils/mockData';
import apiClient from '@/utils/apiUtils';

const userService = {
  // Get user profile
  getUserProfile: async (userId: number): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          user_id,
          name,
          email,
          role_id,
          roles:role_id(role_name),
          employee_details(joining_date, employee_id, date_of_birth)
        `)
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.roles?.role_name || 'unknown',
        joining_date: data.employee_details?.[0]?.joining_date,
        employee_id: data.employee_details?.[0]?.employee_id,
        date_of_birth: data.employee_details?.[0]?.date_of_birth
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      
      // Return mock data for demo
      const mockUser = mockUserData.users.find(u => u.user_id === userId);
      if (mockUser) {
        const mockRole = mockUserData.roles.find(r => r.role_id === mockUser.role_id);
        return {
          id: mockUser.user_id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockRole?.role_name || 'unknown',
          joining_date: '2022-01-15',
          employee_id: `EMP-${String(mockUser.user_id).padStart(4, '0')}`,
          date_of_birth: '1990-05-20'
        };
      }
      
      throw error;
    }
  },
  
  // Get current user attendance
  getUserAttendance: async (userId: number, startDate?: string, endDate?: string): Promise<any> => {
    try {
      let query = supabase
        .from('employee_attendance')
        .select(`
          attendance_id,
          user_id,
          login_time,
          logout_time,
          work_date
        `)
        .eq('user_id', userId);
      
      if (startDate) {
        query = query.gte('work_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('work_date', endDate);
      }
      
      const { data, error } = await query.order('work_date', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching user attendance:', error);
      
      // Return mock data for demo
      return [
        {
          attendance_id: 1,
          user_id: userId,
          login_time: new Date(new Date().setHours(9, 0, 0)).toISOString(),
          logout_time: new Date(new Date().setHours(17, 30, 0)).toISOString(),
          work_date: new Date().toISOString().split('T')[0]
        },
        {
          attendance_id: 2,
          user_id: userId,
          login_time: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(8, 45, 0),
          logout_time: new Date(new Date().setDate(new Date().getDate() - 1)).setHours(17, 15, 0),
          work_date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]
        }
      ];
    }
  },
  
  // Get user tasks
  getUserTasks: async (userId: number, status?: string): Promise<any> => {
    try {
      let query = supabase
        .from('tasks')
        .select(`
          task_id,
          title,
          description,
          status,
          estimated_time,
          actual_time,
          start_time,
          end_time,
          priority,
          progress,
          client_id,
          clients!inner (client_name)
        `)
        .eq('assigned_to', userId);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(task => ({
        ...task,
        client_name: task.clients?.client_name
      }));
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  },
  
  // Get user performance metrics
  getUserPerformance: async (userId: number): Promise<any> => {
    try {
      // This would normally call an API endpoint
      // For demo purposes, return mock data
      return {
        task_completion_rate: 92,
        on_time_percentage: 88,
        average_quality_rating: 4.7,
        tasks_completed_this_month: 24,
        average_time_per_task: 4.5,
        efficiency_score: 94,
        skills: [
          { name: 'Web Design', score: 95 },
          { name: 'UI/UX', score: 92 },
          { name: 'React', score: 88 },
          { name: 'CSS', score: 90 },
          { name: 'Figma', score: 94 }
        ],
        recent_feedback: [
          {
            from: 'Project Manager',
            content: 'Excellent work on the landing page redesign. Client was very happy with the results.',
            date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
          },
          {
            from: 'Team Lead',
            content: 'Great collaboration with the development team. Keep up the good work!',
            date: new Date(new Date().setDate(new Date().getDate() - 12)).toISOString()
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching user performance:', error);
      throw error;
    }
  },
  
  // Get user leave balances
  getUserLeaveBalances: async (userId: number): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('leave_balance')
        .select('*')
        .eq('employee_id', userId)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      
      // Return mock data
      return {
        employee_id: userId,
        annual: 18,
        sick: 10,
        personal: 5,
        remaining_annual: 12,
        remaining_sick: 8,
        remaining_personal: 3
      };
    }
  }
};

export default userService;
