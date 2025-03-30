
import axios from 'axios';
import { supabase } from '@/lib/supabase';

// Define types for marketing data
export interface EmailOutreach {
  id: number;
  subject: string;
  recipient: string;
  status: "sent" | "opened" | "clicked" | "replied" | "bounced";
  sent_at: string;
  response_rate: number;
  recipientCompany?: string;
  source?: string;
  followUpScheduled?: boolean;
}

export interface MarketingMeeting {
  id: number;
  title: string;
  date: string;
  attendees: string[];
  notes: string;
  follow_up_date?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  leadName: string;
  leadCompany: string;
  scheduledTime: string;
  duration: number;
  platform: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "closed" | "lost";
  created_at: string;
  position?: string;
  score?: number;
  lastContactedAt?: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "draft" | "active" | "completed";
  objectives: string[];
  target_audience: string[];
  channels: string[];
  budget: number;
  metrics: {
    target: string;
    value: number;
    unit: string;
  }[];
  progress?: number;
  content?: string;
}

export interface MarketingMetrics {
  email_open_rate: number;
  email_click_rate: number;
  conversion_rate: number;
  acquisition_cost: number;
  social_engagement: number;
  website_traffic: number;
  trends: {
    period: string;
    value: number;
  }[];
  emailOpenRate?: number;
  emailResponseRate?: number;
  meetingConversionRate?: number;
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  marketing_channels: string[];
  pricing_strategy: string;
  unique_selling_points: string[];
  date_analyzed: string;
}

export interface MarketingTrend {
  id: number;
  name: string;
  description: string;
  relevance_score: number;
  potential_impact: "low" | "medium" | "high";
  adoption_timeline: "immediate" | "short-term" | "long-term";
  insights: string[];
}

