
import { apiRequest } from "@/utils/apiUtils";
import { supabase } from '@/integrations/supabase/client';

// Define types
export interface EmailOutreach {
  id: number;
  subject: string;
  body: string;
  recipients: string[];
  sent_at: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduled_for?: string;
  open_rate?: number;
  click_rate?: number;
  source: 'campaign' | 'other' | 'bni' | 'master_networks';
}

export interface MarketingMeeting {
  id: number;
  client_name: string;
  contact_person: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  follow_up_date?: string;
  meeting_link?: string; // Added for completeness
  source: 'referral' | 'other' | 'bni' | 'master_networks';
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
  score: number;
  lastContactedAt?: string;
  notes?: string;
  createdAt: string;
  interactions: Array<{
    date: string;
    type: string;
    notes: string;
  }>;
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
  status: 'draft' | 'active' | 'completed';
  strategies: {
    social_media?: any[];
    email_campaigns?: any[];
    content_marketing?: any[];
    advertising?: any[];
    pr?: any[];
  };
  budget: number;
  kpis: any[];
}

export interface MarketingTrend {
  id: number;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  relevance_score: number;
  sources: string[];
  detected_date: string;
  action_items?: string[];
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  insight_type: 'pricing' | 'product' | 'promotion' | 'positioning';
  description: string;
  detected_date: string;
  impact_level: 'low' | 'medium' | 'high';
  potential_response?: string;
}

export interface MarketingMetrics {
  email_open_rate: number;
  email_click_rate: number;
  social_media_engagement: number;
  website_traffic: number;
  lead_conversion_rate: number;
  campaign_roi: number;
  leads_by_source: { source: string; count: number }[];
  engagement_by_channel: { channel: string; engagement: number }[];
}

// Mock data for email outreach
const mockEmailOutreaches: EmailOutreach[] = [
  {
    id: 1,
    subject: "New Service Announcement",
    body: "We're excited to announce our new service...",
    recipients: ["client1@example.com", "client2@example.com"],
    sent_at: "2023-06-20T14:30:00Z",
    status: "sent",
    open_rate: 68,
    click_rate: 25,
    source: 'campaign'
  },
  {
    id: 2,
    subject: "Exclusive Offer for Valued Clients",
    body: "As a valued client, we'd like to offer you...",
    recipients: ["vip1@example.com", "vip2@example.com"],
    sent_at: "2023-06-25T10:15:00Z",
    status: "sent",
    open_rate: 75,
    click_rate: 40,
    source: 'other'
  },
  {
    id: 3,
    subject: "Upcoming Website Maintenance",
    body: "Please be advised of scheduled maintenance...",
    recipients: ["all-clients@list.example.com"],
    scheduled_for: "2023-07-15T22:00:00Z",
    sent_at: "",
    status: "scheduled",
    source: 'bni'
  }
];

// Mock data for meetings
const mockMeetings: MarketingMeeting[] = [
  {
    id: 1,
    client_name: "Acme Inc",
    contact_person: "John Smith",
    date: "2023-07-10T13:00:00Z",
    status: "scheduled",
    notes: "Initial discussion about marketing strategy",
    follow_up_date: "2023-07-17T13:00:00Z",
    meeting_link: "https://meet.example.com/abc123",
    source: 'other'
  },
  {
    id: 2,
    client_name: "TechCorp",
    contact_person: "Jane Doe",
    date: "2023-06-28T15:30:00Z",
    status: "completed",
    notes: "Reviewed current campaign performance, client interested in social media package",
    follow_up_date: "2023-07-12T15:30:00Z",
    meeting_link: "https://meet.example.com/def456",
    source: 'other'
  },
  {
    id: 3,
    client_name: "Global Services",
    contact_person: "Robert Johnson",
    date: "2023-07-05T10:00:00Z",
    status: "cancelled",
    notes: "Client requested reschedule due to internal meeting conflicts",
    meeting_link: "https://meet.example.com/ghi789",
    source: 'other'
  }
];

