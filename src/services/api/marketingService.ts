
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

export interface EmailOutreach {
  id: number;
  subject: string;
  recipient: string;
  status: 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced';
  sent_at: string;
  response_rate?: number;
}

export interface MarketingMeeting {
  id: number;
  client_name: string;
  scheduled_at: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  transcript?: string;
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
  target_audience: string;
  goals: string[];
  strategies: string[];
  channels: string[];
  timeline: {
    start_date: string;
    end_date: string;
    milestones: { date: string; description: string }[];
  };
  budget: number;
  created_at: string;
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
  lead_metrics: {
    new_leads: number;
    qualified_leads: number;
    conversion_rate: number;
    cost_per_lead: number;
    sources: { source: string; count: number }[];
  };
  social_metrics: {
    followers: number;
    engagement: number;
    reach: number;
    clicks: number;
    platform_breakdown: { platform: string; followers: number; engagement: number }[];
  };
}

export interface CompetitorInsight {
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  market_share: number;
  recent_campaigns: { name: string; description: string; date: string }[];
}

export interface MarketingTrend {
  trend_name: string;
  description: string;
  relevance_score: number;
  potential_impact: 'low' | 'medium' | 'high';
  adoption_timeline: string;
  recommendations: string[];
}

// Sample data for marketing
const sampleCampaigns = [
  {
    id: 1,
    name: "Summer Promotion",
    type: "Email",
    status: "Active",
    start_date: "2023-06-01",
    end_date: "2023-08-31",
    metrics: {
      sent: 1250,
      opened: 432,
      clicked: 175,
      converted: 28
    }
  },
  {
    id: 2,
    name: "Product Launch",
    type: "Multi-channel",
    status: "Planning",
    start_date: "2023-10-15",
    end_date: "2023-12-15",
    metrics: null
  }
];

const sampleMeetings = [
  {
    id: 1,
    client_name: "Potential Client X",
    scheduled_at: "2023-09-20T14:00:00",
    status: "scheduled",
    notes: "Discuss potential partnership opportunities"
  },
  {
    id: 2,
    client_name: "Social Land",
    scheduled_at: "2023-09-18T10:30:00",
    status: "completed",
    notes: "Reviewed campaign results, very positive feedback",
    transcript: "Marketing Manager: We've seen a 25% increase in engagement since implementing your suggestions..."
  }
];

const sampleEmailOutreach = [
  {
    id: 1,
    subject: "Introduction to Our Services",
    recipient: "john@example.com",
    status: "opened",
    sent_at: "2023-09-12T09:15:00",
    response_rate: 0
  },
  {
    id: 2,
    subject: "Follow-up on Our Conversation",
    recipient: "jane@company.com",
    status: "replied",
    sent_at: "2023-09-14T11:30:00",
    response_rate: 100
  }
];

const sampleLeads = [
  {
    id: 1,
    name: "John Smith",
    company: "ABC Corporation",
    email: "john.smith@abccorp.com",
    phone: "+1 555-123-4567",
    source: "Website",
    status: "contacted",
    created_at: "2023-09-10T14:25:00"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "XYZ LLC",
    email: "sarah.j@xyzllc.com",
    source: "Referral",
    status: "qualified",
    created_at: "2023-09-08T09:12:00"
  }
];

const sampleEmailTemplates = [
  {
    id: 1,
    name: "Initial Outreach",
    subject: "Introduction to Our Services - {{company_name}}",
    body: "Dear {{first_name}},\n\nI hope this email finds you well. I wanted to introduce our services that might be of interest to {{company_name}}...",
    variables: ["first_name", "company_name"],
    created_at: "2023-08-15T10:00:00"
  },
  {
    id: 2,
    name: "Follow-up Template",
    subject: "Following up on our conversation - {{company_name}}",
    body: "Hi {{first_name}},\n\nI'm following up on our conversation about {{topic}}. I wanted to provide some additional information...",
    variables: ["first_name", "company_name", "topic"],
    created_at: "2023-08-20T11:30:00"
  }
];

