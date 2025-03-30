
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

export interface MarketingMeeting {
  id: number;
  leadName: string;
  leadCompany: string;
  scheduledTime: string;
  duration: number;
  platform: string;
  status: string;
  notes?: string;
  followUpDate?: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  usage_count: number;
  conversion_rate: number;
  variables: string[];
  tags: string[];
  created_at: string;
  last_modified: string;
}

export interface MarketingMetrics {
  lead_generation: {
    total_leads: number;
    qualified_leads: number;
    lead_quality_score: number;
    cost_per_lead: number;
    conversion_rate: number;
    trends: Array<{
      month: string;
      leads: number;
      qualified: number;
    }>;
  };
  campaign_performance: {
    active_campaigns: number;
    top_performing: string;
    avg_engagement_rate: number;
    avg_conversion_rate: number;
    roi: number;
    by_channel: Array<{
      channel: string;
      engagement: number;
      conversion: number;
      roi: number;
    }>;
  };
  website_performance: {
    traffic: number;
    bounce_rate: number;
    avg_session_duration: number;
    top_landing_pages: Array<{
      page: string;
      visits: number;
      conversion: number;
    }>;
  };
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  owner_id: number;
  owner_name: string;
  budget: number;
  kpis: Array<{
    name: string;
    target: number;
    current: number;
    unit: string;
  }>;
  channels: Array<{
    name: string;
    budget_allocation: number;
    status: string;
  }>;
  milestones: Array<{
    name: string;
    due_date: string;
    status: string;
  }>;
}

export interface MarketingTrends {
  industry_trends: Array<{
    id: number;
    title: string;
    description: string;
    impact: string;
    source: string;
    discovery_date: string;
    tags: string[];
  }>;
  platform_updates: Array<{
    id: number;
    platform: string;
    update: string;
    impact: string;
    effective_date: string;
    recommendations: string;
  }>;
  recommended_actions: Array<{
    id: number;
    title: string;
    description: string;
    priority: string;
    resources_needed: string;
    estimated_impact: string;
  }>;
}

export interface MarketingLead {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  assigned_to: number;
  assigned_to_name: string;
  created_at: string;
  last_contact: string;
  notes: string;
  score: number;
  tags: string[];
}
