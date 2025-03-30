
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

// Import types from task service
import { 
  Task,
  TaskAttachment,
  TaskComment,
  TaskStatistics,
  TaskWithDetails
} from './taskService';

// Import types from client service
import { 
  Brand, 
  ClientPreferences 
} from './clientService';

import { 
  Invoice, 
  FinancialRecord,
  FinancialMetrics,
  SalesMetrics
} from './financeService';

import { 
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

// Export types 
export type {
  Task,
  TaskAttachment,
  TaskComment,
  TaskStatistics,
  TaskWithDetails,
  Brand,
  ClientPreferences,
  Invoice,
  FinancialRecord,
  FinancialMetrics,
  SalesMetrics,
  EmailOutreach,
  MarketingMeeting,
  LeadProfile,
  EmailTemplate,
  MarketingPlan,
  MarketingMetrics,
  CompetitorInsight,
  MarketingTrend
};
