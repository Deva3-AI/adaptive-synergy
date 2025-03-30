
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

export interface EmailOutreach {
  id: number;
  campaign_id: number;
  subject: string;
  body: string;
  sent_to: number;
  opened: number;
  clicked: number;
  responded: number;
  sent_date: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduled_date?: string;
}

export interface MarketingMeeting {
  id: number;
  client_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  date: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  outcome?: string;
  next_steps?: string;
  meeting_link?: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'meeting_scheduled' | 'meeting_completed' | 'proposal_sent' | 'converted' | 'lost';
  score: number; // 0-100
  lastContactedAt?: string;
  notes?: string;
  createdAt: string;
  interactions: {
    date: string;
    type: string;
    notes: string;
  }[];
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: 'outreach' | 'follow_up' | 'proposal' | 'newsletter';
  created_at: string;
  updated_at: string;
  variables: string[];
}

export interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed';
  budget: number;
  objectives: string[];
  tactics: {
    id: number;
    name: string;
    channel: string;
    budget: number;
    start_date: string;
    end_date: string;
    status: 'pending' | 'in_progress' | 'completed';
    kpis: {
      name: string;
      target: number;
      current: number;
    }[];
  }[];
}

export interface MarketingMetrics {
  email_metrics: {
    sent: number;
    opened: number;
    clicked: number;
    open_rate: number;
    click_rate: number;
  };
  leads_metrics: {
    total: number;
    new_this_month: number;
    conversion_rate: number;
    average_score: number;
    by_source: {
      source: string;
      count: number;
    }[];
    by_status: {
      status: string;
      count: number;
    }[];
  };
  meeting_metrics: {
    total: number;
    scheduled: number;
    completed: number;
    conversion_rate: number;
  };
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
  key_offerings: string[];
  market_share?: number;
  pricing_strategy?: string;
  marketing_channels: string[];
  notes?: string;
  last_updated: string;
}

export interface MarketingTrend {
  id: number;
  name: string;
  category: 'industry' | 'technology' | 'consumer_behavior' | 'platform';
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  opportunity: string;
  threat: string;
  action_items: string[];
  sources: string[];
  date_identified: string;
}

