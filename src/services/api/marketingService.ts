
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
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing analytics:', error);
      return null;
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
      console.error('Error fetching email outreach data:', error);
      return [];
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
      return null;
    }
  },
  
  getCompetitorInsights: async () => {
    try {
      const response = await apiClient.get('/marketing/competitors');
      return response.data;
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      return [];
    }
  },
  
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      const response = await apiClient.post('/marketing/analyze-transcript', { transcript });
      return response.data;
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      return null;
    }
  },
  
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
