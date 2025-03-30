
import { supabase } from '@/integrations/supabase/client';

// Define interfaces
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

// Mock data generators
const generateMockEmailOutreach = () => {
  return [
    {
      id: 1,
      subject: 'Introduction to Our Services',
      email_body: 'Hello {{name}}, I wanted to reach out about...',
      recipient: 'john@example.com',
      recipient_name: 'John Smith',
      status: 'sent',
      sent_date: '2023-06-15T10:30:00Z',
      opened_date: '2023-06-15T11:45:00Z',
      created_at: '2023-06-14T15:20:00Z',
      created_by: 1
    },
    {
      id: 2,
      subject: 'Follow-up on Our Previous Discussion',
      email_body: 'Hi {{name}}, I'm following up on our conversation...',
      recipient: 'sarah@company.com',
      recipient_name: 'Sarah Johnson',
      status: 'replied',
      sent_date: '2023-06-10T09:15:00Z',
      opened_date: '2023-06-10T09:45:00Z',
      replied_date: '2023-06-10T14:30:00Z',
      created_at: '2023-06-09T16:45:00Z',
      created_by: 1
    },
    {
      id: 3,
      subject: 'Custom Proposal for Your Business',
      email_body: 'Dear {{name}}, Based on our analysis of your business...',
      recipient: 'mike@corporation.com',
      recipient_name: 'Mike Wilson',
      status: 'opened',
      sent_date: '2023-06-18T13:20:00Z',
      opened_date: '2023-06-18T15:10:00Z',
      created_at: '2023-06-17T11:30:00Z',
      created_by: 2
    }
  ] as EmailOutreach[];
};

const generateMockLeads = () => {
  return [
    {
      id: 1,
      name: 'John Smith',
      company: 'Acme Corp',
      position: 'Marketing Director',
      email: 'john@acmecorp.com',
      phone: '555-123-4567',
      source: 'Website Contact Form',
      status: 'qualified',
      interest_level: 'high',
      notes: 'Interested in complete website redesign and SEO services',
      created_at: '2023-05-15T10:30:00Z',
      last_contact: '2023-06-10T14:15:00Z'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Globex Inc',
      position: 'CEO',
      email: 'sarah@globexinc.com',
      phone: '555-987-6543',
      source: 'LinkedIn Outreach',
      status: 'contacted',
      interest_level: 'medium',
      notes: 'Initial call scheduled for next week',
      created_at: '2023-06-01T09:45:00Z',
      last_contact: '2023-06-02T11:30:00Z'
    },
    {
      id: 3,
      name: 'David Williams',
      company: 'Oceanic Airlines',
      position: 'Digital Marketing Manager',
      email: 'david@oceanicair.com',
      phone: '555-456-7890',
      source: 'Referral',
      status: 'converted',
      interest_level: 'high',
      notes: 'Signed contract for 6-month social media management',
      created_at: '2023-04-20T13:15:00Z',
      last_contact: '2023-05-25T10:00:00Z'
    }
  ] as LeadProfile[];
};

const generateMockEmailTemplates = () => {
  return [
    {
      id: 1,
      name: 'Initial Outreach Template',
      subject: 'Introduction to Our Services',
      body: 'Hello {{name}},\n\nI hope this email finds you well. I wanted to reach out to introduce our company, {{company_name}}, and our services that might benefit {{client_company}}.\n\nWe specialize in {{service_area}} and have helped companies like yours achieve {{benefit}}.\n\nWould you be available for a brief 15-minute call this week to discuss how we might be able to help?\n\nBest regards,\n{{sender_name}}\n{{sender_position}}\n{{company_name}}',
      variables: ['name', 'company_name', 'client_company', 'service_area', 'benefit', 'sender_name', 'sender_position'],
      category: 'outreach',
      created_at: '2023-04-15T10:30:00Z',
      created_by: 1,
      usage_count: 45
    },
    {
      id: 2,
      name: 'Follow-up Template',
      subject: 'Following Up on Our Conversation',
      body: 'Hi {{name}},\n\nI wanted to follow up on our conversation about {{topic}} from {{date}}.\n\nAs promised, I've attached {{resource}} that addresses the {{pain_point}} we discussed.\n\nPlease let me know if you have any questions or if you'd like to schedule a follow-up call.\n\nBest regards,\n{{sender_name}}\n{{company_name}}',
      variables: ['name', 'topic', 'date', 'resource', 'pain_point', 'sender_name', 'company_name'],
      category: 'follow-up',
      created_at: '2023-04-20T14:45:00Z',
      created_by: 1,
      usage_count: 32
    },
    {
      id: 3,
      name: 'Proposal Template',
      subject: 'Proposal: {{service}} for {{client_company}}',
      body: 'Dear {{name}},\n\nThank you for the opportunity to present this proposal for {{service}} to {{client_company}}.\n\nBased on our understanding of your needs, we're proposing a {{timeframe}} engagement with a focus on {{goals}}.\n\nOur approach will include:\n- {{approach_point_1}}\n- {{approach_point_2}}\n- {{approach_point_3}}\n\nThe investment for this engagement is {{price}}.\n\nPlease let me know if you have any questions or would like to discuss any aspects of this proposal in more detail.\n\nSincerely,\n{{sender_name}}\n{{sender_position}}\n{{company_name}}',
      variables: ['name', 'service', 'client_company', 'timeframe', 'goals', 'approach_point_1', 'approach_point_2', 'approach_point_3', 'price', 'sender_name', 'sender_position', 'company_name'],
      category: 'proposal',
      created_at: '2023-05-05T09:15:00Z',
      created_by: 2,
      usage_count: 18
    }
  ] as EmailTemplate[];
};

