
import employeeService from './employeeService';
import clientService from './clientService';
import financeService from './financeService';
import hrService from './hrService';
import marketingService from './marketingService';
import taskService from './taskService';
import aiService from './aiService';
import authService from './authService';
import reportService from './reportService';

// Re-export types
import type { Brand } from './clientService';
import type { Invoice, FinancialRecord } from './financeService';
import type { TaskAttachment, TaskStatistics } from './taskService';

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
  type TaskAttachment,
  type TaskStatistics
};
