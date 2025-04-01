
import { mockData } from '../mockData';

// User service for employee-related functionality
export const userService = {
  getUserProfile: async (userId: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockData.users.find(u => u.id === userId);
        if (user) {
          resolve({
            ...user,
            tasks: mockData.tasks.filter(t => t.assigned_to === userId),
            performance: {
              taskCompletionRate: 85,
              qualityScore: 92,
              efficiencyScore: 88,
              overallRating: 4.5
            }
          });
        } else {
          resolve(null);
        }
      }, 500);
    });
  },
  
  getUserTasks: async (userId: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const tasks = mockData.tasks.filter(t => t.assigned_to === userId);
        resolve(tasks);
      }, 500);
    });
  },
  
  getUserAttendance: async (userId: number, startDate?: string, endDate?: string) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let attendance = mockData.attendance.filter(a => a.user_id === userId);
        
        if (startDate) {
          attendance = attendance.filter(a => new Date(a.work_date) >= new Date(startDate));
        }
        
        if (endDate) {
          attendance = attendance.filter(a => new Date(a.work_date) <= new Date(endDate));
        }
        
        resolve(attendance);
      }, 500);
    });
  },
  
  getEmployeeDetails: async (employeeId: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const employee = mockData.users.find(u => u.id === employeeId);
        if (employee) {
          resolve({
            ...employee,
            roles: mockData.roles.filter(r => r.role_id === employee.role_id),
            joinDate: "2022-01-15"
          });
        } else {
          resolve(null);
        }
      }, 500);
    });
  },
  
  getEmployeePerformance: async (employeeId: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock performance data
        resolve([
          { month: 'Jan', value: 78 },
          { month: 'Feb', value: 82 },
          { month: 'Mar', value: 85 },
          { month: 'Apr', value: 90 },
          { month: 'May', value: 88 },
          { month: 'Jun', value: 92 }
        ]);
      }, 500);
    });
  },
  
  getEmployeeAttendance: async (employeeId: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendance = mockData.attendance.filter(a => a.user_id === employeeId);
        resolve(attendance);
      }, 500);
    });
  },
  
  getEmployeeLeaveBalances: async (employeeId: number) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock leave balances
        resolve({
          annual: { total: 20, used: 5, remaining: 15 },
          sick: { total: 10, used: 2, remaining: 8 },
          personal: { total: 5, used: 1, remaining: 4 }
        });
      }, 500);
    });
  },
  
  updateEmployeeProfile: async (employeeId: number, profileData: any) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Profile updated successfully' });
      }, 500);
    });
  }
};

export default userService;
