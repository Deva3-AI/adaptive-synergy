
export interface EmailOutreach {
  id: number;
  subject: string;
  email_body: string;
  recipient: string;
  recipient_name?: string;
  status: 'draft' | 'sent' | 'opened' | 'replied';
  sent_date?: string;
  opened_date?: string;
  replied_date?: string;
  created_at: string;
  created_by: number;
}

export interface MarketingMeeting {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  attendees: string[];
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  follow_up_tasks?: string[];
  created_at: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  interest_level: 'low' | 'medium' | 'high';
  notes?: string;
  created_at: string;
  last_contact?: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: string;
  created_at: string;
  created_by: number;
  usage_count: number;
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  goals: string[];
  strategies: string[];
  budget: number;
  status: 'draft' | 'active' | 'completed';
  created_at: string;
  metrics: {
    target: string;
    current: number;
    goal: number;
  }[];
}

export interface MarketingMetrics {
  emailMetrics: {
    sent: number;
    opened: number;
    openRate: number;
    clicked: number;
    clickRate: number;
    converted: number;
    conversionRate: number;
  };
  socialMetrics: {
    followers: number;
    engagement: number;
    impressions: number;
    clicks: number;
    conversionRate: number;
  };
  websiteMetrics: {
    visitors: number;
    pageViews: number;
    averageSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  leadMetrics: {
    newLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    conversionRate: number;
    costPerLead: number;
  };
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  created_at: string;
  updated_at: string;
}

export interface MarketingTrend {
  id: number;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  relevance_score: number;
  action_items: string[];
  created_at: string;
  source: string;
}
