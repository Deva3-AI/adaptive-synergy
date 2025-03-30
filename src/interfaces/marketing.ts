
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  body?: string;  // Added for backward compatibility
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  variables?: string[];  // Added for template variables
  performanceMetrics: {
    openRate: number;
    clickRate: number;
    replyRate: number;
    conversionRate: number;
    responseRate?: number;  // Added for backward compatibility
    usageCount?: number;    // Added for backward compatibility
  };
}

export interface EmailOutreach {
  id: number;
  recipient: string;
  recipientCompany: string;  // Added explicit property
  subject: string;
  status: 'sent' | 'opened' | 'replied' | 'bounced' | 'scheduled';
  sentAt: string;  // Added explicit property
  source: string;  // Added explicit property
  followUpScheduled: boolean;  // Added explicit property
}

export interface MarketingMeeting {
  id: number;
  leadName: string;  // Added explicit property
  leadCompany: string;  // Added explicit property
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  scheduledTime: string;  // Added explicit property
  duration: number;
  platform: string;  // Added explicit property
  notes?: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  status: string;
  source: string;
  score: number;  // Added explicit property
  last_contact: string;
  lastContactedAt?: string;  // Added for backward compatibility
}

export interface MarketingTrend {
  id: number;
  title: string;
  description: string;
  relevance_score: number;
  relevanceScore?: number;  // Added for backward compatibility
  category: string;  // Added explicit property
  source?: string;
  discoveredAt: string;  // Added explicit property
  actionable: boolean;  // Added explicit property
  suggestedActions: string[];  // Added explicit property
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  competitorName?: string;  // Added for backward compatibility
  description: string;  // Added explicit property
  impact: 'high' | 'medium' | 'low';  // Added explicit property
  type: string;  // Added explicit property
  discoveredAt: string;  // Added explicit property
  source: string;  // Added explicit property
  suggestedResponse: string;  // Added explicit property
}

export interface SalesData {
  monthly_revenue: number;
  annual_target: number;
  growth_rate: number;
  client_acquisition: number;
  conversion_rate: number;
  avg_deal_size: number;
  top_clients: {
    client_id: number;
    client_name: string;
    revenue: number;
    growth: number;
  }[];
  monthly_trend: {
    month: string;
    revenue: number;
    target: number;
  }[];
  sales_by_service: {
    service: string;
    value: number;
  }[];
}
