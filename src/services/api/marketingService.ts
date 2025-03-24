
// Marketing Service API functions

export const marketingService = {
  // Campaign related functions
  getCampaigns: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          name: 'Summer Promotion',
          type: 'email',
          status: 'active',
          start_date: '2023-06-01',
          end_date: '2023-06-30',
          target_audience: 'small_business',
          budget: 5000,
          metrics: {
            sent: 2500,
            opened: 1200,
            clicked: 500,
            converted: 75
          }
        },
        {
          id: 2,
          name: 'Product Launch',
          type: 'social_media',
          status: 'planned',
          start_date: '2023-07-15',
          end_date: '2023-08-15',
          target_audience: 'enterprise',
          budget: 10000,
          metrics: null
        }
      ];
    } catch (error) {
      console.error('Error getting campaigns:', error);
      throw error;
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        id: 3,
        ...campaignData,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },
  
  // Meeting related functions
  getMeetings: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          leadName: 'John Smith',
          leadCompany: 'ABC Corp',
          scheduledTime: '2023-06-15T10:00:00',
          duration: 60,
          platform: 'zoom',
          status: 'scheduled',
          agenda: 'Discuss service packages and pricing',
          attendees: ['Sales Rep', 'Marketing Manager']
        },
        {
          id: 2,
          leadName: 'Sarah Johnson',
          leadCompany: 'XYZ Inc',
          scheduledTime: '2023-06-10T14:00:00',
          duration: 45,
          platform: 'google_meet',
          status: 'completed',
          agenda: 'Product demo and Q&A',
          attendees: ['Sales Rep', 'Product Specialist']
        }
      ];
    } catch (error) {
      console.error('Error getting meetings:', error);
      throw error;
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        id: 3,
        ...meetingData,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },
  
  // Analytics related functions
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        email: {
          sent: 5000,
          opened: 2500,
          clicked: 1000,
          conversion_rate: 0.05,
          trend: 'increasing'
        },
        social_media: {
          impressions: 50000,
          engagement: 5000,
          clicks: 3000,
          conversion_rate: 0.02,
          trend: 'stable'
        },
        website: {
          visitors: 15000,
          page_views: 45000,
          avg_session: 180, // seconds
          bounce_rate: 0.35,
          trend: 'decreasing'
        }
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  },
  
  // Additional functions to address the missing methods
  getEmailOutreach: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          recipient: 'john.doe@example.com',
          recipientCompany: 'ABC Inc.',
          subject: 'Introduction to Our Services',
          content: 'Hello John, I wanted to introduce our company...',
          status: 'sent',
          sentAt: '2023-06-05T10:30:00',
          source: 'cold_outreach',
          followUpScheduled: false
        },
        {
          id: 2,
          recipient: 'jane.smith@example.com',
          recipientCompany: 'XYZ Corp',
          subject: 'Follow-up on our discussion',
          content: 'Hello Jane, I\'m following up on our conversation...',
          status: 'opened',
          sentAt: '2023-06-03T14:15:00',
          source: 'referral',
          followUpScheduled: true
        }
      ];
    } catch (error) {
      console.error('Error getting email outreach data:', error);
      throw error;
    }
  },
  
  getLeads: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          name: 'John Doe',
          company: 'ABC Inc.',
          position: 'Marketing Director',
          email: 'john.doe@example.com',
          phone: '+1234567890',
          status: 'new',
          source: 'Website',
          score: 85,
          lastContactedAt: '2023-06-01T10:30:00'
        },
        {
          id: 2,
          name: 'Jane Smith',
          company: 'XYZ Corp',
          position: 'CEO',
          email: 'jane.smith@example.com',
          phone: '+0987654321',
          status: 'contacted',
          source: 'Referral',
          score: 92,
          lastContactedAt: '2023-05-28T14:15:00'
        }
      ];
    } catch (error) {
      console.error('Error getting leads:', error);
      throw error;
    }
  },
  
  getEmailTemplates: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          name: 'Initial Outreach',
          subject: 'Introduction to Our Services',
          content: 'Hello {{name}}, I wanted to introduce our company...',
          variables: ['name', 'company'],
          category: 'cold_outreach',
          created_at: '2023-05-10T10:00:00'
        },
        {
          id: 2,
          name: 'Follow-up Template',
          subject: 'Following up on our conversation',
          content: 'Hello {{name}}, I\'m following up on our conversation about {{topic}}...',
          variables: ['name', 'topic', 'meeting_date'],
          category: 'follow_up',
          created_at: '2023-05-15T14:30:00'
        }
      ];
    } catch (error) {
      console.error('Error getting email templates:', error);
      throw error;
    }
  },
  
  getMarketingPlans: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return [
        {
          id: 1,
          title: 'Q3 Growth Strategy',
          description: 'Comprehensive marketing plan for Q3 2023',
          status: 'active',
          start_date: '2023-07-01',
          end_date: '2023-09-30',
          channels: ['email', 'social_media', 'content'],
          owner: 'Marketing Team',
          created_at: '2023-06-10T10:00:00'
        },
        {
          id: 2,
          title: 'Product Launch Campaign',
          description: 'Marketing plan for the launch of Product X',
          status: 'draft',
          start_date: '2023-08-15',
          end_date: '2023-09-15',
          channels: ['email', 'paid_ads', 'webinar'],
          owner: 'Product Marketing',
          created_at: '2023-06-05T14:30:00'
        }
      ];
    } catch (error) {
      console.error('Error getting marketing plans:', error);
      throw error;
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        id: planId,
        title: 'Q3 Growth Strategy',
        description: 'Comprehensive marketing plan for Q3 2023',
        status: 'active',
        start_date: '2023-07-01',
        end_date: '2023-09-30',
        channels: ['email', 'social_media', 'content'],
        owner: 'Marketing Team',
        created_at: '2023-06-10T10:00:00',
        goals: [
          { id: 1, description: 'Increase lead generation by 25%', status: 'in_progress' },
          { id: 2, description: 'Improve email open rates to 35%', status: 'not_started' },
          { id: 3, description: 'Generate 50 qualified sales opportunities', status: 'not_started' }
        ],
        activities: [
          { id: 1, title: 'Refresh email templates', assignee: 'Jane Doe', status: 'completed', due_date: '2023-06-20' },
          { id: 2, title: 'Create content calendar', assignee: 'John Smith', status: 'in_progress', due_date: '2023-06-25' },
          { id: 3, title: 'Set up analytics tracking', assignee: 'Alice Johnson', status: 'not_started', due_date: '2023-06-30' }
        ]
      };
    } catch (error) {
      console.error('Error getting marketing plan:', error);
      throw error;
    }
  },
  
  getMarketingMetrics: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        lead_generation: {
          current_month: 120,
          previous_month: 95,
          growth_rate: 26.3,
          breakdown: {
            website: 45,
            social_media: 25,
            paid_ads: 30,
            referrals: 20
          }
        },
        conversion_rates: {
          lead_to_mql: 0.65,
          mql_to_sql: 0.40,
          sql_to_opportunity: 0.30,
          opportunity_to_closed: 0.25,
          overall: 0.02
        },
        channel_performance: [
          { name: 'Email', roi: 3.5, cost_per_lead: 20, trend: 'stable' },
          { name: 'Social Media', roi: 2.8, cost_per_lead: 25, trend: 'increasing' },
          { name: 'Paid Search', roi: 4.2, cost_per_lead: 35, trend: 'stable' },
          { name: 'Content Marketing', roi: 5.1, cost_per_lead: 15, trend: 'increasing' }
        ]
      };
    } catch (error) {
      console.error('Error getting marketing metrics:', error);
      throw error;
    }
  },
  
  getMarketingTrends: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        industry_trends: [
          { 
            title: 'Increased focus on video content',
            description: 'Short-form video content continues to gain traction across platforms',
            relevance: 'high'
          },
          { 
            title: 'AI in marketing automation',
            description: 'More companies are adopting AI to personalize marketing and improve targeting',
            relevance: 'medium'
          },
          { 
            title: 'Privacy-first marketing',
            description: 'Shift towards privacy-respecting marketing tactics due to regulatory changes',
            relevance: 'high'
          }
        ],
        keyword_trends: [
          { keyword: 'sustainable business', growth_rate: 0.35, volume: 'medium' },
          { keyword: 'remote work solutions', growth_rate: 0.20, volume: 'high' },
          { keyword: 'digital transformation', growth_rate: 0.15, volume: 'high' }
        ],
        platform_trends: [
          { platform: 'LinkedIn', trend: 'increasing', audience_growth: 0.18 },
          { platform: 'TikTok', trend: 'rapidly increasing', audience_growth: 0.45 },
          { platform: 'Facebook', trend: 'stable', audience_growth: 0.05 }
        ]
      };
    } catch (error) {
      console.error('Error getting marketing trends:', error);
      throw error;
    }
  },
  
  getCompetitorInsights: async () => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        competitors: [
          {
            name: 'Competitor A',
            strengths: ['Strong brand recognition', 'Advanced feature set'],
            weaknesses: ['Higher pricing', 'Complex onboarding'],
            market_share: 0.35,
            recent_activities: [
              'Launched new premium tier',
              'Increased focus on enterprise clients'
            ]
          },
          {
            name: 'Competitor B',
            strengths: ['Aggressive pricing', 'Simple user interface'],
            weaknesses: ['Limited feature set', 'Less robust support'],
            market_share: 0.25,
            recent_activities: [
              'Introduced freemium model',
              'Expanded into international markets'
            ]
          }
        ],
        positioning_opportunities: [
          'Focus on ease-of-use and robust support as differentiators',
          'Target mid-market segment underserved by main competitors',
          'Emphasize integration capabilities with existing tools'
        ],
        content_gaps: [
          'In-depth tutorials and implementation guides',
          'Case studies for specific industry verticals',
          'ROI calculators and value demonstration tools'
        ]
      };
    } catch (error) {
      console.error('Error getting competitor insights:', error);
      throw error;
    }
  },
  
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      // Mock API call - in a real app, this would call your backend API
      return {
        summary: 'Client is interested in our services but has concerns about implementation timeline',
        key_points: [
          'Budget range is $10-15k',
          'Looking for implementation within 4 weeks',
          'Requires integration with existing CRM'
        ],
        sentiment: 'neutral',
        action_items: [
          { description: 'Send proposal with detailed timeline', assignee: 'Sales Team', priority: 'high' },
          { description: 'Schedule technical call to discuss CRM integration', assignee: 'Solution Architect', priority: 'medium' }
        ],
        follow_up_date: '2023-06-15'
      };
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  }
};

export default marketingService;
