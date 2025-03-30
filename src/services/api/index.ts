
import employeeService from './employeeService';
import clientService, { type Brand } from './clientService';
import financeService, { type Invoice, type FinancialRecord } from './financeService';
import hrService from './hrService';
import marketingService from './marketingService';
import taskService, { type TaskAttachment } from './taskService';
import aiService from './aiService';
import authService from './authService';
import reportService from './reportService';

export {
  employeeService,
  clientService,
  financeService,
  hrService,
  marketingService,
  taskService,
  aiService,
  authService,
  reportService,
  // Types
  type Brand,
  type Invoice,
  type FinancialRecord,
  type TaskAttachment
};
