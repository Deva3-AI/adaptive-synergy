
import { mockMarketingData } from '@/utils/mockMarketingData';

class MarketingService {
  async getMarketingDashboardData() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            campaigns: mockMarketingData.campaigns,
            leads: mockMarketingData.leads,
            meetings: mockMarketingData.meetings
          });
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching marketing dashboard data:', error);
      throw error;
    }
  }

  async getCampaigns() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockMarketingData.campaigns);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  async getLeads() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockMarketingData.leads);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  async getMeetings() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockMarketingData.meetings);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching meetings:', error);
      throw error;
    }
  }

  async getEmailOutreach() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockMarketingData.emailOutreach);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching email outreach:', error);
      throw error;
    }
  }

  async getMarketingPlans() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockMarketingData.plans);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching marketing plans:', error);
      throw error;
    }
  }

  async getMarketingAnalytics() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve(mockMarketingData.analytics);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching marketing analytics:', error);
      throw error;
    }
  }

  async getMeetingAnalysis(meetingId) {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            sentiment: "positive",
            keyTopics: ["product features", "pricing", "timeline"],
            nextSteps: ["Send proposal", "Schedule follow-up meeting"],
            riskFactors: ["Budget constraints", "Timeline concerns"],
            transcript: "This is a sample meeting transcript...",
            attendees: ["John Smith", "Sarah Wilson", "Client Representative"],
          });
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching meeting analysis:', error);
      throw error;
    }
  }

  async getMarketingTrends() {
    try {
      // Mock API call
      return await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            trends: [
              { name: "Email Marketing", value: 65, prevValue: 60 },
              { name: "Social Media", value: 82, prevValue: 75 },
              { name: "Content Marketing", value: 71, prevValue: 68 },
              { name: "SEO", value: 59, prevValue: 52 },
              { name: "Paid Advertising", value: 45, prevValue: 48 }
            ],
            insights: [
              "Social media engagement has increased by 15% in the last month",
              "Email open rates are down 3% compared to last quarter",
              "Content marketing is driving 25% more conversions than last year",
              "Mobile traffic continues to grow and now represents 68% of all visits"
            ]
          });
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching marketing trends:', error);
      throw error;
    }
  }
}

const marketingService = new MarketingService();
export default marketingService;
