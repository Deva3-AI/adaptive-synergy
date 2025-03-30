
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

// Import types from various services
import type { 
  TaskAttachment, 
  TaskStatistics,
  TaskComment,
  TaskWithDetails
} from './taskService';

import type { 
  Brand, 
  ClientPreferences 
} from './clientService';

import type { 
  Invoice, 
  FinancialRecord,
  FinancialMetrics,
  SalesMetrics
} from './financeService';

import type { 
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
  TaskAttachment,
  TaskStatistics,
  TaskComment,
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
