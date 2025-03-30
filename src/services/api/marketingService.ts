
import { supabase } from '@/integrations/supabase/client';
import type { 
  EmailOutreach, 
  MarketingMeeting, 
  LeadProfile,
  EmailTemplate,
  MarketingPlan,
  MarketingMetrics,
  CompetitorInsight,
  MarketingTrend 
} from '@/interfaces/marketing';

const marketingService = {
  getCampaigns: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      
      // Mock data for development
      return [
        {
          id: 1,
          name: 'Summer Product Launch',
          status: 'active',
          start_date: '2023-06-01',
          end_date: '2023-08-31',
          budget: 5000,
          created_at: '2023-05-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Holiday Season Promotion',
          status: 'planned',
          start_date: '2023-11-01',
          end_date: '2023-12-31',
          budget: 8000,
          created_at: '2023-09-10T09:15:00Z'
        }
      ];
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert(campaignData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },
  
  getMeetings: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      
      // Mock data for development
      return [
        {
          id: 1,
          title: 'Client Onboarding',
          description: 'Initial meeting with new client',
          date: '2023-07-15',
          time: '10:00',
          duration: 60,
          location: 'Zoom',
          attendees: ['John Smith', 'Sarah Lee'],
          notes: 'Prepare slides and demo',
          status: 'scheduled',
          created_at: '2023-07-10T08:30:00Z'
        },
        {
          id: 2,
          title: 'Campaign Review',
          description: 'Quarterly review of marketing campaigns',
          date: '2023-07-20',
          time: '14:00',
          duration: 90,
          location: 'Conference Room A',
          attendees: ['Marketing Team', 'Stakeholders'],
          notes: 'Bring performance reports',
          status: 'scheduled',
          created_at: '2023-07-05T11:45:00Z'
        }
      ];
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .insert(meetingData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },
  
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // This would be implemented with proper date filtering in a real application
      return {
        emailOpen: 68.2,
        clickThrough: 24.5,
        conversion: 5.8,
        socialEngagement: 12.7,
        websiteTraffic: 1542,
        leadGeneration: 87
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  },
  
  // Add methods to support the other components
  getEmailOutreach: async () => {
    try {
      const { data, error } = await supabase
        .from('email_outreach')
        .select('*');
      
      if (error) throw error;
      return data as EmailOutreach[];
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      
      // Mock data for development
      return [
        {
          id: 1,
          subject: 'New Product Announcement',
          email_body: 'We are excited to announce our latest product...',
          recipient: 'client@example.com',
          recipient_name: 'John Client',
          status: 'sent',
          sent_date: '2023-07-10T09:30:00Z',
          opened_date: '2023-07-10T10:15:00Z',
          created_at: '2023-07-09T15:00:00Z',
          created_by: 1
        },
        {
          id: 2,
          subject: 'Follow-up from our meeting',
          email_body: 'Thank you for taking the time to meet with us...',
          recipient: 'prospect@example.com',
          recipient_name: 'Sarah Prospect',
          status: 'draft',
          created_at: '2023-07-11T11:00:00Z',
          created_by: 1
        }
      ] as EmailOutreach[];
    }
  },
  
  getLeads: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_leads')
        .select('*');
      
      if (error) throw error;
      return data as LeadProfile[];
    } catch (error) {
      console.error('Error fetching leads:', error);
      
      // Mock data for development
      return [
        {
          id: 1,
          name: 'John Smith',
          company: 'Acme Corp',
          position: 'Marketing Director',
          email: 'john@acmecorp.com',
          phone: '555-123-4567',
          source: 'Website',
          status: 'qualified',
          interest_level: 'high',
          notes: 'Interested in our enterprise solution',
          created_at: '2023-06-15T10:00:00Z',
          last_contact: '2023-07-05T14:30:00Z'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          company: 'XYZ Inc',
          position: 'CEO',
          email: 'sarah@xyzinc.com',
          source: 'Referral',
          status: 'contacted',
          interest_level: 'medium',
          created_at: '2023-07-01T09:15:00Z',
          last_contact: '2023-07-02T11:00:00Z'
        }
      ] as LeadProfile[];
    }
  },
  
  getEmailTemplates: async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*');
      
      if (error) throw error;
      return data as EmailTemplate[];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      
      // Mock data for development
      return [
        {
          id: 1,
          name: 'Welcome Email',
          subject: 'Welcome to our service!',
          body: 'Dear {{name}},\n\nWelcome to our service! We are excited to have you on board...',
          variables: ['name', 'company'],
          category: 'Onboarding',
          created_at: '2023-05-10T08:00:00Z',
          created_by: 1,
          usage_count: 45
        },
        {
          id: 2,
          name: 'Follow-up Email',
          subject: 'Following up on our conversation',
          body: 'Hi {{name}},\n\nThank you for taking the time to speak with us about {{topic}}...',
          variables: ['name', 'topic', 'next_steps'],
          category: 'Sales',
          created_at: '2023-05-15T09:30:00Z',
          created_by: 1,
          usage_count: 32
        }
      ] as EmailTemplate[];
    }
  },
  
  getMarketingPlans: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_plans')
        .select('*');
      
      if (error) throw error;
      return data as MarketingPlan[];
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      
      // Mock data for development
      return [
        {
          id: 1,
          title: 'Q3 Marketing Strategy',
          description: 'Comprehensive marketing plan for Q3',
          start_date: '2023-07-01',
          end_date: '2023-09-30',
          goals: ['Increase website traffic by 25%', 'Generate 50 new leads'],
          strategies: ['Content marketing', 'Social media campaigns', 'Email newsletters'],
          budget: 15000,
          status: 'active',
          created_at: '2023-06-15T10:00:00Z',
          metrics: [
            { target: 'Website Traffic', current: 12500, goal: 15000 },
            { target: 'New Leads', current: 25, goal: 50 }
          ]
        },
        {
          id: 2,
          title: 'Holiday Season Campaign',
          description: 'Marketing strategy for the holiday season',
          start_date: '2023-11-01',
          end_date: '2023-12-31',
          goals: ['Increase sales by 30%', 'Boost social media engagement'],
          strategies: ['Holiday promotions', 'Gift guides', 'Social media contests'],
          budget: 20000,
          status: 'draft',
          created_at: '2023-07-10T14:30:00Z',
          metrics: [
            { target: 'Sales', current: 0, goal: 50000 },
            { target: 'Social Engagement', current: 0, goal: 10000 }
          ]
        }
      ] as MarketingPlan[];
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      const { data, error } = await supabase
        .from('marketing_plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (error) throw error;
      return data as MarketingPlan;
    } catch (error) {
      console.error(`Error fetching marketing plan ${planId}:`, error);
      
      // For now, return a mock plan
      return {
        id: planId,
        title: 'Sample Marketing Plan',
        description: 'This is a sample marketing plan',
        start_date: '2023-08-01',
        end_date: '2023-10-31',
        goals: ['Increase brand awareness', 'Generate leads'],
        strategies: ['Content marketing', 'Social media'],
        budget: 10000,
        status: 'active',
        created_at: '2023-07-15T10:00:00Z',
        metrics: [
          { target: 'Brand Awareness', current: 65, goal: 80 },
          { target: 'Lead Generation', current: 45, goal: 100 }
        ]
      } as MarketingPlan;
    }
  },
  
  getMarketingMetrics: async () => {
    try {
      // In a real app, we would fetch this from a database
      return {
        emailMetrics: {
          sent: 2500,
          opened: 1250,
          openRate: 50,
          clicked: 625,
          clickRate: 25,
          converted: 125,
          conversionRate: 5
        },
        socialMetrics: {
          followers: 15000,
          engagement: 2250,
          impressions: 45000,
          clicks: 5000,
          conversionRate: 2.5
        },
        websiteMetrics: {
          visitors: 20000,
          pageViews: 60000,
          averageSessionDuration: 3.5,
          bounceRate: 35,
          conversionRate: 3
        },
        leadMetrics: {
          newLeads: 500,
          qualifiedLeads: 250,
          convertedLeads: 100,
          conversionRate: 20,
          costPerLead: 25
        }
      } as MarketingMetrics;
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      throw error;
    }
  },
  
  getMarketingTrends: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_trends')
        .select('*');
      
      if (error) throw error;
      return data as MarketingTrend[];
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      
      // Mock data for development
      return [
        {
          id: 1,
          title: 'Rise of Video Content',
          description: 'Short-form video content is dominating social media platforms',
          impact_level: 'high',
          relevance_score: 8.5,
          action_items: [
            'Develop TikTok strategy',
            'Create short video content for Instagram',
            'Invest in video production tools'
          ],
          created_at: '2023-07-01T10:00:00Z',
          source: 'Industry Research'
        },
        {
          id: 2,
          title: 'AI in Marketing',
          description: 'AI tools are transforming content creation and audience targeting',
          impact_level: 'medium',
          relevance_score: 7.2,
          action_items: [
            'Explore AI content generation tools',
            'Test AI-driven audience segmentation',
            'Monitor competitors\' AI implementations'
          ],
          created_at: '2023-07-05T14:30:00Z',
          source: 'Marketing Conference'
        }
      ] as MarketingTrend[];
    }
  },
  
  getCompetitorInsights: async () => {
    try {
      const { data, error } = await supabase
        .from('competitor_insights')
        .select('*');
      
      if (error) throw error;
      return data as CompetitorInsight[];
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      
      // Mock data for development
      return [
        {
          id: 1,
          competitor_name: 'Acme Corp',
          strengths: [
            'Strong brand recognition',
            'Innovative product features',
            'Large marketing budget'
          ],
          weaknesses: [
            'Poor customer service',
            'Limited international presence',
            'Outdated website design'
          ],
          opportunities: [
            'Expand to new markets',
            'Improve digital presence'
          ],
          threats: [
            'New market entrants',
            'Changing consumer preferences'
          ],
          created_at: '2023-06-15T10:00:00Z',
          updated_at: '2023-07-01T14:30:00Z'
        },
        {
          id: 2,
          competitor_name: 'XYZ Inc',
          strengths: [
            'Excellent customer service',
            'Strong social media presence',
            'Competitive pricing'
          ],
          weaknesses: [
            'Limited product range',
            'Small team size',
            'Less brand recognition'
          ],
          opportunities: [
            'Product diversification',
            'Strategic partnerships'
          ],
          threats: [
            'Price competition',
            'Market saturation'
          ],
          created_at: '2023-06-20T09:15:00Z',
          updated_at: '2023-07-05T11:00:00Z'
        }
      ] as CompetitorInsight[];
    }
  },
  
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      // In a real app, this would use AI services to analyze the transcript
      // For now, return mock analysis data
      return {
        summary: 'The meeting focused on upcoming marketing initiatives and client requirements.',
        action_items: [
          'Create new social media campaign',
          'Follow up with client about website redesign',
          'Schedule next review meeting in 2 weeks'
        ],
        key_topics: [
          'Social Media Strategy',
          'Website Redesign',
          'Content Calendar'
        ],
        sentiment: 'positive',
        client_preferences: {
          style: 'Modern and minimalist',
          colors: 'Blue and gray palette',
          content_tone: 'Professional but approachable'
        }
      };
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  }
};

export default marketingService;
