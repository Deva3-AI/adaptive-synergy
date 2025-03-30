
import { supabase } from '@/integrations/supabase/client';
import apiClient from '@/utils/apiUtils';

export interface EmailOutreach {
  id: number;
  subject: string;
  recipient: string;
  status: 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced';
  sent_at: string;
  response_rate: number;
  template_id?: number;
  campaign_id?: number;
}

export interface MarketingMeeting {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  attendees: string[];
  agenda?: string;
  notes?: string;
  follow_up_tasks?: Array<{
    id: number;
    description: string;
    assigned_to: string;
    due_date: string;
    status: string;
  }>;
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed' | 'lost';
  created_at: string;
  last_contact?: string;
  assigned_to?: string;
  notes?: string;
  tags?: string[];
  engagement_score?: number;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
  category: string;
  tags: string[];
  performance?: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    open_rate: number;
    click_rate: number;
    reply_rate: number;
  };
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  objectives: string[];
  target_audience: string[];
  channels: string[];
  budget: number;
  kpis: Array<{
    name: string;
    target: number;
    current: number;
  }>;
  campaigns: Array<{
    id: number;
    name: string;
    status: string;
    start_date: string;
    end_date: string;
  }>;
  milestones: Array<{
    id: number;
    name: string;
    due_date: string;
    status: string;
  }>;
}

export interface MarketingMetrics {
  email_metrics: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    open_rate: number;
    click_rate: number;
    reply_rate: number;
  };
  website_metrics: {
    visits: number;
    unique_visitors: number;
    page_views: number;
    avg_session_duration: number;
    bounce_rate: number;
    conversion_rate: number;
  };
  social_metrics: {
    followers: number;
    engagement_rate: number;
    impressions: number;
    clicks: number;
  };
  lead_metrics: {
    new_leads: number;
    qualified_leads: number;
    conversion_rate: number;
    cost_per_lead: number;
    avg_lead_value: number;
  };
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  market_share: number;
  pricing_strategy: string;
  unique_selling_points: string[];
  marketing_channels: string[];
  recent_campaigns: Array<{
    name: string;
    description: string;
    date: string;
    observed_impact: string;
  }>;
}

export interface MarketingTrend {
  id: number;
  name: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  relevance_score: number;
  source: string;
  date_identified: string;
  estimated_lifespan: string;
  adoption_stage: 'early' | 'growing' | 'mature' | 'declining';
  action_items: string[];
  related_trends: number[];
}

