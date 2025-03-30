
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
      let url = '/marketing/analytics';
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing analytics:', error);
      return null;
    }
  },

  // Email Outreach methods
  getEmailOutreach: async () => {
    try {
      const response = await apiClient.get('/marketing/email-outreach');
      return response.data;
    } catch (error) {
      console.error('Error fetching email outreach data:', error);
      return [];
    }
  },

  // Email Templates methods
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  },

  // Leads methods
  getLeads: async () => {
    try {
      const response = await apiClient.get('/marketing/leads');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Marketing Plans methods
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

  // Marketing Trends methods
  getMarketingTrends: async () => {
    try {
      const response = await apiClient.get('/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      return [];
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

  // Meeting Analysis methods
  analyzeMeetingTranscript: async (transcriptData: any) => {
    try {
      const response = await apiClient.post('/marketing/analyze-transcript', transcriptData);
      return response.data;
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  },

  // Marketing Metrics
  getMarketingMetrics: async () => {
    try {
      const response = await apiClient.get('/marketing/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      return null;
    }
  }
};

export default marketingService;