const marketingService = {
  // Get marketing campaigns
  getCampaigns: async () => {
    try {
      // In a real implementation, we would query a marketing_campaigns table
      // For now, let's use mock data
      return [
        {
          id: 1,
          name: "Summer Promotion",
          start_date: "2023-06-01",
          end_date: "2023-08-31",
          status: "active",
          budget: 5000,
          channels: ["email", "social", "ppc"],
          metrics: {
            reach: 15000,
            engagement: 2500,
            conversions: 150
          }
        },
        {
          id: 2,
          name: "New Product Launch",
          start_date: "2023-07-15",
          end_date: "2023-09-15",
          status: "scheduled",
          budget: 8000,
          channels: ["email", "social", "event", "ppc"],
          metrics: {
            reach: 0,
            engagement: 0,
            conversions: 0
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return apiRequest('/marketing/campaigns', 'get', undefined, []);
    }
  },
  
  // Create a marketing campaign
  createCampaign: async (campaignData: any) => {
    // In a real implementation, we would insert into a marketing_campaigns table
    console.log('Creating campaign:', campaignData);
    return {
      id: 3,
      ...campaignData,
      created_at: new Date().toISOString()
    };
  },
  
  // Get marketing meetings
  getMeetings: async () => {
    try {
      // Mock meetings
      return [
        {
          id: 1,
          client_name: "Acme Corporation",
          contact_name: "John Smith",
          email: "john@acme.com",
          phone: "555-123-4567",
          date: "2023-06-15T14:00:00Z",
          duration: 60,
          status: "scheduled",
          notes: "Initial discovery meeting",
          meeting_link: "https://zoom.us/j/123456789"
        },
        {
          id: 2,
          client_name: "TechStart Inc",
          contact_name: "Sarah Johnson",
          email: "sarah@techstart.com",
          phone: "555-987-6543",
          date: "2023-06-10T10:00:00Z",
          duration: 45,
          status: "completed",
          notes: "Follow-up on proposal",
          outcome: "Positive reception, requested additional information",
          next_steps: "Send detailed timeline and case studies",
          meeting_link: "https://zoom.us/j/987654321"
        },
        {
          id: 3,
          client_name: "Global Services LLC",
          contact_name: "Michael Brown",
          email: "michael@globalservices.com",
          date: "2023-06-20T15:30:00Z",
          duration: 30,
          status: "scheduled",
          notes: "Present marketing strategy",
          meeting_link: "https://teams.microsoft.com/l/meetup-join/abcdef"
        }
      ];
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return apiRequest('/marketing/meetings', 'get', undefined, []);
    }
  },
  
  // Create a marketing meeting
  createMeeting: async (meetingData: any) => {
    // In a real implementation, we would insert into a marketing_meetings table
    console.log('Creating meeting:', meetingData);
    return {
      id: 4,
      ...meetingData,
      created_at: new Date().toISOString()
    };
  },
  
  // Get marketing analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
    // This would integrate with analytics platforms in a real app
    console.log('Fetching analytics from', startDate, 'to', endDate);
    return {
      summary: {
        total_leads: 45,
        conversion_rate: 12.5,
        avg_response_time: 4.2, // hours
        meetings_scheduled: 18
      },
      channels: [
        { name: "Email", leads: 20, conversion_rate: 15 },
        { name: "Social", leads: 12, conversion_rate: 8 },
        { name: "Referral", leads: 8, conversion_rate: 22 },
        { name: "Organic", leads: 5, conversion_rate: 10 }
      ],
      timeline: [
        { date: "2023-06-01", leads: 10, meetings: 4, conversions: 1 },
        { date: "2023-06-08", leads: 12, meetings: 5, conversions: 2 },
        { date: "2023-06-15", leads: 8, meetings: 3, conversions: 1 },
        { date: "2023-06-22", leads: 15, meetings: 6, conversions: 2 }
      ]
    };
  },
  
  // Get email outreach campaigns
  getEmailOutreach: async () => {
    // Mock email campaigns
    return [
      {
        id: 1,
        campaign_id: 1,
        subject: "Introducing Our New Services",
        body: "Hello {{name}},\n\nWe're excited to share our new service offerings...",
        sent_to: 250,
        opened: 175,
        clicked: 85,
        responded: 32,
        sent_date: "2023-05-15T09:00:00Z",
        status: "sent"
      },
      {
        id: 2,
        campaign_id: 1,
        subject: "Follow-up: Our New Services",
        body: "Hello {{name}},\n\nWe wanted to follow up on our previous email...",
        sent_to: 218,
        opened: 150,
        clicked: 62,
        responded: 28,
        sent_date: "2023-05-22T09:00:00Z",
        status: "sent"
      },
      {
        id: 3,
        campaign_id: 2,
        subject: "Special Summer Promotion",
        body: "Hello {{name}},\n\nFor a limited time, we're offering...",
        sent_to: 0,
        opened: 0,
        clicked: 0,
        responded: 0,
        status: "draft",
        scheduled_date: "2023-06-15T09:00:00Z"
      }
    ];
  },
  
  // Get leads
  getLeads: async () => {
    // Mock leads
    return [
      {
        id: 1,
        name: "John Smith",
        position: "Marketing Director",
        company: "Acme Corporation",
        email: "john@acme.com",
        phone: "555-123-4567",
        source: "lead_generation",
        status: "contacted",
        score: 75,
        lastContactedAt: "2023-06-01T14:30:00Z",
        notes: "Initially interested in our marketing services",
        createdAt: "2023-05-25T10:15:00Z",
        interactions: [
          { date: "2023-05-25T10:15:00Z", type: "lead_capture", notes: "Filled out contact form" },
          { date: "2023-06-01T14:30:00Z", type: "email", notes: "Sent initial outreach email" }
        ]
      },
      {
        id: 2,
        name: "Sarah Johnson",
        position: "CEO",
        company: "TechStart Inc",
        email: "sarah@techstart.com",
        source: "referral",
        status: "meeting_scheduled",
        score: 85,
        lastContactedAt: "2023-06-03T11:45:00Z",
        notes: "Referred by existing client",
        createdAt: "2023-06-02T09:30:00Z",
        interactions: [
          { date: "2023-06-02T09:30:00Z", type: "referral", notes: "Referred by Client X" },
          { date: "2023-06-03T11:45:00Z", type: "email", notes: "Scheduled initial meeting" }
        ]
      },
      {
        id: 3,
        name: "Robert Chen",
        position: "CTO",
        company: "Innovate Solutions",
        email: "robert@innovate.com",
        phone: "555-987-6543",
        source: "meeting_follow_up",
        status: "new",
        score: 65,
        notes: "Met at industry conference",
        createdAt: "2023-06-04T15:00:00Z",
        interactions: [
          { date: "2023-06-04T15:00:00Z", type: "conference", notes: "Met at Tech Conference 2023" }
        ]
      },
      {
        id: 4,
        name: "Emily Davis",
        position: "Marketing Manager",
        company: "Global Retail Corp",
        email: "emily@globalretail.com",
        phone: "555-567-8901",
        source: "campaign",
        status: "meeting_completed",
        score: 90,
        lastContactedAt: "2023-06-05T16:30:00Z",
        notes: "Very interested in our services after initial demo",
        createdAt: "2023-05-28T13:45:00Z",
        interactions: [
          { date: "2023-05-28T13:45:00Z", type: "email_campaign", notes: "Responded to summer campaign" },
          { date: "2023-06-05T16:30:00Z", type: "meeting", notes: "Completed product demo" }
        ]
      },
      {
        id: 5,
        name: "Michael Wilson",
        position: "Sales Director",
        company: "Enterprise Solutions",
        email: "michael@enterprise.com",
        source: "other",
        status: "proposal_sent",
        score: 85,
        lastContactedAt: "2023-06-06T10:15:00Z",
        notes: "Sent proposal for comprehensive marketing package",
        createdAt: "2023-05-20T09:00:00Z",
        interactions: [
          { date: "2023-05-20T09:00:00Z", type: "website", notes: "Requested information through website" },
          { date: "2023-05-22T14:00:00Z", type: "call", notes: "Initial discovery call" },
          { date: "2023-06-01T15:30:00Z", type: "meeting", notes: "Requirements gathering session" },
          { date: "2023-06-06T10:15:00Z", type: "email", notes: "Sent formal proposal" }
        ]
      }
    ];
  },
  
  // Get email templates
  getEmailTemplates: async () => {
    // Mock email templates
    return [
      {
        id: 1,
        name: "Initial Outreach",
        subject: "Introduction to Our Services",
        body: "Hello {{name}},\n\nI hope this email finds you well. I'm reaching out from [Company Name] because...",
        category: "outreach",
        created_at: "2023-04-10T08:00:00Z",
        updated_at: "2023-05-15T14:30:00Z",
        variables: ["name", "company"]
      },
      {
        id: 2,
        name: "Meeting Follow-up",
        subject: "Thank You for Your Time",
        body: "Hello {{name}},\n\nThank you for taking the time to meet with us yesterday...",
        category: "follow_up",
        created_at: "2023-04-12T09:15:00Z",
        updated_at: "2023-04-12T09:15:00Z",
        variables: ["name", "meeting_date", "next_steps"]
      },
      {
        id: 3,
        name: "Proposal Template",
        subject: "Proposal for {{company}}",
        body: "Dear {{name}},\n\nPlease find attached our proposal for {{company}}...",
        category: "proposal",
        created_at: "2023-04-15T11:30:00Z",
        updated_at: "2023-05-20T16:45:00Z",
        variables: ["name", "company", "proposal_link"]
      },
      {
        id: 4,
        name: "Monthly Newsletter",
        subject: "{{month}} Newsletter: Latest Updates",
        body: "Hello {{name}},\n\nHere's what's new this month...",
        category: "newsletter",
        created_at: "2023-04-20T10:00:00Z",
        updated_at: "2023-06-01T09:30:00Z",
        variables: ["name", "month", "featured_article"]
      }
    ];
  },
  
  // Get marketing plans
  getMarketingPlans: async () => {
    // Mock marketing plans
    return [
      {
        id: 1,
        title: "Q3 2023 Marketing Plan",
        description: "Comprehensive marketing strategy for Q3 2023 focusing on increasing brand awareness and lead generation",
        start_date: "2023-07-01",
        end_date: "2023-09-30",
        status: "active",
        budget: 25000,
        objectives: [
          "Increase website traffic by 20%",
          "Generate 50 new qualified leads",
          "Improve social media engagement by 15%"
        ],
        tactics: [
          {
            id: 1,
            name: "Content Marketing Campaign",
            channel: "Blog, Social Media",
            budget: 8000,
            start_date: "2023-07-01",
            end_date: "2023-09-30",
            status: "in_progress",
            kpis: [
              { name: "Blog Posts Published", target: 12, current: 4 },
              { name: "Social Shares", target: 500, current: 180 },
              { name: "New Subscribers", target: 200, current: 65 }
            ]
          },
          {
            id: 2,
            name: "Email Nurture Campaign",
            channel: "Email",
            budget: 5000,
            start_date: "2023-07-15",
            end_date: "2023-09-15",
            status: "in_progress",
            kpis: [
              { name: "Emails Sent", target: 5000, current: 2000 },
              { name: "Open Rate", target: 25, current: 22 },
              { name: "Conversion Rate", target: 5, current: 3.8 }
            ]
          },
          {
            id: 3,
            name: "PPC Campaign",
            channel: "Google Ads, LinkedIn",
            budget: 12000,
            start_date: "2023-08-01",
            end_date: "2023-09-30",
            status: "pending",
            kpis: [
              { name: "Impressions", target: 100000, current: 0 },
              { name: "Clicks", target: 5000, current: 0 },
              { name: "Leads Generated", target: 25, current: 0 }
            ]
          }
        ]
      },
      {
        id: 2,
        title: "Product Launch Campaign",
        description: "Marketing campaign for the launch of our new product line",
        start_date: "2023-08-15",
        end_date: "2023-10-15",
        status: "draft",
        budget: 35000,
        objectives: [
          "Generate 100+ pre-orders",
          "Achieve 500K+ impressions",
          "Obtain 20+ media mentions"
        ],
        tactics: [
          {
            id: 4,
            name: "Press Release Distribution",
            channel: "PR",
            budget: 5000,
            start_date: "2023-08-15",
            end_date: "2023-08-30",
            status: "pending",
            kpis: [
              { name: "Press Releases", target: 1, current: 0 },
              { name: "Media Pickups", target: 20, current: 0 }
            ]
          },
          {
            id: 5,
            name: "Social Media Campaign",
            channel: "Instagram, Facebook, Twitter",
            budget: 10000,
            start_date: "2023-08-20",
            end_date: "2023-10-15",
            status: "pending",
            kpis: [
              { name: "Impressions", target: 500000, current: 0 },
              { name: "Engagement Rate", target: 3, current: 0 },
              { name: "Referral Traffic", target: 5000, current: 0 }
            ]
          },
          {
            id: 6,
            name: "Influencer Partnerships",
            channel: "Influencer Marketing",
            budget: 15000,
            start_date: "2023-09-01",
            end_date: "2023-10-15",
            status: "pending",
            kpis: [
              { name: "Influencers Engaged", target: 10, current: 0 },
              { name: "Posts Created", target: 30, current: 0 },
              { name: "Reach", target: 300000, current: 0 }
            ]
          },
          {
            id: 7,
            name: "Launch Event",
            channel: "Event",
            budget: 5000,
            start_date: "2023-09-15",
            end_date: "2023-09-15",
            status: "pending",
            kpis: [
              { name: "Attendees", target: 100, current: 0 },
              { name: "Media Present", target: 5, current: 0 },
              { name: "Leads Generated", target: 30, current: 0 }
            ]
          }
        ]
      }
    ];
  },
  
  // Get marketing plan by ID
  getMarketingPlanById: async (planId: number) => {
    // In a real app, we would fetch a specific marketing plan
    // For now, we'll return a mock plan
    const plans = await marketingService.getMarketingPlans();
    return plans.find(plan => plan.id === planId);
  },
  
  // Get marketing metrics
  getMarketingMetrics: async () => {
    // Mock marketing metrics
    return {
      email_metrics: {
        sent: 1250,
        opened: 875,
        clicked: 425,
        open_rate: 70,
        click_rate: 34
      },
      leads_metrics: {
        total: 125,
        new_this_month: 45,
        conversion_rate: 15,
        average_score: 72,
        by_source: [
          { source: "Email", count: 45 },
          { source: "Website", count: 35 },
          { source: "Referral", count: 25 },
          { source: "Social", count: 15 },
          { source: "Other", count: 5 }
        ],
        by_status: [
          { status: "New", count: 35 },
          { status: "Contacted", count: 40 },
          { status: "Meeting Scheduled", count: 20 },
          { status: "Meeting Completed", count: 15 },
          { status: "Proposal Sent", count: 10 },
          { status: "Converted", count: 5 }
        ]
      },
      meeting_metrics: {
        total: 85,
        scheduled: 25,
        completed: 60,
        conversion_rate: 12
      }
    };
  },
  
  // Get marketing trends
  getMarketingTrends: async () => {
    // Mock marketing trends
    return [
      {
        id: 1,
        name: "AI-Powered Marketing Automation",
        category: "technology",
        description: "AI and machine learning technologies are transforming marketing automation capabilities",
        impact_level: "high",
        opportunity: "Implement AI-driven personalization to increase engagement and conversion rates",
        threat: "Competitors adopting these technologies may gain significant advantages in efficiency and personalization",
        action_items: [
          "Research AI marketing platforms",
          "Pilot test on email campaigns",
          "Develop AI-driven content strategy"
        ],
        sources: [
          "MarketingTech Conference 2023",
          "Industry Report: Future of MarTech"
        ],
        date_identified: "2023-05-15"
      },
      {
        id: 2,
        name: "Video Content Dominance",
        category: "consumer_behavior",
        description: "Short-form video content continues to dominate engagement across platforms",
        impact_level: "high",
        opportunity: "Develop a comprehensive video content strategy to increase reach and engagement",
        threat: "Declining effectiveness of traditional content formats",
        action_items: [
          "Audit current video capabilities",
          "Develop short-form video content strategy",
          "Train team on video production best practices"
        ],
        sources: [
          "Social Media Trends Report 2023",
          "Platform Analytics Data"
        ],
        date_identified: "2023-05-20"
      },
      {
        id: 3,
        name: "Privacy-First Marketing",
        category: "industry",
        description: "Increased privacy regulations and browser changes impacting tracking and targeting",
        impact_level: "medium",
        opportunity: "Build trust through transparent data practices and first-party data strategies",
        threat: "Reduced effectiveness of current targeting and attribution models",
        action_items: [
          "Audit current tracking dependencies",
          "Develop first-party data strategy",
          "Update privacy policies and communications"
        ],
        sources: [
          "Regulatory Updates Report",
          "MarTech Advisory Council"
        ],
        date_identified: "2023-06-01"
      }
    ];
  },
  
  // Get competitor insights
  getCompetitorInsights: async () => {
    // Mock competitor insights
    return [
      {
        id: 1,
        competitor_name: "DigitalEdge Solutions",
        website: "https://digitaledge.com",
        strengths: [
          "Strong social media presence",
          "Advanced analytics offering",
          "Large enterprise client base"
        ],
        weaknesses: [
          "Higher pricing",
          "Less personalized service",
          "Slower turnaround times"
        ],
        key_offerings: [
          "Digital Marketing",
          "Web Development",
          "Analytics Consulting"
        ],
        market_share: 12,
        pricing_strategy: "Premium pricing with tiered service levels",
        marketing_channels: [
          "Industry conferences",
          "Content marketing",
          "Paid search",
          "Strategic partnerships"
        ],
        notes: "Recently acquired a data analytics firm to strengthen their offering",
        last_updated: "2023-05-25"
      },
      {
        id: 2,
        competitor_name: "CreativeForce Agency",
        website: "https://creativeforce.agency",
        strengths: [
          "Award-winning creative work",
          "Strong brand reputation",
          "Innovative campaign approaches"
        ],
        weaknesses: [
          "Limited technical capabilities",
          "Inconsistent project management",
          "Less emphasis on performance metrics"
        ],
        key_offerings: [
          "Brand Strategy",
          "Creative Services",
          "Social Media Management"
        ],
        market_share: 8,
        pricing_strategy: "Project-based pricing with high creative premiums",
        marketing_channels: [
          "Design awards",
          "Case studies",
          "Referral programs",
          "Industry publications"
        ],
        notes: "Recently lost their creative director to another agency",
        last_updated: "2023-06-02"
      },
      {
        id: 3,
        competitor_name: "GrowthHackers Inc",
        website: "https://growthhackers.co",
        strengths: [
          "Performance-based approach",
          "Strong data-driven methodology",
          "Agile team structure"
        ],
        weaknesses: [
          "Less established brand",
          "Smaller team size",
          "Limited service breadth"
        ],
        key_offerings: [
          "Growth Marketing",
          "Conversion Optimization",
          "PPC Management"
        ],
        market_share: 5,
        pricing_strategy: "Performance-based with guaranteed results",
        marketing_channels: [
          "Thought leadership",
          "Webinars and workshops",
          "Free tools and resources",
          "Partner ecosystem"
        ],
        notes: "Rapidly growing and taking market share in the SMB segment",
        last_updated: "2023-06-10"
      }
    ];
  },
  
  // Analyze meeting transcript
  analyzeMeetingTranscript: async (transcript: string) => {
    // In a real implementation, this would use NLP/AI to analyze the transcript
    // For now, we'll return a mock analysis
    return {
      summary: "Client expressed interest in our marketing services, particularly content creation and social media management. They have concerns about pricing and ROI measurement.",
      key_points: [
        "Budget range: $5,000 - $8,000 per month",
        "Timeline: Looking to start in Q3",
        "Previous agency experience: Unsatisfied with reporting and transparency",
        "Main goals: Increase lead generation and brand awareness"
      ],
      sentiment: "Positive",
      next_steps: [
        "Send proposal by Friday",
        "Include case studies for similar clients",
        "Provide detailed reporting examples",
        "Schedule follow-up meeting next week"
      ],
      action_items: [
        {
          task: "Prepare custom proposal",
          assigned_to: "Account Manager",
          due_date: "2023-06-16"
        },
        {
          task: "Compile relevant case studies",
          assigned_to: "Marketing Strategist",
          due_date: "2023-06-15"
        },
        {
          task: "Schedule follow-up meeting",
          assigned_to: "Sales Manager",
          due_date: "2023-06-14"
        }
      ]
    };
  }
};

export default marketingService;