const marketingService = {
  // Get all marketing campaigns
  getCampaigns: async () => {
    try {
      // This would query the campaigns table in a real app
      return sampleCampaigns;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return sampleCampaigns;
    }
  },
  
  // Create a new marketing campaign
  createCampaign: async (campaignData: any) => {
    try {
      // This would insert into the campaigns table in a real app
      return { ...campaignData, id: Date.now() };
    } catch (error) {
      console.error('Error creating campaign:', error);
      return { ...campaignData, id: Date.now() };
    }
  },
  
  // Get all marketing meetings
  getMeetings: async () => {
    try {
      // This would query the marketing_meetings table in a real app
      return sampleMeetings;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return sampleMeetings;
    }
  },
  
  // Create a new marketing meeting
  createMeeting: async (meetingData: any) => {
    try {
      // This would insert into the marketing_meetings table in a real app
      return { ...meetingData, id: Date.now() };
    } catch (error) {
      console.error('Error creating meeting:', error);
      return { ...meetingData, id: Date.now() };
    }
  },
  
  // Get marketing analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // This would aggregate data from multiple tables in a real app
      return {
        email_campaigns: {
          total_sent: 15000,
          total_opened: 4500,
          total_clicked: 1800,
          average_open_rate: 30,
          average_click_rate: 12
        },
        leads: {
          total_generated: 350,
          qualified: 120,
          conversion_rate: 34.3
        },
        meetings: {
          total: 45,
          completed: 38,
          resulted_in_sale: 22
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {};
    }
  },
  
  // Get email outreach data
  getEmailOutreach: async (): Promise<EmailOutreach[]> => {
    try {
      // This would query the email_outreach table in a real app
      return sampleEmailOutreach;
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      return sampleEmailOutreach;
    }
  },
  
  // Get leads data
  getLeads: async (): Promise<LeadProfile[]> => {
    try {
      // This would query the leads table in a real app
      return sampleLeads;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return sampleLeads;
    }
  },
  
  // Get email templates
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      // This would query the email_templates table in a real app
      return sampleEmailTemplates;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return sampleEmailTemplates;
    }
  },
  
  // Get marketing plans
  getMarketingPlans: async (): Promise<MarketingPlan[]> => {
    try {
      // This would query the marketing_plans table in a real app
      return [
        {
          id: 1,
          title: "Q4 Marketing Strategy",
          description: "Comprehensive plan for Q4 marketing initiatives",
          target_audience: "Small to medium-sized businesses in the tech sector",
          goals: ["Increase leads by 25%", "Boost website traffic by 30%", "Grow social media engagement by 40%"],
          strategies: ["Content marketing", "Email campaigns", "Social media advertising"],
          channels: ["Email", "LinkedIn", "Twitter", "Industry blogs"],
          timeline: {
            start_date: "2023-10-01",
            end_date: "2023-12-31",
            milestones: [
              { date: "2023-10-15", description: "Launch new content series" },
              { date: "2023-11-01", description: "Begin social media campaign" },
              { date: "2023-12-01", description: "Start year-end promotion" }
            ]
          },
          budget: 25000,
          created_at: "2023-09-15T10:00:00"
        }
      ];
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      return [];
    }
  },
  
  // Get specific marketing plan by ID
  getMarketingPlanById: async (planId: number): Promise<MarketingPlan | null> => {
    try {
      // This would query the marketing_plans table by ID in a real app
      const plans = await marketingService.getMarketingPlans();
      return plans.find(plan => plan.id === planId) || null;
    } catch (error) {
      console.error(`Error fetching marketing plan with ID ${planId}:`, error);
      return null;
    }
  },
  
  // Get marketing metrics
  getMarketingMetrics: async (): Promise<MarketingMetrics> => {
    try {
      // This would aggregate data from multiple tables in a real app
      return {
        email_metrics: {
          sent: 15000,
          opened: 4500,
          clicked: 1800,
          replied: 750,
          open_rate: 30,
          click_rate: 12,
          reply_rate: 5
        },
        lead_metrics: {
          new_leads: 350,
          qualified_leads: 120,
          conversion_rate: 34.3,
          cost_per_lead: 45.75,
          sources: [
            { source: "Website", count: 180 },
            { source: "Referral", count: 85 },
            { source: "Social Media", count: 65 },
            { source: "Email", count: 20 }
          ]
        },
        social_metrics: {
          followers: 12500,
          engagement: 3.8,
          reach: 45000,
          clicks: 1200,
          platform_breakdown: [
            { platform: "LinkedIn", followers: 5500, engagement: 4.2 },
            { platform: "Twitter", followers: 4200, engagement: 3.5 },
            { platform: "Instagram", followers: 2800, engagement: 3.8 }
          ]
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
        lead_metrics: {
          new_leads: 0,
          qualified_leads: 0,
          conversion_rate: 0,
          cost_per_lead: 0,
          sources: []
        },
        social_metrics: {
          followers: 0,
          engagement: 0,
          reach: 0,
          clicks: 0,
          platform_breakdown: []
        }
      };
    }
  },
  
  // Get marketing trends
  getMarketingTrends: async (): Promise<MarketingTrend[]> => {
    try {
      // This would query the marketing_trends table in a real app
      return [
        {
          trend_name: "AI-Driven Content Creation",
          description: "Using artificial intelligence to generate and optimize marketing content",
          relevance_score: 85,
          potential_impact: "high",
          adoption_timeline: "Next 6-12 months",
          recommendations: [
            "Experiment with AI tools for content ideation",
            "Test AI-generated copy against human-written copy",
            "Implement AI for content personalization"
          ]
        },
        {
          trend_name: "Video-First Social Strategy",
          description: "Prioritizing short-form video content across social platforms",
          relevance_score: 92,
          potential_impact: "high",
          adoption_timeline: "Immediate",
          recommendations: [
            "Allocate 40% of content budget to video",
            "Create platform-specific video formats",
            "Develop a consistent posting schedule"
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      return [];
    }
  },
  
  // Get competitor insights
  getCompetitorInsights: async (): Promise<CompetitorInsight[]> => {
    try {
      // This would query the competitor_insights table in a real app
      return [
        {
          competitor_name: "Competitor A",
          strengths: ["Strong brand recognition", "Large marketing budget", "Established customer base"],
          weaknesses: ["Outdated product offerings", "Poor customer service", "Limited digital presence"],
          opportunities: ["Target their dissatisfied customers", "Highlight your innovative features", "Emphasize personalized service"],
          threats: ["Price undercutting", "Aggressive marketing campaigns", "Potential new products"],
          market_share: 28,
          recent_campaigns: [
            { name: "Summer Sale", description: "30% off all products", date: "2023-07-01" },
            { name: "Loyalty Program", description: "New points-based system", date: "2023-08-15" }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      return [];
    }
  },
  
  // Analyze meeting transcript
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      // This would use AI to analyze the transcript in a real app
      return {
        key_points: [
          "Client is interested in social media management",
          "Budget concerns mentioned three times",
          "Competitor A was mentioned as current provider"
        ],
        sentiment: "Positive",
        follow_up_suggestions: [
          "Send detailed proposal with competitive pricing",
          "Highlight differentiators from Competitor A",
          "Schedule follow-up call in one week"
        ],
        word_cloud: {
          "budget": 12,
          "social": 15,
          "results": 9,
          "analytics": 7,
          "competitor": 5,
        }
      };
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      return {};
    }
  }
};

export default marketingService;
