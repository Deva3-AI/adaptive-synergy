
import employeeService from './employeeService';
import clientService from './clientService';
import financeService from './financeService';
import hrService from './hrService';
import marketingService from './marketingService';
import taskService from './taskService';
import aiService from './aiService';
import authService from './authService';
import reportService from './reportService';

// Export service types
export type { TaskAttachment, TaskStatistics } from './taskService';
export type { Brand, ClientPreferences } from './clientService';
export type { Invoice, FinancialRecord } from './financeService';
export type { EmailOutreach, MarketingMeeting, LeadProfile } from './marketingService';

// Export services
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
};
