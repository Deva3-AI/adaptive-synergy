
import apiClient, { handleApiError } from '@/utils/apiUtils';
import { supabase } from '@/integrations/supabase/client';

// Mock data generator for development
const generateMockData = (type: string, params?: any) => {
  // This will be replaced with actual API calls in production
  switch (type) {
    case 'campaigns':
      return Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Campaign ${i + 1}`,
        type: ['email', 'social', 'content', 'paid'][Math.floor(Math.random() * 4)],
        status: ['active', 'planned', 'completed', 'paused'][Math.floor(Math.random() * 4)],
        start_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: Math.floor(Math.random() * 10000) + 1000,
        roi: (Math.random() * 5 + 1).toFixed(2),
        leads_generated: Math.floor(Math.random() * 100) + 10,
        conversion_rate: (Math.random() * 10 + 1).toFixed(2),
      }));
    
    case 'meetings':
      return Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Meeting with Lead ${i + 1}`,
        type: ['discovery', 'proposal', 'follow-up', 'negotiation'][Math.floor(Math.random() * 4)],
        date: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: `${Math.floor(Math.random() * 8) + 9}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        contact_name: `Contact Person ${i + 1}`,
        company: `Company ${i + 1}`,
        status: ['scheduled', 'completed', 'rescheduled', 'cancelled'][Math.floor(Math.random() * 4)],
        notes: `Discussion about ${['new project', 'ongoing campaign', 'service proposal', 'partnership opportunity'][Math.floor(Math.random() * 4)]}`,
      }));
    
    case 'analytics':
      return {
        overview: {
          total_leads: Math.floor(Math.random() * 500) + 200,
          lead_growth: (Math.random() * 30).toFixed(1),
          conversion_rate: (Math.random() * 15 + 5).toFixed(1),
          avg_deal_size: Math.floor(Math.random() * 5000) + 2000,
          channel_performance: [
            { name: 'Email', value: Math.floor(Math.random() * 40) + 10 },
            { name: 'Social', value: Math.floor(Math.random() * 30) + 5 },
            { name: 'Referrals', value: Math.floor(Math.random() * 20) + 5 },
            { name: 'Organic', value: Math.floor(Math.random() * 15) + 5 },
            { name: 'Paid', value: Math.floor(Math.random() * 10) + 5 },
          ],
        },
        campaigns: {
          total: Math.floor(Math.random() * 20) + 10,
          active: Math.floor(Math.random() * 10) + 5,
          roi: (Math.random() * 4 + 1).toFixed(2),
          best_performing: {
            name: `Campaign ${Math.floor(Math.random() * 5) + 1}`,
            conversion_rate: (Math.random() * 20 + 10).toFixed(1),
            roi: (Math.random() * 5 + 2).toFixed(2),
          },
        },
        leads: {
          monthly_trend: Array(12).fill(null).map((_, i) => ({
            month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
            value: Math.floor(Math.random() * 80) + 20,
          })),
          by_source: [
            { name: 'Email Outreach', value: Math.floor(Math.random() * 150) + 50 },
            { name: 'Social Media', value: Math.floor(Math.random() * 120) + 30 },
            { name: 'Website', value: Math.floor(Math.random() * 100) + 20 },
            { name: 'Referrals', value: Math.floor(Math.random() * 80) + 20 },
            { name: 'Events', value: Math.floor(Math.random() * 50) + 10 },
          ],
          conversion_by_stage: [
            { name: 'Awareness', value: Math.floor(Math.random() * 100) + 500 },
            { name: 'Interest', value: Math.floor(Math.random() * 100) + 300 },
            { name: 'Consideration', value: Math.floor(Math.random() * 100) + 150 },
            { name: 'Intent', value: Math.floor(Math.random() * 100) + 70 },
            { name: 'Evaluation', value: Math.floor(Math.random() * 100) + 40 },
            { name: 'Purchase', value: Math.floor(Math.random() * 100) + 20 },
          ],
        },
      };
    
    case 'email-outreach':
      return Array(10).fill(null).map((_, i) => ({
        id: i + 1,
        template_name: `Template ${i + 1}`,
        subject: `Subject for Template ${i + 1}`,
        sent_count: Math.floor(Math.random() * 200) + 50,
        open_rate: (Math.random() * 40 + 20).toFixed(1),
        click_rate: (Math.random() * 20 + 5).toFixed(1),
        response_rate: (Math.random() * 10 + 2).toFixed(1),
        last_sent: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: ['active', 'draft', 'archived'][Math.floor(Math.random() * 3)],
        category: ['cold-outreach', 'follow-up', 'nurture', 'promotional'][Math.floor(Math.random() * 4)],
      }));
    
    case 'leads':
      return Array(15).fill(null).map((_, i) => ({
        id: i + 1,
        name: `Lead ${i + 1}`,
        company: `Company ${i + 1}`,
        position: ['CEO', 'Marketing Director', 'Operations Manager', 'CTO', 'Business Owner'][Math.floor(Math.random() * 5)],
        email: `lead${i + 1}@company${i + 1}.com`,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        source: ['Website', 'Referral', 'LinkedIn', 'Email Campaign', 'Event'][Math.floor(Math.random() * 5)],
        status: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'][Math.floor(Math.random() * 7)],
        last_contact: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        next_follow_up: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimated_value: Math.floor(Math.random() * 10000) + 1000,
        probability: Math.floor(Math.random() * 100),
        notes: `Notes about Lead ${i + 1}`,
      }));
    
    case 'marketing-plans':
      return Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Marketing Plan ${i + 1}`,
        description: `Description for Marketing Plan ${i + 1}`,
        start_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: ['active', 'draft', 'completed', 'on_hold'][Math.floor(Math.random() * 4)],
        budget: Math.floor(Math.random() * 50000) + 10000,
        goals: Array(3).fill(null).map((_, j) => ({
          id: j + 1,
          title: ['Increase Website Traffic', 'Generate Leads', 'Improve Conversion Rate', 'Boost Social Media Presence', 'Launch New Product'][Math.floor(Math.random() * 5)],
          target: `${Math.floor(Math.random() * 100) + 20}%`,
          current: `${Math.floor(Math.random() * 50) + 10}%`,
        })),
        channels: ['Email', 'Social Media', 'Content Marketing', 'SEO', 'Paid Ads'].slice(0, Math.floor(Math.random() * 5) + 1),
        target_audience: ['Small Businesses', 'Enterprise Companies', 'Startups', 'E-commerce', 'B2B Services'].slice(0, Math.floor(Math.random() * 5) + 1),
        milestones: Array(4).fill(null).map((_, j) => ({
          id: j + 1,
          title: `Milestone ${j + 1}`,
          date: new Date(Date.now() + j * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: ['pending', 'completed', 'in_progress', 'delayed'][Math.floor(Math.random() * 4)],
        })),
      }));
    
    case 'marketing-trends':
      return Array(8).fill(null).map((_, i) => ({
        id: i + 1,
        title: ['AI in Marketing', 'Video Content', 'Personalization', 'Voice Search', 'Social Commerce', 'Sustainability Marketing', 'Influencer Marketing', 'Interactive Content'][i],
        description: `Trend description for ${['AI in Marketing', 'Video Content', 'Personalization', 'Voice Search', 'Social Commerce', 'Sustainability Marketing', 'Influencer Marketing', 'Interactive Content'][i]}`,
        relevance_score: Math.floor(Math.random() * 10) + 1,
        adoption_level: ['early', 'growing', 'mainstream', 'mature'][Math.floor(Math.random() * 4)],
        expected_impact: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        suggested_actions: Array(3).fill(null).map((_, j) => `Action ${j + 1} for trend ${i + 1}`),
        resources_needed: ['budget', 'training', 'tools', 'expertise'].slice(0, Math.floor(Math.random() * 4) + 1),
        implementation_timeline: ['immediate', 'short-term', 'mid-term', 'long-term'][Math.floor(Math.random() * 4)],
        industry_examples: Array(2).fill(null).map((_, j) => `Example ${j + 1} for trend ${i + 1}`),
      }));
    
    case 'competitor-insights':
      return Array(5).fill(null).map((_, i) => ({
        id: i + 1,
        competitor_name: `Competitor ${i + 1}`,
        website: `https://competitor${i + 1}.com`,
        strengths: Array(3).fill(null).map((_, j) => `Strength ${j + 1} for competitor ${i + 1}`),
        weaknesses: Array(3).fill(null).map((_, j) => `Weakness ${j + 1} for competitor ${i + 1}`),
        recent_activities: Array(3).fill(null).map((_, j) => `Activity ${j + 1} for competitor ${i + 1}`),
        target_audience: ['Small Businesses', 'Enterprise Companies', 'Startups', 'E-commerce', 'B2B Services'].slice(0, Math.floor(Math.random() * 5) + 1),
        pricing_strategy: ['premium', 'competitive', 'economy', 'freemium', 'subscription'][Math.floor(Math.random() * 5)],
        market_share: (Math.random() * 30).toFixed(1),
        growth_rate: (Math.random() * 20 - 5).toFixed(1),
        threat_level: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
        opportunity_areas: Array(2).fill(null).map((_, j) => `Opportunity ${j + 1} for differentiating from competitor ${i + 1}`),
      }));
    
    case 'marketing-metrics':
      return {
        website_traffic: {
          total_visits: Math.floor(Math.random() * 100000) + 20000,
          growth_rate: (Math.random() * 30 - 5).toFixed(1),
          bounce_rate: (Math.random() * 30 + 20).toFixed(1),
          avg_session_duration: (Math.random() * 5 + 1).toFixed(2),
          by_source: [
            { name: 'Organic', value: Math.floor(Math.random() * 50000) + 10000 },
            { name: 'Paid', value: Math.floor(Math.random() * 30000) + 5000 },
            { name: 'Social', value: Math.floor(Math.random() * 20000) + 3000 },
            { name: 'Referral', value: Math.floor(Math.random() * 10000) + 2000 },
            { name: 'Direct', value: Math.floor(Math.random() * 5000) + 1000 },
          ],
          monthly_trend: Array(12).fill(null).map((_, i) => ({
            month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
            value: Math.floor(Math.random() * 10000) + 5000,
          })),
        },
        social_media: {
          followers: Math.floor(Math.random() * 50000) + 10000,
          growth_rate: (Math.random() * 20).toFixed(1),
          engagement_rate: (Math.random() * 5 + 1).toFixed(2),
          reach: Math.floor(Math.random() * 200000) + 50000,
          by_platform: [
            { name: 'LinkedIn', value: Math.floor(Math.random() * 20000) + 5000, growth: (Math.random() * 20).toFixed(1) },
            { name: 'Twitter', value: Math.floor(Math.random() * 15000) + 3000, growth: (Math.random() * 15).toFixed(1) },
            { name: 'Facebook', value: Math.floor(Math.random() * 10000) + 2000, growth: (Math.random() * 10).toFixed(1) },
            { name: 'Instagram', value: Math.floor(Math.random() * 5000) + 1000, growth: (Math.random() * 25).toFixed(1) },
          ],
          top_posts: Array(3).fill(null).map((_, i) => ({
            id: i + 1,
            platform: ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'][Math.floor(Math.random() * 4)],
            content: `Content snippet for post ${i + 1}`,
            engagement: Math.floor(Math.random() * 1000) + 100,
            reach: Math.floor(Math.random() * 5000) + 500,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          })),
        },
        email_marketing: {
          total_subscribers: Math.floor(Math.random() * 20000) + 5000,
          growth_rate: (Math.random() * 15).toFixed(1),
          avg_open_rate: (Math.random() * 30 + 15).toFixed(1),
          avg_click_rate: (Math.random() * 10 + 2).toFixed(1),
          unsubscribe_rate: (Math.random() * 2).toFixed(2),
          best_performing_campaign: {
            name: `Campaign ${Math.floor(Math.random() * 5) + 1}`,
            open_rate: (Math.random() * 50 + 20).toFixed(1),
            click_rate: (Math.random() * 30 + 5).toFixed(1),
            conversion_rate: (Math.random() * 15 + 2).toFixed(1),
          },
        },
        content_marketing: {
          total_content_pieces: Math.floor(Math.random() * 200) + 50,
          avg_engagement: (Math.random() * 500 + 100).toFixed(0),
          conversion_rate: (Math.random() * 5 + 1).toFixed(2),
          by_type: [
            { name: 'Blog Posts', value: Math.floor(Math.random() * 100) + 20 },
            { name: 'Case Studies', value: Math.floor(Math.random() * 50) + 10 },
            { name: 'Whitepapers', value: Math.floor(Math.random() * 30) + 5 },
            { name: 'Videos', value: Math.floor(Math.random() * 20) + 5 },
            { name: 'Infographics', value: Math.floor(Math.random() * 10) + 5 },
          ],
          top_performing: Array(3).fill(null).map((_, i) => ({
            id: i + 1,
            title: `Content ${i + 1}`,
            type: ['Blog Post', 'Case Study', 'Whitepaper', 'Video', 'Infographic'][Math.floor(Math.random() * 5)],
            views: Math.floor(Math.random() * 5000) + 1000,
            engagement: Math.floor(Math.random() * 500) + 100,
            conversion_rate: (Math.random() * 10 + 1).toFixed(2),
          })),
        },
      };
        
    case 'meeting-transcript':
      return {
        summary: "The meeting focused on the client's needs for a new marketing campaign targeting small business owners. The client wants to increase brand awareness and generate leads through social media and email marketing.",
        key_points: [
          "Client is looking for a comprehensive marketing strategy",
          "Target audience is small business owners in the tech sector",
          "Budget is around $10,000-$15,000 for the initial campaign",
          "Timeline is 3 months with a potential extension",
          "Client prefers data-driven approach with regular reporting"
        ],
        action_items: [
          { task: "Create initial campaign proposal", assignee: "Marketing Team", deadline: "Next Friday" },
          { task: "Research similar campaigns in tech sector", assignee: "Research Team", deadline: "Wednesday" },
          { task: "Develop budget breakdown", assignee: "Finance Team", deadline: "Monday" },
          { task: "Draft email templates", assignee: "Content Team", deadline: "Next Tuesday" }
        ],
        client_pain_points: [
          "Previous agencies didn't provide enough reporting",
          "Struggled to track ROI from marketing efforts",
          "Limited success with previous social media campaigns",
          "Needs help with messaging and positioning"
        ],
        opportunities: [
          "Client has untapped email list of 5,000+ contacts",
          "Client has good content that can be repurposed",
          "Client is open to testimonial videos",
          "Client has budget for paid social campaigns"
        ],
        follow_up_schedule: {
          next_meeting: "Two weeks from today",
          deliverables: [
            "Initial campaign proposal",
            "Budget breakdown",
            "Timeline for implementation",
            "KPI tracking methodology"
          ]
        }
      };
      
    case 'email-templates':
      return [
        {
          id: 1,
          name: "Cold Outreach - Initial Contact",
          subject: "Quick question about your [business area] goals",
          body: "Hi {first_name},\n\nI noticed [company_name]'s recent [achievement/news] and wanted to reach out. We've helped similar businesses in [industry] achieve [specific result] through our [service].\n\nWould you be open to a brief conversation about how we might help [company_name] with [specific goal]?\n\nBest regards,\n{sender_name}",
          variables: ["first_name", "company_name", "industry", "specific_result", "service", "specific_goal", "sender_name"],
          category: "cold-outreach",
          performance: {
            open_rate: 35,
            response_rate: 12,
            meetings_booked: 5
          }
        },
        {
          id: 2,
          name: "Follow-up - After No Response",
          subject: "Following up: [specific topic]",
          body: "Hi {first_name},\n\nI wanted to follow up on my previous email about helping [company_name] with [specific goal].\n\nI understand you're busy, but I thought you might be interested in this [case study/resource] showing how we helped [similar company] achieve [specific result].\n\nWould you have 15 minutes this week to discuss how we could achieve similar results for [company_name]?\n\nBest regards,\n{sender_name}",
          variables: ["first_name", "company_name", "specific_goal", "case_study/resource", "similar_company", "specific_result", "sender_name"],
          category: "follow-up",
          performance: {
            open_rate: 42,
            response_rate: 15,
            meetings_booked: 7
          }
        },
        {
          id: 3,
          name: "Meeting Confirmation",
          subject: "Confirmed: Our meeting on [date]",
          body: "Hi {first_name},\n\nI'm looking forward to our conversation on {meeting_date} at {meeting_time}.\n\nTo make our time most valuable, I've prepared a few questions:\n\n1. What are your current challenges with [business area]?\n2. What have you tried so far to address these challenges?\n3. What would success look like for you in the next [timeframe]?\n\nFeel free to share any specific topics you'd like to discuss.\n\nBest regards,\n{sender_name}\n\nP.S. Here's a calendar invite for your convenience: {calendar_link}",
          variables: ["first_name", "meeting_date", "meeting_time", "business_area", "timeframe", "sender_name", "calendar_link"],
          category: "meeting",
          performance: {
            open_rate: 82,
            response_rate: 65,
            meetings_booked: 0
          }
        },
        {
          id: 4,
          name: "Proposal Follow-up",
          subject: "Next steps for [company_name]'s [project/solution]",
          body: "Hi {first_name},\n\nI hope you've had a chance to review the proposal I sent on {sent_date}.\n\nBased on our conversation, I believe the [specific solution] we outlined would help [company_name] achieve [specific goal] within [timeframe].\n\nDo you have any questions about the proposal or would you like to discuss any adjustments to better meet your needs?\n\nBest regards,\n{sender_name}",
          variables: ["first_name", "company_name", "sent_date", "specific_solution", "specific_goal", "timeframe", "sender_name"],
          category: "proposal",
          performance: {
            open_rate: 78,
            response_rate: 45,
            meetings_booked: 0
          }
        },
        {
          id: 5,
          name: "Client Onboarding - Welcome",
          subject: "Welcome to [company_name]!",
          body: "Hi {first_name},\n\nWe're thrilled to have [client_company] join us as a client!\n\nHere's what happens next:\n\n1. Your account manager, {account_manager}, will reach out within 24 hours to schedule your kickoff meeting.\n2. You'll receive access to our client portal at {portal_link}.\n3. We'll begin working on [initial_deliverable] as discussed.\n\nIf you have any questions in the meantime, feel free to reach out.\n\nWe're excited to help [client_company] achieve [specific_goal]!\n\nBest regards,\n{sender_name}",
          variables: ["first_name", "client_company", "account_manager", "portal_link", "initial_deliverable", "specific_goal", "sender_name"],
          category: "onboarding",
          performance: {
            open_rate: 95,
            response_rate: 72,
            meetings_booked: 0
          }
        }
      ];
      
    default:
      return [];
  }
};

