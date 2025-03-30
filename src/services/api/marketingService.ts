
import { apiRequest } from "@/utils/apiUtils";
import { 
  mockEmailTemplates, 
  mockEmailOutreach, 
  mockLeads, 
  mockMarketingPlans,
  mockMarketingTrends,
  mockCompetitorInsights
} from "@/utils/mockData";

const marketingService = {
  // Get all campaigns
  getCampaigns: async () => {
    return apiRequest('/marketing/campaigns', 'get', undefined, []);
  },

  // Create a new campaign
  createCampaign: async (campaignData: any) => {
    return apiRequest('/marketing/campaigns', 'post', campaignData, {});
  },

  // Get all meetings
  getMeetings: async () => {
    return apiRequest('/marketing/meetings', 'get', undefined, []);
  },

  // Create a new meeting
  createMeeting: async (meetingData: any) => {
    return apiRequest('/marketing/meetings', 'post', meetingData, {});
  },

  // Get analytics data
  getAnalytics: async (startDate?: string, endDate?: string) => {
    const url = startDate && endDate
      ? `/marketing/analytics?start=${startDate}&end=${endDate}`
      : '/marketing/analytics';
    return apiRequest(url, 'get', undefined, {});
  },

  // Get email templates
  getEmailTemplates: async () => {
    return apiRequest('/marketing/email-templates', 'get', undefined, mockEmailTemplates);
  },

  // Get email outreach data
  getEmailOutreach: async () => {
    return apiRequest('/marketing/email-outreach', 'get', undefined, mockEmailOutreach);
  },

  // Get leads
  getLeads: async (status?: string) => {
    const url = status ? `/marketing/leads?status=${status}` : '/marketing/leads';
    return apiRequest(url, 'get', undefined, mockLeads);
  },

  // Get marketing plans
  getMarketingPlans: async () => {
    return apiRequest('/marketing/plans', 'get', undefined, mockMarketingPlans);
  },

  // Get marketing plan by id
  getMarketingPlanById: async (planId: number) => {
    return apiRequest(`/marketing/plans/${planId}`, 'get', undefined, 
      mockMarketingPlans.find(plan => plan.id === planId) || {});
  },

  // Get marketing trends
  getMarketingTrends: async () => {
    return apiRequest('/marketing/trends', 'get', undefined, mockMarketingTrends);
  },

  // Get competitor insights
  getCompetitorInsights: async () => {
    return apiRequest('/marketing/competitor-insights', 'get', undefined, mockCompetitorInsights);
  },

  // Analyze meeting transcript
  analyzeMeetingTranscript: async (transcript: string) => {
    return apiRequest('/marketing/analyze-transcript', 'post', { transcript }, {
      key_points: [
        "Client is interested in expanding social media presence",
        "Budget concerns mentioned multiple times",
        "Competitor analysis is a priority",
        "Timeline expectations: results within 3 months"
      ],
      action_items: [
        "Prepare social media proposal with budget options",
        "Conduct competitor analysis for top 3 competitors",
        "Create 90-day performance roadmap",
        "Schedule follow-up meeting in 1 week"
      ],
      sentiment: "positive",
      client_concerns: ["Budget", "Timeline", "Measurable results"]
    });
  },

  // Get marketing metrics
  getMarketingMetrics: async (period?: string) => {
    const url = period ? `/marketing/metrics?period=${period}` : '/marketing/metrics';
    return apiRequest(url, 'get', undefined, {
      website_traffic: 45000,
      conversion_rate: 3.2,
      cost_per_lead: 45,
      social_engagement: 12500,
      email_open_rate: 22.5,
      content_performance: 4.2
    });
  }
};

export default marketingService;
