
export interface Campaign {
  id: number;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'social' | 'content' | 'paid' | 'event';
  start_date: string;
  end_date?: string;
  budget?: number;
  target_audience?: string;
  created_at: string;
  updated_at?: string;
  metrics?: {
    impressions?: number;
    clicks?: number;
    conversions?: number;
    cost_per_conversion?: number;
  };
}

export interface MarketingMeeting {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number; // in minutes
  contact_name: string;
  contact_email: string;
  contact_company: string;
  meeting_type: 'prospect' | 'client' | 'partner' | 'internal';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  location?: string;
  platform?: string;
  meeting_link?: string;
  created_at: string;
  updated_at?: string;
  leadName?: string;
  leadCompany?: string;
  scheduledTime?: string;
}

export interface EmailOutreach {
  id: number;
  campaign_id?: number;
  subject: string;
  content: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduled_date?: string;
  sent_date?: string;
  recipients: string[];
  open_rate?: number;
  click_rate?: number;
  response_rate?: number;
  created_at: string;
  updated_at?: string;
  recipientCompany?: string;
  source?: string;
  follow_up_scheduled?: boolean;
  sentDate?: string;
}

export interface MarketingLead {
  id: number;
  name: string;
  email: string;
  company?: string;
  position?: string;
  phone?: string;
  source: 'website' | 'referral' | 'social' | 'event' | 'advertisement' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  assigned_to?: number;
  assigned_name?: string;
  notes?: string;
  last_contact_date?: string;
  next_follow_up?: string;
  potential_value?: number;
  created_at: string;
  updated_at?: string;
  interests?: string[];
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  objectives: string[];
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed';
  budget?: number;
  target_audience?: string[];
  key_strategies: string[];
  success_metrics: {
    [key: string]: {
      target: number;
      current?: number;
      unit: string;
    };
  };
  channels: string[];
  owner_id?: number;
  owner_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface MarketingTrends {
  industry_trends: Array<{
    trend: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
  }>;
  platform_changes: Array<{
    platform: string;
    change: string;
    impact: 'low' | 'medium' | 'high';
  }>;
  recommended_actions: Array<{
    action: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}

export interface CompetitorInsight {
  competitor: string;
  strengths: string[];
  weaknesses: string[];
  recent_activities: string[];
  threat_level: 'low' | 'medium' | 'high';
}

export interface MarketingMetrics {
  overall_performance: {
    total_leads: number;
    conversion_rate: string;
    cost_per_lead: string;
    roi: string;
  };
  channel_performance: Array<{
    channel: string;
    leads: number;
    conversion_rate: string;
    cost_per_lead: string;
  }>;
  trends: Array<{
    metric: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    value: string;
  }>;
}