const marketingService = {
  // Campaign-related methods
  getCampaigns: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/campaigns');
      
      // Mock data for development
      return generateMockData('campaigns');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post('/marketing/campaigns', campaignData);
      
      // Mock response for development
      return { 
        success: true, 
        message: 'Campaign created successfully', 
        campaign: { id: Date.now(), ...campaignData } 
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to create campaign' });
    }
  },
  
  // Meeting-related methods
  getMeetings: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/meetings');
      
      // Mock data for development
      return generateMockData('meetings');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post('/marketing/meetings', meetingData);
      
      // Mock response for development
      return { 
        success: true, 
        message: 'Meeting created successfully', 
        meeting: { id: Date.now(), ...meetingData } 
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to create meeting' });
    }
  },
  
  // Analytics-related methods
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/analytics', { params: { startDate, endDate } });
      
      // Mock data for development
      return generateMockData('analytics');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  // Email Outreach
  getEmailOutreach: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/email-outreach');
      
      // Mock data for development
      return generateMockData('email-outreach');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  // Leads
  getLeads: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/leads');
      
      // Mock data for development
      return generateMockData('leads');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  // Marketing Plans
  getMarketingPlans: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/plans');
      
      // Mock data for development
      return generateMockData('marketing-plans');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      // In production, this would be an API call
      // return await apiClient.get(`/marketing/plans/${planId}`);
      
      // Mock data for development
      const plans = generateMockData('marketing-plans');
      return plans.find((plan: any) => plan.id === planId) || null;
    } catch (error) {
      return handleApiError(error, null);
    }
  },
  
  // Marketing Trends
  getMarketingTrends: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/trends');
      
      // Mock data for development
      return generateMockData('marketing-trends');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  // Competitor Insights
  getCompetitorInsights: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/competitor-insights');
      
      // Mock data for development
      return generateMockData('competitor-insights');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  // Marketing Metrics
  getMarketingMetrics: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/metrics');
      
      // Mock data for development
      return generateMockData('marketing-metrics');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  // Meeting Analysis
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post('/marketing/analyze-transcript', { transcript });
      
      // Mock data for development
      return generateMockData('meeting-transcript');
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  // Email Templates
  getEmailTemplates: async () => {
    try {
      // In production, this would be an API call
      // return await apiClient.get('/marketing/email-templates');
      
      // Mock data for development
      return generateMockData('email-templates');
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  createEmailTemplate: async (templateData: any) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post('/marketing/email-templates', templateData);
      
      // Mock response for development
      return { 
        success: true, 
        message: 'Email template created successfully', 
        template: { id: Date.now(), ...templateData, performance: { open_rate: 0, response_rate: 0, meetings_booked: 0 } } 
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to create email template' });
    }
  },
  
  updateEmailTemplate: async (templateId: number, templateData: any) => {
    try {
      // In production, this would be an API call
      // return await apiClient.put(`/marketing/email-templates/${templateId}`, templateData);
      
      // Mock response for development
      return { 
        success: true, 
        message: 'Email template updated successfully', 
        template: { id: templateId, ...templateData } 
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to update email template' });
    }
  },
  
  improveEmailTemplate: async (templateId: number, promptConstraints: any) => {
    try {
      // In production, this would be an API call
      // return await apiClient.post(`/marketing/email-templates/${templateId}/improve`, promptConstraints);
      
      // Mock response for development - simulating AI improvement
      const templates = generateMockData('email-templates');
      const template = templates.find((t: any) => t.id === templateId);
      
      if (!template) {
        return { success: false, message: 'Template not found' };
      }
      
      // Simulate AI improvements
      const improved = {
        ...template,
        subject: template.subject + " - Enhanced",
        body: template.body.replace("I noticed", "I recently noticed").replace("Would you be open", "I'm curious if you'd be open"),
        improvements: [
          "Made subject line more engaging",
          "Improved opening sentence to create stronger connection",
          "Added specificity to value proposition",
          "Created more conversational tone throughout",
          "Enhanced call to action"
        ]
      };
      
      return { 
        success: true, 
        message: 'Email template improved successfully', 
        original: template,
        improved: improved
      };
    } catch (error) {
      return handleApiError(error, { success: false, message: 'Failed to improve email template' });
    }
  }
};

export default marketingService;
