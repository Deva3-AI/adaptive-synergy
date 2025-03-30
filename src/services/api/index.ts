
import authService from './authService';
import employeeService from './employeeService';
import clientService from './clientService';
import taskService from './taskService';
import financeService from './financeService';
import hrService from './hrService';
import marketingService from './marketingService';
import reportService from './reportService';
import userService from './userService';
import hrServiceSupabase from './hrServiceSupabase';

export {
  authService,
  employeeService,
  clientService,
  taskService,
  financeService,
  hrService,
  marketingService,
  reportService,
  userService,
  hrServiceSupabase
};

// Define a taskModule object to replace the import in taskService.ts
export const task = {
  // Add any necessary properties or methods
};

// For backward compatibility
const apiService = {
  auth: authService,
  employees: employeeService,
  clients: clientService,
  tasks: taskService,
  finance: financeService,
  hr: hrService,
  marketing: marketingService,
  reports: reportService,
  users: userService
};

export default apiService;
