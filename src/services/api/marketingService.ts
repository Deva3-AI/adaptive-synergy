
import axios from 'axios';
import { toast } from 'sonner';

// Types for Marketing Service
export interface MarketingLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
  source: string;
  notes: string;
  lastContactDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'social' | 'content' | 'event' | 'other';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  roi: number;
  leads: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingMeeting {
  id: string;
  title: string;
  leadId: string;
  leadName: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes: string;
  summary: string;
  actionItems: ActionItem[];
  recordingUrl?: string;
  transcriptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'outreach' | 'follow-up' | 'proposal' | 'newsletter' | 'other';
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketingAnalytics {
  emailStats: {
    sent: number;
    opened: number;
    clicked: number;
    responded: number;
    openRate: number;
    clickRate: number;
    responseRate: number;
  };
  leadStats: {
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    negotiation: number;
    closed: number;
    lost: number;
    conversionRate: number;
  };
  meetingStats: {
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
    completionRate: number;
  };
  campaignPerformance: {
    campaignId: string;
    campaignName: string;
    leads: number;
    conversions: number;
    roi: number;
  }[];
  trends: {
    date: string;
    leads: number;
    meetings: number;
    conversions: number;
  }[];
}

export interface MarketingTrend {
  id: string;
  title: string;
  description: string;
  category: 'industry' | 'competitor' | 'market' | 'technology' | 'consumer';
  impact: 'low' | 'medium' | 'high';
  source: string;
  date: string;
}

export interface MarketingStrategy {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  targetAudience: string[];
  channels: string[];
  tactics: {
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    estimatedImpact: 'low' | 'medium' | 'high';
    timeline: string;
  }[];
  kpis: {
    name: string;
    target: string;
    currentValue: string;
  }[];
  budget: number;
  timeline: {
    startDate: string;
    endDate: string;
    milestones: {
      name: string;
      date: string;
      status: 'pending' | 'in-progress' | 'completed' | 'delayed';
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

// Mock data
const MOCK_MARKETING_LEADS: MarketingLead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Acme Corp',
    email: 'john.smith@acmecorp.com',
    phone: '(555) 123-4567',
    status: 'contacted',
    source: 'BNI Network',
    notes: 'Met at networking event. Interested in web development services.',
    lastContactDate: '2023-09-15T10:30:00',
    createdAt: '2023-09-10T14:25:00',
    updatedAt: '2023-09-15T10:35:00'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Johnson & Partners',
    email: 'sarah@johnsonpartners.com',
    phone: '(555) 987-6543',
    status: 'qualified',
    source: 'Website Contact Form',
    notes: 'Looking for a complete rebrand and website redesign.',
    lastContactDate: '2023-09-18T14:00:00',
    createdAt: '2023-09-17T09:15:00',
    updatedAt: '2023-09-18T14:10:00'
  },
  {
    id: '3',
    name: 'Michael Chen',
    company: 'InnoTech Solutions',
    email: 'mchen@innotech.com',
    phone: '(555) 456-7890',
    status: 'proposal',
    source: 'LinkedIn',
    notes: 'Needs help with digital marketing strategy. Budget: $10K-15K.',
    lastContactDate: '2023-09-20T11:30:00',
    createdAt: '2023-09-12T13:45:00',
    updatedAt: '2023-09-20T11:40:00'
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    company: 'Bright Ideas Marketing',
    email: 'emily@brightideas.com',
    phone: '(555) 234-5678',
    status: 'negotiation',
    source: 'Master Networks',
    notes: 'Discussing partnership opportunities for client referrals.',
    lastContactDate: '2023-09-22T15:30:00',
    createdAt: '2023-09-05T10:00:00',
    updatedAt: '2023-09-22T15:45:00'
  },
  {
    id: '5',
    name: 'David Wilson',
    company: 'Wilson Enterprises',
    email: 'david@wilsonent.com',
    phone: '(555) 345-6789',
    status: 'new',
    source: 'Referral',
    notes: 'Referred by Sarah Johnson. Needs e-commerce website.',
    lastContactDate: '',
    createdAt: '2023-09-23T09:30:00',
    updatedAt: '2023-09-23T09:30:00'
  }
];

const MOCK_MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: '1',
    name: 'Fall 2023 Email Outreach',
    description: 'Targeted email campaign to past clients and warm leads',
    status: 'active',
    type: 'email',
    startDate: '2023-09-01',
    endDate: '2023-10-31',
    budget: 2500,
    spent: 1200,
    roi: 2.4,
    leads: 15,
    conversions: 3,
    createdAt: '2023-08-15T10:00:00',
    updatedAt: '2023-09-22T14:30:00'
  },
  {
    id: '2',
    name: 'LinkedIn Thought Leadership',
    description: 'Regular posts and articles demonstrating expertise',
    status: 'active',
    type: 'social',
    startDate: '2023-08-15',
    endDate: '2023-12-15',
    budget: 1000,
    spent: 450,
    roi: 3.1,
    leads: 8,
    conversions: 2,
    createdAt: '2023-08-01T09:15:00',
    updatedAt: '2023-09-21T11:20:00'
  },
  {
    id: '3',
    name: 'Local Business Networking',
    description: 'BNI and Chamber of Commerce event attendance',
    status: 'active',
    type: 'event',
    startDate: '2023-09-01',
    endDate: '2023-11-30',
    budget: 1500,
    spent: 600,
    roi: 1.8,
    leads: 12,
    conversions: 1,
    createdAt: '2023-08-20T14:30:00',
    updatedAt: '2023-09-23T09:45:00'
  },
  {
    id: '4',
    name: 'Website SEO Optimization',
    description: 'Improving search rankings for key services',
    status: 'draft',
    type: 'content',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    budget: 3000,
    spent: 0,
    roi: 0,
    leads: 0,
    conversions: 0,
    createdAt: '2023-09-15T13:20:00',
    updatedAt: '2023-09-15T13:20:00'
  }
];