// Mock data for leads
const mockLeads: LeadProfile[] = [
  {
    id: 1,
    name: "John Smith",
    position: "Marketing Director",
    company: "Acme Corp",
    email: "john.smith@acme.com",
    phone: "+1 (555) 123-4567",
    source: "Website Form",
    status: "contacted",
    score: 85,
    lastContactedAt: "2023-06-25T14:30:00Z",
    notes: "Interested in our full-service package",
    createdAt: "2023-06-20T10:15:00Z",
    interactions: [
      {
        date: "2023-06-20T10:15:00Z",
        type: "form_submission",
        notes: "Submitted contact form on website"
      },
      {
        date: "2023-06-25T14:30:00Z",
        type: "email",
        notes: "Sent follow-up email with service details"
      }
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "CEO",
    company: "TechStartup Inc",
    email: "sarah@techstartup.com",
    source: "LinkedIn",
    status: "meeting_scheduled",
    score: 90,
    lastContactedAt: "2023-06-28T11:00:00Z",
    notes: "Scheduled initial consultation for July 5",
    createdAt: "2023-06-15T09:30:00Z",
    interactions: [
      {
        date: "2023-06-15T09:30:00Z",
        type: "linkedin_connection",
        notes: "Connected on LinkedIn"
      },
      {
        date: "2023-06-28T11:00:00Z",
        type: "phone_call",
        notes: "Discussed services and scheduled meeting"
      }
    ]
  },
  {
    id: 3,
    name: "Michael Brown",
    position: "Sales Manager",
    company: "Global Industries",
    email: "michael.brown@global.com",
    phone: "+1 (555) 987-6543",
    source: "Referral",
    status: "new",
    score: 65,
    notes: "Referred by John Smith at Acme Corp",
    createdAt: "2023-06-30T15:45:00Z",
    interactions: [
      {
        date: "2023-06-30T15:45:00Z",
        type: "referral",
        notes: "Added to system via referral from existing client"
      }
    ]
  },
  {
    id: 4,
    name: "Lisa Davis",
    position: "Marketing Manager",
    company: "Retail Solutions",
    email: "lisa.davis@retail.com",
    phone: "+1 (555) 234-5678",
    source: "Trade Show",
    status: "meeting_completed",
    score: 80,
    lastContactedAt: "2023-06-22T13:30:00Z",
    notes: "Interested in social media management and content creation",
    createdAt: "2023-06-10T08:00:00Z",
    interactions: [
      {
        date: "2023-06-10T08:00:00Z",
        type: "trade_show",
        notes: "Met at industry conference, exchanged cards"
      },
      {
        date: "2023-06-15T10:00:00Z",
        type: "email",
        notes: "Sent follow-up email with information"
      },
      {
        date: "2023-06-22T13:30:00Z",
        type: "meeting",
        notes: "Conducted initial consultation, discussed needs"
      }
    ]
  },
  {
    id: 5,
    name: "David Wilson",
    position: "Operations Director",
    company: "Manufacturing Experts",
    email: "david@manufacturing.com",
    source: "Google Ads",
    status: "proposal_sent",
    score: 75,
    lastContactedAt: "2023-06-29T16:00:00Z",
    notes: "Sent comprehensive proposal for website redesign and SEO",
    createdAt: "2023-06-18T11:30:00Z",
    interactions: [
      {
        date: "2023-06-18T11:30:00Z",
        type: "ad_click",
        notes: "Clicked on Google Ad for website services"
      },
      {
        date: "2023-06-20T14:00:00Z",
        type: "phone_call",
        notes: "Initial discussion about needs"
      },
      {
        date: "2023-06-29T16:00:00Z",
        type: "proposal",
        notes: "Sent detailed proposal via email"
      }
    ]
  }
];

// Mock data for email templates
const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Welcome New Client",
    subject: "Welcome to Our Services!",
    body: "Dear {{client_name}},\n\nWelcome to our services! We're excited to start working with you...",
    category: "Onboarding",
    created_at: "2023-01-15T10:00:00Z",
    updated_at: "2023-03-20T14:30:00Z"
  },
  {
    id: 2,
    name: "Monthly Report",
    subject: "Your Monthly Performance Report - {{month}}",
    body: "Dear {{client_name}},\n\nHere is your performance report for {{month}}...",
    category: "Reporting",
    created_at: "2023-02-05T11:15:00Z",
    updated_at: "2023-05-12T09:45:00Z"
  },
  {
    id: 3,
    name: "Follow-up After Meeting",
    subject: "Follow-up: Our Discussion on {{topic}}",
    body: "Dear {{contact_name}},\n\nThank you for taking the time to meet with us today to discuss {{topic}}...",
    category: "Sales",
    created_at: "2023-03-10T13:30:00Z",
    updated_at: "2023-03-10T13:30:00Z"
  }
];

