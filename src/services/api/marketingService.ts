import apiClient from '@/utils/apiUtils';
import { EmailTemplate, EmailOutreach, MarketingMeeting, LeadProfile, MarketingTrend, CompetitorInsight } from '@/interfaces/marketing';

// Mock data
const MOCK_EMAIL_TEMPLATES = [
  {
    id: 1,
    name: 'Initial Outreach',
    subject: 'Interesting collaboration opportunity with {{company}}',
    content: '<p>Hello {{name}},</p><p>I hope this email finds you well. I came across {{company}} and was impressed by your work in {{industry}}...</p>',
    category: 'outreach',
    tags: ['initial', 'cold'],
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-05-10T14:45:00Z',
    variables: ['name', 'company', 'industry'],
    performanceMetrics: {
      openRate: 62,
      clickRate: 18,
      replyRate: 12,
      conversionRate: 5
    }
  },
  {
    id: 2,
    name: 'Follow-up Template',
    subject: 'Following up on our conversation, {{name}}',
    content: '<p>Hi {{name}},</p><p>I wanted to touch base following our conversation about {{topic}}...</p>',
    category: 'follow-up',
    tags: ['follow-up', 'meeting'],
    createdAt: '2023-04-20T11:15:00Z',
    updatedAt: '2023-05-12T09:30:00Z',
    variables: ['name', 'topic', 'date'],
    performanceMetrics: {
      openRate: 75,
      clickRate: 25,
      replyRate: 35,
      conversionRate: 15
    }
  }
];

const MOCK_EMAIL_OUTREACH = [
  {
    id: 1,
    recipient: 'john.doe@example.com',
    recipientCompany: 'Acme Corp',
    subject: 'Collaboration opportunity with Acme Corp',
    status: 'sent',
    sentAt: '2023-05-15T10:30:00Z',
    source: 'LinkedIn',
    followUpScheduled: true
  },
  {
    id: 2,
    recipient: 'jane.smith@techfirm.com',
    recipientCompany: 'Tech Firm Inc',
    subject: 'Partnership opportunity with Tech Firm',
    status: 'opened',
    sentAt: '2023-05-16T09:15:00Z',
    source: 'Website Form',
    followUpScheduled: false
  }
];

const MOCK_LEADS = [
  {
    id: 1,
    name: 'John Doe',
    company: 'Acme Corp',
    position: 'Marketing Director',
    email: 'john.doe@acme.com',
    phone: '+1 212-555-1234',
    status: 'Qualified',
    source: 'LinkedIn',
    score: 85,
    last_contact: '2023-05-10T14:30:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    company: 'Tech Innovations',
    position: 'CEO',
    email: 'jane.smith@techinno.com',
    phone: '+1 415-555-6789',
    status: 'Nurturing',
    source: 'Website',
    score: 65,
    last_contact: '2023-05-12T10:15:00Z'
  }
];

const MOCK_MARKETING_TRENDS = [
  {
    id: 1,
    title: 'AI-Driven Content Creation',
    description: 'Companies are increasingly using AI to generate and optimize marketing content.',
    relevance_score: 85,
    category: 'Content Marketing',
    source: 'Industry Report',
    discoveredAt: '2023-05-01T00:00:00Z',
    actionable: true,
    suggestedActions: ['Evaluate AI content tools', 'Test AI content against human-created content']
  },
  {
    id: 2,
    title: 'Video Content Dominance',
    description: 'Short-form video content continues to show highest engagement rates across platforms.',
    relevance_score: 90,
    category: 'Social Media',
    source: 'Platform Analytics',
    discoveredAt: '2023-05-05T00:00:00Z',
    actionable: true,
    suggestedActions: ['Develop short-form video strategy', 'Allocate resources for video production']
  }
];

const MOCK_COMPETITOR_INSIGHTS = [
  {
    id: 1,
    competitor_name: 'Digital Solutions Inc',
    description: 'Launched new AI-powered analytics dashboard',
    impact: 'medium',
    type: 'product',
    discoveredAt: '2023-05-10T00:00:00Z',
    source: 'Company Blog',
    suggestedResponse: 'Evaluate our analytics offerings and identify improvement opportunities'
  },
  {
    id: 2,
    competitor_name: 'WebTech Services',
    description: 'Reduced prices by 15% for enterprise clients',
    impact: 'high',
    type: 'pricing',
    discoveredAt: '2023-05-12T00:00:00Z',
    source: 'Client Feedback',
    suggestedResponse: 'Review our enterprise pricing strategy and value propositions'
  }
];

