
export interface Campaign {
  id: number;
  title: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
  roi: string;
  leads_generated: number;
  conversion_rate: string;
}

export interface Meeting {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  contact_name: string;
  company: string;
  status: string;
  notes: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: string;
  performance: {
    open_rate: number;
    response_rate: number;
    meetings_booked: number;
  };
  improvements?: string[];
}

export interface Lead {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  last_contact: string;
  next_follow_up: string;
  estimated_value: number;
  probability: number;
  notes: string;
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: string;
  budget: number;
  goals: {
    id: number;
    title: string;
    target: string;
    current: string;
  }[];
  channels: string[];
  target_audience: string[];
  milestones: {
    id: number;
    title: string;
    date: string;
    status: string;
  }[];
}

export interface MarketingTrends {
  id: number;
  title: string;
  description: string;
  relevance_score: number;
  adoption_level: string;
  expected_impact: string;
  suggested_actions: string[];
  resources_needed: string[];
  implementation_timeline: string;
  industry_examples: string[];
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
  recent_activities: string[];
  target_audience: string[];
  pricing_strategy: string;
  market_share: string;
  growth_rate: string;
  threat_level: string;
  opportunity_areas: string[];
}

export interface MarketingMetrics {
  website_traffic: {
    total_visits: number;
    growth_rate: string;
    bounce_rate: string;
    avg_session_duration: string;
    by_source: {
      name: string;
      value: number;
    }[];
    monthly_trend: {
      month: string;
      value: number;
    }[];
  };
  social_media: {
    followers: number;
    growth_rate: string;
    engagement_rate: string;
    reach: number;
    by_platform: {
      name: string;
      value: number;
      growth: string;
    }[];
    top_posts: {
      id: number;
      platform: string;
      content: string;
      engagement: number;
      reach: number;
      date: string;
    }[];
  };
  email_marketing: {
    total_subscribers: number;
    growth_rate: string;
    avg_open_rate: string;
    avg_click_rate: string;
    unsubscribe_rate: string;
    best_performing_campaign: {
      name: string;
      open_rate: string;
      click_rate: string;
      conversion_rate: string;
    };
  };
  content_marketing: {
    total_content_pieces: number;
    avg_engagement: string;
    conversion_rate: string;
    by_type: {
      name: string;
      value: number;
    }[];
    top_performing: {
      id: number;
      title: string;
      type: string;
      views: number;
      engagement: number;
      conversion_rate: string;
    }[];
  };
}

export interface MeetingAnalysis {
  summary: string;
  key_points: string[];
  action_items: {
    task: string;
    assignee: string;
    deadline: string;
  }[];
  client_pain_points: string[];
  opportunities: string[];
  follow_up_schedule: {
    next_meeting: string;
    deliverables: string[];
  };
}