// Mock data for marketing plans
const mockMarketingPlans: MarketingPlan[] = [
  {
    id: 1,
    title: "Q3 2023 Marketing Strategy",
    description: "Comprehensive marketing plan for Q3 2023 focusing on digital channels and lead generation",
    start_date: "2023-07-01",
    end_date: "2023-09-30",
    status: "active",
    strategies: {
      social_media: [
        { platform: "LinkedIn", frequency: "daily", content_themes: ["industry insights", "company updates", "success stories"] },
        { platform: "Instagram", frequency: "3x weekly", content_themes: ["behind the scenes", "team spotlights", "product highlights"] }
      ],
      email_campaigns: [
        { name: "Monthly Newsletter", frequency: "monthly", target_segments: ["all clients", "prospects"] },
        { name: "Product Updates", frequency: "as needed", target_segments: ["current clients"] }
      ],
      content_marketing: [
        { type: "Blog Posts", frequency: "weekly", topics: ["industry trends", "how-to guides", "case studies"] },
        { type: "Whitepapers", frequency: "monthly", topics: ["in-depth research", "industry analysis"] }
      ]
    },
    budget: 15000,
    kpis: [
      { name: "Website Traffic", target: "Increase by 20%", current: "10% increase" },
      { name: "Lead Generation", target: "50 new qualified leads", current: "22 leads" },
      { name: "Social Media Engagement", target: "30% increase", current: "15% increase" }
    ]
  },
  {
    id: 2,
    title: "Holiday Season Campaign",
    description: "Special promotion and content strategy for the holiday season",
    start_date: "2023-11-01",
    end_date: "2023-12-31",
    status: "draft",
    strategies: {
      social_media: [
        { platform: "All Channels", frequency: "daily", content_themes: ["holiday specials", "end-of-year reviews", "success stories"] }
      ],
      email_campaigns: [
        { name: "Holiday Promotion", frequency: "weekly", target_segments: ["all clients", "prospects", "past clients"] }
      ],
      advertising: [
        { platform: "Google Ads", budget: 3000, targeting: "Industry-specific keywords + holiday terms" },
        { platform: "LinkedIn Ads", budget: 2000, targeting: "Decision makers in target industries" }
      ]
    },
    budget: 12000,
    kpis: [
      { name: "Sales Leads", target: "75 qualified leads", current: "0" },
      { name: "Conversion Rate", target: "3.5%", current: "0%" },
      { name: "Revenue", target: "$40,000 in new contracts", current: "$0" }
    ]
  }
];

// Mock data for marketing trends
const mockMarketingTrends: MarketingTrend[] = [
  {
    id: 1,
    title: "AI-Driven Content Creation",
    description: "Increasing adoption of AI tools for content creation and optimization in the industry",
    impact_level: "high",
    relevance_score: 85,
    sources: ["Industry Reports", "Competitor Analysis", "Tech News"],
    detected_date: "2023-06-10",
    action_items: [
      "Research top AI content tools",
      "Test implementation for blog production",
      "Develop strategy for AI-assisted content workflow"
    ]
  },
  {
    id: 2,
    title: "Video Content Dominance",
    description: "Short-form video content continuing to dominate engagement metrics across platforms",
    impact_level: "high",
    relevance_score: 90,
    sources: ["Social Media Analytics", "Industry Blogs", "Platform Updates"],
    detected_date: "2023-05-22",
    action_items: [
      "Increase video content production",
      "Train team on short-form video best practices",
      "Develop video content calendar for Q3"
    ]
  },
  {
    id: 3,
    title: "Privacy-First Marketing",
    description: "Shift towards privacy-focused marketing strategies due to cookie deprecation and regulations",
    impact_level: "medium",
    relevance_score: 75,
    sources: ["Regulatory Updates", "Marketing Publications", "Data Privacy News"],
    detected_date: "2023-06-05",
    action_items: [
      "Audit current data collection practices",
      "Develop first-party data strategy",
      "Update privacy policies and disclosures"
    ]
  }
];

