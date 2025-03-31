
// Marketing Campaign
export interface MarketingCampaign {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  target: {
    audience: string;
    location: string;
    demographic: string[];
  };
  kpis: {
    name: string;
    value: number;
    target: number;
    unit: string;
  }[];
  channels: string[];
  owner: string;
  team: string[];
  createdAt: string;
  updatedAt: string;
}

// Marketing Meeting
export interface MarketingMeeting {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  platform: string;
  participants: string[];
  agenda: string[];
  notes: string;
  followUp: string[];
  status: string;
  leadName: string;
  leadCompany: string;
  scheduledTime: string;
}

// Marketing Lead
export interface MarketingLead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  source: string;
  rating: number;
  notes: string;
  lastContact: string;
  nextContact: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// Email Outreach
export interface EmailOutreach {
  id: number;
  subject: string;
  recipients: string[];
  recipient: string; // For backward compatibility with existing components
  recipientCompany: string; // For backward compatibility with existing components
  content: string;
  sentDate: string;
  sentAt: string; // For backward compatibility with existing components
  status: string;
  openRate: number;
  clickRate: number;
  responseRate: number;
  source: string;
  followUpScheduled: boolean;
  follow_up_scheduled: boolean; // For backward compatibility with existing components
  follow_up_date: string;
  tags: string[];
}

// Analytics Data
export interface MarketingAnalytics {
  period: string;
  metrics: {
    leads: number;
    meetings: number;
    opportunities: number;
    conversions: number;
    revenue: number;
  };
  channels: {
    name: string;
    value: number;
    percentage: number;
  }[];
  campaigns: {
    name: string;
    leads: number;
    meetings: number;
    conversions: number;
    roi: number;
  }[];
  trends: {
    date: string;
    leads: number;
    meetings: number;
    conversions: number;
  }[];
}

// Marketing Plan
export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  objectives: string[];
  strategy: string;
  tactics: string[];
  timeline: {
    startDate: string;
    endDate: string;
    milestones: {
      date: string;
      description: string;
    }[];
  };
  budget: number;
  resources: string[];
  metrics: {
    name: string;
    target: number;
    unit: string;
  }[];
  status: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

// Marketing Metric
export interface MarketingMetric {
  id: number;
  name: string;
  value: number;
  target: number;
  unit: string;
  period: string;
  trend: number;
  category: string;
  source: string;
  updatedAt: string;
}

// Marketing Trends
export interface MarketingTrend {
  id: number;
  title: string;
  description: string;
  category: string;
  relevance_score: number;
  relevanceScore: number; // For backward compatibility
  source: string;
  discoveredAt: string;
  actionable: boolean;
  suggestedActions: string[];
  impact: string;
}

// Competitor Insight
export interface CompetitorInsight {
  id: number;
  competitor: string;
  competitor_name: string; // For backward compatibility
  description: string;
  type: string;
  impact: string;
  discoveredAt: string;
  source: string;
  suggestedResponse: string;
}
