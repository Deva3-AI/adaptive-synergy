
import { 
  EmailTemplate, 
  EmailOutreach, 
  MarketingMeeting, 
  LeadProfile,
  MarketingTrend,
  CompetitorInsight
} from '@/interfaces/marketing';
import { supabase } from '@/integrations/supabase/client';

const marketingService = {
  getCampaigns: async () => {
    try {
      // Mock implementation
      return [
        {
          id: 1,
          name: 'Summer Promotion',
          status: 'active',
          start_date: '2023-06-01',
          end_date: '2023-08-31',
          budget: 12000,
          spent: 7500,
          metrics: {
            impressions: 125000,
            clicks: 4200,
            conversions: 145
          }
        },
        {
          id: 2,
          name: 'New Product Launch',
          status: 'planning',
          start_date: '2023-09-15',
          end_date: '2023-11-15',
          budget: 20000,
          spent: 0,
          metrics: null
        }
      ];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      // Mock implementation
      return {
        id: 3,
        ...campaignData,
        status: 'planning',
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },
  
  getMeetings: async (): Promise<MarketingMeeting[]> => {
    try {
      // Mock implementation
      return [
        {
          id: 1,
          leadName: 'John Smith',
          leadCompany: 'Acme Corp',
          status: 'scheduled',
          scheduledTime: '2023-07-15T14:00:00Z',
          duration: 60,
          platform: 'google_meet',
          notes: 'Discuss website redesign proposal'
        },
        {
          id: 2,
          leadName: 'Sarah Johnson',
          leadCompany: 'Tech Innovations',
          status: 'completed',
          scheduledTime: '2023-07-10T11:00:00Z',
          duration: 45,
          platform: 'zoom',
          notes: 'Initial project scoping'
        },
        {
          id: 3,
          leadName: 'Michael Brown',
          leadCompany: 'Global Solutions',
          status: 'cancelled',
          scheduledTime: '2023-07-08T09:30:00Z',
          duration: 30,
          platform: 'teams',
          notes: 'Reschedule for next week'
        }
      ];
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      // Mock implementation
      return {
        id: 4,
        ...meetingData,
        created_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },
  
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // Mock implementation
      return {
        website_traffic: {
          total_visits: 28500,
          unique_visitors: 15200,
          avg_session_duration: 185,
          bounce_rate: 42.3,
          top_pages: [
            { path: '/', visits: 12500 },
            { path: '/services', visits: 8200 },
            { path: '/contact', visits: 3800 }
          ]
        },
        social_media: {
          followers: {
            twitter: 8500,
            linkedin: 12000,
            instagram: 5200
          },
          engagement: {
            twitter: 3.2,
            linkedin: 4.8,
            instagram: 5.1
          },
          top_posts: [
            {
              platform: 'linkedin',
              content: 'Case study: How we helped Client X increase conversions by 45%',
              engagement: 285,
              date: '2023-06-28'
            }
          ]
        },
        conversions: {
          total: 325,
          by_source: [
            { source: 'organic', count: 120 },
            { source: 'paid', count: 95 },
            { source: 'referral', count: 65 },
            { source: 'direct', count: 45 }
          ],
          conversion_rate: 3.8
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
  
  // Add missing methods
  
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      // Mock implementation
      return [
        {
          id: 1,
          name: 'Initial Outreach',
          subject: 'Elevate your digital presence with our services',
          content: 'Hello {{name}},\n\nI hope this email finds you well...',
          category: 'cold_outreach',
          tags: ['introduction', 'services'],
          createdAt: '2023-05-15T10:30:00Z',
          updatedAt: '2023-06-20T14:15:00Z',
          performanceMetrics: {
            openRate: 28.5,
            clickRate: 12.3,
            replyRate: 8.7,
            conversionRate: 2.4
          }
        },
        {
          id: 2,
          name: 'Follow-up After Meeting',
          subject: 'Next steps after our conversation',
          content: 'Hi {{name}},\n\nThank you for taking the time to speak with me today...',
          category: 'follow_up',
          tags: ['meeting', 'next_steps'],
          createdAt: '2023-04-10T09:45:00Z',
          updatedAt: '2023-06-15T11:20:00Z',
          performanceMetrics: {
            openRate: 62.8,
            clickRate: 35.1,
            replyRate: 41.2,
            conversionRate: 15.7
          }
        },
        {
          id: 3,
          name: 'Proposal Submission',
          subject: 'Your custom proposal from HyperFlow',
          content: 'Dear {{name}},\n\nBased on our recent discussions, I'm pleased to present our proposal...',
          category: 'proposal',
          tags: ['formal', 'proposal', 'services'],
          createdAt: '2023-05-22T13:15:00Z',
          updatedAt: '2023-06-18T16:30:00Z',
          performanceMetrics: {
            openRate: 85.1,
            clickRate: 72.4,
            replyRate: 65.3,
            conversionRate: 38.2
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      throw error;
    }
  },
  
  getEmailOutreach: async (): Promise<EmailOutreach[]> => {
    try {
      // Mock implementation
      return [
        {
          id: 1,
          recipient: 'john.doe@example.com',
          recipientCompany: 'Example Corp',
          subject: 'Elevate your digital presence with our services',
          status: 'sent',
          sentAt: '2023-07-10T09:30:00Z',
          source: 'linkedin_connection',
          followUpScheduled: false
        },
        {
          id: 2,
          recipient: 'sarah.smith@techfirm.com',
          recipientCompany: 'Tech Firm Inc',
          subject: 'Elevate your digital presence with our services',
          status: 'opened',
          sentAt: '2023-07-10T09:45:00Z',
          source: 'website_lead',
          followUpScheduled: true
        },
        {
          id: 3,
          recipient: 'michael.johnson@bigco.com',
          recipientCompany: 'Big Company LLC',
          subject: 'Your custom proposal from HyperFlow',
          status: 'replied',
          sentAt: '2023-07-09T14:15:00Z',
          source: 'referral',
          followUpScheduled: false
        },
        {
          id: 4,
          recipient: 'david.wilson@startup.io',
          recipientCompany: 'Startup.io',
          subject: 'Next steps after our conversation',
          status: 'bounced',
          sentAt: '2023-07-09T11:20:00Z',
          source: 'cold_email',
          followUpScheduled: false
        }
      ];
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      throw error;
    }
  },
  
  getLeads: async (): Promise<LeadProfile[]> => {
    try {
      // Mock implementation
      return [
        {
          id: 1,
          name: 'John Doe',
          company: 'Example Corp',
          position: 'Marketing Director',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          status: 'new',
          source: 'Website Form',
          score: 85,
          last_contact: '2023-07-10T09:30:00Z'
        },
        {
          id: 2,
          name: 'Sarah Smith',
          company: 'Tech Firm Inc',
          position: 'CEO',
          email: 'sarah.smith@techfirm.com',
          phone: '+1 (555) 234-5678',
          status: 'contacted',
          source: 'LinkedIn',
          score: 72,
          last_contact: '2023-07-08T14:15:00Z'
        },
        {
          id: 3,
          name: 'Michael Johnson',
          company: 'Big Company LLC',
          position: 'IT Director',
          email: 'michael.johnson@bigco.com',
          phone: '+1 (555) 345-6789',
          status: 'meeting_scheduled',
          source: 'Referral',
          score: 91,
          last_contact: '2023-07-05T11:45:00Z'
        },
        {
          id: 4,
          name: 'Emily Davis',
          company: 'Growth Startup',
          position: 'Operations Manager',
          email: 'emily.davis@growth.co',
          status: 'meeting_completed',
          source: 'Conference',
          score: 68,
          last_contact: '2023-07-01T10:00:00Z'
        },
        {
          id: 5,
          name: 'David Wilson',
          company: 'Startup.io',
          position: 'Founder',
          email: 'david.wilson@startup.io',
          phone: '+1 (555) 456-7890',
          status: 'proposal_sent',
          source: 'Cold Email',
          score: 76,
          last_contact: '2023-06-28T15:30:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  },
  
  getMarketingMetrics: async () => {
    try {
      // Mock implementation
      return {
        campaign_performance: {
          active_campaigns: 3,
          total_budget: 45000,
          spent: 28750,
          roi: 2.8,
          best_performing: 'Summer Promotion'
        },
        lead_metrics: {
          new_leads: 128,
          qualified_leads: 68,
          conversion_rate: 18.5,
          avg_acquisition_cost: 125
        },
        content_performance: {
          blog_visits: 8500,
          social_engagement: 1250,
          email_open_rate: 32.4,
          downloads: 345
        },
        channel_effectiveness: [
          { channel: 'Organic Search', effectiveness: 85, trend: 'up' },
          { channel: 'Social Media', effectiveness: 72, trend: 'up' },
          { channel: 'Email', effectiveness: 68, trend: 'stable' },
          { channel: 'Paid Search', effectiveness: 61, trend: 'down' },
          { channel: 'Referral', effectiveness: 78, trend: 'up' }
        ]
      };
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      throw error;
    }
  },
  
  getMarketingPlans: async () => {
    try {
      // Mock implementation
      return [
        {
          id: 1,
          title: 'Q3 Growth Strategy',
          description: 'Comprehensive marketing plan to accelerate growth in Q3 2023',
          status: 'active',
          start_date: '2023-07-01',
          end_date: '2023-09-30',
          owner: 'Sarah Johnson',
          budget: 35000,
          objectives: [
            'Increase qualified leads by 25%',
            'Improve conversion rate to 22%',
            'Launch 2 new marketing campaigns'
          ],
          kpis: [
            { name: 'New Leads', target: 250, current: 128 },
            { name: 'Conversion Rate', target: 22, current: 18.5 },
            { name: 'Marketing ROI', target: 3.2, current: 2.8 }
          ],
          progress: 45
        },
        {
          id: 2,
          title: 'Content Calendar 2023',
          description: 'Strategic content plan for blog, social media, and email',
          status: 'active',
          start_date: '2023-01-01',
          end_date: '2023-12-31',
          owner: 'Michael Brown',
          budget: 24000,
          objectives: [
            'Publish 48 blog posts (4 per month)',
            'Increase social media engagement by 35%',
            'Grow email subscriber list by 5000'
          ],
          kpis: [
            { name: 'Blog Posts Published', target: 48, current: 28 },
            { name: 'Social Engagement', target: 1650, current: 1250 },
            { name: 'New Subscribers', target: 5000, current: 2800 }
          ],
          progress: 58
        }
      ];
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      throw error;
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      // Mock implementation
      const plans = await marketingService.getMarketingPlans();
      return plans.find(plan => plan.id === planId) || null;
    } catch (error) {
      console.error(`Error fetching marketing plan ${planId}:`, error);
      throw error;
    }
  },
  
  getMarketingTrends: async (): Promise<MarketingTrend[]> => {
    try {
      // Mock implementation
      return [
        {
          id: 1,
          title: 'AI-Powered Content Creation',
          description: 'The rise of AI tools for generating and optimizing marketing content',
          relevance_score: 92,
          category: 'technology',
          source: 'Industry Report',
          discoveredAt: '2023-06-15T10:30:00Z',
          actionable: true,
          suggestedActions: [
            'Evaluate top AI content tools',
            'Test AI-generated content against human-written',
            'Implement selective AI assistance in content workflow'
          ]
        },
        {
          id: 2,
          title: 'Video Content Domination',
          description: 'Short-form video becoming the preferred content format across platforms',
          relevance_score: 88,
          category: 'content',
          source: 'Platform Analytics',
          discoveredAt: '2023-06-20T14:15:00Z',
          actionable: true,
          suggestedActions: [
            'Develop short-form video strategy',
            'Create video content templates',
            'Allocate resources for video production'
          ]
        },
        {
          id: 3,
          title: 'Sustainability Marketing',
          description: 'Growing consumer preference for brands with genuine sustainability practices',
          relevance_score: 75,
          category: 'consumer_behavior',
          source: 'Market Research',
          discoveredAt: '2023-06-25T09:45:00Z',
          actionable: true,
          suggestedActions: [
            'Audit current sustainability initiatives',
            'Develop authentic sustainability messaging',
            'Implement clear sustainability metrics'
          ]
        },
        {
          id: 4,
          title: 'Privacy-First Marketing',
          description: 'Adapting to a cookieless future and increasing privacy regulations',
          relevance_score: 85,
          category: 'regulations',
          source: 'Industry News',
          discoveredAt: '2023-06-28T11:20:00Z',
          actionable: true,
          suggestedActions: [
            'Audit current data collection practices',
            'Develop first-party data strategy',
            'Test alternative targeting methods'
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      throw error;
    }
  },
  
  getCompetitorInsights: async (): Promise<CompetitorInsight[]> => {
    try {
      // Mock implementation
      return [
        {
          id: 1,
          competitor_name: 'Digital Innovators',
          description: 'Launched new service bundle at 15% lower price point',
          impact: 'high',
          type: 'pricing',
          discoveredAt: '2023-07-05T10:15:00Z',
          source: 'Competitor Website',
          suggestedResponse: 'Review our service bundles and consider value-added differentiators rather than price matching'
        },
        {
          id: 2,
          competitor_name: 'WebSolutions Pro',
          description: 'Implemented 24/7 support chat with 15-minute response guarantee',
          impact: 'medium',
          type: 'service',
          discoveredAt: '2023-07-03T14:30:00Z',
          source: 'Client Feedback',
          suggestedResponse: 'Evaluate cost of extended support hours and response time guarantees'
        },
        {
          id: 3,
          competitor_name: 'CreativeForge',
          description: 'Secured major partnership with industry-leading platform',
          impact: 'high',
          type: 'partnership',
          discoveredAt: '2023-06-28T09:45:00Z',
          source: 'Press Release',
          suggestedResponse: 'Identify alternative partnership opportunities and accelerate ongoing partnership discussions'
        },
        {
          id: 4,
          competitor_name: 'TechBuild Solutions',
          description: 'Released case study showing 40% faster delivery times',
          impact: 'medium',
          type: 'performance',
          discoveredAt: '2023-06-25T11:20:00Z',
          source: 'Social Media',
          suggestedResponse: 'Conduct internal process review and benchmark our delivery times'
        }
      ];
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      throw error;
    }
  },
  
  analyzeMeetingTranscript: async (transcriptText: string) => {
    try {
      // Mock implementation
      return {
        summary: 'Meeting discussed potential website redesign project with focus on improving user experience and conversion rates.',
        key_points: [
          'Client expressed concern about current conversion rates',
          'Budget range discussed: $15,000-$20,000',
          'Timeline expectation: 6-8 weeks',
          'Mobile responsiveness is a top priority'
        ],
        action_items: [
          { action: 'Send proposal with detailed timeline', assigned_to: 'Account Manager', due_date: '2023-07-18' },
          { action: 'Share portfolio examples of similar projects', assigned_to: 'Designer', due_date: '2023-07-15' },
          { action: 'Prepare technical requirements document', assigned_to: 'Developer', due_date: '2023-07-20' }
        ],
        client_sentiment: {
          overall: 'positive',
          pain_points: ['Current website speed', 'Mobile experience', 'Lead generation'],
          areas_of_interest: ['E-commerce integration', 'Content management', 'Analytics']
        },
        next_steps_recommendations: [
          'Schedule follow-up meeting within 10 days',
          'Prepare preliminary design concepts',
          'Review competitor websites with client'
        ]
      };
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  }
};

export default marketingService;