// Mock data for competitor insights
const mockCompetitorInsights: CompetitorInsight[] = [
  {
    id: 1,
    competitor_name: "Digital Marketing Masters",
    insight_type: "pricing",
    description: "Introduced new tiered pricing model with lower entry point for small businesses",
    detected_date: "2023-06-18",
    impact_level: "medium",
    potential_response: "Evaluate our pricing for small business segment, consider entry-level package"
  },
  {
    id: 2,
    competitor_name: "WebWizards Agency",
    insight_type: "product",
    description: "Launched new AI-powered content optimization tool as part of their service packages",
    detected_date: "2023-06-25",
    impact_level: "high",
    potential_response: "Accelerate our AI tool integration, highlight our personalized approach as differentiation"
  },
  {
    id: 3,
    competitor_name: "Growth Gurus",
    insight_type: "promotion",
    description: "Running aggressive referral campaign offering 20% discount for client referrals",
    detected_date: "2023-06-20",
    impact_level: "medium",
    potential_response: "Monitor impact on our lead flow, consider enhanced referral incentives if needed"
  }
];

const marketingService = {
  getCampaigns: async () => {
    // Mock implementation
    return [
      {
        id: 1,
        name: "Summer Promotion",
        status: "active",
        start_date: "2023-06-01",
        end_date: "2023-08-31",
        channels: ["email", "social_media", "google_ads"],
        budget: 5000,
        spent: 2300,
        leads_generated: 45,
        conversions: 12
      },
      {
        id: 2,
        name: "Product Launch",
        status: "planning",
        start_date: "2023-09-15",
        end_date: "2023-10-15",
        channels: ["email", "social_media", "pr", "webinar"],
        budget: 8000,
        spent: 0,
        leads_generated: 0,
        conversions: 0
      },
      {
        id: 3,
        name: "Q2 Newsletter Series",
        status: "completed",
        start_date: "2023-04-01",
        end_date: "2023-06-30",
        channels: ["email"],
        budget: 1500,
        spent: 1500,
        leads_generated: 35,
        conversions: 8
      }
    ];
  },
  
  createCampaign: async (campaignData: any) => {
    // Mock implementation
    console.log('Creating campaign:', campaignData);
    return {
      id: Math.floor(Math.random() * 1000) + 10,
      ...campaignData,
      created_at: new Date().toISOString(),
      status: campaignData.status || 'draft'
    };
  },
  
  getMeetings: async () => {
    return mockMeetings;
  },
  
  createMeeting: async (meetingData: any) => {
    const newMeeting: MarketingMeeting = {
      id: mockMeetings.length + 1,
      client_name: meetingData.client_name,
      contact_person: meetingData.contact_person,
      date: meetingData.date,
      status: meetingData.status || 'scheduled',
      notes: meetingData.notes || '',
      follow_up_date: meetingData.follow_up_date,
      meeting_link: meetingData.meeting_link,
      source: meetingData.source || 'other'
    };
    
    mockMeetings.push(newMeeting);
    return newMeeting;
  },
  
  getAnalytics: async (startDate?: string, endDate?: string) => {
    // Mock implementation
    return {
      website_traffic: {
        total_visitors: 12500,
        new_visitors: 8750,
        returning_visitors: 3750,
        bounce_rate: 45,
        average_session_duration: '2:35',
        top_pages: [
          { url: '/services', visits: 3200 },
          { url: '/about', visits: 1800 },
          { url: '/blog', visits: 1600 }
        ]
      },
      social_media: {
        total_followers: 15000,
        engagement_rate: 3.2,
        post_impressions: 45000,
        by_platform: [
          { platform: 'LinkedIn', followers: 5500, engagement: 4.1 },
          { platform: 'Instagram', followers: 6200, engagement: 3.8 },
          { platform: 'Twitter', followers: 3300, engagement: 1.9 }
        ]
      },
      email_marketing: {
        total_sends: 25000,
        open_rate: 22.5,
        click_rate: 3.8,
        conversion_rate: 1.2,
        campaigns: [
          { name: 'June Newsletter', sends: 10000, opens: 2350, clicks: 410 },
          { name: 'Product Update', sends: 8500, opens: 1870, clicks: 320 },
          { name: 'Special Promotion', sends: 6500, opens: 1450, clicks: 255 }
        ]
      }
    };
  },
  
  // Additional methods to handle specific component needs
  getEmailOutreach: async () => {
    return mockEmailOutreaches;
  },
  
  createEmailOutreach: async (outreachData: Partial<EmailOutreach>) => {
    const newOutreach: EmailOutreach = {
      id: mockEmailOutreaches.length + 1,
      subject: outreachData.subject || '',
      body: outreachData.body || '',
      recipients: outreachData.recipients || [],
      sent_at: outreachData.status === 'sent' ? new Date().toISOString() : '',
      status: outreachData.status || 'draft',
      scheduled_for: outreachData.scheduled_for,
      open_rate: outreachData.open_rate,
      click_rate: outreachData.click_rate,
      source: outreachData.source || 'other'
    };
    
    mockEmailOutreaches.push(newOutreach);
    return newOutreach;
  },
  
  getLeads: async () => {
    return mockLeads;
  },
  
  createLead: async (leadData: Partial<LeadProfile>) => {
    const newLead: LeadProfile = {
      id: mockLeads.length + 1,
      name: leadData.name || '',
      position: leadData.position || '',
      company: leadData.company || '',
      email: leadData.email || '',
      phone: leadData.phone,
      source: leadData.source || '',
      status: leadData.status || 'new',
      score: leadData.score || 50,
      lastContactedAt: leadData.lastContactedAt,
      notes: leadData.notes,
      createdAt: new Date().toISOString(),
      interactions: leadData.interactions || [
        {
          date: new Date().toISOString(),
          type: 'created',
          notes: 'Lead created in system'
        }
      ]
    };
    
    mockLeads.push(newLead);
    return newLead;
  },
  
  getEmailTemplates: async () => {
    return mockEmailTemplates;
  },
  
  createEmailTemplate: async (templateData: Partial<EmailTemplate>) => {
    const now = new Date().toISOString();
    const newTemplate: EmailTemplate = {
      id: mockEmailTemplates.length + 1,
      name: templateData.name || '',
      subject: templateData.subject || '',
      body: templateData.body || '',
      category: templateData.category || 'General',
      created_at: now,
      updated_at: now
    };
    
    mockEmailTemplates.push(newTemplate);
    return newTemplate;
  },
  
  getMarketingPlans: async () => {
    return mockMarketingPlans;
  },
  
  getMarketingPlanById: async (planId: number) => {
    return mockMarketingPlans.find(plan => plan.id === planId) || null;
  },
  
  createMarketingPlan: async (planData: Partial<MarketingPlan>) => {
    const newPlan: MarketingPlan = {
      id: mockMarketingPlans.length + 1,
      title: planData.title || '',
      description: planData.description || '',
      start_date: planData.start_date || '',
      end_date: planData.end_date || '',
      status: planData.status || 'draft',
      strategies: planData.strategies || {},
      budget: planData.budget || 0,
      kpis: planData.kpis || []
    };
    
    mockMarketingPlans.push(newPlan);
    return newPlan;
  },
  
  getMarketingTrends: async () => {
    return mockMarketingTrends;
  },
  
  getCompetitorInsights: async () => {
    return mockCompetitorInsights;
  },
  
  analyzeMeetingTranscript: async (transcriptText: string) => {
    // This would use AI in a real implementation
    // Mock implementation returns predefined insights
    return {
      key_points: [
        "Client expressed interest in social media services",
        "Concerns about current website performance were mentioned",
        "Budget constraints discussed - looking for phased approach"
      ],
      sentiment: "Positive",
      client_pain_points: [
        "Low online visibility",
        "Outdated website design",
        "Limited marketing resources"
      ],
      next_steps: [
        "Prepare social media proposal",
        "Schedule website audit",
        "Develop phased marketing plan within budget"
      ],
      follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  },
  
  getMarketingMetrics: async () => {
    // Mock implementation
    const metrics: MarketingMetrics = {
      email_open_rate: 23.5,
      email_click_rate: 3.8,
      social_media_engagement: 4.2,
      website_traffic: 15000,
      lead_conversion_rate: 2.5,
      campaign_roi: 320,
      leads_by_source: [
        { source: "Website", count: 45 },
        { source: "Social Media", count: 32 },
        { source: "Email Campaigns", count: 28 },
        { source: "Referrals", count: 20 },
        { source: "Other", count: 10 }
      ],
      engagement_by_channel: [
        { channel: "LinkedIn", engagement: 4.5 },
        { channel: "Instagram", engagement: 5.2 },
        { channel: "Email", engagement: 3.8 },
        { channel: "Blog", engagement: 2.9 }
      ]
    };
    
    return metrics;
  }
};

export default marketingService;
