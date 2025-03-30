import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

export interface EmailOutreach {
  id: number;
  subject: string;
  recipient: string;
  status: "sent" | "opened" | "clicked" | "replied" | "bounced" | string;
  sent_at: string;
  response_rate: number;
}

export interface MarketingMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  attendees: string[];
  objective: string;
  outcome: string;
  created_at: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "closed" | "lost" | string;
  created_at: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  created_at: string;
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: "active" | "inactive" | "completed";
  goals: {
    id: number;
    description: string;
    status: "not_started" | "in_progress" | "completed";
  }[];
}

export interface MarketingMetrics {
  campaigns: {
    active: number;
    completed: number;
    performance: number;
  };
  channels: {
    name: string;
    performance: number;
    growth: number;
  }[];
  leads: {
    total: number;
    new_this_month: number;
    conversion_rate: number;
    sources: {
      name: string;
      value: number;
    }[];
  };
  roi: {
    overall: number;
    by_channel: {
      name: string;
      value: number;
    }[];
  };
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  recent_activities: string[];
}

export interface MarketingTrend {
  id: number;
  category: string;
  trend: string;
  impact: string;
  description: string;
  adoption_rate: number;
  recommendations: string[];
}

const marketingService = {
  getCampaigns: async () => {
    return apiRequest('/marketing/campaigns', 'get', undefined, [
      {
        id: 1,
        name: 'Summer Sale',
        start_date: '2023-06-01',
        end_date: '2023-08-31',
        objective: 'Increase sales by 20%',
        status: 'active'
      },
    ]);
  },

  createCampaign: async (campaignData: any) => {
    return apiRequest('/marketing/campaigns', 'post', campaignData, {
      id: Date.now(),
      ...campaignData,
      status: 'draft'
    });
  },

  getMeetings: async () => {
    return apiRequest('/marketing/meetings', 'get', undefined, [
      {
        id: 1,
        title: 'Client Meeting - Social Land',
        date: '2023-06-25',
        time: '10:00 AM',
        attendees: ['John Smith', 'Jane Doe'],
        objective: 'Discuss website redesign',
        outcome: 'Agreed on proposal'
      },
    ]);
  },

  createMeeting: async (meetingData: any) => {
    return apiRequest('/marketing/meetings', 'post', meetingData, {
      id: Date.now(),
      ...meetingData
    });
  },

  getAnalytics: async (startDate?: string, endDate?: string) => {
    return apiRequest('/marketing/analytics', 'get', { startDate, endDate }, {
      website_traffic: 12000,
      lead_generation: 350,
      conversion_rate: 2.8,
      customer_acquisition_cost: 450,
      roi: 320
    });
  },
  getEmailTemplates: async () => {
    return apiRequest('/marketing/email-templates', 'get', undefined, [
      {
        id: 1,
        name: 'Initial Contact',
        subject: 'Introducing our Digital Marketing Services',
        body: 'Dear {{name}},\n\nI hope this email finds you well...',
        variables: ['name', 'company'],
        created_at: '2023-05-15'
      },
    ]);
  },

  getEmailOutreach: async () => {
    return apiRequest('/marketing/email-outreach', 'get', undefined, [
      {
        id: 1,
        subject: 'Introducing our Digital Marketing Services',
        recipient: 'john.smith@company.com',
        status: 'sent',
        sent_at: '2023-06-10T09:30:00',
        response_rate: 0
      },
    ] as EmailOutreach[]);
  },

  getLeads: async () => {
    return apiRequest('/marketing/leads', 'get', undefined, [
      {
        id: 1,
        name: 'John Smith',
        company: 'ABC Corp',
        email: 'john.smith@abccorp.com',
        phone: '(555) 123-4567',
        source: 'Website Contact Form',
        status: 'contacted',
        created_at: '2023-06-01T14:25:00'
      },
    ] as LeadProfile[]);
  },

  getMarketingPlans: async () => {
    return apiRequest('/marketing/plans', 'get', undefined, [
      {
        id: 1,
        title: 'Q3 Growth Strategy',
        description: 'Comprehensive marketing plan for Q3 2023',
        created_at: '2023-05-30',
        status: 'active',
        goals: [
          { id: 1, description: 'Increase website traffic by 25%', status: 'in_progress' },
          { id: 2, description: 'Generate 50 new leads', status: 'in_progress' },
          { id: 3, description: 'Achieve 15% conversion rate', status: 'not_started' }
        ]
      },
    ]);
  },

  getMarketingPlanById: async (planId: number) => {
    return apiRequest(`/marketing/plans/${planId}`, 'get', undefined, {
      id: planId,
      title: 'Q3 Growth Strategy',
      description: 'Comprehensive marketing plan for Q3 2023',
      created_at: '2023-05-30',
      status: 'active',
      goals: [
        { id: 1, description: 'Increase website traffic by 25%', status: 'in_progress' },
        { id: 2, description: 'Generate 50 new leads', status: 'in_progress' },
        { id: 3, description: 'Achieve 15% conversion rate', status: 'not_started' }
      ],
      strategies: [
        { id: 1, title: 'Content Marketing', description: 'Create and distribute valuable content' },
        { id: 2, title: 'SEO Optimization', description: 'Improve search engine rankings' },
        { id: 3, title: 'Social Media Campaign', description: 'Increase engagement on social platforms' }
      ],
      timeline: [
        { id: 1, activity: 'Content Calendar Creation', start_date: '2023-07-01', end_date: '2023-07-07' },
        { id: 2, activity: 'Website SEO Audit', start_date: '2023-07-10', end_date: '2023-07-14' },
        { id: 3, activity: 'Social Media Campaign Launch', start_date: '2023-07-17', end_date: '2023-08-17' }
      ]
    });
  },

  getMarketingTrends: async () => {
    return apiRequest('/marketing/trends', 'get', undefined, [
      {
        id: 1,
        category: 'Social Media',
        trend: 'Video-First Content',
        impact: 'high',
        description: 'Short-form video content continues to dominate engagement metrics across platforms',
        adoption_rate: 85,
        recommendations: [
          'Develop short-form video strategy for client platforms',
          'Focus on authentic, behind-the-scenes content',
          'Test different formats to identify highest engagement'
        ]
      },
    ]);
  },

  getCompetitorInsights: async () => {
    return apiRequest('/marketing/competitor-insights', 'get', undefined, [
      {
        id: 1,
        competitor_name: 'Digital Innovators',
        strengths: ['Strong social media presence', 'Comprehensive service offerings', 'Established brand'],
        weaknesses: ['Higher pricing', 'Slower delivery times', 'Less personalized service'],
        opportunities: ['Emphasize faster turnaround times', 'Highlight personalized approach', 'Target price-sensitive segments'],
        recent_activities: [
          'Launched new AI-driven analytics service',
          'Expanded to international markets',
          'Redesigned website with focus on case studies'
        ]
      },
    ]);
  },

  analyzeMeetingTranscript: async (transcriptId: number) => {
    return apiRequest(`/marketing/meetings/${transcriptId}/analyze`, 'get', undefined, {
      meeting_id: transcriptId,
      analysis: {
        key_points: [
          'Client interested in website redesign with focus on e-commerce',
          'Budget constraints mentioned - looking for phased approach',
          'Concerned about SEO impact of redesign',
          'Current site has poor mobile experience'
        ],
        client_concerns: [
          'Budget limitations',
          'Timeline concerns',
          'SEO performance',
          'Mobile responsiveness'
        ],
        action_items: [
          'Prepare phased website redesign proposal',
          'Include SEO migration strategy in proposal',
          'Provide mobile-first design examples',
          'Schedule follow-up meeting in 1 week'
        ],
        sentiment: 'positive',
        follow_up_date: '2023-06-28T14:00:00'
      }
    });
  },

  getMarketingMetrics: async () => {
    return apiRequest('/marketing/metrics', 'get', undefined, {
      campaigns: {
        active: 5,
        completed: 12,
        performance: 92
      },
      channels: [
        { name: 'Email', performance: 78, growth: 12 },
        { name: 'Social Media', performance: 85, growth: 18 },
        { name: 'SEO', performance: 65, growth: 8 },
        { name: 'Content', performance: 72, growth: 15 }
      ],
      leads: {
        total: 154,
        new_this_month: 28,
        conversion_rate: 12.5,
        sources: [
          { name: 'Website', value: 45 },
          { name: 'Referral', value: 25 },
          { name: 'Social Media', value: 20 },
          { name: 'Events', value: 10 }
        ]
      },
      roi: {
        overall: 320,
        by_channel: [
          { name: 'Email', value: 380 },
          { name: 'Social Media', value: 290 },
          { name: 'SEO', value: 425 },
          { name: 'Content', value: 185 }
        ]
      }
    });
  },
};

export default marketingService;
