
import authService from './authService';
import clientService from './clientService';
import employeeService from './employeeService';
import financeService from './financeService';
import hrService from './hrService';
import marketingService from './marketingService';
import reportService from './reportService';
import userService from './userService';
import aiService from './aiService';
import taskService from './taskService';

export {
  authService,
  clientService,
  employeeService,
  financeService,
  hrService,
  marketingService,
  reportService,
  userService,
  aiService,
  taskService
};

// For backward compatibility with existing code
export const apiService = {
  authService,
  clientService,
  employeeService,
  financeService,
  hrService,
  marketingService,
  reportService,
  userService,
  aiService,
  taskService
};
