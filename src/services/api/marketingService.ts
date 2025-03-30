
import { apiRequest } from "@/utils/apiUtils";
import { supabase } from '@/integrations/supabase/client';

// Define types
export interface EmailOutreach {
  id: number;
  recipient: string;
  recipientCompany?: string;
  subject: string;
  status: string;
  sentAt: string;
  source: string;
  followUpScheduled: boolean;
}

export interface MarketingMeeting {
  id: number;
  leadName: string;
  leadCompany: string;
  status: string;
  scheduledTime: string;
  duration: number;
  platform: string;
  notes?: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  score?: number;
  lastContactedAt?: string;
  notes?: string;
  createdAt: string;
  interactions: any[];
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  performanceMetrics?: {
    openRate: number;
    responseRate: number;
    usageCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MarketingPlan {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
  owner: string;
  goals: {
    leads: number;
    meetings: number;
    conversions: number;
  };
  channels: {
    name: string;
    allocation: number;
    expectedReturn: number;
  }[];
  tasks: {
    id: number;
    name: string;
    status: string;
    dueDate: string;
    assignee: string;
  }[];
}

// Mock data
const mockMeetings: MarketingMeeting[] = [
  {
    id: 1,
    leadName: "John Smith",
    leadCompany: "Acme Corp",
    status: "scheduled",
    scheduledTime: "2023-07-15T10:00:00Z",
    duration: 45,
    platform: "google_meet",
    notes: "Initial discovery call to discuss their needs"
  },
  {
    id: 2,
    leadName: "Sarah Johnson",
    leadCompany: "TechSolutions Inc",
    status: "completed",
    scheduledTime: "2023-07-10T14:30:00Z",
    duration: 60,
    platform: "zoom",
    notes: "Presented our services, they seemed interested in the premium package"
  },
  {
    id: 3,
    leadName: "Michael Lee",
    leadCompany: "Global Services",
    status: "rescheduled",
    scheduledTime: "2023-07-20T11:00:00Z",
    duration: 30,
    platform: "teams",
    notes: "Rescheduled from original date of July 18th"
  },
  {
    id: 4,
    leadName: "Emily Chen",
    leadCompany: "Innovative Solutions",
    status: "cancelled",
    scheduledTime: "2023-07-12T09:00:00Z",
    duration: 45,
    platform: "zoom",
    notes: "Cancelled due to scheduling conflict"
  },
  {
    id: 5,
    leadName: "David Wilson",
    leadCompany: "Strategic Partners",
    status: "completed",
    scheduledTime: "2023-07-08T15:00:00Z",
    duration: 60,
    platform: "in_person",
    notes: "Met at their office, very promising discussion"
  }
];

const mockEmailOutreach: EmailOutreach[] = [
  {
    id: 1,
    recipient: "john.smith@acmecorp.com",
    recipientCompany: "Acme Corp",
    subject: "Introduction to Our Services",
    status: "sent",
    sentAt: "2023-07-10T09:30:00Z",
    source: "lead_list",
    followUpScheduled: false
  },
  {
    id: 2,
    recipient: "sarah.johnson@techsolutions.com",
    recipientCompany: "TechSolutions Inc",
    subject: "Follow-up from our conversation",
    status: "opened",
    sentAt: "2023-07-11T14:45:00Z",
    source: "referral",
    followUpScheduled: true
  },
  {
    id: 3,
    recipient: "michael.lee@globalservices.com",
    recipientCompany: "Global Services",
    subject: "Custom solutions for your business",
    status: "replied",
    sentAt: "2023-07-08T11:15:00Z",
    source: "website",
    followUpScheduled: false
  },
  {
    id: 4,
    recipient: "emily.chen@innovative.com",
    recipientCompany: "Innovative Solutions",
    subject: "Premium offerings - exclusive preview",
    status: "bounced",
    sentAt: "2023-07-12T10:00:00Z",
    source: "linkedin",
    followUpScheduled: false
  },
  {
    id: 5,
    recipient: "david.wilson@strategic.com",
    recipientCompany: "Strategic Partners",
    subject: "Partnership opportunities",
    status: "opened",
    sentAt: "2023-07-09T16:30:00Z",
    source: "networking_event",
    followUpScheduled: true
  }
];

const mockLeadProfiles: LeadProfile[] = [
  {
    id: 1,
    name: "John Smith",
    position: "CTO",
    company: "Acme Corp",
    email: "john.smith@acmecorp.com",
    phone: "+1-555-123-4567",
    source: "website",
    status: "contacted",
    score: 85,
    lastContactedAt: "2023-07-10T09:30:00Z",
    notes: "Interested in our enterprise solution",
    createdAt: "2023-07-01T00:00:00Z",
    interactions: [
      { type: "email", date: "2023-07-05", description: "Introduction email" },
      { type: "call", date: "2023-07-10", description: "Discovery call, 15 minutes" }
    ]
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "Marketing Director",
    company: "TechSolutions Inc",
    email: "sarah.johnson@techsolutions.com",
    source: "referral",
    status: "meeting_scheduled",
    score: 90,
    lastContactedAt: "2023-07-11T14:45:00Z",
    notes: "Referred by David Wilson, high-priority lead",
    createdAt: "2023-07-08T00:00:00Z",
    interactions: [
      { type: "email", date: "2023-07-08", description: "Introduction email" },
      { type: "email", date: "2023-07-10", description: "Follow-up email" },
      { type: "meeting", date: "2023-07-15", description: "Scheduled meeting" }
    ]
  },
  {
    id: 3,
    name: "Michael Lee",
    position: "CEO",
    company: "Global Services",
    email: "michael.lee@globalservices.com",
    phone: "+1-555-987-6543",
    source: "conference",
    status: "new",
    score: 65,
    notes: "Met at Tech Conference 2023",
    createdAt: "2023-07-12T00:00:00Z",
    interactions: []
  },
  {
    id: 4,
    name: "Emily Chen",
    position: "Operations Manager",
    company: "Innovative Solutions",
    email: "emily.chen@innovative.com",
    phone: "+1-555-456-7890",
    source: "linkedin",
    status: "meeting_completed",
    score: 75,
    lastContactedAt: "2023-07-12T10:00:00Z",
    notes: "Looking for cost-effective solutions",
    createdAt: "2023-06-28T00:00:00Z",
    interactions: [
      { type: "email", date: "2023-06-30", description: "Introduction email" },
      { type: "call", date: "2023-07-05", description: "Brief call, scheduled meeting" },
      { type: "meeting", date: "2023-07-12", description: "Initial consultation" }
    ]
  },
  {
    id: 5,
    name: "David Wilson",
    position: "Sales Director",
    company: "Strategic Partners",
    email: "david.wilson@strategic.com",
    source: "networking",
    status: "proposal_sent",
    score: 95,
    lastContactedAt: "2023-07-09T16:30:00Z",
    notes: "Very interested in premium package",
    createdAt: "2023-06-15T00:00:00Z",
    interactions: [
      { type: "email", date: "2023-06-16", description: "Introduction email" },
      { type: "call", date: "2023-06-20", description: "Discovery call" },
      { type: "meeting", date: "2023-06-28", description: "Detailed presentation" },
      { type: "email", date: "2023-07-05", description: "Proposal sent" }
    ]
  }
];

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "Initial Outreach",
    subject: "Introduction to Our Services",
    body: "Dear {{name}},\n\nI hope this email finds you well. I wanted to introduce our company and the services we offer...",
    category: "outreach",
    performanceMetrics: {
      openRate: 0.32,
      responseRate: 0.08,
      usageCount: 145
    },
    createdAt: "2023-05-10T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z"
  },
  {
    id: 2,
    name: "Follow-up After Meeting",
    subject: "Thank You for Your Time",
    body: "Dear {{name}},\n\nThank you for taking the time to meet with us today. I wanted to follow up on some of the key points we discussed...",
    category: "follow_up",
    performanceMetrics: {
      openRate: 0.85,
      responseRate: 0.45,
      usageCount: 78
    },
    createdAt: "2023-05-12T00:00:00Z",
    updatedAt: "2023-06-20T00:00:00Z"
  },
  {
    id: 3,
    name: "Meeting Request",
    subject: "Request for a Brief Meeting",
    body: "Dear {{name}},\n\nI would like to request a brief meeting to discuss how our services might benefit your company...",
    category: "meeting_request",
    performanceMetrics: {
      openRate: 0.45,
      responseRate: 0.28,
      usageCount: 112
    },
    createdAt: "2023-05-18T00:00:00Z",
    updatedAt: "2023-06-25T00:00:00Z"
  },
  {
    id: 4,
    name: "Proposal Follow-up",
    subject: "Following Up on Our Proposal",
    body: "Dear {{name}},\n\nI wanted to follow up regarding the proposal we sent last week. I'd be happy to address any questions...",
    category: "proposal",
    performanceMetrics: {
      openRate: 0.75,
      responseRate: 0.35,
      usageCount: 65
    },
    createdAt: "2023-05-22T00:00:00Z",
    updatedAt: "2023-06-30T00:00:00Z"
  },
  {
    id: 5,
    name: "Thank You for Your Business",
    subject: "Thank You for Choosing Us",
    body: "Dear {{name}},\n\nOn behalf of our entire team, I want to thank you for choosing our company. We're excited to work with you...",
    category: "other",
    performanceMetrics: {
      openRate: 0.90,
      responseRate: 0.12,
      usageCount: 48
    },
    createdAt: "2023-05-25T00:00:00Z",
    updatedAt: "2023-07-05T00:00:00Z"
  }
];

