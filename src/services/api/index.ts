
// Import services
import employeeService from './employeeService';
import clientService from './clientService';
import financeService from './financeService';
import hrService from './hrService';
import marketingService from './marketingService';
import taskService from './taskService';
import aiService from './aiService';
import authService from './authService';
import reportService from './reportService';

// Import and export types from services
export type { 
  TaskAttachment, 
  TaskStatistics,
  TaskComment
} from './taskService';

export type { 
  Brand, 
  ClientPreferences 
} from './clientService';

export type { 
  Invoice, 
  FinancialRecord,
  FinancialMetrics,
  SalesMetrics
} from './financeService';

export type { 
  EmailOutreach, 
  MarketingMeeting, 
  LeadProfile,
  EmailTemplate,
  MarketingPlan,
  MarketingMetrics,
  CompetitorInsight,
  MarketingTrend
} from './marketingService';

// Export individual services
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
