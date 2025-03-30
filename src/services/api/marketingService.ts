
import axios from 'axios';
import config from '@/config/config';
import { 
  EmailTemplate, 
  EmailOutreach, 
  MarketingMeeting, 
  LeadProfile, 
  MarketingTrend, 
  CompetitorInsight 
} from '@/interfaces/marketing';

const api = axios.create({
  baseURL: config.apiUrl,
});

const marketingService = {
  // Email Templates
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      const response = await api.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching email templates:', error);
      return [];
    }
  },

  // Email Outreach
  getEmailOutreach: async (): Promise<EmailOutreach[]> => {
    try {
      const response = await api.get('/marketing/email-outreach');
      return response.data;
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      return [];
    }
  },

  // Marketing Meetings
  getMeetings: async (): Promise<MarketingMeeting[]> => {
    try {
      const response = await api.get('/marketing/meetings');
      return response.data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      return [];
    }
  },

  createMeeting: async (meetingData: Partial<MarketingMeeting>): Promise<any> => {
    try {
      const response = await api.post('/marketing/meetings', meetingData);
      return response.data;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },

  // Lead Management
  getLeads: async (): Promise<LeadProfile[]> => {
    try {
      const response = await api.get('/marketing/leads');
      return response.data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  // Analytics
  getAnalytics: async (startDate?: string, endDate?: string): Promise<any> => {
    try {
      let url = '/marketing/analytics';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  // Trends
  getMarketingTrends: async (): Promise<MarketingTrend[]> => {
    try {
      const response = await api.get('/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      return [];
    }
  },

  // Competitor Insights
  getCompetitorInsights: async (): Promise<CompetitorInsight[]> => {
    try {
      const response = await api.get('/marketing/competitor-insights');
      return response.data;
    } catch (error) {
      console.error('Error fetching competitor insights:', error);
      return [];
    }
  },

  // Marketing Plans
  getMarketingPlans: async (): Promise<any[]> => {
    try {
      const response = await api.get('/marketing/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      return [];
    }
  },

  getMarketingPlanById: async (planId: number): Promise<any> => {
    try {
      const response = await api.get(`/marketing/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching marketing plan ${planId}:`, error);
      throw error;
    }
  },

  // Marketing Metrics
  getMarketingMetrics: async (): Promise<any> => {
    try {
      const response = await api.get('/marketing/metrics');
      return response.data;
    } catch (error) {
      console.error('Error fetching marketing metrics:', error);
      return {};
    }
  },

  // Meeting Analysis
  analyzeMeetingTranscript: async (transcript: string, meetingType: string): Promise<any> => {
    try {
      const response = await api.post('/marketing/analyze-meeting', {
        transcript,
        meeting_type: meetingType
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing meeting transcript:', error);
      throw error;
    }
  },
  
  // Campaigns
  getCampaigns: async () => {
    try {
      const response = await api.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
  },

  createCampaign: async (campaignData: any) => {
    try {
      const response = await api.post('/marketing/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }
};

export default marketingService;