const MOCK_MARKETING_MEETINGS: MarketingMeeting[] = [
  {
    id: '1',
    title: 'Initial Consultation',
    leadId: '3',
    leadName: 'Michael Chen',
    date: '2023-09-20',
    time: '11:30:00',
    duration: 60,
    status: 'completed',
    notes: 'Discussed digital marketing needs for Q4 2023',
    summary: 'Client needs complete digital marketing strategy including social media, content, and email marketing. Budget of $10K-15K for Q4.',
    actionItems: [
      {
        id: '1a',
        description: 'Send proposal with detailed scope and pricing',
        assignedTo: 'John Doe',
        dueDate: '2023-09-25',
        status: 'pending'
      },
      {
        id: '1b',
        description: 'Share case studies of similar clients',
        assignedTo: 'Jane Smith',
        dueDate: '2023-09-22',
        status: 'completed'
      }
    ],
    recordingUrl: 'https://example.com/recordings/meeting1',
    transcriptUrl: 'https://example.com/transcripts/meeting1',
    createdAt: '2023-09-19T10:15:00',
    updatedAt: '2023-09-20T12:45:00'
  },
  {
    id: '2',
    title: 'Project Kickoff',
    leadId: '4',
    leadName: 'Emily Rodriguez',
    date: '2023-09-22',
    time: '15:30:00',
    duration: 45,
    status: 'completed',
    notes: 'Discussed partnership terms and referral process',
    summary: 'Agreed to establish formal referral partnership. They will refer web design clients, we refer marketing clients. 10% commission on projects that convert.',
    actionItems: [
      {
        id: '2a',
        description: 'Draft partnership agreement',
        assignedTo: 'John Doe',
        dueDate: '2023-09-29',
        status: 'in-progress'
      },
      {
        id: '2b',
        description: 'Create shared resource folder',
        assignedTo: 'Jane Smith',
        dueDate: '2023-09-26',
        status: 'pending'
      }
    ],
    recordingUrl: 'https://example.com/recordings/meeting2',
    transcriptUrl: 'https://example.com/transcripts/meeting2',
    createdAt: '2023-09-21T09:30:00',
    updatedAt: '2023-09-22T16:15:00'
  },
  {
    id: '3',
    title: 'Discovery Call',
    leadId: '5',
    leadName: 'David Wilson',
    date: '2023-09-25',
    time: '10:00:00',
    duration: 30,
    status: 'scheduled',
    notes: 'Initial call to discuss e-commerce website needs',
    summary: '',
    actionItems: [],
    createdAt: '2023-09-23T10:15:00',
    updatedAt: '2023-09-23T10:15:00'
  }
];

