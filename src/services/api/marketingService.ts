
import apiClient from '@/utils/apiUtils';

const marketingService = {
  getCampaigns: async () => {
    try {
      const response = await apiClient.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Get campaigns error:', error);
      return [];
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
      return [];
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
      const params = [];
      if (startDate) params.push(`startDate=${startDate}`);
      if (endDate) params.push(`endDate=${endDate}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      return {};
    }
  },
  
  // Add missing methods
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Get email templates error:', error);
      return [];
    }
  },
  
  getEmailOutreach: async () => {
    try {
      const response = await apiClient.get('/marketing/email-outreach');
      return response.data;
    } catch (error) {
      console.error('Get email outreach error:', error);
      return [];
    }
  },
  
  getLeads: async (status?: string) => {
    try {
      const url = status ? `/marketing/leads?status=${status}` : '/marketing/leads';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get leads error:', error);
      return [];
    }
  },
  
  getMarketingPlans: async () => {
    try {
      const response = await apiClient.get('/marketing/plans');
      return response.data;
    } catch (error) {
      console.error('Get marketing plans error:', error);
      return [];
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      const response = await apiClient.get(`/marketing/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Get marketing plan by ID error:', error);
      return null;
    }
  },
  
  getMarketingTrends: async () => {
    try {
      const response = await apiClient.get('/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Get marketing trends error:', error);
      return [];
    }
  },
  
  getCompetitorInsights: async () => {
    try {
      const response = await apiClient.get('/marketing/competitor-insights');
      return response.data;
    } catch (error) {
      console.error('Get competitor insights error:', error);
      return [];
    }
  },
  
  analyzeMeetingTranscript: async (transcriptData: any) => {
    try {
      const response = await apiClient.post('/marketing/analyze-transcript', transcriptData);
      return response.data;
    } catch (error) {
      console.error('Analyze meeting transcript error:', error);
      return { key_points: [], action_items: [], sentiment: {} };
    }
  },
  
  getMarketingMetrics: async () => {
    try {
      const response = await apiClient.get('/marketing/metrics');
      return response.data;
    } catch (error) {
      console.error('Get marketing metrics error:', error);
      return {};
    }
  }
};

export default marketingService;