const generateMockMarketingPlans = () => {
  return [
    {
      id: 1,
      title: 'Q3 Digital Marketing Campaign',
      description: 'Comprehensive digital marketing strategy focused on increasing brand awareness and lead generation',
      start_date: '2023-07-01T00:00:00Z',
      end_date: '2023-09-30T23:59:59Z',
      goals: [
        'Increase website traffic by 30%',
        'Generate 100 new qualified leads',
        'Improve social media engagement by 25%',
        'Achieve 15% increase in conversion rate'
      ],
      strategies: [
        'Content marketing: Publish 4 blog posts monthly',
        'Email campaigns: Weekly newsletter and bi-weekly targeted campaigns',
        'Social media: Daily posts across platforms with paid promotion',
        'SEO optimization: Keyword research and on-page optimizations'
      ],
      budget: 25000,
      status: 'active',
      created_at: '2023-06-15T14:30:00Z',
      metrics: [
        { target: 'Website Traffic', current: 15000, goal: 19500 },
        { target: 'New Leads', current: 45, goal: 100 },
        { target: 'Social Engagement', current: 3200, goal: 4000 },
        { target: 'Conversion Rate', current: 2.8, goal: 3.45 }
      ]
    },
    {
      id: 2,
      title: 'Product Launch Campaign',
      description: 'Marketing campaign for the launch of our new service offering',
      start_date: '2023-08-15T00:00:00Z',
      end_date: '2023-10-15T23:59:59Z',
      goals: [
        'Generate 50 demo requests',
        'Achieve 200 product sign-ups',
        'Secure 5 case studies',
        'Reach 100,000 potential customers'
      ],
      strategies: [
        'Launch event: Virtual product demonstration',
        'PR campaign: Press releases and media outreach',
        'Influencer marketing: Partner with 3-5 industry influencers',
        'Paid advertising: Google Ads and social media campaigns'
      ],
      budget: 35000,
      status: 'draft',
      created_at: '2023-06-20T11:15:00Z',
      metrics: [
        { target: 'Demo Requests', current: 0, goal: 50 },
        { target: 'Product Sign-ups', current: 0, goal: 200 },
        { target: 'Case Studies', current: 0, goal: 5 },
        { target: 'Reach', current: 0, goal: 100000 }
      ]
    }
  ] as MarketingPlan[];
};

const generateMockCompetitorInsights = () => {
  return [
    {
      id: 1,
      competitor_name: 'Digital Marketing Masters',
      strengths: [
        'Strong brand recognition in enterprise market',
        'Comprehensive service offerings',
        'Large team with specialized experts',
        'Strong case studies and social proof'
      ],
      weaknesses: [
        'Higher pricing than market average',
        'Slow turnaround times on projects',
        'Less personalized customer service',
        'Rigid contract terms'
      ],
      opportunities: [
        'Position as more agile and responsive alternative',
        'Target mid-market companies they overlook',
        'Highlight personalized service approach',
        'Offer flexible engagement models'
      ],
      threats: [
        'Resources to outspend on marketing',
        'Ability to undercut on price temporarily',
        'Established relationships with key clients',
        'Broader service offerings'
      ],
      created_at: '2023-05-10T09:30:00Z',
      updated_at: '2023-06-15T14:45:00Z'
    },
    {
      id: 2,
      competitor_name: 'CreativeOne Agency',
      strengths: [
        'Award-winning creative work',
        'Strong design-focused portfolio',
        'Popular industry blog with high traffic',
        'Active and engaging social media presence'
      ],
      weaknesses: [
        'Limited technical capabilities',
        'Smaller team size',
        'Focus primarily on B2C clients',
        'Less emphasis on analytics and reporting'
      ],
      opportunities: [
        'Highlight technical expertise and data-driven approach',
        'Target B2B clients they underserve',
        'Build out more comprehensive analytics offerings',
        'Partner on projects requiring technical integration'
      ],
      threats: [
        'Strong industry reputation for creativity',
        'Ability to win design-focused clients',
        'Lower pricing structure',
        'Strong personal relationships with client CMOs'
      ],
      created_at: '2023-04-20T11:15:00Z',
      updated_at: '2023-06-10T16:30:00Z'
    }
  ] as CompetitorInsight[];
};

