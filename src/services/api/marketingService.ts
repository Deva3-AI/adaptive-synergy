
import apiClient from '@/utils/apiUtils';

export const marketingService = {
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
  
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Get email templates error:', error);
      throw error;
    }
  },
  
  getEmailOutreach: async () => {
    try {
      const response = await apiClient.get('/marketing/email-outreach');
      return response.data;
    } catch (error) {
      console.error('Get email outreach error:', error);
      throw error;
    }
  },
  
  getLeads: async () => {
    try {
      const response = await apiClient.get('/marketing/leads');
      return response.data;
    } catch (error) {
      console.error('Get leads error:', error);
      throw error;
    }
  },
  
  getMarketingPlans: async () => {
    try {
      const response = await apiClient.get('/marketing/plans');
      return response.data;
    } catch (error) {
      console.error('Get marketing plans error:', error);
      throw error;
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      const response = await apiClient.get(`/marketing/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Get marketing plan by ID error:', error);
      throw error;
    }
  },
  
  getMarketingTrends: async () => {
    try {
      const response = await apiClient.get('/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Get marketing trends error:', error);
      throw error;
    }
  },
  
  getCompetitorInsights: async () => {
    try {
      const response = await apiClient.get('/marketing/competitor-insights');
      return response.data;
    } catch (error) {
      console.error('Get competitor insights error:', error);
      throw error;
    }
  },
  
  analyzeMeetingTranscript: async (transcriptData: any) => {
    try {
      const response = await apiClient.post('/marketing/analyze-transcript', transcriptData);
      return response.data;
    } catch (error) {
      console.error('Analyze meeting transcript error:', error);
      throw error;
    }
  },
  
  getMarketingMetrics: async () => {
    try {
      const response = await apiClient.get('/marketing/metrics');
      return response.data;
    } catch (error) {
      console.error('Get marketing metrics error:', error);
      throw error;
    }
  },
};
