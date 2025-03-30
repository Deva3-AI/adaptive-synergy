
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  performanceMetrics: {
    openRate: number;
    clickRate: number;
    replyRate: number;
    conversionRate: number;
  };
}

export interface EmailOutreach {
  id: number;
  recipient: string;
  recipientCompany: string;
  subject: string;
  status: 'sent' | 'opened' | 'replied' | 'bounced' | 'scheduled';
  sentAt: string;
  source: string;
  followUpScheduled: boolean;
}

export interface MarketingMeeting {
  id: number;
  leadName: string;
  leadCompany: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  scheduledTime: string;
  duration: number;
  platform: string;
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
  score: number;
  last_contact: string;
}

export interface MarketingTrend {
  id: number;
  title: string;
  description: string;
  relevance_score: number;
  category: string;
  source?: string;
  discoveredAt: string;
  actionable: boolean;
  suggestedActions: string[];
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: string;
  discoveredAt: string;
  source: string;
  suggestedResponse: string;
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