const generateMockMarketingTrends = () => {
  return [
    {
      id: 1,
      title: 'AI-Powered Content Creation',
      description: 'AI tools for content creation are becoming increasingly sophisticated, enabling marketers to generate and optimize content more efficiently.',
      impact_level: 'high',
      relevance_score: 8.5,
      action_items: [
        'Evaluate top AI content tools for our workflow',
        'Test AI-generated content against human-created content',
        'Develop guidelines for AI-assisted content creation',
        'Train team on effective AI prompt engineering'
      ],
      created_at: '2023-06-01T10:30:00Z',
      source: 'Industry Report'
    },
    {
      id: 2,
      title: 'Video-First Social Media Strategy',
      description: 'Short-form video content continues to dominate social media engagement, with platforms prioritizing video in their algorithms.',
      impact_level: 'high',
      relevance_score: 9.0,
      action_items: [
        'Increase production of short-form video content',
        'Develop platform-specific video strategies',
        'Invest in basic video production equipment',
        'Train team on video creation best practices'
      ],
      created_at: '2023-05-15T14:45:00Z',
      source: 'Social Media Analytics'
    },
    {
      id: 3,
      title: 'Zero-Party Data Collection',
      description: 'With the phasing out of third-party cookies, brands are focusing on collecting zero-party data directly from consumers through interactive experiences.',
      impact_level: 'medium',
      relevance_score: 7.5,
      action_items: [
        'Design interactive content that collects preference data',
        'Update privacy policies and data collection processes',
        'Implement preference centers on website and in emails',
        'Develop value exchanges for data sharing'
      ],
      created_at: '2023-06-10T09:15:00Z',
      source: 'Marketing Technology Blog'
    }
  ] as MarketingTrend[];
};

const marketingService = {
  // Original methods
  getCampaigns: async () => {
    try {
      // Implementation or mock data
      return [];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      // Implementation
      return { id: 1, ...campaignData };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },
  
  getMeetings: async () => {
    try {
      // Implementation or mock data
      return [];
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return [];
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      // Implementation
      return { id: 1, ...meetingData };
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },
  
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // Implementation or mock data
      return {};
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {};
    }
  },
  
  // New methods needed by components
  getEmailOutreach: async () => {
    return generateMockEmailOutreach();
  },
  
  getLeads: async () => {
    return generateMockLeads();
  },
  
  getEmailTemplates: async () => {
    return generateMockEmailTemplates();
  },
  
  getMarketingPlans: async () => {
    return generateMockMarketingPlans();
  },
  
  getMarketingPlanById: async (planId: number) => {
    const plans = generateMockMarketingPlans();
    return plans.find(plan => plan.id === planId) || null;
  },
  
  getCompetitorInsights: async () => {
    return generateMockCompetitorInsights();
  },
  
  getMarketingTrends: async () => {
    return generateMockMarketingTrends();
  },
  
  analyzeMeetingTranscript: async (transcript: string) => {
    // Mock analysis of meeting transcript
    return {
      summary: 'This meeting discussed potential marketing strategies for Q3, focusing on digital campaigns and content marketing.',
      key_points: [
        'Client wants to increase social media presence',
        'Budget concerns were mentioned regarding paid advertising',
        'Content strategy should focus on educational materials',
        'Timeline: Campaign should launch by August 1st'
      ],
      action_items: [
        'Create draft social media calendar by July 15',
        'Research content topics and share with client',
        'Develop campaign budget options at different price points',
        'Schedule follow-up meeting in two weeks'
      ],
      sentiment: 'positive',
      confidence_score: 0.85
    };
  },
  
  getMarketingMetrics: async () => {
    // Generate mock marketing metrics
    const metrics: MarketingMetrics = {
      emailMetrics: {
        sent: 1250,
        opened: 450,
        openRate: 36,
        clicked: 175,
        clickRate: 14,
        converted: 28,
        conversionRate: 2.24
      },
      socialMetrics: {
        followers: 8500,
        engagement: 3.2,
        impressions: 45000,
        clicks: 1200,
        conversionRate: 2.67
      },
      websiteMetrics: {
        visitors: 12500,
        pageViews: 28000,
        averageSessionDuration: 2.3,
        bounceRate: 42,
        conversionRate: 1.8
      },
      leadMetrics: {
        newLeads: 180,
        qualifiedLeads: 85,
        convertedLeads: 32,
        conversionRate: 17.78,
        costPerLead: 45
      }
    };
    return metrics;
  }
};

export default marketingService;
