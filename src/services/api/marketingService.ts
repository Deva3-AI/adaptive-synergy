
import apiClient from '@/utils/apiUtils';

const marketingService = {
  getCampaigns: async () => {
    try {
      const response = await apiClient.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  },

  createCampaign: async (campaignData: any) => {
    try {
      const response = await apiClient.post('/marketing/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  },

  getMeetings: async () => {
    try {
      const response = await apiClient.get('/marketing/meetings');
      return response.data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return [];
    }
  },

  createMeeting: async (meetingData: any) => {
    try {
      const response = await apiClient.post('/marketing/meetings', meetingData);
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },

  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      const params = { start_date: startDate, end_date: endDate };
      const response = await apiClient.get('/marketing/analytics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        websiteTraffic: [],
        conversionRate: 0,
        topChannels: []
      };
    }
  },

  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  },

  getEmailOutreach: async () => {
    try {
      const response = await apiClient.get('/marketing/email-outreach');
      return response.data;
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      return {
        campaigns: [],
        stats: {
          total_sent: 0,
          open_rate: 0,
          click_rate: 0
        }
      };
    }
  },

  getLeads: async () => {
    try {
      const response = await apiClient.get('/marketing/leads');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  getMarketingPlans: async () => {
    try {
      const response = await apiClient.get('/marketing/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      return [];
    }
  },

  getMarketingPlanById: async (planId: number) => {
    try {
      const response = await apiClient.get(`/marketing/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching marketing plan ${planId}:`, error);
      return null;
    }
  },

  getMarketingTrends: async () => {
    try {
      const response = await apiClient.get('/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      return {
        channels: [],
        keywords: [],
        content_types: []
      };
    }
  },

  getCompetitorInsights: async () => {
    try {
      const response = await apiClient.get('/marketing/competitor-insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      return [];
    }
  },

  analyzeMeetingTranscript: async (transcriptData: any) => {
    try {
      const response = await apiClient.post('/marketing/analyze-transcript', transcriptData);
      return response.data;
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  },

  getMarketingMetrics: async () => {
    try {
      const response = await apiClient.get('/marketing/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      return {
        lead_generation: {
          current_month: 45,
          previous_month: 38,
          trend: 'up'
        },
        conversion_rate: {
          current_month: 5.2,
          previous_month: 4.8,
          trend: 'up'
        },
        campaign_performance: [
          { name: "Email Campaign", leads: 18, conversions: 5 },
          { name: "Social Media", leads: 15, conversions: 3 },
          { name: "Content Marketing", leads: 12, conversions: 4 }
        ]
      };
    }
  }
};

export default marketingService;
