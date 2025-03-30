
import axios from 'axios';
import { EmailOutreach, CompetitorInsight, MarketingMeeting, EmailTemplate, MarketingMetrics, MarketingPlan, MarketingTrends, MarketingLead } from '@/interfaces/marketing';

// Create mock marketingService
const marketingService = {
  // Original methods
  getCampaigns: async () => {
    try {
      // For now, return mock data
      return getMockCampaigns();
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },

  createCampaign: async (campaignData: any) => {
    try {
      // Mock API call
      return { ...campaignData, id: Date.now(), created_at: new Date().toISOString() };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  getMeetings: async () => {
    try {
      // For now, return mock data
      return getMockMeetings();
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
  },

  createMeeting: async (meetingData: any) => {
    try {
      // Mock API call
      return { ...meetingData, id: Date.now(), created_at: new Date().toISOString() };
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },

  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // For now, return mock data
      return getMockAnalytics(startDate, endDate);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // New methods for EmailTemplates component
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      // For now, return mock data
      return getMockEmailTemplates();
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  },

  getEmailOutreach: async (): Promise<EmailOutreach[]> => {
    try {
      // For now, return mock data
      return getMockEmailOutreach();
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      throw error;
    }
  },

  getLeads: async (): Promise<MarketingLead[]> => {
    try {
      // For now, return mock data
      return getMockLeads();
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  getMarketingPlans: async (): Promise<MarketingPlan[]> => {
    try {
      // For now, return mock data
      return getMockMarketingPlans();
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      throw error;
    }
  },

  getMarketingPlanById: async (planId: number): Promise<MarketingPlan> => {
    try {
      const plans = getMockMarketingPlans();
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Marketing plan not found');
      return plan;
    } catch (error) {
      console.error('Error fetching marketing plan:', error);
      throw error;
    }
  },

  getMarketingTrends: async (): Promise<MarketingTrends> => {
    try {
      // For now, return mock data
      return getMockMarketingTrends();
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      throw error;
    }
  },

  getCompetitorInsights: async (): Promise<CompetitorInsight[]> => {
    try {
      // For now, return mock data
      return getMockCompetitorInsights();
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      throw error;
    }
  },

  analyzeMeetingTranscript: async (transcriptId: number) => {
    try {
      // For now, return mock data
      return getMockMeetingTranscriptAnalysis(transcriptId);
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  },

  getMarketingMetrics: async (): Promise<MarketingMetrics> => {
    try {
      // For now, return mock data
      return getMockMarketingMetrics();
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      throw error;
    }
  }
};

// Mock data functions
const getMockCampaigns = () => {
  return [
    {
      id: 1,
      name: 'Spring Promotion',
      status: 'active',
      type: 'email',
      target_audience: 'existing_customers',
      start_date: '2023-03-01',
      end_date: '2023-04-15',
      budget: 1500,
      performance: {
        impressions: 5000,
        clicks: 350,
        conversions: 25,
        cost_per_conversion: 60
      }
    },
    {
      id: 2,
      name: 'New Product Launch',
      status: 'preparing',
      type: 'social_media',
      target_audience: 'new_prospects',
      start_date: '2023-04-20',
      end_date: '2023-05-20',
      budget: 2500,
      performance: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cost_per_conversion: 0
      }
    }
  ];
};

const getMockMeetings = (): MarketingMeeting[] => {
  return [
    {
      id: 1,
      leadName: 'John Smith',
      leadCompany: 'TechCorp',
      scheduledTime: '2023-04-15T14:00:00Z',
      duration: 45,
      platform: 'zoom',
      status: 'scheduled',
      notes: 'Initial meeting to discuss project requirements'
    },
    {
      id: 2,
      leadName: 'Sarah Johnson',
      leadCompany: 'Innovate Inc',
      scheduledTime: '2023-04-10T16:30:00Z',
      duration: 30,
      platform: 'google_meet',
      status: 'completed',
      notes: 'Follow-up on proposal sent last week',
      followUpDate: '2023-04-17T00:00:00Z'
    }
  ];
};

const getMockAnalytics = (startDate?: string, endDate?: string) => {
  // Mock analytics data - in a real implementation, this would be filtered by date
  return {
    overview: {
      website_visits: 12500,
      bounce_rate: 35,
      avg_session_duration: 180,
      conversion_rate: 2.8
    },
    traffic_sources: [
      { source: 'Organic Search', sessions: 5500, percentage: 44 },
      { source: 'Direct', sessions: 3200, percentage: 25.6 },
      { source: 'Social Media', sessions: 2500, percentage: 20 },
      { source: 'Referral', sessions: 1000, percentage: 8 },
      { source: 'Email', sessions: 300, percentage: 2.4 }
    ],
    conversions: {
      total: 350,
      by_source: [
        { source: 'Organic Search', count: 150, percentage: 42.9 },
        { source: 'Direct', count: 80, percentage: 22.9 },
        { source: 'Social Media', count: 70, percentage: 20 },
        { source: 'Referral', count: 40, percentage: 11.4 },
        { source: 'Email', count: 10, percentage: 2.8 }
      ]
    }
  };
};

const getMockEmailTemplates = (): EmailTemplate[] => {
  return [
    {
      id: 1,
      name: 'Initial Outreach',
      subject: 'Let\'s discuss how we can help [company_name]',
      body: 'Dear [first_name],\n\nI hope this email finds you well. I came across [company_name] and was impressed by your work in [industry].\n\nOur company specializes in [service_description], and I'd love to discuss how we might be able to help [company_name] with [specific_value_proposition].\n\nWould you be available for a quick call next week?\n\nBest regards,\n[sender_name]',
      usage_count: 45,
      conversion_rate: 12.5,
      variables: ['first_name', 'company_name', 'industry', 'service_description', 'specific_value_proposition', 'sender_name'],
      tags: ['outreach', 'introduction'],
      created_at: '2023-02-10T10:00:00Z',
      last_modified: '2023-03-15T14:30:00Z'
    },
    {
      id: 2,
      name: 'Follow-up After Meeting',
      subject: 'Follow-up: Our conversation about [topic]',
      body: 'Hello [first_name],\n\nThank you for taking the time to chat earlier about [topic]. I really enjoyed our conversation and learning more about your needs.\n\nAs promised, I\'ve attached [promised_material] for your review.\n\nIf you have any questions or would like to proceed, please don\'t hesitate to let me know.\n\nLooking forward to our next steps,\n[sender_name]',
      usage_count: 32,
      conversion_rate: 28.6,
      variables: ['first_name', 'topic', 'promised_material', 'sender_name'],
      tags: ['follow-up', 'post-meeting'],
      created_at: '2023-02-15T11:30:00Z',
      last_modified: '2023-03-20T09:45:00Z'
    }
  ];
};

const getMockEmailOutreach = (): EmailOutreach[] => {
  return [
    {
      id: 1,
      recipient: 'John Smith',
      recipientCompany: 'TechCorp',
      subject: 'Introduction to our services',
      status: 'sent',
      sentAt: '2023-04-01T10:00:00Z',
      source: 'linkedin',
      followUpScheduled: false
    },
    {
      id: 2,
      recipient: 'Sarah Johnson',
      recipientCompany: 'Innovate Inc',
      subject: 'Follow-up on our conversation',
      status: 'opened',
      sentAt: '2023-04-03T14:30:00Z',
      source: 'direct_contact',
      followUpScheduled: true
    },
    {
      id: 3,
      recipient: 'Michael Brown',
      recipientCompany: 'Digital Solutions',
      subject: 'Proposal for your review',
      status: 'replied',
      sentAt: '2023-04-05T09:15:00Z',
      source: 'referral',
      followUpScheduled: false
    }
  ];
};

const getMockLeads = (): MarketingLead[] => {
  return [
    {
      id: 1,
      name: 'John Smith',
      company: 'TechCorp',
      position: 'CTO',
      email: 'john@techcorp.com',
      phone: '555-123-4567',
      source: 'linkedin',
      status: 'new',
      assigned_to: 1,
      assigned_to_name: 'Sarah Miller',
      created_at: '2023-04-01T10:00:00Z',
      last_contact: '2023-04-01T10:00:00Z',
      notes: 'Initial contact through LinkedIn, showed interest in our development services',
      score: 85,
      tags: ['tech', 'development', 'high_budget']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      company: 'Innovate Inc',
      position: 'Marketing Director',
      email: 'sarah@innovate.com',
      phone: '555-765-4321',
      source: 'website',
      status: 'qualified',
      assigned_to: 2,
      assigned_to_name: 'Mike Chen',
      created_at: '2023-03-25T14:30:00Z',
      last_contact: '2023-04-05T11:15:00Z',
      notes: 'Downloaded our case study on marketing automation, follow-up call scheduled',
      score: 65,
      tags: ['marketing', 'automation']
    }
  ];
};

const getMockMarketingPlans = (): MarketingPlan[] => {
  return [
    {
      id: 1,
      title: 'Q2 Digital Marketing Strategy',
      description: 'Comprehensive plan to boost online presence and lead generation',
      status: 'active',
      start_date: '2023-04-01',
      end_date: '2023-06-30',
      owner_id: 1,
      owner_name: 'Sarah Miller',
      budget: 15000,
      kpis: [
        { name: 'Website Traffic', target: 30000, current: 12500, unit: 'visitors' },
        { name: 'Lead Generation', target: 500, current: 175, unit: 'leads' },
        { name: 'Conversion Rate', target: 3.5, current: 2.8, unit: 'percent' }
      ],
      channels: [
        { name: 'SEO', budget_allocation: 30, status: 'on_track' },
        { name: 'Content Marketing', budget_allocation: 25, status: 'on_track' },
        { name: 'Paid Social', budget_allocation: 25, status: 'at_risk' },
        { name: 'Email Marketing', budget_allocation: 20, status: 'on_track' }
      ],
      milestones: [
        { name: 'SEO Audit Completion', due_date: '2023-04-15', status: 'completed' },
        { name: 'Content Calendar Finalization', due_date: '2023-04-20', status: 'completed' },
        { name: 'Social Media Campaign Launch', due_date: '2023-05-01', status: 'pending' },
        { name: 'Mid-Quarter Performance Review', due_date: '2023-05-15', status: 'pending' }
      ]
    }
  ];
};

const getMockMarketingTrends = (): MarketingTrends => {
  return {
    industry_trends: [
      {
        id: 1,
        title: 'Rise of Video Content',
        description: 'Short-form video content continues to dominate engagement across platforms',
        impact: 'high',
        source: 'industry_report',
        discovery_date: '2023-03-10',
        tags: ['video', 'content', 'engagement']
      },
      {
        id: 2,
        title: 'AI-Powered Personalization',
        description: 'AI tools enabling deeper content and experience personalization',
        impact: 'medium',
        source: 'market_analysis',
        discovery_date: '2023-03-15',
        tags: ['ai', 'personalization', 'technology']
      }
    ],
    platform_updates: [
      {
        id: 1,
        platform: 'LinkedIn',
        update: 'Algorithm change favoring comment-driving content',
        impact: 'medium',
        effective_date: '2023-03-20',
        recommendations: 'Focus on question-based posts that encourage comments'
      },
      {
        id: 2,
        platform: 'Google',
        update: 'Core Web Vitals becoming more significant in ranking',
        impact: 'high',
        effective_date: '2023-04-01',
        recommendations: 'Audit website performance and address page speed issues'
      }
    ],
    recommended_actions: [
      {
        id: 1,
        title: 'Develop Video Content Strategy',
        description: 'Create short-form videos for product demonstrations and client testimonials',
        priority: 'high',
        resources_needed: 'Video equipment, editing software, staff training',
        estimated_impact: 'Increase engagement by 25-30%'
      },
      {
        id: 2,
        title: 'Implement Website Performance Improvements',
        description: 'Optimize Core Web Vitals to improve search ranking',
        priority: 'medium',
        resources_needed: 'Developer time, performance testing tools',
        estimated_impact: 'Improve organic traffic by 10-15%'
      }
    ]
  };
};

const getMockCompetitorInsights = (): CompetitorInsight[] => {
  return [
    {
      id: 1,
      competitor_name: 'Digital Innovators',
      description: 'Launched new service package combining SEO and content marketing',
      impact: 'medium',
      type: 'service_offering',
      discoveredAt: '2023-03-25T00:00:00Z',
      source: 'website_monitoring',
      suggestedResponse: 'Evaluate our own service bundling options to maintain competitive pricing'
    },
    {
      id: 2,
      competitor_name: 'TechMarket Solutions',
      description: 'Expanded into enterprise market with dedicated account management team',
      impact: 'high',
      type: 'market_expansion',
      discoveredAt: '2023-04-01T00:00:00Z',
      source: 'industry_news',
      suggestedResponse: 'Accelerate enterprise strategy development and consider strategic hiring'
    }
  ];
};

const getMockMeetingTranscriptAnalysis = (transcriptId: number) => {
  return {
    meeting_id: transcriptId,
    participant_analysis: [
      { name: 'John Smith', speaking_time: 450, sentiment: 'positive', key_questions: 2 },
      { name: 'Sarah Johnson', speaking_time: 380, sentiment: 'neutral', key_questions: 1 }
    ],
    key_points: [
      { text: 'Need for improved lead generation process', timestamp: '00:05:23', speaker: 'John Smith' },
      { text: 'Current website not converting well', timestamp: '00:12:45', speaker: 'John Smith' },
      { text: 'Budget constraints for Q2', timestamp: '00:18:30', speaker: 'Sarah Johnson' }
    ],
    action_items: [
      { text: 'Send proposal for website optimization', assigned_to: 'Marketing Team', due_date: '2023-04-20' },
      { text: 'Share case studies on lead generation', assigned_to: 'Sarah Johnson', due_date: '2023-04-15' }
    ],
    sentiment_analysis: {
      overall: 'positive',
      about_our_company: 'positive',
      about_pricing: 'neutral',
      about_timeline: 'concerned'
    },
    opportunity_assessment: {
      probability: 75,
      estimated_value: 12000,
      expected_close_date: '2023-05-15',
      potential_obstacles: ['Budget approval process', 'Competing priorities']
    }
  };
};

const getMockMarketingMetrics = (): MarketingMetrics => {
  return {
    lead_generation: {
      total_leads: 210,
      qualified_leads: 85,
      lead_quality_score: 72,
      cost_per_lead: 35,
      conversion_rate: 2.8,
      trends: [
        { month: 'Jan', leads: 150, qualified: 60 },
        { month: 'Feb', leads: 175, qualified: 70 },
        { month: 'Mar', leads: 210, qualified: 85 }
      ]
    },
    campaign_performance: {
      active_campaigns: 5,
      top_performing: 'Spring Promotion',
      avg_engagement_rate: 3.2,
      avg_conversion_rate: 1.8,
      roi: 320,
      by_channel: [
        { channel: 'Email', engagement: 4.5, conversion: 2.1, roi: 380 },
        { channel: 'Social', engagement: 3.8, conversion: 1.6, roi: 290 },
        { channel: 'Content', engagement: 2.5, conversion: 1.9, roi: 410 },
        { channel: 'PPC', engagement: 2.0, conversion: 1.6, roi: 200 }
      ]
    },
    website_performance: {
      traffic: 25000,
      bounce_rate: 35,
      avg_session_duration: 175,
      top_landing_pages: [
        { page: '/services', visits: 4500, conversion: 3.2 },
        { page: '/case-studies', visits: 3200, conversion: 4.1 },
        { page: '/blog/digital-trends', visits: 2800, conversion: 2.5 }
      ]
    }
  };
};

export default marketingService;
