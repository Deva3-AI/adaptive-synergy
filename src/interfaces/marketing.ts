
export interface EmailOutreach {
  id: number;
  subject: string;
  recipient: string;
  recipientCompany?: string;
  recipientPosition?: string;
  sentAt: Date | string;
  status: 'sent' | 'opened' | 'replied' | 'bounced';
  responseTime?: Date | string;
  source: 'bni' | 'master_networks' | 'other';
  sentBy: number; // user_id
  followUpScheduled?: boolean;
}

export interface MarketingMeeting {
  id: number;
  leadId: number;
  leadName: string;
  leadCompany: string;
  scheduledTime: Date | string;
  duration: number; // minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  attendees: string[];
  notes?: string;
  recordingUrl?: string;
  transcriptUrl?: string;
  platform: 'google_meet' | 'zoom' | 'teams' | 'in_person' | 'other';
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  source: string;
  createdAt: Date | string;
  lastContactedAt?: Date | string;
  status: 'new' | 'contacted' | 'meeting_scheduled' | 'meeting_completed' | 'proposal_sent' | 'converted' | 'lost';
  score?: number; // lead score
  tags?: string[];
  notes?: string;
  socialProfiles?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  };
  interactions: LeadInteraction[];
}

export interface LeadInteraction {
  id: number;
  leadId: number;
  type: 'email' | 'meeting' | 'call' | 'message' | 'other';
  date: Date | string;
  description: string;
  outcome?: string;
  nextSteps?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface MeetingInsight {
  id: number;
  meetingId: number;
  leadId: number;
  type: 'action_item' | 'preference' | 'concern' | 'opportunity' | 'objection';
  content: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: Date | string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface MarketingMetrics {
  emailsSent: number;
  emailOpenRate: number;
  emailResponseRate: number;
  meetingsScheduled: number;
  meetingConversionRate: number;
  salesCloseRate: number;
  averageResponseTime: number; // hours
  leadAcquisitionCost: number;
  customerAcquisitionCost: number;
  periodStart: Date | string;
  periodEnd: Date | string;
}

export interface MarketingTrend {
  id: number;
  title: string;
  description: string;
  source: string;
  discoveredAt: Date | string;
  relevanceScore: number;
  category: 'industry' | 'competitor' | 'technology' | 'customer_behavior' | 'other';
  actionable: boolean;
  suggestedActions?: string[];
}

export interface CompetitorInsight {
  id: number;
  competitorName: string;
  description: string;
  source: string;
  discoveredAt: Date | string;
  type: 'strategy' | 'offering' | 'pricing' | 'marketing' | 'other';
  impact: 'low' | 'medium' | 'high';
  suggestedResponse?: string;
}

export interface MarketingPlanAction {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date | string;
  assignee?: number; // user_id
  dependencies?: number[]; // other action IDs
  progress?: number; // 0-100
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  timeframe: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  objectives: string[];
  targetMetrics: {
    [key: string]: number;
  };
  actions: MarketingPlanAction[];
  status: 'draft' | 'active' | 'completed';
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: 'outreach' | 'follow_up' | 'meeting_request' | 'proposal' | 'other';
  variables: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  performanceMetrics?: {
    usageCount: number;
    openRate: number;
    responseRate: number;
  };
}
