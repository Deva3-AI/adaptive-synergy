
import clientService from './clientService';
import marketingService from './marketingService';
import financeService from './financeService';
import hrService from './hrService';
import aiService from './aiService';
import employeeService from './employeeService';
import taskService from './taskService';
import userService from './userService';

export { 
  clientService,
  marketingService,
  financeService,
  hrService,
  aiService,
  employeeService,
  taskService,
  userService
};

// Re-export types from service files
export type { Brand } from './clientService';
export type { Invoice, FinancialRecord } from './financeService';
export type { TaskAttachment } from './taskService';

