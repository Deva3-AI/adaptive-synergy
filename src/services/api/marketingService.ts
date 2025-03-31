
import api from '../api';
import { mockMarketingData } from '@/utils/mockData';

const marketingService = {
  // Campaign management
  getCampaigns: async () => {
    try {
      const response = await api.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Get campaigns error:', error);
      return mockMarketingData.campaigns;
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const response = await api.post('/marketing/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Create campaign error:', error);
      throw error;
    }
  },
  
  // Meeting management
  getMeetings: async () => {
    try {
      const response = await api.get('/marketing/meetings');
      return response.data;
    } catch (error) {
      console.error('Get meetings error:', error);
      return mockMarketingData.meetings;
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const response = await api.post('/marketing/meetings', meetingData);
      return response.data;
    } catch (error) {
      console.error('Create meeting error:', error);
      throw error;
    }
  },
  
  // Analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
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
      console.error('Get analytics error:', error);
      return mockMarketingData.analytics;
    }
  },
  
  // Email outreach management
  getEmailOutreach: async () => {
    try {
      const response = await api.get('/marketing/email-outreach');
      return response.data;
    } catch (error) {
      console.error('Get email outreach error:', error);
      return mockMarketingData.emailOutreach;
    }
  },
  
  createEmailOutreach: async (outreachData: any) => {
    try {
      const response = await api.post('/marketing/email-outreach', outreachData);
      return response.data;
    } catch (error) {
      console.error('Create email outreach error:', error);
      throw error;
    }
  },
  
  // Leads management
  getLeads: async () => {
    try {
      const response = await api.get('/marketing/leads');
      return response.data;
    } catch (error) {
      console.error('Get leads error:', error);
      return mockMarketingData.leads;
    }
  },
  
  createLead: async (leadData: any) => {
    try {
      const response = await api.post('/marketing/leads', leadData);
      return response.data;
    } catch (error) {
      console.error('Create lead error:', error);
      throw error;
    }
  },
  
  updateLead: async (leadId: number, leadData: any) => {
    try {
      const response = await api.put(`/marketing/leads/${leadId}`, leadData);
      return response.data;
    } catch (error) {
      console.error('Update lead error:', error);
      throw error;
    }
  },
  
  // Marketing plans management
  getMarketingPlans: async () => {
    try {
      const response = await api.get('/marketing/plans');
      return response.data;
    } catch (error) {
      console.error('Get marketing plans error:', error);
      return mockMarketingData.marketingPlans;
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      const response = await api.get(`/marketing/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Get marketing plan error:', error);
      const plan = mockMarketingData.marketingPlans.find(p => p.id === planId);
      return plan || null;
    }
  },
  
  createMarketingPlan: async (planData: any) => {
    try {
      const response = await api.post('/marketing/plans', planData);
      return response.data;
    } catch (error) {
      console.error('Create marketing plan error:', error);
      throw error;
    }
  },
  
  updateMarketingPlan: async (planId: number, planData: any) => {
    try {
      const response = await api.put(`/marketing/plans/${planId}`, planData);
      return response.data;
    } catch (error) {
      console.error('Update marketing plan error:', error);
      throw error;
    }
  },
  
  // Marketing trends and insights
  getMarketingTrends: async () => {
    try {
      const response = await api.get('/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Get marketing trends error:', error);
      return mockMarketingData.marketingTrends;
    }
  },
  
  getCompetitorInsights: async () => {
    try {
      const response = await api.get('/marketing/competitor-insights');
      return response.data;
    } catch (error) {
      console.error('Get competitor insights error:', error);
      return mockMarketingData.competitorInsights;
    }
  },
  
  // Marketing metrics
  getMarketingMetrics: async () => {
    try {
      const response = await api.get('/marketing/metrics');
      return response.data;
    } catch (error) {
      console.error('Get marketing metrics error:', error);
      return mockMarketingData.marketingMetrics;
    }
  },
  
  // Meeting analysis
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      const response = await api.post('/marketing/analyze-transcript', { transcript });
      return response.data;
    } catch (error) {
      console.error('Analyze meeting transcript error:', error);
      return mockMarketingData.meetingAnalysis;
    }
  }
};

export default marketingService;