const marketingService = {
  getCampaigns: async () => {
    try {
      const { data, error } = await supabase.from('marketing_campaigns').select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      
      // Mock data for fallback
      return [
        {
          id: 1,
          name: 'Summer Promotion',
          status: 'active',
          start_date: '2023-06-01',
          end_date: '2023-08-31',
          budget: 5000,
          channels: ['email', 'social', 'website'],
          performance: {
            reach: 15000,
            engagement: 2200,
            conversions: 180
          }
        },
        {
          id: 2,
          name: 'Product Launch',
          status: 'planning',
          start_date: '2023-09-15',
          end_date: '2023-10-15',
          budget: 10000,
          channels: ['email', 'social', 'paid', 'pr'],
          performance: null
        }
      ];
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const { data, error } = await supabase.from('marketing_campaigns').insert(campaignData).select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },
  
  getMeetings: async () => {
    try {
      const { data, error } = await supabase.from('marketing_meetings').select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      
      // Mock data for fallback
      return [
        {
          id: 1,
          title: 'Acme Corp Introduction',
          date: '2023-08-15T10:00:00',
          attendees: ['John Smith', 'Sarah Johnson'],
          notes: 'Initial meeting to discuss potential services',
          status: 'scheduled',
          leadName: 'John Smith',
          leadCompany: 'Acme Corp',
          scheduledTime: '2023-08-15T10:00:00',
          duration: 60,
          platform: 'zoom'
        },
        {
          id: 2,
          title: 'XYZ Inc Follow-up',
          date: '2023-08-10T14:00:00',
          attendees: ['Michael Brown', 'Jennifer Davis'],
          notes: 'Review proposal and address questions',
          follow_up_date: '2023-08-24T14:00:00',
          status: 'completed',
          leadName: 'Michael Brown',
          leadCompany: 'XYZ Inc',
          scheduledTime: '2023-08-10T14:00:00',
          duration: 45,
          platform: 'google_meet'
        }
      ];
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const { data, error } = await supabase.from('marketing_meetings').insert(meetingData).select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },
  
  getAnalytics: async (startDate?: string, endDate?: string) => {
    // In a real app, we would query analytics data within the date range
    // For now, return mock data
    return {
      overview: {
        totalLeads: 125,
        qualifiedLeads: 85,
        conversions: 32,
        conversionRate: 25.6
      },
      channelPerformance: [
        { channel: 'Email', leads: 45, conversions: 12 },
        { channel: 'Social', leads: 35, conversions: 8 },
        { channel: 'Organic', leads: 25, conversions: 7 },
        { channel: 'Referral', leads: 20, conversions: 5 }
      ],
      trends: [
        { date: '2023-01', leads: 95, conversions: 22 },
        { date: '2023-02', leads: 105, conversions: 24 },
        { date: '2023-03', leads: 115, conversions: 28 },
        { date: '2023-04', leads: 110, conversions: 27 },
        { date: '2023-05', leads: 125, conversions: 32 }
      ]
    };
  },
  
  // Email outreach methods
  getEmailOutreach: async () => {
    try {
      const { data, error } = await supabase.from('email_outreach').select('*');
      
      if (error) throw error;
      
      // Cast to expected type
      return data as EmailOutreach[];
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      
      // Mock data for fallback
      const mockData: EmailOutreach[] = [
        {
          id: 1,
          subject: 'New Service Announcement',
          recipient: 'john@example.com',
          status: 'sent',
          sent_at: '2023-08-01T10:00:00',
          response_rate: 0,
          recipientCompany: 'Example Inc',
          source: 'website_contact',
          followUpScheduled: false
        },
        {
          id: 2,
          subject: 'Follow-up on Our Meeting',
          recipient: 'sarah@company.com',
          status: 'opened',
          sent_at: '2023-08-02T09:30:00',
          response_rate: 0,
          recipientCompany: 'Company LLC',
          source: 'linkedin',
          followUpScheduled: true
        },
        {
          id: 3,
          subject: 'Special Offer for Valued Clients',
          recipient: 'david@client.org',
          status: 'replied',
          sent_at: '2023-08-03T14:15:00',
          response_rate: 100,
          recipientCompany: 'Client Organization',
          source: 'existing_client',
          followUpScheduled: false
        }
      ];
      
      return mockData;
    }
  },
  
  // Leads management methods
  getLeads: async () => {
    try {
      const { data, error } = await supabase.from('marketing_leads').select('*');
      
      if (error) throw error;
      
      // Cast to expected type
      return data as LeadProfile[];
    } catch (error) {
      console.error('Error fetching leads:', error);
      
      // Mock data for fallback
      const mockData: LeadProfile[] = [
        {
          id: 1,
          name: 'John Smith',
          company: 'Acme Corp',
          email: 'john@acme.com',
          phone: '555-123-4567',
          source: 'Referral',
          status: 'qualified',
          created_at: '2023-07-15T10:30:00',
          position: 'Marketing Director',
          score: 85,
          lastContactedAt: '2023-08-02T09:15:00'
        },
        {
          id: 2,
          name: 'Sarah Jones',
          company: 'XYZ Inc',
          email: 'sarah@xyz.com',
          source: 'Website',
          status: 'new',
          created_at: '2023-08-01T14:45:00',
          position: 'CEO',
          score: 65
        },
        {
          id: 3,
          name: 'Michael Brown',
          company: 'Global Solutions',
          email: 'michael@globalsolutions.com',
          phone: '555-987-6543',
          source: 'LinkedIn',
          status: 'contacted',
          created_at: '2023-07-28T09:15:00',
          position: 'Operations Manager',
          score: 72,
          lastContactedAt: '2023-08-01T11:30:00'
        }
      ];
      
      return mockData;
    }
  },
  
  // Email templates methods
  getEmailTemplates: async () => {
    try {
      const { data, error } = await supabase.from('email_templates').select('*');
      
      if (error) throw error;
      return data as EmailTemplate[];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      
      // Mock data for fallback
      const mockData: EmailTemplate[] = [
        {
          id: 1,
          name: 'Initial Contact',
          subject: 'Introduction to Our Services',
          body: 'Dear {{name}},\n\nI hope this email finds you well. I wanted to introduce our company and the services we offer that might be beneficial for {{company}}...',
          category: 'Lead Generation',
          created_at: '2023-06-10T08:30:00',
          updated_at: '2023-07-05T11:45:00'
        },
        {
          id: 2,
          name: 'Follow-up Meeting',
          subject: 'Following Up on Our Conversation',
          body: 'Hi {{name}},\n\nThank you for taking the time to meet with us yesterday. As discussed, here are the next steps we proposed...',
          category: 'Nurturing',
          created_at: '2023-06-15T14:20:00',
          updated_at: '2023-06-15T14:20:00'
        },
        {
          id: 3,
          name: 'Proposal Submission',
          subject: 'Our Proposal for {{company}}',
          body: 'Dear {{name}},\n\nWe're excited to submit our proposal for {{company}}. Based on our discussions, we've tailored our approach to address your specific needs...',
          category: 'Proposal',
          created_at: '2023-07-01T09:45:00',
          updated_at: '2023-07-22T16:30:00'
        }
      ];
      
      return mockData;
    }
  },
  
  // Marketing plans methods
  getMarketingPlans: async () => {
    try {
      const { data, error } = await supabase.from('marketing_plans').select('*');
      
      if (error) throw error;
      return data as MarketingPlan[];
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      
      // Mock data for fallback
      const mockData: MarketingPlan[] = [
        {
          id: 1,
          title: 'Q3 2023 Growth Strategy',
          description: 'Comprehensive plan to increase market share and lead generation for Q3.',
          start_date: '2023-07-01',
          end_date: '2023-09-30',
          status: 'active',
          objectives: [
            'Increase qualified leads by 20%',
            'Improve conversion rate to 15%',
            'Expand social media presence'
          ],
          target_audience: ['Small Businesses', 'Tech Startups', 'E-commerce'],
          channels: ['Email', 'Social Media', 'Content Marketing', 'SEO'],
          budget: 25000,
          metrics: [
            { target: 'New Leads', value: 150, unit: 'count' },
            { target: 'Conversion Rate', value: 15, unit: 'percentage' },
            { target: 'Social Engagement', value: 5000, unit: 'interactions' }
          ],
          progress: 68
        },
        {
          id: 2,
          title: 'Product Launch Campaign',
          description: 'Marketing plan for the upcoming product launch in October.',
          start_date: '2023-09-01',
          end_date: '2023-10-31',
          status: 'draft',
          objectives: [
            'Generate pre-launch excitement',
            'Secure 200 pre-orders',
            'Achieve 50,000 website visits during launch week'
          ],
          target_audience: ['Existing Customers', 'Industry Professionals'],
          channels: ['Email', 'Social Media', 'PR', 'Paid Advertising'],
          budget: 40000,
          metrics: [
            { target: 'Pre-orders', value: 200, unit: 'count' },
            { target: 'Website Traffic', value: 50000, unit: 'visits' },
            { target: 'Media Mentions', value: 10, unit: 'count' }
          ],
          progress: 25
        }
      ];
      
      return mockData;
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
      console.error(`Error fetching marketing plan with ID ${planId}:`, error);
      
      // Mock detailed plan data
      const plans = await marketingService.getMarketingPlans();
      return plans.find(plan => plan.id === planId);
    }
  },
  
  // Marketing trends methods
  getMarketingTrends: async () => {
    try {
      const { data, error } = await supabase.from('marketing_trends').select('*');
      
      if (error) throw error;
      return data as MarketingTrend[];
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      
      // Mock data for fallback
      const mockData: MarketingTrend[] = [
        {
          id: 1,
          name: 'AI-Powered Personalization',
          description: 'Using artificial intelligence to create highly personalized marketing content and customer experiences.',
          relevance_score: 9.2,
          potential_impact: 'high',
          adoption_timeline: 'short-term',
          insights: [
            'Can increase conversion rates by up to 25%',
            'Early adopters are seeing 15-20% improvements in engagement',
            'Requires integration with existing CRM and data systems'
          ]
        },
        {
          id: 2,
          name: 'Interactive Content Marketing',
          description: 'Shifting from static content to interactive experiences like quizzes, assessments, and calculators.',
          relevance_score: 8.5,
          potential_impact: 'medium',
          adoption_timeline: 'immediate',
          insights: [
            'Increases average time on page by 52%',
            'Generates 2x more conversions than passive content',
            'Provides valuable first-party data about audience preferences'
          ]
        },
        {
          id: 3,
          name: 'Voice Search Optimization',
          description: 'Adapting SEO and content strategies for the growing use of voice search and voice assistants.',
          relevance_score: 7.8,
          potential_impact: 'medium',
          adoption_timeline: 'short-term',
          insights: [
            'Voice searches projected to account for 50% of all searches by 2024',
            'Requires focus on conversational keywords and natural language',
            'Local businesses see highest impact from voice search optimization'
          ]
        }
      ];
      
      return mockData;
    }
  },
  
  // Competitor insights methods
  getCompetitorInsights: async () => {
    try {
      const { data, error } = await supabase.from('competitor_insights').select('*');
      
      if (error) throw error;
      return data as CompetitorInsight[];
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      
      // Mock data for fallback
      const mockData: CompetitorInsight[] = [
        {
          id: 1,
          competitor_name: 'Acme Digital',
          strengths: [
            'Strong brand recognition',
            'Large existing client base',
            'Comprehensive service offering'
          ],
          weaknesses: [
            'Higher pricing structure',
            'Slower delivery times',
            'Less personalized service'
          ],
          marketing_channels: ['SEO', 'PPC', 'Industry Events', 'Referral Programs'],
          pricing_strategy: 'Premium pricing with tiered service levels',
          unique_selling_points: [
            'Industry-leading analytics dashboard',
            '24/7 customer support',
            'Performance guarantees'
          ],
          date_analyzed: '2023-07-15'
        },
        {
          id: 2,
          competitor_name: 'WebWizards',
          strengths: [
            'Innovative design approach',
            'Strong social media presence',
            'Growing rapidly in the market'
          ],
          weaknesses: [
            'Limited service offerings',
            'Less established reputation',
            'Smaller team with capacity constraints'
          ],
          marketing_channels: ['Social Media', 'Content Marketing', 'Influencer Partnerships'],
          pricing_strategy: 'Value-based pricing with transparent project quotes',
          unique_selling_points: [
            'Award-winning design team',
            'Rapid deployment methodology',
            'Unlimited revisions policy'
          ],
          date_analyzed: '2023-08-01'
        }
      ];
      
      return mockData;
    }
  },
  
  // Meeting analysis methods
  analyzeMeetingTranscript: async (transcriptData: string) => {
    try {
      // In a real implementation, you would send the transcript to an API endpoint or process it directly
      
      // Mock meeting analysis results
      return {
        summary: 'Client is interested in expanding their digital marketing efforts with a focus on lead generation and conversion optimization.',
        keyPoints: [
          'Current website has low conversion rate (1.2%)',
          'Looking to increase online lead generation by 30%',
          'Budget constraints of $5,000 per month',
          'Decision needed by end of quarter'
        ],
        clientConcerns: [
          'Previous agency didn't provide clear reporting',
          'Uncertain about which channels provide best ROI',
          'Worried about timeline for implementation'
        ],
        nextSteps: [
          'Prepare detailed proposal by August 20',
          'Include case studies from similar clients',
          'Schedule follow-up call with technical team',
          'Send pricing comparison for different service tiers'
        ],
        sentiment: {
          overall: 'positive',
          aboutPrice: 'neutral',
          aboutTimeline: 'concerned',
          aboutResults: 'optimistic'
        }
      };
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  },
  
  // Marketing metrics methods
  getMarketingMetrics: async (timeframe?: 'week' | 'month' | 'quarter' | 'year') => {
    try {
      // In a real app, we would query metrics based on the timeframe
      // For now, return mock data
      
      // Mock marketing metrics
      return {
        email_open_rate: 32.5,
        email_click_rate: 4.8,
        conversion_rate: 2.3,
        acquisition_cost: 75.20,
        social_engagement: 8750,
        website_traffic: 24680,
        trends: [
          { period: 'Jan', value: 18500 },
          { period: 'Feb', value: 19200 },
          { period: 'Mar', value: 21500 },
          { period: 'Apr', value: 20800 },
          { period: 'May', value: 22300 },
          { period: 'Jun', value: 24680 }
        ],
        emailOpenRate: 32.5,
        emailResponseRate: 8.7,
        meetingConversionRate: 35.2
      };
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      
      // Basic fallback data
      return {
        email_open_rate: 0,
        email_click_rate: 0,
        conversion_rate: 0,
        acquisition_cost: 0,
        social_engagement: 0,
        website_traffic: 0,
        trends: [],
        emailOpenRate: 0,
        emailResponseRate: 0,
        meetingConversionRate: 0
      };
    }
  }
};

export default marketingService;
