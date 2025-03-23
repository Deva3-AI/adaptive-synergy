
import apiClient from '@/utils/apiUtils';
import { 
  EmailOutreach, 
  MarketingMeeting, 
  LeadProfile, 
  MeetingInsight, 
  MarketingMetrics, 
  MarketingTrend, 
  CompetitorInsight, 
  MarketingPlan,
  EmailTemplate
} from '@/interfaces/marketing';
import { toast } from 'sonner';

const marketingService = {
  // Email outreach related methods
  getEmailOutreach: async (filters?: any) => {
    try {
      const response = await apiClient.get('/marketing/email-outreach', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get email outreach error:', error);
      // Return mock data for development
      return Array(10).fill(null).map((_, index) => ({
        id: index + 1,
        subject: `Potential collaboration opportunity - ${index + 1}`,
        recipient: `lead${index + 1}@example.com`,
        recipientCompany: `Company ${index + 1}`,
        recipientPosition: 'Marketing Director',
        sentAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        status: ['sent', 'opened', 'replied', 'bounced'][Math.floor(Math.random() * 4)],
        responseTime: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000) : undefined,
        source: ['bni', 'master_networks', 'other'][Math.floor(Math.random() * 3)],
        sentBy: 1,
        followUpScheduled: Math.random() > 0.7
      }));
    }
  },
  
  sendEmail: async (emailData: Partial<EmailOutreach>) => {
    try {
      const response = await apiClient.post('/marketing/email-outreach', emailData);
      toast.success('Email sent successfully');
      return response.data;
    } catch (error) {
      console.error('Send email error:', error);
      toast.error('Failed to send email');
      throw error;
    }
  },
  
  // Meeting related methods
  getMeetings: async (filters?: any) => {
    try {
      const response = await apiClient.get('/marketing/meetings', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get meetings error:', error);
      // Return mock data for development
      return Array(8).fill(null).map((_, index) => ({
        id: index + 1,
        leadId: index + 1,
        leadName: `Lead ${index + 1}`,
        leadCompany: `Company ${index + 1}`,
        scheduledTime: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)),
        duration: [30, 45, 60][Math.floor(Math.random() * 3)],
        status: ['scheduled', 'completed', 'cancelled', 'rescheduled'][Math.floor(Math.random() * 4)],
        attendees: ['CEO', `Lead ${index + 1}`, 'Marketing Manager'],
        platform: ['google_meet', 'zoom', 'teams', 'in_person', 'other'][Math.floor(Math.random() * 5)]
      }));
    }
  },
  
  scheduleMeeting: async (meetingData: Partial<MarketingMeeting>) => {
    try {
      const response = await apiClient.post('/marketing/meetings', meetingData);
      toast.success('Meeting scheduled successfully');
      return response.data;
    } catch (error) {
      console.error('Schedule meeting error:', error);
      toast.error('Failed to schedule meeting');
      throw error;
    }
  },
  
  // Lead profile related methods
  getLeads: async (filters?: any) => {
    try {
      const response = await apiClient.get('/marketing/leads', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Get leads error:', error);
      // Return mock data for development
      return Array(15).fill(null).map((_, index) => ({
        id: index + 1,
        name: `Lead ${index + 1}`,
        company: `Company ${index + 1}`,
        position: ['CEO', 'Marketing Director', 'Operations Manager'][Math.floor(Math.random() * 3)],
        email: `lead${index + 1}@example.com`,
        phone: Math.random() > 0.3 ? `555-${100 + index}` : undefined,
        source: ['BNI', 'Master Networks', 'Website', 'Referral'][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
        lastContactedAt: Math.random() > 0.2 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        status: ['new', 'contacted', 'meeting_scheduled', 'meeting_completed', 'proposal_sent', 'converted', 'lost'][Math.floor(Math.random() * 7)],
        score: Math.floor(Math.random() * 100),
        interactions: Array(Math.floor(Math.random() * 5)).fill(null).map((_, idx) => ({
          id: idx + 1,
          leadId: index + 1,
          type: ['email', 'meeting', 'call', 'message', 'other'][Math.floor(Math.random() * 5)],
          date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
          description: `Interaction ${idx + 1} with lead`,
          outcome: Math.random() > 0.5 ? 'Positive response' : 'No response yet',
          sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)]
        }))
      }));
    }
  },
  
  getLeadById: async (leadId: number) => {
    try {
      const response = await apiClient.get(`/marketing/leads/${leadId}`);
      return response.data;
    } catch (error) {
      console.error('Get lead by ID error:', error);
      // Return mock data for development
      return {
        id: leadId,
        name: `Lead ${leadId}`,
        company: `Company ${leadId}`,
        position: 'Marketing Director',
        email: `lead${leadId}@example.com`,
        phone: `555-${100 + leadId}`,
        source: 'BNI',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastContactedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'meeting_scheduled',
        score: 75,
        tags: ['interested', 'high-budget', 'marketing'],
        notes: 'Very interested in our marketing services, especially social media management.',
        socialProfiles: {
          linkedin: `https://linkedin.com/in/lead${leadId}`,
          website: `https://company${leadId}.com`
        },
        interactions: Array(3).fill(null).map((_, idx) => ({
          id: idx + 1,
          leadId,
          type: ['email', 'meeting', 'call'][idx],
          date: new Date(Date.now() - (30 - idx * 10) * 24 * 60 * 60 * 1000),
          description: `Interaction ${idx + 1} with lead`,
          outcome: 'Positive response',
          nextSteps: idx === 2 ? 'Schedule follow-up meeting' : '',
          sentiment: 'positive'
        }))
      };
    }
  },
  
  // Meeting insights
  getMeetingInsights: async (meetingId: number) => {
    try {
      const response = await apiClient.get(`/marketing/meetings/${meetingId}/insights`);
      return response.data;
    } catch (error) {
      console.error('Get meeting insights error:', error);
      // Return mock data for development
      return Array(5).fill(null).map((_, index) => ({
        id: index + 1,
        meetingId,
        leadId: 1,
        type: ['action_item', 'preference', 'concern', 'opportunity', 'objection'][index % 5],
        content: [
          'Send proposal by end of week',
          'Prefers minimalist design style',
          'Concerned about implementation timeline',
          'Interested in additional social media services',
          'Budget constraints may be an issue'
        ][index % 5],
        assignee: index % 2 === 0 ? 'Marketing Manager' : 'CEO',
        priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        dueDate: index % 2 === 0 ? new Date(Date.now() + (index + 1) * 2 * 24 * 60 * 60 * 1000) : undefined,
        status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)]
      }));
    }
  },
  
  // Analytics and metrics
  getMarketingMetrics: async (period: 'week' | 'month' | 'quarter' | 'year' = 'month') => {
    try {
      const response = await apiClient.get('/marketing/metrics', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Get marketing metrics error:', error);
      // Return mock data for development
      const periodEnd = new Date();
      let periodStart: Date;
      
      switch (period) {
        case 'week':
          periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          periodStart = new Date(periodEnd.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          periodStart = new Date(periodEnd.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          periodStart = new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      return {
        emailsSent: 87,
        emailOpenRate: 0.42,
        emailResponseRate: 0.18,
        meetingsScheduled: 12,
        meetingConversionRate: 0.75,
        salesCloseRate: 0.35,
        averageResponseTime: 6.5,
        leadAcquisitionCost: 35,
        customerAcquisitionCost: 250,
        periodStart,
        periodEnd
      };
    }
  },
  
  // Trends and market research
  getMarketingTrends: async () => {
    try {
      const response = await apiClient.get('/marketing/trends');
      return response.data;
    } catch (error) {
      console.error('Get marketing trends error:', error);
      // Return mock data for development
      return Array(5).fill(null).map((_, index) => ({
        id: index + 1,
        title: [
          'Rising demand for video-based content',
          'AI-driven personalization gaining traction',
          'Voice search optimization importance growing',
          'Sustainability messaging resonating with audiences',
          'Micro-influencer marketing effectiveness increasing'
        ][index],
        description: `Detailed information about the "${['Rising demand for video-based content', 'AI-driven personalization gaining traction', 'Voice search optimization importance growing', 'Sustainability messaging resonating with audiences', 'Micro-influencer marketing effectiveness increasing'][index]}" trend.`,
        source: ['Industry Report', 'Competitor Analysis', 'Market Research', 'Social Listening', 'Customer Feedback'][index],
        discoveredAt: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000),
        relevanceScore: 85 - (index * 5),
        category: ['industry', 'competitor', 'technology', 'customer_behavior', 'other'][index],
        actionable: index < 3,
        suggestedActions: index < 3 ? ['Update marketing strategy', 'Create new content', 'Allocate resources'] : undefined
      }));
    }
  },
  
  getCompetitorInsights: async () => {
    try {
      const response = await apiClient.get('/marketing/competitor-insights');
      return response.data;
    } catch (error) {
      console.error('Get competitor insights error:', error);
      // Return mock data for development
      return Array(4).fill(null).map((_, index) => ({
        id: index + 1,
        competitorName: `Competitor ${index + 1}`,
        description: `Important insight about Competitor ${index + 1}'s recent activities.`,
        source: ['Industry Report', 'Website Analysis', 'Social Media', 'Client Feedback'][index % 4],
        discoveredAt: new Date(Date.now() - index * 5 * 24 * 60 * 60 * 1000),
        type: ['strategy', 'offering', 'pricing', 'marketing', 'other'][index % 5],
        impact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        suggestedResponse: 'Update our offering to maintain competitive advantage.'
      }));
    }
  },
  
  // Marketing plans
  getMarketingPlans: async () => {
    try {
      const response = await apiClient.get('/marketing/plans');
      return response.data;
    } catch (error) {
      console.error('Get marketing plans error:', error);
      // Return mock data for development
      return Array(3).fill(null).map((_, index) => ({
        id: index + 1,
        title: `${['Q1', 'Q2', 'Q3'][index]} Marketing Plan`,
        description: `Comprehensive marketing strategy for ${['Q1', 'Q2', 'Q3'][index]}.`,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        timeframe: 'quarterly',
        objectives: [
          'Increase lead generation by 20%',
          'Improve conversion rate by 15%',
          'Expand social media presence'
        ],
        targetMetrics: {
          leadGeneration: 500,
          conversionRate: 0.35,
          salesGrowth: 0.25
        },
        actions: Array(5).fill(null).map((_, idx) => ({
          id: idx + 1,
          title: `Action ${idx + 1}`,
          description: `Description for action ${idx + 1}`,
          priority: ['low', 'medium', 'high'][idx % 3],
          estimatedImpact: ['low', 'medium', 'high'][(idx + 1) % 3],
          effort: ['low', 'medium', 'high'][(idx + 2) % 3],
          status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
          dueDate: new Date(Date.now() + (idx + 1) * 15 * 24 * 60 * 60 * 1000),
          assignee: (idx % 3) + 1,
          progress: Math.floor(Math.random() * 100)
        })),
        status: ['draft', 'active', 'completed'][index % 3]
      }));
    }
  },
  
  getMarketingPlanById: async (planId: number) => {
    try {
      const response = await apiClient.get(`/marketing/plans/${planId}`);
      return response.data;
    } catch (error) {
      console.error('Get marketing plan by ID error:', error);
      // For development, just call getMarketingPlans and filter
      const plans = await marketingService.getMarketingPlans();
      return plans.find((p: any) => p.id === planId) || null;
    }
  },
  
  // Email templates
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get('/marketing/email-templates');
      return response.data;
    } catch (error) {
      console.error('Get email templates error:', error);
      // Return mock data for development
      return Array(5).fill(null).map((_, index) => ({
        id: index + 1,
        name: [
          'Initial Outreach',
          'Follow-up Template',
          'Meeting Request',
          'Proposal Intro',
          'Thank You Message'
        ][index],
        subject: [
          'Opportunity to collaborate with BrandingBeez',
          'Following up on our previous conversation',
          'Let's schedule a quick meeting',
          'Proposal for your consideration',
          'Thank you for your time'
        ][index],
        body: `This is the body of the ${[
          'Initial Outreach',
          'Follow-up Template',
          'Meeting Request',
          'Proposal Intro',
          'Thank You Message'
        ][index]} template with variables like {{lead_name}}, {{company_name}}, etc.`,
        category: ['outreach', 'follow_up', 'meeting_request', 'proposal', 'other'][index],
        variables: ['lead_name', 'company_name', 'user_name', 'meeting_date'],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        performanceMetrics: {
          usageCount: 15 + index * 5,
          openRate: 0.5 - (index * 0.05),
          responseRate: 0.3 - (index * 0.04)
        }
      }));
    }
  },
  
  // Meeting transcripts analysis
  analyzeMeetingTranscript: async (transcriptData: { text: string, meetingId: number }) => {
    try {
      const response = await apiClient.post('/marketing/analyze-meeting', transcriptData);
      return response.data;
    } catch (error) {
      console.error('Analyze meeting transcript error:', error);
      // Return mock analysis for development
      return {
        summary: "The meeting discussed potential marketing services for the client's business. They expressed interest in social media management and content creation, with concerns about budget and timeline.",
        keyPoints: [
          "Client is interested in social media management",
          "Budget constraints mentioned ($2000-3000/month)",
          "Timeline expected is 3 months initial contract",
          "Concerned about measuring ROI",
          "Mentioned previous negative experience with another agency"
        ],
        actionItems: [
          {
            description: "Send detailed proposal by Friday",
            assignee: "Marketing Team",
            priority: "high"
          },
          {
            description: "Provide case studies of similar clients",
            assignee: "CEO",
            priority: "medium"
          },
          {
            description: "Schedule follow-up call in 2 weeks",
            assignee: "CEO",
            priority: "medium"
          }
        ],
        clientPreferences: [
          "Prefers data-driven approach",
          "Values prompt communication",
          "Interested in innovative strategies",
          "Wants regular reporting"
        ],
        sentiment: "positive",
        nextSteps: "Send proposal and case studies, then follow up in one week."
      };
    }
  }
};

export default marketingService;