const MOCK_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: 'Initial Outreach',
    subject: 'Let\'s connect about your {{business_type}} business',
    body: 'Hi {{first_name}},\n\nI hope this email finds you well. I recently came across {{company_name}} and was impressed by your work in the {{industry}} industry.\n\nOur team at Hive specializes in helping businesses like yours with digital growth and streamlined operations.\n\nWould you be open to a quick 15-minute call to explore if we might be a good fit to work together?\n\nBest regards,\n{{sender_name}}',
    category: 'outreach',
    variables: ['first_name', 'company_name', 'business_type', 'industry', 'sender_name'],
    createdAt: '2023-08-10T09:00:00',
    updatedAt: '2023-09-05T14:30:00'
  },
  {
    id: '2',
    name: 'Meeting Follow-up',
    subject: 'Thank you for our conversation about {{topic}}',
    body: 'Hi {{first_name}},\n\nThank you for taking the time to meet with me today. I enjoyed learning more about {{company_name}} and your goals for the upcoming {{timeframe}}.\n\nAs promised, I\'ve attached {{attachment_description}} for your review.\n\nPlease let me know if you have any questions or need additional information. I look forward to our next steps.\n\nBest regards,\n{{sender_name}}',
    category: 'follow-up',
    variables: ['first_name', 'company_name', 'topic', 'timeframe', 'attachment_description', 'sender_name'],
    createdAt: '2023-08-15T10:30:00',
    updatedAt: '2023-09-10T11:45:00'
  },
  {
    id: '3',
    name: 'Proposal Delivery',
    subject: 'Your custom proposal for {{project_type}}',
    body: 'Hi {{first_name}},\n\nI\'m excited to share our proposal for your {{project_type}} project at {{company_name}}.\n\nThe attached document outlines our understanding of your requirements, our proposed approach, timeline, and investment.\n\nI\'d be happy to schedule a call to walk through the details and answer any questions you might have.\n\nLooking forward to your feedback.\n\nBest regards,\n{{sender_name}}',
    category: 'proposal',
    variables: ['first_name', 'company_name', 'project_type', 'sender_name'],
    createdAt: '2023-08-20T13:15:00',
    updatedAt: '2023-09-15T16:20:00'
  }
];

const MOCK_MARKETING_ANALYTICS: MarketingAnalytics = {
  emailStats: {
    sent: 250,
    opened: 125,
    clicked: 50,
    responded: 20,
    openRate: 50,
    clickRate: 40,
    responseRate: 16
  },
  leadStats: {
    new: 35,
    contacted: 28,
    qualified: 20,
    proposal: 15,
    negotiation: 8,
    closed: 5,
    lost: 10,
    conversionRate: 14.3
  },
  meetingStats: {
    scheduled: 30,
    completed: 25,
    cancelled: 3,
    noShow: 2,
    completionRate: 83.3
  },
  campaignPerformance: [
    {
      campaignId: '1',
      campaignName: 'Fall 2023 Email Outreach',
      leads: 15,
      conversions: 3,
      roi: 2.4
    },
    {
      campaignId: '2',
      campaignName: 'LinkedIn Thought Leadership',
      leads: 8,
      conversions: 2,
      roi: 3.1
    },
    {
      campaignId: '3',
      campaignName: 'Local Business Networking',
      leads: 12,
      conversions: 1,
      roi: 1.8
    }
  ],
  trends: [
    { date: '2023-07-01', leads: 8, meetings: 5, conversions: 1 },
    { date: '2023-08-01', leads: 12, meetings: 8, conversions: 2 },
    { date: '2023-09-01', leads: 15, meetings: 12, conversions: 3 }
  ]
};

