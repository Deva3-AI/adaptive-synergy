
import axios from 'axios';
import { supabase } from '@/lib/supabase';
import { mockMarketingData } from '@/utils/mockMarketingData';

const marketingService = {
  // Campaign management
  getCampaigns: async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return mockMarketingData.campaigns;
    }
  },
  
  createCampaign: async (campaignData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert(campaignData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },
  
  // Meeting management
  getMeetings: async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return mockMarketingData.meetings;
    }
  },
  
  createMeeting: async (meetingData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .insert(meetingData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },
  
  // Analytics
  getAnalytics: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      // In a real app, this would query analytics data from a database
      // For now, return mock data
      return {
        website_traffic: {
          total_visits: 12500,
          unique_visitors: 8200,
          average_session_duration: '2m 45s',
          bounce_rate: '32%',
          by_source: [
            { source: 'Organic Search', visits: 5200 },
            { source: 'Direct', visits: 3100 },
            { source: 'Social Media', visits: 2800 },
            { source: 'Referral', visits: 1400 }
          ]
        },
        conversions: {
          total: 350,
          rate: '4.3%',
          by_channel: [
            { channel: 'Email', conversions: 120, rate: '5.8%' },
            { channel: 'Social', conversions: 95, rate: '3.4%' },
            { channel: 'Search', conversions: 85, rate: '4.1%' },
            { channel: 'Ads', conversions: 50, rate: '3.8%' }
          ]
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },
  
  // Email outreach
  getEmailOutreach: async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('email_outreach')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching email outreach data:', error);
      return mockMarketingData.emailOutreach;
    }
  },
  
  createEmailOutreach: async (outreachData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('email_outreach')
        .insert(outreachData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating email outreach:', error);
      throw error;
    }
  },
  
  updateEmailOutreach: async (id: number, updateData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('email_outreach')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating email outreach:', error);
      throw error;
    }
  },
  
  // Leads
  getLeads: async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_leads')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return mockMarketingData.leads;
    }
  },
  
  createLead: async (leadData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_leads')
        .insert(leadData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },
  
  updateLead: async (id: number, updateData: any): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },
  
  // Marketing plans
  getMarketingPlans: async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_plans')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      return mockMarketingData.plans;
    }
  },
  
  getMarketingPlanById: async (planId: number): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('marketing_plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching marketing plan:', error);
      return mockMarketingData.plans.find(p => p.id === planId);
    }
  },
  
  // Trends and insights
  getMarketingTrends: async (): Promise<any> => {
    try {
      // In a real app, this might call an AI service or analytics platform
      return {
        industry_trends: [
          { trend: 'Video Content', impact: 'high', description: 'Short-form video continuing to drive engagement' },
          { trend: 'AI-Generated Content', impact: 'medium', description: 'Growing adoption for content creation and personalization' },
          { trend: 'Privacy Focus', impact: 'high', description: 'Increasing emphasis on first-party data and privacy-compliant marketing' }
        ],
        platform_changes: [
          { platform: 'Instagram', change: 'Algorithm update favoring Reels content', impact: 'high' },
          { platform: 'Google', change: 'Core update emphasizing expertise and trustworthiness', impact: 'medium' }
        ],
        recommended_actions: [
          { action: 'Increase video content production', priority: 'high' },
          { action: 'Develop first-party data strategy', priority: 'medium' },
          { action: 'Test AI-assisted content creation', priority: 'medium' }
        ]
      };
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      throw error;
    }
  },
  
  getCompetitorInsights: async (): Promise<any> => {
    try {
      return [
        {
          competitor: 'Digital Masters',
          strengths: ['Strong social media presence', 'Comprehensive service offerings'],
          weaknesses: ['Higher pricing', 'Longer delivery times'],
          recent_activities: [
            'Launched new service package',
            'Redesigned website with case studies focus'
          ],
          threat_level: 'medium'
        },
        {
          competitor: 'CreativeForce',
          strengths: ['Award-winning design work', 'Established industry reputation'],
          weaknesses: ['Limited digital marketing services', 'Less responsive customer service'],
          recent_activities: [
            'Expanded team with SEO specialists',
            'Released pricing packages'
          ],
          threat_level: 'high'
        }
      ];
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      throw error;
    }
  },
  
  // Meeting analysis
  analyzeMeetingTranscript: async (transcript: string): Promise<any> => {
    try {
      // In a real app, this would call an AI service
      // For demo purposes, return mock analysis
      console.log('Analyzing transcript:', transcript.substring(0, 50) + '...');
      
      return {
        key_points: [
          'Client expressed interest in website redesign',
          'Budget constraints mentioned multiple times',
          'Timeline expectation: 6-8 weeks',
          'Concerned about mobile responsiveness'
        ],
        sentiment: 'positive',
        client_needs: [
          'Modern, responsive website design',
          'SEO optimization',
          'Budget-friendly solution',
          'Ongoing maintenance plan'
        ],
        action_items: [
          'Send proposal within 3 days',
          'Include budget-friendly options',
          'Highlight mobile-first approach',
          'Share portfolio of similar projects'
        ],
        follow_up_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  },
  
  // Marketing metrics
  getMarketingMetrics: async (): Promise<any> => {
    try {
      return {
        overall_performance: {
          total_leads: 285,
          conversion_rate: '3.8%',
          cost_per_lead: '$12.50',
          roi: '320%'
        },
        channel_performance: [
          { channel: 'Social Media', leads: 95, conversion_rate: '4.2%', cost_per_lead: '$10.25' },
          { channel: 'Email', leads: 75, conversion_rate: '3.9%', cost_per_lead: '$8.50' },
          { channel: 'Content', leads: 65, conversion_rate: '3.5%', cost_per_lead: '$15.75' },
          { channel: 'SEO', leads: 50, conversion_rate: '3.2%', cost_per_lead: '$18.00' }
        ],
        trends: [
          { metric: 'Leads', trend: 'increasing', value: '+12%' },
          { metric: 'Conversion Rate', trend: 'stable', value: '+0.2%' },
          { metric: 'Cost per Lead', trend: 'decreasing', value: '-5%' }
        ]
      };
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      throw error;
    }
  }
};

export default marketingService;