const mockMarketingPlans: MarketingPlan[] = [
  {
    id: 1,
    name: "Q3 Lead Generation Campaign",
    description: "Focused campaign to generate high-quality leads through content marketing and paid advertising",
    startDate: "2023-07-01",
    endDate: "2023-09-30",
    budget: 15000,
    status: "active",
    owner: "Sarah Johnson",
    goals: {
      leads: 150,
      meetings: 45,
      conversions: 15
    },
    channels: [
      { name: "LinkedIn Ads", allocation: 40, expectedReturn: 3.5 },
      { name: "Content Marketing", allocation: 30, expectedReturn: 2.8 },
      { name: "Email Campaigns", allocation: 20, expectedReturn: 4.2 },
      { name: "Partner Referrals", allocation: 10, expectedReturn: 5.0 }
    ],
    tasks: [
      { id: 101, name: "Develop content calendar", status: "completed", dueDate: "2023-06-15", assignee: "Emily Chen" },
      { id: 102, name: "Create LinkedIn ad creatives", status: "completed", dueDate: "2023-06-20", assignee: "Michael Lee" },
      { id: 103, name: "Set up campaign tracking", status: "in_progress", dueDate: "2023-07-05", assignee: "David Wilson" },
      { id: 104, name: "Publish lead magnet ebook", status: "pending", dueDate: "2023-07-15", assignee: "Sarah Johnson" },
      { id: 105, name: "Analyze first month results", status: "pending", dueDate: "2023-08-05", assignee: "John Smith" }
    ]
  },
  {
    id: 2,
    name: "Website Conversion Optimization",
    description: "Improve website conversion rates through A/B testing, UX improvements, and targeted content",
    startDate: "2023-08-01",
    endDate: "2023-10-31",
    budget: 8500,
    status: "planned",
    owner: "Michael Lee",
    goals: {
      leads: 80,
      meetings: 25,
      conversions: 10
    },
    channels: [
      { name: "SEO", allocation: 35, expectedReturn: 3.0 },
      { name: "UX Improvements", allocation: 40, expectedReturn: 2.5 },
      { name: "Content Updates", allocation: 25, expectedReturn: 2.2 }
    ],
    tasks: [
      { id: 201, name: "Conduct UX audit", status: "pending", dueDate: "2023-07-25", assignee: "Emily Chen" },
      { id: 202, name: "Design A/B tests", status: "pending", dueDate: "2023-07-30", assignee: "Sarah Johnson" },
      { id: 203, name: "Implement tracking code", status: "pending", dueDate: "2023-08-05", assignee: "David Wilson" },
      { id: 204, name: "Update landing page content", status: "pending", dueDate: "2023-08-15", assignee: "John Smith" },
      { id: 205, name: "Review initial test results", status: "pending", dueDate: "2023-09-05", assignee: "Michael Lee" }
    ]
  }
];

