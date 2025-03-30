
import employeeService from './employeeService';
import clientService from './clientService';
import financeService, { type Invoice, type FinancialRecord } from './financeService';
import hrService from './hrService';
import marketingService from './marketingService';
import taskService from './taskService';
import aiService from './aiService';
import authService from './authService';

export {
  employeeService,
  clientService,
  financeService,
  hrService,
  marketingService,
  taskService,
  aiService,
  authService,
  // Types
  type Invoice,
  type FinancialRecord
};