const marketingService = {
  getCampaigns: async () => {
    try {
      const response = await apiClient.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      
      // Return mock data for now
      return [
        {
          id: 1,
          name: 'Summer Promotion',
          status: 'active',
          start_date: '2023-06-01',
          end_date: '2023-08-31',
          budget: 5000,
          channel: 'Email, Social Media',
          performance: {
            reach: 15000,
            engagement: 2500,
            conversions: 120,
            roi: 2.4
          }
        },
        {
          id: 2,
          name: 'Product Launch',
          status: 'planning',
          start_date: '2023-09-15',
          end_date: '2023-10-15',
          budget: 8000,
          channel: 'Email, Webinar, Paid Ads',
          performance: {
            reach: 0,
            engagement: 0,
            conversions: 0,
            roi: 0
          }
        }
      ];
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const response = await apiClient.post('/marketing/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      
      // Return mock success response
      return {
        id: Math.floor(Math.random() * 100) + 10,
        ...campaignData,
        status: 'draft',
        created_at: new Date().toISOString()
      };
    }
  },
  
  getMeetings: async () => {
    try {
      const response = await apiClient.get('/marketing/meetings');
      return response.data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      
      // Return mock data for now
      return [
        {
          id: 1,
          title: 'Initial Client Discovery',
          date: '2023-07-20',
          time: '10:00 AM',
          duration: 60,
          attendees: ['John Smith', 'Jane Doe', 'Bob Johnson'],
          agenda: 'Discuss client requirements and project scope',
          notes: 'Client expressed interest in our enterprise package',
          follow_up_tasks: [
            {
              id: 1,
              description: 'Send proposal',
              assigned_to: 'Jane Doe',
              due_date: '2023-07-25',
              status: 'pending'
            }
          ]
        },
        {
          id: 2,
          title: 'Marketing Strategy Session',
          date: '2023-07-22',
          time: '2:00 PM',
          duration: 90,
          attendees: ['Marketing Team', 'Sales Team'],
          agenda: 'Plan Q3 marketing initiatives',
          notes: '',
          follow_up_tasks: []
        }
      ];
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const response = await apiClient.post('/marketing/meetings', meetingData);
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      
      // Return mock success response
      return {
        id: Math.floor(Math.random() * 100) + 10,
        ...meetingData,
        created_at: new Date().toISOString()
      };
    }
  },
  
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/marketing/analytics';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      
      // Return mock data for now
      return {
        email_metrics: {
          sent: 5000,
          opened: 1750,
          clicked: 525,
          replies: 175,
          open_rate: 35,
          click_rate: 30,
          reply_rate: 10
        },
        website_metrics: {
          visits: 12500,
          unique_visitors: 8750,
          page_views: 35000,
          avg_session_duration: 2.5,
          bounce_rate: 45,
          conversion_rate: 3.2
        },
        social_metrics: {
          followers: 5500,
          engagement_rate: 2.8,
          impressions: 75000,
          clicks: 2250
        },
        lead_metrics: {
          new_leads: 350,
          qualified_leads: 105,
          conversion_rate: 30,
          cost_per_lead: 25,
          avg_lead_value: 1250
        }
      };
    }
  },

  // Additional methods to support component functionality
  getEmailOutreach: async (): Promise<EmailOutreach[]> => {
    try {
      // In a real app, this would query the database or API
      // For now, return mock data
      return [
        {
          id: 1,
          subject: 'New Service Announcement',
          recipient: 'john@example.com',
          status: 'opened',
          sent_at: '2023-07-15T10:30:00Z',
          response_rate: 0
        },
        {
          id: 2,
          subject: 'Follow-up from Meeting',
          recipient: 'jane@example.com',
          status: 'replied',
          sent_at: '2023-07-16T09:15:00Z',
          response_rate: 100
        },
        {
          id: 3,
          subject: 'Exclusive Offer',
          recipient: 'bob@example.com',
          status: 'sent',
          sent_at: '2023-07-17T14:45:00Z',
          response_rate: 0
        }
      ];
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      return [];
    }
  },

  getLeads: async (): Promise<LeadProfile[]> => {
    try {
      // In a real app, this would query the database or API
      // For now, return mock data
      return [
        {
          id: 1,
          name: 'John Smith',
          company: 'ABC Corp',
          email: 'john@abccorp.com',
          phone: '555-123-4567',
          source: 'Website',
          status: 'contacted',
          created_at: '2023-07-10T00:00:00Z'
        },
        {
          id: 2,
          name: 'Jane Doe',
          company: 'XYZ Ltd',
          email: 'jane@xyzltd.com',
          source: 'Referral',
          status: 'qualified',
          created_at: '2023-07-12T00:00:00Z'
        },
        {
          id: 3,
          name: 'Bob Johnson',
          company: 'Acme Inc',
          email: 'bob@acmeinc.com',
          phone: '555-987-6543',
          source: 'LinkedIn',
          status: 'new',
          created_at: '2023-07-15T00:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      // In a real app, this would query the database or API
      // For now, return mock data
      return [
        {
          id: 1,
          name: 'Initial Outreach',
          subject: 'Introduction to Our Services',
          body: 'Hi [Name],\n\nI hope this email finds you well. I wanted to introduce our services...',
          created_at: '2023-06-01T00:00:00Z',
          updated_at: '2023-06-01T00:00:00Z',
          category: 'Prospecting',
          tags: ['introduction', 'services'],
          performance: {
            sent: 500,
            opened: 200,
            clicked: 75,
            replied: 25,
            open_rate: 40,
            click_rate: 37.5,
            reply_rate: 12.5
          }
        },
        {
          id: 2,
          name: 'Follow-up',
          subject: 'Following Up on Our Conversation',
          body: 'Hi [Name],\n\nI wanted to follow up on our recent conversation about...',
          created_at: '2023-06-15T00:00:00Z',
          updated_at: '2023-06-15T00:00:00Z',
          category: 'Follow-up',
          tags: ['follow-up', 'conversation'],
          performance: {
            sent: 350,
            opened: 175,
            clicked: 60,
            replied: 30,
            open_rate: 50,
            click_rate: 34.3,
            reply_rate: 17.1
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  },

  getMarketingPlans: async (): Promise<MarketingPlan[]> => {
    try {
      // In a real app, this would query the database or API
      // For now, return mock data
      return [
        {
          id: 1,
          title: 'Q3 Growth Strategy',
          description: 'Focused plan to increase lead generation and conversion rates',
          start_date: '2023-07-01',
          end_date: '2023-09-30',
          objectives: ['Increase leads by 25%', 'Improve conversion rate by 10%'],
          target_audience: ['SMBs', 'Tech Industry'],
          channels: ['Email', 'Social Media', 'Content Marketing'],
          budget: 25000,
          kpis: [
            { name: 'New Leads', target: 500, current: 350 },
            { name: 'Conversion Rate', target: 25, current: 18 }
          ],
          campaigns: [
            {
              id: 1,
              name: 'Summer Promotion',
              status: 'active',
              start_date: '2023-07-01',
              end_date: '2023-07-31'
            }
          ],
          milestones: [
            {
              id: 1,
              name: 'Launch new landing pages',
              due_date: '2023-07-15',
              status: 'completed'
            },
            {
              id: 2,
              name: 'Start email campaign',
              due_date: '2023-07-20',
              status: 'pending'
            }
          ]
        },
        {
          id: 2,
          title: 'Product Launch Campaign',
          description: 'Comprehensive marketing plan for new product launch',
          start_date: '2023-08-15',
          end_date: '2023-10-15',
          objectives: ['Generate 1000 leads', 'Achieve 100 sales'],
          target_audience: ['Enterprise', 'Manufacturing'],
          channels: ['Email', 'Webinars', 'Paid Advertising', 'PR'],
          budget: 50000,
          kpis: [
            { name: 'New Leads', target: 1000, current: 0 },
            { name: 'Sales', target: 100, current: 0 }
          ],
          campaigns: [],
          milestones: [
            {
              id: 3,
              name: 'Finalize product messaging',
              due_date: '2023-08-01',
              status: 'pending'
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      return [];
    }
  },

  getMarketingPlanById: async (planId: number): Promise<MarketingPlan | null> => {
    try {
      // In a real app, this would query the database or API for a specific plan
      // For now, simulate fetching a specific plan
      const plans = await marketingService.getMarketingPlans();
      return plans.find(plan => plan.id === planId) || null;
    } catch (error) {
      console.error(`Error fetching marketing plan ${planId}:`, error);
      return null;
    }
  },

  getMarketingTrends: async (): Promise<MarketingTrend[]> => {
    try {
      // In a real app, this would query the database or API
      // For now, return mock data
      return [
        {
          id: 1,
          name: 'AI-Powered Personalization',
          description: 'Using AI to create highly personalized customer experiences across all touchpoints',
          impact_level: 'high',
          relevance_score: 85,
          source: 'Industry Reports',
          date_identified: '2023-06-01',
          estimated_lifespan: '2-3 years',
          adoption_stage: 'growing',
          action_items: [
            'Evaluate AI personalization tools',
            'Start small pilot with email personalization'
          ],
          related_trends: [2]
        },
        {
          id: 2,
          name: 'Video-First Content Strategy',
          description: 'Prioritizing video content across marketing channels to increase engagement',
          impact_level: 'medium',
          relevance_score: 75,
          source: 'Competitor Analysis',
          date_identified: '2023-06-15',
          estimated_lifespan: '1-2 years',
          adoption_stage: 'mature',
          action_items: [
            'Develop video content plan',
            'Test short-form vs long-form videos'
          ],
          related_trends: [3]
        },
        {
          id: 3,
          name: 'Interactive Content Experiences',
          description: 'Creating interactive content that encourages active participation',
          impact_level: 'medium',
          relevance_score: 70,
          source: 'Industry Conference',
          date_identified: '2023-07-01',
          estimated_lifespan: '1-2 years',
          adoption_stage: 'early',
          action_items: [
            'Research interactive content tools',
            'Identify key conversion points for interactive elements'
          ],
          related_trends: [2]
        }
      ];
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      return [];
    }
  },

  getCompetitorInsights: async (): Promise<CompetitorInsight[]> => {
    try {
      // In a real app, this would query the database or API
      // For now, return mock data
      return [
        {
          id: 1,
          competitor_name: 'CompeteX',
          strengths: ['Strong brand recognition', 'Established customer base', 'Robust feature set'],
          weaknesses: ['Higher pricing', 'Slower innovation cycle', 'Complex user interface'],
          opportunities: ['Target their price-sensitive customers', 'Highlight our streamlined UX'],
          threats: ['Large marketing budget', 'Recent product improvements'],
          market_share: 35,
          pricing_strategy: 'Premium pricing with tiered packages',
          unique_selling_points: ['Enterprise-grade security', '24/7 support'],
          marketing_channels: ['Conferences', 'Paid search', 'Industry publications'],
          recent_campaigns: [
            {
              name: 'Enterprise Security Focus',
              description: 'Campaign highlighting security features',
              date: '2023-06-01',
              observed_impact: 'Moderate increase in enterprise leads'
            }
          ]
        },
        {
          id: 2,
          competitor_name: 'InnovateCo',
          strengths: ['Cutting-edge features', 'Strong tech team', 'Lower pricing'],
          weaknesses: ['Limited market presence', 'Narrower feature set', 'Less established support'],
          opportunities: ['Emphasize our comprehensive solution', 'Target their enterprise customers'],
          threats: ['Rapid innovation pace', 'Recent funding round'],
          market_share: 15,
          pricing_strategy: 'Low entry pricing with upsell strategy',
          unique_selling_points: ['Newest technology', 'Simple onboarding'],
          marketing_channels: ['Social media', 'Content marketing', 'Free trials'],
          recent_campaigns: [
            {
              name: 'Free-to-Pro Conversion',
              description: 'Campaign to convert free users to paid plans',
              date: '2023-07-01',
              observed_impact: 'Significant increase in conversions'
            }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      return [];
    }
  },

  getMarketingMetrics: async (): Promise<MarketingMetrics> => {
    try {
      // In a real app, this would query the database or API
      // For now, return mock data
      return {
        email_metrics: {
          sent: 5000,
          opened: 1750,
          clicked: 525,
          replied: 175,
          open_rate: 35,
          click_rate: 30,
          reply_rate: 10
        },
        website_metrics: {
          visits: 12500,
          unique_visitors: 8750,
          page_views: 35000,
          avg_session_duration: 2.5,
          bounce_rate: 45,
          conversion_rate: 3.2
        },
        social_metrics: {
          followers: 5500,
          engagement_rate: 2.8,
          impressions: 75000,
          clicks: 2250
        },
        lead_metrics: {
          new_leads: 350,
          qualified_leads: 105,
          conversion_rate: 30,
          cost_per_lead: 25,
          avg_lead_value: 1250
        }
      };
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      return {
        email_metrics: {
          sent: 0,
          opened: 0,
          clicked: 0,
          replied: 0,
          open_rate: 0,
          click_rate: 0,
          reply_rate: 0
        },
        website_metrics: {
          visits: 0,
          unique_visitors: 0,
          page_views: 0,
          avg_session_duration: 0,
          bounce_rate: 0,
          conversion_rate: 0
        },
        social_metrics: {
          followers: 0,
          engagement_rate: 0,
          impressions: 0,
          clicks: 0
        },
        lead_metrics: {
          new_leads: 0,
          qualified_leads: 0,
          conversion_rate: 0,
          cost_per_lead: 0,
          avg_lead_value: 0
        }
      };
    }
  },

  analyzeMeetingTranscript: async (transcript: string): Promise<any> => {
    try {
      // In a real app, this would send the transcript to an AI service for analysis
      // For now, simulate analysis result
      return {
        key_topics: ['Product features', 'Pricing concerns', 'Implementation timeline'],
        sentiment: 'Positive',
        client_concerns: ['Cost', 'Integration complexity'],
        action_items: [
          'Send detailed pricing breakdown',
          'Schedule technical follow-up',
          'Share case studies addressing integration'
        ],
        follow_up_urgency: 'High',
        sales_opportunity_score: 85
      };
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      return null;
    }
  }
};

export default marketingService;