const mockMarketingTrends = {
  industry_trends: [
    { trend: "AI-powered personalization", impact: "high", adoption_rate: 0.45, relevance_score: 0.85 },
    { trend: "Video content dominance", impact: "high", adoption_rate: 0.75, relevance_score: 0.90 },
    { trend: "Privacy-focused marketing", impact: "medium", adoption_rate: 0.65, relevance_score: 0.75 },
    { trend: "Voice search optimization", impact: "medium", adoption_rate: 0.35, relevance_score: 0.60 },
    { trend: "Social commerce", impact: "high", adoption_rate: 0.55, relevance_score: 0.80 }
  ],
  channel_performance: [
    { channel: "Email", current_performance: 0.8, trend: 0.02, roi: 4.2 },
    { channel: "Social Media", current_performance: 0.75, trend: 0.05, roi: 3.8 },
    { channel: "Content Marketing", current_performance: 0.7, trend: 0.03, roi: 3.0 },
    { channel: "PPC", current_performance: 0.65, trend: -0.01, roi: 2.5 },
    { channel: "SEO", current_performance: 0.85, trend: 0.04, roi: 5.0 }
  ],
  content_engagement: [
    { type: "Blog Posts", engagement_rate: 0.4, conversion_rate: 0.02, trend: 0.01 },
    { type: "Video", engagement_rate: 0.65, conversion_rate: 0.035, trend: 0.08 },
    { type: "Infographics", engagement_rate: 0.55, conversion_rate: 0.025, trend: 0.03 },
    { type: "Webinars", engagement_rate: 0.45, conversion_rate: 0.05, trend: 0.04 },
    { type: "eBooks", engagement_rate: 0.35, conversion_rate: 0.04, trend: -0.01 }
  ]
};