const MOCK_MARKETING_TRENDS: MarketingTrend[] = [
  {
    id: '1',
    title: 'AI-Powered Content Creation',
    description: 'Businesses are increasingly using AI tools to generate and optimize marketing content, reducing costs and improving personalization.',
    category: 'technology',
    impact: 'high',
    source: 'Industry Report',
    date: '2023-09-10'
  },
  {
    id: '2',
    title: 'Video Marketing Dominance',
    description: 'Short-form video content continues to see the highest engagement rates across platforms, with businesses investing more in this format.',
    category: 'industry',
    impact: 'high',
    source: 'Market Analysis',
    date: '2023-09-05'
  },
  {
    id: '3',
    title: 'Competitor X New Service Launch',
    description: 'Competitor X has launched a new service bundle combining web design and ongoing marketing support for a monthly subscription.',
    category: 'competitor',
    impact: 'medium',
    source: 'Competitor Website',
    date: '2023-09-15'
  },
  {
    id: '4',
    title: 'Privacy-First Marketing',
    description: 'With increased privacy regulations and cookie deprecation, businesses are shifting to first-party data collection and contextual targeting.',
    category: 'market',
    impact: 'medium',
    source: 'Industry News',
    date: '2023-08-28'
  }
];

const MOCK_MARKETING_STRATEGY: MarketingStrategy = {
  id: '1',
  title: 'Q4 2023 Growth Strategy',
  description: 'Comprehensive marketing strategy to drive lead generation and conversions for Q4 2023.',
  objectives: [
    'Increase qualified leads by 25%',
    'Improve conversion rate to 20%',
    'Establish thought leadership in key service areas',
    'Expand network of strategic partnerships'
  ],
  targetAudience: [
    'Small to medium businesses (10-100 employees)',
    'Professional service firms',
    'E-commerce businesses',
    'Local businesses in Greater Portland area'
  ],
  channels: [
    'Email marketing',
    'LinkedIn',
    'Networking events',
    'Content marketing',
    'Strategic partnerships'
  ],
  tactics: [
    {
      name: 'Targeted Email Campaign',
      description: 'Two-phase email campaign to warm leads and past clients highlighting end-of-year services.',
      priority: 'high',
      estimatedImpact: 'high',
      timeline: '10/1 - 11/30'
    },
    {
      name: 'LinkedIn Thought Leadership',
      description: 'Weekly articles and posts demonstrating expertise and sharing insights.',
      priority: 'medium',
      estimatedImpact: 'medium',
      timeline: '10/1 - 12/31'
    },
    {
      name: 'Case Study Development',
      description: 'Create 3 detailed case studies highlighting recent successful projects.',
      priority: 'medium',
      estimatedImpact: 'medium',
      timeline: '10/1 - 10/31'
    },
    {
      name: 'Networking Event Attendance',
      description: 'Attend at least 6 industry and local business networking events.',
      priority: 'high',
      estimatedImpact: 'high',
      timeline: '10/1 - 12/31'
    }
  ],
  kpis: [
    {
      name: 'New qualified leads',
      target: '25',
      currentValue: '0'
    },
    {
      name: 'Conversion rate',
      target: '20%',
      currentValue: '14.3%'
    },
    {
      name: 'New partnerships',
      target: '3',
      currentValue: '0'
    }
  ],
  budget: 7500,
  timeline: {
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    milestones: [
      {
        name: 'Strategy finalization',
        date: '2023-09-30',
        status: 'in-progress'
      },
      {
        name: 'Email campaign launch',
        date: '2023-10-05',
        status: 'pending'
      },
      {
        name: 'Case studies published',
        date: '2023-10-31',
        status: 'pending'
      },
      {
        name: 'Mid-quarter review',
        date: '2023-11-15',
        status: 'pending'
      }
    ]
  },
  createdAt: '2023-09-15T10:00:00',
  updatedAt: '2023-09-22T14:30:00'
};

