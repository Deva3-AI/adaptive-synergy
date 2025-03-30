
import { supabase } from '@/integrations/supabase/client';

// Import all service modules
import * as authServiceModule from './authService';
import * as clientServiceModule from './clientService';
import * as employeeServiceModule from './employeeService';
import * as financeServiceModule from './financeService';
import * as hrServiceModule from './hrService';
import * as marketingServiceModule from './marketingService';
import * as taskServiceModule from './taskService';
import * as aiServiceModule from './aiService';

// Export all service modules
export const authService = authServiceModule;
export const clientService = clientServiceModule;
export const employeeService = employeeServiceModule;
export const financeService = financeServiceModule;
export const hrService = hrServiceModule;
export const marketingService = marketingServiceModule;
export const taskService = taskServiceModule;
export const aiService = aiServiceModule;

// Export interfaces
export interface Task {
  task_id: number;
  title: string;
  description?: string;
  client_id?: number;
  assigned_to?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time?: number;
  actual_time?: number;
  start_time?: string | Date;
  end_time?: string | Date;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  comment: string;
  created_at: string;
}

export interface TaskStatistics {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
  cancelled: number;
  avg_completion_time: number;
  completion_rate: number;
}

export interface TaskWithDetails extends Task {
  client_name?: string;
  assignee_name?: string;
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  is_active: boolean;
  tags: string[];
  performanceMetrics: {
    open_rate: number;
    click_rate: number;
    conversion_rate: number;
    send_count: number;
  };
}

export interface EmailOutreach {
  id: number;
  subject: string;
  email_body: string;
  recipient: string;
  recipientCompany: string;
  status: 'draft' | 'sent' | 'opened' | 'clicked' | 'replied';
  sent_by: number;
  sentAt: string;
  template_id?: number;
  followUpScheduled: boolean;
  source: string;
}

export interface MarketingMeeting {
  id: number;
  title: string;
  description?: string;
  leadName: string;
  leadCompany: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_by: number;
  created_at: string;
  platform: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  score: number;
  last_contact: string;
  notes?: string;
  created_at: string;
  assigned_to?: number;
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  budget: number;
  objectives: string[];
  kpis: Record<string, string>;
  channels: string[];
  target_audience: string[];
  created_by: number;
  created_at: string;
}

export interface MarketingMetrics {
  email_metrics: {
    open_rate: number;
    click_rate: number;
    conversion_rate: number;
    bounce_rate: number;
  };
  social_metrics: {
    followers: number;
    engagement_rate: number;
    reach: number;
    growth_rate: number;
  };
  website_metrics: {
    visitors: number;
    page_views: number;
    avg_session_duration: number;
    bounce_rate: number;
    conversion_rate: number;
  };
  lead_metrics: {
    new_leads: number;
    qualified_leads: number;
    conversion_rate: number;
    avg_acquisition_cost: number;
  };
}

export interface MarketingTrend {
  id: number;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  relevance_score: number;
  industry: string[];
  source_url?: string;
  discoveredAt: string;
  created_at: string;
  category: string;
  actionable: boolean;
  suggestedActions: string[];
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  strategies: string[];
  impact: 'low' | 'medium' | 'high';
  source?: string;
  discoveredAt: string;
  created_at: string;
  category: string;
  type: string;
  suggestedResponse: string;
  description: string;
}

// Export default API object with all services
export default {
  auth: authService,
  client: clientService,
  employee: employeeService,
  finance: financeService,
  hr: hrService,
  marketing: marketingService,
  task: taskService,
  ai: aiService,
};