const mockCompetitorInsights = {
  competitors: [
    {
      name: "TechSolutions Inc",
      market_share: 0.28,
      growth_rate: 0.15,
      strengths: ["Strong brand recognition", "Innovative products", "Large marketing budget"],
      weaknesses: ["Higher pricing", "Less personalized service", "Slower customer support"],
      focus_areas: ["Enterprise clients", "AI solutions", "Global expansion"]
    },
    {
      name: "InnovateCorp",
      market_share: 0.18,
      growth_rate: 0.25,
      strengths: ["Cutting-edge technology", "Aggressive pricing", "Strong social media presence"],
      weaknesses: ["Limited product range", "Newer market entrant", "Smaller client base"],
      focus_areas: ["SMB market", "Mobile solutions", "Rapid feature development"]
    },
    {
      name: "GlobalTech Partners",
      market_share: 0.35,
      growth_rate: 0.08,
      strengths: ["Established market leader", "Comprehensive service offerings", "Global presence"],
      weaknesses: ["Slower innovation", "Complex pricing structure", "Legacy systems"],
      focus_areas: ["Enterprise stability", "Industry partnerships", "Service expansion"]
    }
  ],
  opportunity_areas: [
    { area: "Mid-market focus", potential: "high", competition_level: "medium" },
    { area: "Industry-specific solutions", potential: "high", competition_level: "low" },
    { area: "AI-enhanced services", potential: "medium", competition_level: "high" },
    { area: "Customer success focus", potential: "high", competition_level: "low" }
  ],
  differentiation_strategies: [
    { strategy: "Personalized customer experience", effectiveness: 0.85, implementation_difficulty: 0.6 },
    { strategy: "Specialized industry expertise", effectiveness: 0.8, implementation_difficulty: 0.7 },
    { strategy: "Transparent pricing", effectiveness: 0.75, implementation_difficulty: 0.4 },
    { strategy: "Rapid implementation", effectiveness: 0.7, implementation_difficulty: 0.8 }
  ]
};

const mockMeetingTranscriptAnalysis = {
  key_points: [
    "Client expressed interest in the enterprise package",
    "Concerned about implementation timeline",
    "Current provider lacks customer support",
    "Budget approval needed from CFO",
    "Looking for a solution that integrates with their CRM"
  ],
  sentiment: {
    overall: "positive",
    product_interest: 0.85,
    price_sensitivity: 0.65,
    urgency: 0.55
  },
  next_steps: [
    "Send detailed proposal by Friday",
    "Provide case studies for similar implementations",
    "Schedule follow-up call with technical team",
    "Share integration documentation"
  ],
  objections: [
    {
      objection: "Timeline concerns",
      response_suggestion: "Highlight rapid implementation process and dedicated onboarding team"
    },
    {
      objection: "Budget constraints",
      response_suggestion: "Offer phased implementation approach with flexible payment terms"
    }
  ],
  buying_signals: [
    {
      signal: "Asked about contract terms",
      significance: "high",
      follow_up: "Send contract template with highlighted flexible terms"
    },
    {
      signal: "Requested customer references",
      significance: "medium",
      follow_up: "Prepare reference list from same industry"
    }
  ]
};

