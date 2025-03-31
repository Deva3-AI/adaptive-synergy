
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Campaign, 
  Meeting, 
  EmailTemplate, 
  Lead, 
  MarketingPlan,
  MarketingTrends,
  CompetitorInsight,
  MarketingMetrics,
  MeetingAnalysis,
  EmailOutreach,
  MarketingTrend
} from '@/interfaces/marketing';

/**
 * Service for marketing data
 */
const marketingService = {
  /**
   * Get all marketing campaigns
   */
  getCampaigns: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*');
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || [
        {
          id: 1,
          title: 'Summer Promotion',
          type: 'Email',
          status: 'Active',
          start_date: '2023-06-01',
          end_date: '2023-08-31',
          budget: 5000,
          roi: '320%',
          leads_generated: 127,
          conversion_rate: '3.5%'
        },
        {
          id: 2,
          title: 'Product Launch',
          type: 'Social Media',
          status: 'Planning',
          start_date: '2023-09-15',
          end_date: '2023-10-15',
          budget: 10000,
          roi: 'N/A',
          leads_generated: 0,
          conversion_rate: '0%'
        }
      ];
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns');
      return [];
    }
  },

  /**
   * Create a new marketing campaign
   * @param campaignData - Campaign data
   */
  createCampaign: async (campaignData: any) => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert(campaignData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Campaign created successfully');
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
      throw error;
    }
  },

  /**
   * Get all marketing meetings
   */
  getMeetings: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .select('*');
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || [
        {
          id: 1,
          title: 'Client Onboarding',
          type: 'New Client',
          date: '2023-08-15',
          time: '14:00',
          contact_name: 'John Smith',
          company: 'ABC Tech',
          status: 'Scheduled',
          notes: 'Discuss project requirements and timeline'
        },
        {
          id: 2,
          title: 'Strategy Review',
          type: 'Existing Client',
          date: '2023-08-18',
          time: '10:30',
          contact_name: 'Sarah Johnson',
          company: 'XYZ Corp',
          status: 'Completed',
          notes: 'Reviewed campaign performance and planned next steps'
        }
      ];
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Failed to load meetings');
      return [];
    }
  },

  /**
   * Create a new marketing meeting
   * @param meetingData - Meeting data
   */
  createMeeting: async (meetingData: any) => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .insert(meetingData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast.success('Meeting created successfully');
      return data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
      throw error;
    }
  },

  /**
   * Get marketing analytics
   * @param startDate - Start date for the analytics
   * @param endDate - End date for the analytics
   */
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // In a real implementation, we would filter based on startDate and endDate
      
      // Return mock data
      return {
        overview: {
          total_leads: 256,
          lead_growth: '+15%',
          conversion_rate: '3.2%',
          avg_deal_size: 5200,
          channel_performance: [
            { name: 'Email', value: 35 },
            { name: 'Social', value: 25 },
            { name: 'SEO', value: 20 },
            { name: 'Referral', value: 15 },
            { name: 'Direct', value: 5 }
          ]
        },
        campaigns: {
          total: 8,
          active: 3,
          roi: '275%',
          best_performing: {
            name: 'Summer Promotion',
            roi: '320%',
            leads: 127
          }
        },
        website: {
          visitors: 12500,
          growth: '+8%',
          avg_session: '2:15',
          bounce_rate: '38%',
          top_pages: [
            { path: '/features', visits: 3200 },
            { path: '/pricing', visits: 2800 },
            { path: '/about', visits: 1500 }
          ]
        },
        social_media: {
          followers: 45000,
          engagement: '4.2%',
          growth: '+12%',
          top_platforms: [
            { name: 'LinkedIn', followers: 22000, growth: '+15%' },
            { name: 'Twitter', followers: 18000, growth: '+8%' },
            { name: 'Instagram', followers: 5000, growth: '+20%' }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
      return {};
    }
  },

  /**
   * Get email templates
   */
  getEmailTemplates: async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*');
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || [
        {
          id: 1,
          name: 'Welcome Email',
          subject: 'Welcome to Our Service!',
          body: 'Dear {{name}},\n\nWelcome to our service! We are excited to have you on board...',
          variables: ['name', 'company'],
          category: 'Onboarding',
          performance: {
            open_rate: 65.2,
            response_rate: 12.5,
            meetings_booked: 8
          },
          improvements: [
            'Add more personalization',
            'Include case study links'
          ]
        },
        {
          id: 2,
          name: 'Follow-up After Meeting',
          subject: 'Great Meeting Today, {{name}}',
          body: 'Hi {{name}},\n\nThank you for your time today. As discussed...',
          variables: ['name', 'meeting_date', 'next_steps'],
          category: 'Follow-up',
          performance: {
            open_rate: 72.8,
            response_rate: 35.4,
            meetings_booked: 12
          }
        }
      ];
    } catch (error) {
      console.error('Error fetching email templates:', error);
      toast.error('Failed to load email templates');
      return [];
    }
  },

  /**
   * Get email outreach data
   */
  getEmailOutreach: async () => {
    try {
      const { data, error } = await supabase
        .from('email_outreach')
        .select('*');
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || [
        {
          id: 1,
          campaign_name: 'Q3 Prospecting',
          status: 'Active',
          sent_date: '2023-07-10',
          recipients: 500,
          open_rate: '42%',
          click_rate: '12%',
          response_rate: '8%',
          meetings_booked: 15
        },
        {
          id: 2,
          campaign_name: 'Event Follow-up',
          status: 'Completed',
          sent_date: '2023-06-22',
          recipients: 250,
          open_rate: '58%',
          click_rate: '24%',
          response_rate: '18%',
          meetings_booked: 22
        }
      ];
    } catch (error) {
      console.error('Error fetching email outreach data:', error);
      toast.error('Failed to load email outreach data');
      return [];
    }
  },

  /**
   * Get leads
   */
  getLeads: async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*');
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || [
        {
          id: 1,
          name: 'John Smith',
          company: 'ABC Tech',
          position: 'CTO',
          email: 'john.smith@abctech.com',
          phone: '+1-555-123-4567',
          source: 'Website',
          status: 'New',
          last_contact: '2023-08-10',
          next_follow_up: '2023-08-15',
          estimated_value: 10000,
          probability: 30,
          notes: 'Showed interest in our enterprise solution'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          company: 'XYZ Corp',
          position: 'Marketing Director',
          email: 'sarah.j@xyzcorp.com',
          phone: '+1-555-987-6543',
          source: 'Referral',
          status: 'Qualified',
          last_contact: '2023-08-05',
          next_follow_up: '2023-08-12',
          estimated_value: 25000,
          probability: 50,
          notes: 'Looking to revamp their digital marketing strategy'
        }
      ];
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
      return [];
    }
  },

  /**
   * Get marketing plans
   */
  getMarketingPlans: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_plans')
        .select('*');
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || [
        {
          id: 1,
          title: 'Q4 Growth Strategy',
          description: 'Comprehensive plan to drive Q4 growth across all channels',
          start_date: '2023-10-01',
          end_date: '2023-12-31',
          status: 'Draft',
          budget: 50000,
          goals: [
            { id: 1, title: 'Increase website traffic', target: '25%', current: '0%' },
            { id: 2, title: 'Generate qualified leads', target: '100', current: '0' }
          ],
          channels: ['Social Media', 'Email', 'Content Marketing', 'SEO'],
          target_audience: ['SaaS Companies', 'E-commerce', 'Financial Services'],
          milestones: [
            { id: 1, title: 'Strategy finalization', date: '2023-09-15', status: 'Pending' },
            { id: 2, title: 'Campaign launch', date: '2023-10-01', status: 'Pending' }
          ]
        },
        {
          id: 2,
          title: 'Product Launch Campaign',
          description: 'Marketing plan for the launch of our new product',
          start_date: '2023-09-15',
          end_date: '2023-10-15',
          status: 'In Progress',
          budget: 35000,
          goals: [
            { id: 1, title: 'Product pre-orders', target: '500', current: '125' },
            { id: 2, title: 'Press coverage', target: '10 publications', current: '3 publications' }
          ],
          channels: ['PR', 'Social Media', 'Influencer Marketing', 'Email'],
          target_audience: ['Existing Customers', 'Tech Enthusiasts', 'Industry Professionals'],
          milestones: [
            { id: 1, title: 'Press release', date: '2023-09-01', status: 'Completed' },
            { id: 2, title: 'Product launch event', date: '2023-09-15', status: 'Pending' }
          ]
        }
      ];
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      toast.error('Failed to load marketing plans');
      return [];
    }
  },

  /**
   * Get a marketing plan by ID
   * @param planId - Plan ID
   */
  getMarketingPlanById: async (planId: number) => {
    try {
      const { data, error } = await supabase
        .from('marketing_plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (error) throw error;
      
      // For demonstration, return first mock plan if no data
      if (!data) {
        return {
          id: 1,
          title: 'Q4 Growth Strategy',
          description: 'Comprehensive plan to drive Q4 growth across all channels',
          start_date: '2023-10-01',
          end_date: '2023-12-31',
          status: 'Draft',
          budget: 50000,
          goals: [
            { id: 1, title: 'Increase website traffic', target: '25%', current: '0%' },
            { id: 2, title: 'Generate qualified leads', target: '100', current: '0' }
          ],
          channels: ['Social Media', 'Email', 'Content Marketing', 'SEO'],
          target_audience: ['SaaS Companies', 'E-commerce', 'Financial Services'],
          milestones: [
            { id: 1, title: 'Strategy finalization', date: '2023-09-15', status: 'Pending' },
            { id: 2, title: 'Campaign launch', date: '2023-10-01', status: 'Pending' }
          ]
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching marketing plan:', error);
      toast.error('Failed to load marketing plan');
      return null;
    }
  },

  /**
   * Get marketing trends
   */
  getMarketingTrends: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_trends')
        .select('*');
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || [
        {
          id: 1,
          title: 'AI-Powered Content Creation',
          type: 'Technology',
          description: 'AI tools are revolutionizing how marketing content is created, enabling faster production and personalization.',
          impact: 'High',
          discoveredAt: '2023-07-15',
          source: 'Industry Research',
          suggestedResponse: 'Evaluate AI content tools for our marketing department to improve efficiency'
        },
        {
          id: 2,
          title: 'Privacy-First Marketing',
          type: 'Strategy',
          description: 'With increasing privacy regulations, marketers are shifting towards first-party data and privacy-compliant strategies.',
          impact: 'High',
          discoveredAt: '2023-08-01',
          source: 'Market Analysis',
          suggestedResponse: 'Audit our data collection practices and enhance first-party data strategies'
        }
      ];
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      toast.error('Failed to load marketing trends');
      return [];
    }
  },

  /**
   * Get competitor insights
   */
  getCompetitorInsights: async () => {
    try {
      const { data, error } = await supabase
        .from('competitor_insights')
        .select('*');
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || [
        {
          id: 1,
          competitor_name: 'Acme Corp',
          website: 'www.acmecorp.com',
          strengths: ['Strong brand recognition', 'Large marketing budget', 'Extensive product line'],
          weaknesses: ['Poor customer service', 'Outdated UI/UX', 'Slow innovation cycle'],
          recent_activities: ['Launched new product line', 'Expanded to European market', 'Hired new CMO'],
          target_audience: ['Enterprise customers', 'Mid-market businesses'],
          pricing_strategy: 'Premium pricing with annual contracts',
          market_share: '32%',
          growth_rate: '8%',
          threat_level: 'High',
          opportunity_areas: ['Customer service improvements', 'SMB market expansion'],
          impact: 'High',
          type: 'Competitor Move',
          description: 'Acme Corp is entering our primary market segment with competitive pricing',
          discoveredAt: '2023-08-05',
          source: 'Press Release',
          suggestedResponse: 'Enhance our value proposition and prepare competitive comparison materials'
        },
        {
          id: 2,
          competitor_name: 'TechSolutions Inc',
          website: 'www.techsolutions.com',
          strengths: ['Cutting-edge technology', 'Strong developer community', 'Agile development process'],
          weaknesses: ['Limited market presence', 'High pricing', 'Complex implementation'],
          recent_activities: ['Raised $50M Series C', 'Released API platform', 'Partnered with major cloud provider'],
          target_audience: ['Technical decision makers', 'Startups', 'Technology companies'],
          pricing_strategy: 'Usage-based with freemium tier',
          market_share: '15%',
          growth_rate: '25%',
          threat_level: 'Medium',
          opportunity_areas: ['Non-technical user experience', 'Simplified onboarding'],
          impact: 'Medium',
          type: 'Product Launch',
          description: 'TechSolutions launched a simplified version of their platform aimed at non-technical users',
          discoveredAt: '2023-07-20',
          source: 'Product Hunt',
          suggestedResponse: 'Highlight our ease-of-use advantages and prepare competitive feature comparison'
        }
      ];
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      toast.error('Failed to load competitor insights');
      return [];
    }
  },

  /**
   * Get marketing metrics
   */
  getMarketingMetrics: async () => {
    try {
      // Return mock data
      return {
        website_traffic: {
          total_visits: 45000,
          growth_rate: '+12%',
          bounce_rate: '35%',
          avg_session_duration: '2:45',
          by_source: [
            { name: 'Organic Search', value: 18000 },
            { name: 'Direct', value: 12000 },
            { name: 'Referral', value: 8000 },
            { name: 'Social', value: 5000 },
            { name: 'Email', value: 2000 }
          ],
          monthly_trend: [
            { month: 'Jan', value: 32000 },
            { month: 'Feb', value: 34000 },
            { month: 'Mar', value: 38000 },
            { month: 'Apr', value: 42000 },
            { month: 'May', value: 40000 },
            { month: 'Jun', value: 45000 }
          ]
        },
        social_media: {
          followers: 78000,
          growth_rate: '+8%',
          engagement_rate: '3.2%',
          reach: 250000,
          by_platform: [
            { name: 'LinkedIn', value: 35000, growth: '+12%' },
            { name: 'Twitter', value: 25000, growth: '+5%' },
            { name: 'Instagram', value: 15000, growth: '+15%' },
            { name: 'Facebook', value: 3000, growth: '-2%' }
          ],
          top_posts: [
            {
              id: 1,
              platform: 'LinkedIn',
              content: 'Announcement of our new product feature',
              engagement: 1800,
              reach: 20000,
              date: '2023-06-15'
            },
            {
              id: 2,
              platform: 'Twitter',
              content: 'Industry insights thread',
              engagement: 950,
              reach: 15000,
              date: '2023-06-22'
            }
          ]
        },
        email_marketing: {
          total_subscribers: 25000,
          growth_rate: '+5%',
          avg_open_rate: '28%',
          avg_click_rate: '3.5%',
          unsubscribe_rate: '0.2%',
          best_performing_campaign: {
            name: 'Product Update - June 2023',
            open_rate: '35%',
            click_rate: '5.8%',
            conversion_rate: '2.1%'
          }
        },
        content_marketing: {
          total_content_pieces: 120,
          avg_engagement: '250 interactions per piece',
          conversion_rate: '1.8%',
          by_type: [
            { name: 'Blog Posts', value: 60 },
            { name: 'Case Studies', value: 25 },
            { name: 'Whitepapers', value: 15 },
            { name: 'Videos', value: 20 }
          ],
          top_performing: [
            {
              id: 1,
              title: 'Ultimate Guide to Digital Transformation',
              type: 'Whitepaper',
              views: 8500,
              engagement: 450,
              conversion_rate: '3.2%'
            },
            {
              id: 2,
              title: '5 Ways to Improve Your Marketing ROI',
              type: 'Blog Post',
              views: 12000,
              engagement: 350,
              conversion_rate: '2.5%'
            }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      toast.error('Failed to load marketing metrics');
      return {};
    }
  },

  /**
   * Analyze meeting transcript
   * @param transcript - Meeting transcript
   */
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-meeting', {
        body: { transcript },
      });
      
      if (error) throw error;
      
      // Return mock data if no data is returned
      return data || {
        summary: 'The meeting focused on discussing the client\'s needs for a new marketing campaign targeting their B2B audience. The client expressed interest in our content marketing services and had specific requirements regarding timeline and budget.',
        key_points: [
          'Client needs a B2B-focused campaign',
          'Budget range is $25,000-$30,000',
          'Timeline: launch by Q4 2023',
          'Main goals: lead generation and brand awareness',
          'Previous campaign had mixed results'
        ],
        action_items: [
          {
            task: 'Prepare campaign proposal',
            assignee: 'Marketing Team',
            deadline: '2023-08-20'
          },
          {
            task: 'Send case studies relevant to B2B marketing',
            assignee: 'Account Manager',
            deadline: '2023-08-15'
          },
          {
            task: 'Schedule follow-up meeting',
            assignee: 'Sales Team',
            deadline: '2023-08-25'
          }
        ],
        client_pain_points: [
          'Previous marketing efforts lacked ROI tracking',
          'Difficulty reaching decision-makers',
          'Concerned about messaging consistency'
        ],
        opportunities: [
          'Content syndication through industry partners',
          'Account-based marketing approach',
          'Interactive content formats'
        ],
        follow_up_schedule: {
          next_meeting: '2023-08-25',
          deliverables: [
            'Campaign proposal',
            'Cost breakdown',
            'Timeline draft'
          ]
        }
      };
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      toast.error('Failed to analyze meeting transcript');
      return null;
    }
  }
};

export default marketingService;