const marketingService = {
  // Existing methods
  getCampaigns: async () => {
    try {
      const response = await apiClient.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Get campaigns error:', error);
      throw error;
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const response = await apiClient.post('/marketing/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Create campaign error:', error);
      throw error;
    }
  },
  
  getMeetings: async () => {
    try {
      const response = await apiClient.get('/marketing/meetings');
      return response.data;
    } catch (error) {
      console.error('Get meetings error:', error);
      throw error;
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const response = await apiClient.post('/marketing/meetings', meetingData);
      return response.data;
    } catch (error) {
      console.error('Create meeting error:', error);
      throw error;
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
      console.error('Get analytics error:', error);
      throw error;
    }
  },

  // New methods to resolve TypeScript errors
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    // This would normally call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_EMAIL_TEMPLATES);
      }, 500);
    });
  },

  getEmailOutreach: async (): Promise<EmailOutreach[]> => {
    // This would normally call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_EMAIL_OUTREACH);
      }, 500);
    });
  },

  getLeads: async (): Promise<LeadProfile[]> => {
    // This would normally call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_LEADS);
      }, 500);
    });
  },

  getMarketingMetrics: async () => {
    // This would normally call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          emailMetrics: {
            sent: 250,
            opened: 150,
            clicked: 75,
            replied: 40,
            openRate: 60,
            clickRate: 30,
            replyRate: 16
          },
          leadMetrics: {
            total: 85,
            new: 15,
            qualified: 45,
            converted: 12,
            conversionRate: 14.1
          },
          socialMetrics: {
            followers: {
              linkedin: 3500,
              twitter: 2200,
              instagram: 1800
            },
            engagement: {
              linkedin: 3.5,
              twitter: 2.1,
              instagram: 4.2
            },
            growth: {
              linkedin: 5.2,
              twitter: 3.1,
              instagram: 6.5
            }
          }
        });
      }, 500);
    });
  },

  getMarketingTrends: async (): Promise<MarketingTrend[]> => {
    // This would normally call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_MARKETING_TRENDS);
      }, 500);
    });
  },

  getCompetitorInsights: async (): Promise<CompetitorInsight[]> => {
    // This would normally call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_COMPETITOR_INSIGHTS);
      }, 500);
    });
  },

  analyzeMeetingTranscript: async (transcriptText: string) => {
    // This would normally send the transcript to an API for analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          summary: "Client expressed interest in our web development services. They're planning to redesign their corporate website in Q3 and need help with UX/UI design and development.",
          keyPoints: [
            "Website redesign needed by October",
            "Budget is around $30,000-40,000",
            "Primary concerns are mobile responsiveness and performance",
            "Current website is 5 years old and built on WordPress"
          ],
          sentimentAnalysis: {
            overall: "positive",
            score: 0.78,
            details: {
              aboutProduct: "interested",
              aboutPricing: "neutral",
              aboutTimeline: "concerned"
            }
          },
          actionItems: [
            "Send proposal by end of week",
            "Share portfolio of similar projects",
            "Schedule follow-up call with technical team",
            "Prepare timeline and resource allocation plan"
          ]
        });
      }, 1000);
    });
  },

  getMarketingPlans: async () => {
    // This would normally call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          plans: [
            {
              id: 1,
              title: "Q3 Content Marketing Strategy",
              description: "Comprehensive content strategy focusing on thought leadership and lead generation",
              status: "active",
              startDate: "2023-07-01",
              endDate: "2023-09-30",
              goals: [
                { name: "Increase website traffic", target: "30% growth", current: "15% growth" },
                { name: "Generate leads", target: "50 qualified leads", current: "20 qualified leads" },
                { name: "Improve engagement", target: "4min avg. time on page", current: "2.5min avg. time on page" }
              ],
              tactics: [
                { name: "Weekly blog posts", status: "on track" },
                { name: "Monthly whitepapers", status: "behind" },
                { name: "Bi-weekly webinars", status: "on track" }
              ],
              budget: {
                allocated: 15000,
                spent: 6500,
                remaining: 8500
              }
            },
            {
              id: 2,
              title: "Social Media Growth Initiative",
              description: "Targeted campaign to expand social media presence and engagement",
              status: "planning",
              startDate: "2023-08-01",
              endDate: "2023-10-31",
              goals: [
                { name: "Increase followers", target: "25% growth", current: "0% growth" },
                { name: "Improve engagement rate", target: "5% engagement", current: "2.8% engagement" },
                { name: "Drive website traffic", target: "500 visits/month", current: "320 visits/month" }
              ],
              tactics: [
                { name: "Daily posts across platforms", status: "planning" },
                { name: "Influencer partnerships", status: "planning" },
                { name: "Paid promotion campaign", status: "planning" }
              ],
              budget: {
                allocated: 12000,
                spent: 0,
                remaining: 12000
              }
            }
          ]
        });
      }, 500);
    });
  },

  getMarketingPlanById: async (planId: number) => {
    // This would normally call an API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 1,
          title: "Q3 Content Marketing Strategy",
          description: "Comprehensive content strategy focusing on thought leadership and lead generation",
          status: "active",
          startDate: "2023-07-01",
          endDate: "2023-09-30",
          goals: [
            { id: 1, name: "Increase website traffic", target: "30% growth", current: "15% growth" },
            { id: 2, name: "Generate leads", target: "50 qualified leads", current: "20 qualified leads" },
            { id: 3, name: "Improve engagement", target: "4min avg. time on page", current: "2.5min avg. time on page" }
          ],
          tactics: [
            { id: 1, name: "Weekly blog posts", status: "on track", owner: "Content Team", notes: "Topics planned through August" },
            { id: 2, name: "Monthly whitepapers", status: "behind", owner: "Research Team", notes: "Delayed due to research requirements" },
            { id: 3, name: "Bi-weekly webinars", status: "on track", owner: "Marketing Team", notes: "First two webinars scheduled" }
          ],
          budget: {
            allocated: 15000,
            spent: 6500,
            remaining: 8500,
            breakdown: [
              { category: "Content creation", amount: 4000 },
              { category: "Design", amount: 1500 },
              { category: "Promotion", amount: 1000 }
            ]
          },
          timeline: [
            { phase: "Planning", startDate: "2023-06-01", endDate: "2023-06-30", completion: 100 },
            { phase: "Implementation", startDate: "2023-07-01", endDate: "2023-09-15", completion: 25 },
            { phase: "Evaluation", startDate: "2023-09-16", endDate: "2023-09-30", completion: 0 }
          ],
          kpis: [
            { name: "Blog traffic", target: 10000, current: 4500, trend: "increasing" },
            { name: "Whitepaper downloads", target: 500, current: 150, trend: "stable" },
            { name: "Webinar registrations", target: 300, current: 120, trend: "increasing" },
            { name: "New leads", target: 50, current: 20, trend: "increasing" }
          ]
        });
      }, 500);
    });
  }
};

export default marketingService;
