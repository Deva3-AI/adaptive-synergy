
export interface MarketingCampaign {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  channels: string[];
  targets: {
    audience: string;
    goals: string[];
  };
  performance?: {
    reach: number;
    engagement: number;
    conversion: number;
    roi: number;
  };
}

export interface MarketingLead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  notes?: string;
  lastContactDate?: string;
  assignedTo?: number;
  assignedToName?: string;
  createdAt: string;
  updatedAt?: string;
  score?: number;
  tags?: string[];
}

export interface MarketingMetrics {
  timeframe: string;
  leads: {
    total: number;
    new: number;
    qualified: number;
    conversion: number;
  };
  campaigns: {
    active: number;
    reach: number;
    engagement: number;
    conversion: number;
  };
  channels: {
    name: string;
    performance: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  sales: {
    total: number;
    average: number;
    trend: number;
  };
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  period: {
    start: string;
    end: string;
  };
  status: 'draft' | 'active' | 'completed';
  goals: {
    description: string;
    metric: string;
    target: number;
    current?: number;
  }[];
  strategies: {
    id: number;
    title: string;
    description: string;
    tactics: string[];
  }[];
  budget: {
    total: number;
    allocated: number;
    remaining: number;
  };
  timeline: {
    milestones: {
      date: string;
      description: string;
      completed: boolean;
    }[];
  };
}

export interface MarketingTrends {
  trends: {
    id: number;
    name: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
    relevance: string;
    source: string;
    date: string;
  }[];
  industryBenchmarks: {
    metric: string;
    industry: number;
    company: number;
    difference: number;
  }[];
  recommendations: string[];
}

export interface CompetitorInsight {
  id: number;
  competitor: string;
  impact: 'low' | 'medium' | 'high';
  type: string;
  description: string;
  discoveredAt: string;
  source: string;
  suggestedResponse: string;
}

export interface EmailOutreach {
  id: number;
  title: string;
  recipients: number;
  sentDate: string;
  openRate: number;
  clickRate: number;
  responses: number;
  meetings: number;
  status: 'draft' | 'scheduled' | 'sent' | 'completed';
  template?: string;
  results?: {
    leads: number;
    opportunities: number;
    sales: number;
  };
}

export interface MarketingMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  company: string;
  contacts: {
    name: string;
    title: string;
    email?: string;
    phone?: string;
  }[];
  agenda: string[];
  notes?: string;
  outcome?: string;
  nextSteps?: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  followUp?: {
    date: string;
    type: 'email' | 'call' | 'meeting';
    completed: boolean;
  };
}

export interface MeetingTranscript {
  id: number;
  meetingId: number;
  meetingTitle: string;
  date: string;
  duration: number;
  participants: string[];
  content: string;
  keyPoints?: string[];
  action_items?: {
    description: string;
    assignee?: string;
    dueDate?: string;
    completed: boolean;
  }[];
  sentiment?: 'positive' | 'neutral' | 'negative';
}