const mockMarketingMetrics = {
  lead_generation: {
    total_leads: 245,
    qualified_leads: 125,
    conversion_rate: 0.18,
    cost_per_lead: 45,
    trend: 0.12
  },
  campaign_performance: {
    email: {
      open_rate: 0.28,
      click_rate: 0.05,
      conversion_rate: 0.02,
      roi: 3.5
    },
    social: {
      engagement_rate: 0.035,
      click_rate: 0.025,
      conversion_rate: 0.015,
      roi: 2.8
    },
    content: {
      view_rate: 0.15,
      engagement_rate: 0.08,
      conversion_rate: 0.02,
      roi: 4.2
    },
    ppc: {
      click_rate: 0.045,
      conversion_rate: 0.025,
      cost_per_click: 2.35,
      roi: 3.0
    }
  },
  customer_acquisition: {
    cac: 250,
    ltv: 2200,
    ltv_cac_ratio: 8.8,
    avg_sales_cycle: 35
  },
  brand_metrics: {
    website_traffic: 15000,
    social_followers: 8500,
    brand_mentions: 450,
    sentiment_score: 0.75
  }
};

const marketingService = {
  // Campaigns
  getCampaigns: async () => {
    try {
      const response = await apiRequest('/marketing/campaigns', 'get', undefined, []);
      return response;
    } catch (error) {
      console.error('Error fetching marketing campaigns:', error);
      throw error;
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const response = await apiRequest('/marketing/campaigns', 'post', campaignData, {});
      return response;
    } catch (error) {
      console.error('Error creating marketing campaign:', error);
      throw error;
    }
  },
  
  // Meetings
  getMeetings: async () => {
    try {
      // In a real implementation, this would fetch from the database
      return mockMeetings;
    } catch (error) {
      console.error('Error fetching marketing meetings:', error);
      return apiRequest('/marketing/meetings', 'get', undefined, mockMeetings);
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const response = await apiRequest('/marketing/meetings', 'post', meetingData, {});
      return response;
    } catch (error) {
      console.error('Error creating marketing meeting:', error);
      throw error;
    }
  },
  
  // Analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      const response = await apiRequest('/marketing/analytics', 'get', { startDate, endDate }, {});
      return response;
    } catch (error) {
      console.error('Error fetching marketing analytics:', error);
      throw error;
    }
  },
  
  // Email outreach
  getEmailOutreach: async () => {
    try {
      // In a real implementation, this would fetch from the database
      return mockEmailOutreach;
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      return apiRequest('/marketing/email-outreach', 'get', undefined, mockEmailOutreach);
    }
  },
  
  // Leads
  getLeads: async () => {
    try {
      // In a real implementation, this would fetch from the database
      return mockLeadProfiles;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return apiRequest('/marketing/leads', 'get', undefined, mockLeadProfiles);
    }
  },
  
  // Email templates
  getEmailTemplates: async () => {
    try {
      // In a real implementation, this would fetch from the database
      return mockEmailTemplates;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return apiRequest('/marketing/email-templates', 'get', undefined, mockEmailTemplates);
    }
  },
  
  // Marketing plans
  getMarketingPlans: async () => {
    try {
      // In a real implementation, this would fetch from the database
      return mockMarketingPlans;
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      return apiRequest('/marketing/plans', 'get', undefined, mockMarketingPlans);
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      // In a real implementation, this would fetch from the database
      const plan = mockMarketingPlans.find(plan => plan.id === planId);
      return plan || null;
    } catch (error) {
      console.error('Error fetching marketing plan details:', error);
      return apiRequest(`/marketing/plans/${planId}`, 'get', undefined, null);
    }
  },
  
  // Marketing trends
  getMarketingTrends: async () => {
    try {
      // In a real implementation, this would fetch from the database
      return mockMarketingTrends;
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      return apiRequest('/marketing/trends', 'get', undefined, mockMarketingTrends);
    }
  },
  
  // Competitor insights
  getCompetitorInsights: async () => {
    try {
      // In a real implementation, this would fetch from the database
      return mockCompetitorInsights;
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      return apiRequest('/marketing/competitor-insights', 'get', undefined, mockCompetitorInsights);
    }
  },
  
  // Meeting analysis
  analyzeMeetingTranscript: async (transcriptText: string) => {
    try {
      // In a real implementation, this would use NLP services to analyze the transcript
      // For now, return mock data
      return mockMeetingTranscriptAnalysis;
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      return apiRequest('/marketing/analyze-transcript', 'post', { transcript: transcriptText }, mockMeetingTranscriptAnalysis);
    }
  },
  
  // Marketing metrics
  getMarketingMetrics: async () => {
    try {
      // In a real implementation, this would fetch from the database
      return mockMarketingMetrics;
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      return apiRequest('/marketing/metrics', 'get', undefined, mockMarketingMetrics);
    }
  }
};

export default marketingService;
