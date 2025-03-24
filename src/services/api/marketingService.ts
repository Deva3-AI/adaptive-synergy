
import apiClient from '@/utils/apiUtils';

export const marketingService = {
  // Campaign management
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
  
  // Meeting management
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
  
  // Analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiClient.get(`/marketing/analytics?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      return { data: [] };
    }
  },
  
  // Email templates
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Get email templates error:', error);
      return [];
    }
  },
  
  // Email outreach
  getEmailOutreach: async (status?: string) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/marketing/email-outreach?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get email outreach error:', error);
      return [];
    }
  },
  
  // Leads management
  getLeads: async (status?: string) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/marketing/leads?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get leads error:', error);
      return [];
    }
  },
  
  // Marketing plans
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
      console.error('Get marketing plan error:', error);
      throw error;
    }
  },
  
  // Trends and insights
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
      return {
        key_points: [],
        action_items: [],
        sentiment: 'neutral'
      };
    }
  },
  
  getMarketingMetrics: async (period: string = 'month') => {
    try {
      const response = await apiClient.get(`/marketing/metrics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Get marketing metrics error:', error);
      return {};
    }
  }
};

export default marketingService;
