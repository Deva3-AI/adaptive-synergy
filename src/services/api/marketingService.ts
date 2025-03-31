import apiClient from '@/utils/apiUtils';
import { Campaign, Meeting, MarketingMeeting, MarketingTrend, EmailOutreach, Lead, MarketingPlan, CompetitorInsight } from '@/interfaces/marketing';

const marketingService = {
  // Existing methods
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const response = await apiClient.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      
      // Return mock data for development
      return [
        {
          id: 1,
          title: 'Q3 Social Media Campaign',
          type: 'Social Media',
          status: 'Active',
          start_date: '2023-07-01',
          end_date: '2023-09-30',
          budget: 15000,
          roi: '220%',
          leads_generated: 142,
          conversion_rate: '3.8%'
        },
        {
          id: 2,
          title: 'Email Outreach Program',
          type: 'Email',
          status: 'Active',
          start_date: '2023-08-15',
          end_date: '2023-10-15',
          budget: 5000,
          roi: '180%',
          leads_generated: 86,
          conversion_rate: '4.2%'
        }
      ];
    }
  },
  
  getMeetings: async (): Promise<Meeting[]> => {
    try {
      const response = await apiClient.get('/marketing/meetings');
      return response.data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      
      // Return mock data for development
      return [
        {
          id: 1,
          title: 'Initial Client Consultation',
          type: 'Discovery',
          date: '2023-09-15',
          time: '10:00 AM',
          contact_name: 'John Smith',
          company: 'Acme Corp',
          status: 'Scheduled',
          notes: 'Discuss potential marketing campaign for Q4'
        },
        {
          id: 2,
          title: 'Campaign Strategy Review',
          type: 'Strategy',
          date: '2023-09-18',
          time: '2:00 PM',
          contact_name: 'Sarah Johnson',
          company: 'XYZ Inc',
          status: 'Completed',
          notes: 'Reviewed social media strategy and content calendar'
        }
      ];
    }
  },
  
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      
      // Return mock data for development
      return [
        {
          id: 1,
          name: 'Initial Outreach',
          subject: 'Introducing Our Services to {{company}}',
          body: 'Dear {{name}},\n\nI hope this email finds you well. I wanted to reach out to introduce our services that have helped companies like {{company}} achieve significant growth...',
          variables: ['name', 'company'],
          category: 'Cold Outreach',
          performance: {
            open_rate: 32,
            response_rate: 8,
            meetings_booked: 5
          },
          improvements: [
            'Add more personalization',
            'Include case study links',
            'Shorten the introduction paragraph'
          ]
        },
        {
          id: 2,
          name: 'Follow-up After Meeting',
          subject: 'Following Up on Our Conversation, {{name}}',
          body: 'Hi {{name}},\n\nThank you for taking the time to speak with me today about {{topic}}. As promised, I\'m sending over the additional information we discussed...',
          variables: ['name', 'topic'],
          category: 'Follow-up',
          performance: {
            open_rate: 68,
            response_rate: 42,
            meetings_booked: 12
          }
        }
      ];
    }
  },
  
  getLeads: async (): Promise<Lead[]> => {
    try {
      const response = await apiClient.get('/marketing/leads');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      
      // Return mock data for development
      return [
        {
          id: 1,
          name: 'John Smith',
          company: 'Acme Corp',
          position: 'Marketing Director',
          email: 'john.smith@acmecorp.com',
          phone: '(555) 123-4567',
          source: 'Website Contact Form',
          status: 'New',
          last_contact: '2023-09-10',
          next_follow_up: '2023-09-17',
          estimated_value: 15000,
          probability: 60,
          notes: 'Interested in social media management services'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          company: 'XYZ Inc',
          position: 'CEO',
          email: 'sarah.johnson@xyzinc.com',
          phone: '(555) 987-6543',
          source: 'LinkedIn Outreach',
          status: 'Qualified',
          last_contact: '2023-09-08',
          next_follow_up: '2023-09-15',
          estimated_value: 25000,
          probability: 75,
          notes: 'Looking for comprehensive marketing strategy'
        }
      ];
    }
  },
  
  // Add missing methods
  getMarketingPlans: async (): Promise<MarketingPlan[]> => {
    try {
      const response = await apiClient.get('/marketing/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      return [];
    }
  },
  
  getMarketingPlanById: async (planId: number): Promise<MarketingPlan | null> => {
    try {
      const response = await apiClient.get(`/marketing/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching marketing plan ${planId}:`, error);
      return null;
    }
  },
  
  getMarketingTrends: async (): Promise<MarketingTrend[]> => {
    try {
      const response = await apiClient.get('/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      return [
        {
          id: 1,
          title: 'AI-Powered Content Creation',
          type: 'Technology',
          description: 'AI tools are revolutionizing content creation with efficient generation of high-quality content.',
          impact: 'High',
          discoveredAt: '2023-08-15',
          source: 'Industry Report',
          suggestedResponse: 'Implement AI tools for content generation and editing.',
          relevance_score: 95,
          category: 'Content',
          actionable: true,
          suggestedActions: ['Research top AI content tools', 'Implement trial for blog content']
        },
        {
          id: 2,
          title: 'Voice Search Optimization',
          type: 'SEO',
          description: 'Rising popularity of voice search requires different keyword strategies.',
          impact: 'Medium',
          discoveredAt: '2023-07-20',
          source: 'Digital Marketing Blog',
          suggestedResponse: 'Adapt content strategy for voice search queries.',
          relevance_score: 85,
          category: 'SEO',
          actionable: true,
          suggestedActions: ['Audit current content for voice search compatibility', 'Develop voice search keyword list']
        }
      ];
    }
  },
  
  getCompetitorInsights: async (): Promise<CompetitorInsight[]> => {
    try {
      const response = await apiClient.get('/marketing/competitor-insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      return [
        {
          id: 1,
          competitor_name: 'TechRival Inc.',
          website: 'techriva.com',
          strengths: ['Strong content marketing', 'High social engagement'],
          weaknesses: ['Poor customer support', 'Limited product features'],
          recent_activities: ['Launched new blog series', 'Increased ad spend'],
          target_audience: ['Small businesses', 'Startups'],
          pricing_strategy: 'Premium',
          market_share: '15%',
          growth_rate: '8% annually',
          threat_level: 'Medium',
          opportunity_areas: ['Focus on customer support quality', 'Highlight expanded feature set'],
          impact: 'Medium',
          type: 'Product',
          description: 'Launched a competing product with fewer features but lower price',
          discoveredAt: '2023-08-10',
          source: 'Product Hunt',
          suggestedResponse: 'Emphasize our superior feature set and support in marketing'
        }
      ];
    }
  },
  
  getEmailOutreach: async (): Promise<EmailOutreach[]> => {
    try {
      const response = await apiClient.get('/marketing/email-outreach');
      return response.data;
    } catch (error) {
      console.error('Error fetching email outreach data:', error);
      return [
        {
          id: 1,
          campaign_name: 'Q3 New Leads',
          status: 'Active',
          sent_date: '2023-07-15',
          recipients: 450,
          open_rate: '32%',
          click_rate: '8%',
          response_rate: '3.5%',
          meetings_booked: 12,
          recipient: 'John Smith',
          recipientCompany: 'Acme Corp',
          subject: 'Partnership Opportunity',
          sentAt: '2023-07-15T10:30:00Z',
          source: 'LinkedIn',
          followUpScheduled: true
        }
      ];
    }
  },
  
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      const response = await apiClient.post('/marketing/analyze-meeting', { transcript });
      return response.data;
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      return {
        summary: 'Meeting focused on partnership opportunities and potential collaborations.',
        key_points: [
          'Client interested in our premium package',
          'Timeline is approximately 2 months',
          'Budget concerns around implementation costs'
        ],
        action_items: [
          { task: 'Send proposal with detailed pricing', assignee: 'Sales Team', deadline: '2023-09-15' },
          { task: 'Schedule follow-up call', assignee: 'Account Manager', deadline: '2023-09-20' }
        ],
        client_pain_points: [
          'Current solution is too slow',
          'Need better reporting features'
        ],
        opportunities: [
          'Upsell premium support package',
          'Training services potential'
        ]
      };
    }
  },
  
  getMarketingMetrics: async () => {
    try {
      const response = await apiClient.get('/marketing/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      return {};
    }
  }
};

export default marketingService;
