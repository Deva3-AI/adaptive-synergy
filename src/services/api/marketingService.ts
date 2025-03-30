
import { supabase } from '@/integrations/supabase/client';

export interface EmailOutreach {
  id: number;
  subject: string;
  email_body: string;
  recipient: string;
  status: 'sent' | 'draft' | 'scheduled';
  sent_at?: string | Date;
  created_at: string | Date;
  response?: string;
}

export interface MarketingMeeting {
  id: number;
  title: string;
  date: string | Date;
  attendees: string[];
  notes?: string;
  status: 'scheduled' | 'completed' | 'canceled';
  follow_up_tasks?: string[];
  recording_url?: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  notes?: string;
  created_at: string | Date;
  last_contacted?: string | Date;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  created_at: string | Date;
  updated_at: string | Date;
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  start_date: string | Date;
  end_date: string | Date;
  goals: string[];
  strategies: string[];
  status: 'draft' | 'active' | 'completed';
  budget?: number;
  roi?: number;
  created_at: string | Date;
}

export interface MarketingMetrics {
  email_open_rate: number;
  email_click_rate: number;
  meeting_conversion_rate: number;
  leads_generated: number;
  qualified_leads: number;
  average_deal_size: number;
  sales_cycle_length: number;
  customer_acquisition_cost: number;
  roi: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  market_share?: number;
  pricing_strategy?: string;
  marketing_channels: string[];
  unique_selling_points: string[];
  created_at: string | Date;
  updated_at: string | Date;
}

export interface MarketingTrend {
  id: number;
  name: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  relevance_score: number;
  source: string;
  discovered_at: string | Date;
  action_items?: string[];
}

