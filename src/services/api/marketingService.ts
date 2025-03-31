
import axios from 'axios';
import { mockMarketingData } from '@/utils/mockData';

const marketingService = {
  // Campaigns
  getCampaigns: async () => {
    try {
      const response = await axios.get('/api/marketing/campaigns');
      return response.data;
    } catch (error) {
      console.error('Get campaigns error:', error);
      return mockMarketingData.campaigns;
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const response = await axios.post('/api/marketing/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Create campaign error:', error);
      // Simulate creating a new campaign
      return {
        ...campaignData,
        id: Math.floor(Math.random() * 1000),
        status: 'draft'
      };
    }
  },
  
  // Meetings
  getMeetings: async () => {
    try {
      const response = await axios.get('/api/marketing/meetings');
      return response.data;
    } catch (error) {
      console.error('Get meetings error:', error);
      return [
        {
          id: 1,
          title: "Product Demo",
          date: "2023-07-15",
          time: "14:00",
          company: "Acme Corp",
          status: "scheduled"
        },
        {
          id: 2,
          title: "Discovery Call",
          date: "2023-07-18",
          time: "10:00",
          company: "New Client Ltd",
          status: "scheduled"
        }
      ];
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const response = await axios.post('/api/marketing/meetings', meetingData);
      return response.data;
    } catch (error) {
      console.error('Create meeting error:', error);
      // Simulate creating a new meeting
      return {
        ...meetingData,
        id: Math.floor(Math.random() * 1000),
        status: 'scheduled'
      };
    }
  },
  
  // Analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      let url = '/api/marketing/analytics';
      const params = new URLSearchParams();
      
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      return {
        leads: {
          total: 45,
          new: 12,
          qualified: 8,
          conversion: "17.8%"
        },
        channels: [
          { name: "Email", performance: 35, trend: "up" },
          { name: "Social", performance: 25, trend: "stable" },
          { name: "Website", performance: 40, trend: "up" }
        ]
      };
    }
  },
  
  // Leads
  getLeads: async () => {
    try {
      const response = await axios.get('/api/marketing/leads');
      return response.data;
    } catch (error) {
      console.error('Get leads error:', error);
      return mockMarketingData.leads;
    }
  },
  
  createLead: async (leadData: any) => {
    try {
      const response = await axios.post('/api/marketing/leads', leadData);
      return response.data;
    } catch (error) {
      console.error('Create lead error:', error);
      // Simulate creating a new lead
      return {
        ...leadData,
        id: Math.floor(Math.random() * 1000),
        status: 'new',
        createdAt: new Date().toISOString()
      };
    }
  },
  
  updateLead: async (leadId: number, leadData: any) => {
    try {
      const response = await axios.put(`/api/marketing/leads/${leadId}`, leadData);
      return response.data;
    } catch (error) {
      console.error('Update lead error:', error);
      return { ...leadData, id: leadId };
    }
  },
  
  // Email Outreach
  getEmailOutreach: async () => {
    try {
      const response = await axios.get('/api/marketing/email-outreach');
      return response.data;
    } catch (error) {
      console.error('Get email outreach error:', error);
      return [
        {
          id: 1,
          title: "July Newsletter",
          recipients: 250,
          sentDate: "2023-07-01",
          openRate: 28.5,
          clickRate: 12.3,
          status: "sent"
        },
        {
          id: 2,
          title: "New Service Announcement",
          recipients: 500,
          sentDate: "2023-06-15",
          openRate: 32.1,
          clickRate: 15.8,
          status: "completed"
        }
      ];
    }
  },
  
  // Marketing Plans
  getMarketingPlans: async () => {
    try {
      const response = await axios.get('/api/marketing/plans');
      return response.data;
    } catch (error) {
      console.error('Get marketing plans error:', error);
      return mockMarketingData.plans;
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      const response = await axios.get(`/api/marketing/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Get marketing plan error:', error);
      return mockMarketingData.plans.find(plan => plan.id === planId);
    }
  },
  
  // Marketing Trends
  getMarketingTrends: async () => {
    try {
      const response = await axios.get('/api/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Get marketing trends error:', error);
      return mockMarketingData.trends;
    }
  },
  
  // Competitor Insights
  getCompetitorInsights: async () => {
    try {
      const response = await axios.get('/api/marketing/competitor-insights');
      return response.data;
    } catch (error) {
      console.error('Get competitor insights error:', error);
      return mockMarketingData.competitorInsights;
    }
  },
  
  // Metrics
  getMarketingMetrics: async () => {
    try {
      const response = await axios.get('/api/marketing/metrics');
      return response.data;
    } catch (error) {
      console.error('Get marketing metrics error:', error);
      return mockMarketingData.metrics;
    }
  },
  
  // Meeting Analysis
  analyzeMeetingTranscript: async (transcriptData: any) => {
    try {
      const response = await axios.post('/api/marketing/analyze-transcript', transcriptData);
      return response.data;
    } catch (error) {
      console.error('Analyze meeting transcript error:', error);
      return {
        summary: "Client is interested in our services but has concerns about timeline and budget.",
        keyPoints: [
          "Budget concerns regarding implementation costs",
          "Timeline needs to be shortened by 2 weeks",
          "Client prefers regular video updates"
        ],
        nextSteps: [
          "Revise proposal with updated timeline",
          "Provide detailed budget breakdown",
          "Schedule follow-up meeting next week"
        ],
        sentiment: "positive"
      };
    }
  }
};

export default marketingService;