// API functions
export const getMarketingLeads = async (): Promise<MarketingLead[]> => {
  try {
    // This would normally be an API call
    // const response = await axios.get('/api/marketing/leads');
    // return response.data;
    
    // Using mock data for development
    return MOCK_MARKETING_LEADS;
  } catch (error) {
    console.error('Error fetching marketing leads:', error);
    toast.error('Failed to fetch marketing leads');
    return [];
  }
};

export const getMarketingCampaigns = async (): Promise<MarketingCampaign[]> => {
  try {
    // This would normally be an API call
    // const response = await axios.get('/api/marketing/campaigns');
    // return response.data;
    
    // Using mock data for development
    return MOCK_MARKETING_CAMPAIGNS;
  } catch (error) {
    console.error('Error fetching marketing campaigns:', error);
    toast.error('Failed to fetch marketing campaigns');
    return [];
  }
};

export const getMarketingMeetings = async (): Promise<MarketingMeeting[]> => {
  try {
    // This would normally be an API call
    // const response = await axios.get('/api/marketing/meetings');
    // return response.data;
    
    // Using mock data for development
    return MOCK_MARKETING_MEETINGS;
  } catch (error) {
    console.error('Error fetching marketing meetings:', error);
    toast.error('Failed to fetch marketing meetings');
    return [];
  }
};

export const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
  try {
    // This would normally be an API call
    // const response = await axios.get('/api/marketing/email-templates');
    // return response.data;
    
    // Using mock data for development
    return MOCK_EMAIL_TEMPLATES;
  } catch (error) {
    console.error('Error fetching email templates:', error);
    toast.error('Failed to fetch email templates');
    return [];
  }
};

export const getMarketingAnalytics = async (): Promise<MarketingAnalytics> => {
  try {
    // This would normally be an API call
    // const response = await axios.get('/api/marketing/analytics');
    // return response.data;
    
    // Using mock data for development
    return MOCK_MARKETING_ANALYTICS;
  } catch (error) {
    console.error('Error fetching marketing analytics:', error);
    toast.error('Failed to fetch marketing analytics');
    return {
      emailStats: { sent: 0, opened: 0, clicked: 0, responded: 0, openRate: 0, clickRate: 0, responseRate: 0 },
      leadStats: { new: 0, contacted: 0, qualified: 0, proposal: 0, negotiation: 0, closed: 0, lost: 0, conversionRate: 0 },
      meetingStats: { scheduled: 0, completed: 0, cancelled: 0, noShow: 0, completionRate: 0 },
      campaignPerformance: [],
      trends: []
    };
  }
};

export const getMarketingTrends = async (): Promise<MarketingTrend[]> => {
  try {
    // This would normally be an API call
    // const response = await axios.get('/api/marketing/trends');
    // return response.data;
    
    // Using mock data for development
    return MOCK_MARKETING_TRENDS;
  } catch (error) {
    console.error('Error fetching marketing trends:', error);
    toast.error('Failed to fetch marketing trends');
    return [];
  }
};

export const getMarketingStrategy = async (): Promise<MarketingStrategy> => {
  try {
    // This would normally be an API call
    // const response = await axios.get('/api/marketing/strategy');
    // return response.data;
    
    // Using mock data for development
    return MOCK_MARKETING_STRATEGY;
  } catch (error) {
    console.error('Error fetching marketing strategy:', error);
    toast.error('Failed to fetch marketing strategy');
    return {
      id: '',
      title: '',
      description: '',
      objectives: [],
      targetAudience: [],
      channels: [],
      tactics: [],
      kpis: [],
      budget: 0,
      timeline: {
        startDate: '',
        endDate: '',
        milestones: []
      },
      createdAt: '',
      updatedAt: ''
    };
  }
};