const marketingService = {
  // Campaign management
  getCampaigns: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      
      // Return mock data for fallback
      return [
        {
          id: 1,
          name: 'Summer Email Campaign',
          description: 'Promotional campaign for summer products',
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          budget: 5000,
          metrics: {
            impressions: 25000,
            clicks: 1200,
            conversions: 85
          }
        },
        {
          id: 2,
          name: 'Social Media Contest',
          description: 'User-generated content contest on Instagram',
          start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          budget: 2500,
          metrics: {
            impressions: 18000,
            clicks: 950,
            conversions: 45
          }
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

  // Meetings management
  getMeetings: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      
      // Return mock data for fallback
      return [
        {
          id: 1,
          title: 'Initial Client Consultation',
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          attendees: ['John Smith', 'Sarah Johnson', 'Michael Brown'],
          status: 'scheduled',
          notes: 'Discuss marketing strategy and goals',
          follow_up_tasks: ['Send proposal', 'Share case studies']
        },
        {
          id: 2,
          title: 'Campaign Review',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          attendees: ['Sarah Johnson', 'Michael Brown', 'Emily Davis'],
          status: 'completed',
          notes: 'Reviewed campaign performance, client satisfied with results',
          follow_up_tasks: ['Update reporting dashboard', 'Schedule next review']
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

  // Email outreach
  getEmailOutreach: async () => {
    try {
      const { data, error } = await supabase
        .from('email_outreach')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EmailOutreach[];
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      
      // Return mock data for fallback
      return [
        {
          id: 1,
          subject: 'Introduction to Our Services',
          email_body: 'Hello, We wanted to introduce our marketing services...',
          recipient: 'john@example.com',
          status: 'sent',
          sent_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          response: 'Interested, please send more information'
        },
        {
          id: 2,
          subject: 'Follow-up on Our Proposal',
          email_body: 'Hello, I wanted to follow up on the proposal we sent...',
          recipient: 'sarah@example.com',
          status: 'sent',
          sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          subject: 'Upcoming Marketing Webinar',
          email_body: 'We are hosting a webinar on digital marketing trends...',
          recipient: 'marketing-list@example.com',
          status: 'scheduled',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  },
  
  // Leads management
  getLeads: async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LeadProfile[];
    } catch (error) {
      console.error('Error fetching leads:', error);
      
      // Return mock data for fallback
      return [
        {
          id: 1,
          name: 'John Smith',
          company: 'Acme Corp',
          position: 'Marketing Director',
          email: 'john@acmecorp.com',
          phone: '555-123-4567',
          source: 'Website Contact Form',
          status: 'contacted',
          notes: 'Interested in social media services',
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          company: 'Johnson & Co',
          position: 'CEO',
          email: 'sarah@johnsonco.com',
          source: 'Referral',
          status: 'qualified',
          notes: 'Looking for complete marketing overhaul',
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          last_contacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          name: 'Michael Brown',
          company: 'Brown Industries',
          position: 'Sales Manager',
          email: 'michael@brownindustries.com',
          phone: '555-987-6543',
          source: 'LinkedIn',
          status: 'new',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  },
  
  // Email templates
  getEmailTemplates: async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EmailTemplate[];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      
      // Return mock data for fallback
      return [
        {
          id: 1,
          name: 'Initial Outreach',
          subject: 'Introduction to Our Services',
          body: 'Hello {{name}},\n\nWe are reaching out because we noticed {{company}} might benefit from our {{service}} services...',
          variables: ['name', 'company', 'service'],
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          name: 'Follow-up',
          subject: 'Following Up on Our Discussion',
          body: 'Hello {{name}},\n\nI wanted to follow up on our conversation about {{topic}}...',
          variables: ['name', 'topic', 'meeting_date'],
          created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  },
  
  // Marketing analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // In a real app, this would query analytics data from the database
      // For this example, we'll return mock data
      return {
        email_metrics: {
          send_count: 1250,
          open_rate: 32.5,
          click_rate: 12.8,
          bounce_rate: 2.3
        },
        lead_metrics: {
          new_leads: 45,
          qualified_leads: 18,
          conversion_rate: 8.2
        },
        campaign_performance: [
          {
            name: 'Summer Promotion',
            impressions: 25000,
            clicks: 1200,
            conversions: 85
          },
          {
            name: 'Product Launch',
            impressions: 35000,
            clicks: 2100,
            conversions: 130
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
  
  // Marketing plans
  getMarketingPlans: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MarketingPlan[];
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      
      // Return mock data for fallback
      return [
        {
          id: 1,
          title: 'Q3 Marketing Strategy',
          description: 'Comprehensive marketing plan for Q3 focusing on digital channels',
          start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
          goals: ['Increase website traffic by 25%', 'Generate 150 new leads', 'Convert 30 new customers'],
          strategies: ['Content marketing', 'Social media campaigns', 'Email outreach', 'PPC advertising'],
          status: 'active',
          budget: 15000,
          roi: 2.8,
          created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          title: 'Product Launch Plan',
          description: 'Marketing strategy for new product launch',
          start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          goals: ['Achieve 5000 product views', 'Sell 500 units in first month', 'Establish product as market leader'],
          strategies: ['Influencer marketing', 'Press releases', 'Product demos', 'Early adopter discounts'],
          status: 'draft',
          budget: 25000,
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
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
      return null;
    }
  },
  
  // Marketing metrics
  getMarketingMetrics: async () => {
    // In a real app, this would calculate metrics from actual data
    // For this example, we'll return mock data
    return {
      email_open_rate: 32.5,
      email_click_rate: 12.8,
      meeting_conversion_rate: 28.3,
      leads_generated: 145,
      qualified_leads: 68,
      average_deal_size: 7500,
      sales_cycle_length: 45,
      customer_acquisition_cost: 250,
      roi: 3.2,
      date_range: {
        start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString()
      }
    } as MarketingMetrics;
  },
  
  // Competitor analysis
  getCompetitorInsights: async () => {
    try {
      const { data, error } = await supabase
        .from('competitor_insights')
        .select('*');
      
      if (error) throw error;
      return data as CompetitorInsight[];
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      
      // Return mock data for fallback
      return [
        {
          id: 1,
          competitor_name: 'Acme Marketing',
          strengths: ['Strong social media presence', 'High-quality content', 'Celebrity endorsements'],
          weaknesses: ['High pricing', 'Poor customer service', 'Limited service offerings'],
          market_share: 18.5,
          pricing_strategy: 'Premium pricing',
          marketing_channels: ['Social media', 'Influencer marketing', 'TV advertisements'],
          unique_selling_points: ['24/7 customer support', 'AI-powered analytics'],
          created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          competitor_name: 'MarketPro Solutions',
          strengths: ['Affordable pricing', 'Wide range of services', 'Strong client testimonials'],
          weaknesses: ['Outdated website', 'Slow response times', 'Limited international presence'],
          market_share: 12.3,
          pricing_strategy: 'Value-based pricing',
          marketing_channels: ['Email marketing', 'Content marketing', 'Industry conferences'],
          unique_selling_points: ['Industry specialization', 'Performance guarantees'],
          created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  },
  
  // Marketing trends
  getMarketingTrends: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_trends')
        .select('*')
        .order('relevance_score', { ascending: false });
      
      if (error) throw error;
      return data as MarketingTrend[];
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      
      // Return mock data for fallback
      return [
        {
          id: 1,
          name: 'AI-Powered Personalization',
          description: 'Using artificial intelligence to deliver highly personalized marketing content',
          impact_level: 'high',
          relevance_score: 9.2,
          source: 'Industry Report',
          discovered_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          action_items: ['Research AI tools', 'Develop personalized email strategy', 'Test on sample audience']
        },
        {
          id: 2,
          name: 'Video Marketing Growth',
          description: 'Increasing importance of short-form video content across platforms',
          impact_level: 'high',
          relevance_score: 8.7,
          source: 'Market Analysis',
          discovered_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          action_items: ['Develop video content calendar', 'Train team on video production', 'Allocate budget for equipment']
        },
        {
          id: 3,
          name: 'Privacy-First Marketing',
          description: 'Shift towards marketing strategies that prioritize user privacy',
          impact_level: 'medium',
          relevance_score: 7.5,
          source: 'Industry Conference',
          discovered_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          action_items: ['Audit current data practices', 'Update privacy policies', 'Develop first-party data strategy']
        }
      ];
    }
  },
  
  // Meeting transcript analysis
  analyzeMeetingTranscript: async (transcript: string) => {
    // In a real app, this would use AI to analyze the transcript
    // For this example, we'll return mock data
    return {
      key_points: [
        'Client interested in social media marketing',
        'Budget concerns mentioned multiple times',
        'Competitor analysis requested',
        'Timeline: looking to launch in 6-8 weeks'
      ],
      action_items: [
        'Send social media proposal by Friday',
        'Provide competitive analysis report',
        'Schedule follow-up call next week',
        'Share case studies of similar projects'
      ],
      sentiment_analysis: {
        overall: 'positive',
        concerns: ['budget constraints', 'timeline pressure'],
        interests: ['social media strategy', 'content creation']
      }
    };
  }
};

export default marketingService;
