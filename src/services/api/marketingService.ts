
import apiClient, { handleApiError } from '@/utils/apiUtils';
import config from '@/config/config';

// Define interfaces
interface Campaign {
  id: number;
  name: string;
  status: 'active' | 'draft' | 'completed' | 'paused';
  platform: string;
  budget: number;
  start_date: string;
  end_date: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cost: number;
  };
}

interface LeadProfile {
  id: number;
  name: string;
  company: string;
  position: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  interest_level: 'high' | 'medium' | 'low';
  notes: string;
  created_at: string;
  last_contact: string;
  social_profiles: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  tags: string[];
}

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: string;
  created_at: string;
  updated_at: string;
  metrics: {
    openRate: number;
    clickRate: number;
    replyRate: number;
    conversionRate: number;
    usageCount: number;
    responseRate: number;
  };
}

interface EmailOutreach {
  id: number;
  name: string;
  status: 'active' | 'draft' | 'completed' | 'paused';
  total_emails: number;
  sent_emails: number;
  opened_emails: number;
  clicked_emails: number;
  replied_emails: number;
  converted_emails: number;
  start_date: string;
  end_date: string;
  template_id: number;
  template_name: string;
  target_audience: string;
  segments: string[];
}

interface MarketingTrend {
  id: number;
  title: string;
  description: string;
  relevance_score: number;
  category: string;
  source: string;
  discovered_at: string;
  actionable: boolean;
  suggested_actions: string[];
}

interface CompetitorInsight {
  id: number;
  competitor_name: string;
  category: string;
  description: string;
  source: string;
  discovered_at: string;
  impact_level: 'high' | 'medium' | 'low';
  opportunity: string;
  threat: string;
  recommended_action: string;
}

interface MarketingPlan {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  start_date: string;
  end_date: string;
  goals: {
    id: number;
    title: string;
    target: string;
    current: string;
    progress: number;
  }[];
  strategies: {
    id: number;
    title: string;
    description: string;
    channels: string[];
    budget: number;
    metrics: {
      name: string;
      target: string;
      current: string;
    }[];
  }[];
  overall_progress: number;
}

// Create marketing service
const marketingService = {
  // Campaigns
  getCampaigns: async () => {
    try {
      const response = await apiClient.get('/marketing/campaigns');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const response = await apiClient.post('/marketing/campaigns', campaignData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Meetings
  getMeetings: async () => {
    try {
      const response = await apiClient.get('/marketing/meetings');
      return response.data;
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const response = await apiClient.post('/marketing/meetings', meetingData);
      return response.data;
    } catch (error) {
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
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  // Mock implementations for front-end
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    try {
      // Mock implementation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Introduction Email",
              subject: "Introduction to Our Services",
              content: "<p>Dear {{name}},</p><p>I hope this email finds you well. I wanted to introduce our company and the services we offer...</p><p>Best regards,<br>{{sender_name}}</p>",
              variables: ["name", "sender_name"],
              category: "Outreach",
              created_at: "2023-04-10T09:00:00Z",
              updated_at: "2023-04-15T14:30:00Z",
              metrics: {
                openRate: 45.2,
                clickRate: 12.8,
                replyRate: 8.5,
                conversionRate: 2.3,
                usageCount: 87,
                responseRate: 9.6
              }
            },
            {
              id: 2,
              name: "Follow-up Meeting",
              subject: "Follow-up on Our Recent Meeting",
              content: "<p>Hello {{name}},</p><p>It was great meeting you on {{meeting_date}}. As discussed, I'm following up with more information about...</p><p>Regards,<br>{{sender_name}}</p>",
              variables: ["name", "meeting_date", "sender_name"],
              category: "Follow-up",
              created_at: "2023-04-12T10:15:00Z",
              updated_at: "2023-04-16T11:45:00Z",
              metrics: {
                openRate: 62.5,
                clickRate: 18.9,
                replyRate: 21.3,
                conversionRate: 5.7,
                usageCount: 53,
                responseRate: 23.8
              }
            },
            {
              id: 3,
              name: "Proposal Email",
              subject: "Proposal for {{company_name}}",
              content: "<p>Dear {{name}},</p><p>Based on our discussion, I'm pleased to present our proposal for {{project_name}}. The details are as follows:</p><p>Project Timeline: {{timeline}}<br>Investment: {{price}}</p><p>Looking forward to your feedback.</p><p>Best regards,<br>{{sender_name}}</p>",
              variables: ["name", "company_name", "project_name", "timeline", "price", "sender_name"],
              category: "Proposal",
              created_at: "2023-04-05T15:30:00Z",
              updated_at: "2023-04-18T09:20:00Z",
              metrics: {
                openRate: 72.1,
                clickRate: 35.6,
                replyRate: 42.8,
                conversionRate: 18.9,
                usageCount: 32,
                responseRate: 45.2
              }
            }
          ]);
        }, 500);
      });
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getEmailOutreach: async (): Promise<EmailOutreach[]> => {
    try {
      // Mock implementation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Q2 Campaign - Web Design Services",
              status: "active",
              total_emails: 150,
              sent_emails: 120,
              opened_emails: 85,
              clicked_emails: 42,
              replied_emails: 18,
              converted_emails: 5,
              start_date: "2023-04-01T00:00:00Z",
              end_date: "2023-06-30T23:59:59Z",
              template_id: 1,
              template_name: "Introduction Email",
              target_audience: "Small Business Owners",
              segments: ["Tech", "E-commerce", "Consulting"]
            },
            {
              id: 2,
              name: "Follow-up Campaign - Recent Meetings",
              status: "active",
              total_emails: 75,
              sent_emails: 75,
              opened_emails: 62,
              clicked_emails: 41,
              replied_emails: 27,
              converted_emails: 12,
              start_date: "2023-05-01T00:00:00Z",
              end_date: "2023-05-31T23:59:59Z",
              template_id: 2,
              template_name: "Follow-up Meeting",
              target_audience: "Meeting Contacts",
              segments: ["Qualified Leads", "Warm Leads"]
            },
            {
              id: 3,
              name: "Proposal Campaign - Agency Services",
              status: "draft",
              total_emails: 50,
              sent_emails: 0,
              opened_emails: 0,
              clicked_emails: 0,
              replied_emails: 0,
              converted_emails: 0,
              start_date: "2023-06-01T00:00:00Z",
              end_date: "2023-07-31T23:59:59Z",
              template_id: 3,
              template_name: "Proposal Email",
              target_audience: "Marketing Directors",
              segments: ["Enterprise", "Mid-Market"]
            }
          ]);
        }, 500);
      });
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getLeads: async (): Promise<LeadProfile[]> => {
    try {
      // Mock implementation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "John Smith",
              company: "Acme Corp",
              position: "Marketing Director",
              email: "john.smith@acmecorp.com",
              phone: "+1 (555) 123-4567",
              source: "LinkedIn",
              status: "qualified",
              interest_level: "high",
              notes: "Interested in website redesign and SEO services",
              created_at: "2023-04-10T09:00:00Z",
              last_contact: "2023-05-15T14:30:00Z",
              social_profiles: {
                linkedin: "https://linkedin.com/in/johnsmith"
              },
              tags: ["website", "seo", "high-budget"]
            },
            {
              id: 2,
              name: "Sarah Johnson",
              company: "XYZ Industries",
              position: "CEO",
              email: "sarah@xyzindustries.com",
              phone: "+1 (555) 987-6543",
              source: "Referral",
              status: "proposal",
              interest_level: "high",
              notes: "Meeting scheduled for next week to discuss proposal",
              created_at: "2023-04-15T11:30:00Z",
              last_contact: "2023-05-18T10:15:00Z",
              social_profiles: {
                linkedin: "https://linkedin.com/in/sarahjohnson",
                twitter: "https://twitter.com/sarahj"
              },
              tags: ["branding", "website", "urgent"]
            },
            {
              id: 3,
              name: "Michael Brown",
              company: "Tech Solutions",
              position: "CTO",
              email: "michael@techsolutions.com",
              phone: "+1 (555) 567-1234",
              source: "Website Contact Form",
              status: "contacted",
              interest_level: "medium",
              notes: "Initial email sent, waiting for response",
              created_at: "2023-05-02T15:45:00Z",
              last_contact: "2023-05-08T09:30:00Z",
              social_profiles: {
                linkedin: "https://linkedin.com/in/michaelbrown"
              },
              tags: ["website", "development", "technical"]
            },
            {
              id: 4,
              name: "Emily Davis",
              company: "Global Media",
              position: "Marketing Manager",
              email: "emily@globalmedia.com",
              phone: "+1 (555) 234-5678",
              source: "Conference",
              status: "new",
              interest_level: "low",
              notes: "Met at MarketingCon 2023, expressed initial interest",
              created_at: "2023-05-10T13:20:00Z",
              last_contact: "2023-05-10T13:20:00Z",
              social_profiles: {},
              tags: ["content", "social-media"]
            },
            {
              id: 5,
              name: "Robert Wilson",
              company: "Innovative Solutions",
              position: "Founder",
              email: "robert@innovativesolutions.com",
              phone: "+1 (555) 876-5432",
              source: "Google Ads",
              status: "won",
              interest_level: "high",
              notes: "Contract signed for website development and SEO",
              created_at: "2023-03-15T10:30:00Z",
              last_contact: "2023-05-12T16:45:00Z",
              social_profiles: {
                linkedin: "https://linkedin.com/in/robertwilson",
                twitter: "https://twitter.com/robertw"
              },
              tags: ["website", "seo", "retainer"]
            }
          ]);
        }, 500);
      });
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getMarketingMetrics: async () => {
    try {
      // Mock implementation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            website_traffic: {
              current_month: 12500,
              previous_month: 10800,
              growth: 15.7,
              sources: [
                { source: "Organic Search", value: 5250, percentage: 42 },
                { source: "Direct", value: 3125, percentage: 25 },
                { source: "Social Media", value: 2000, percentage: 16 },
                { source: "Referral", value: 1250, percentage: 10 },
                { source: "Email", value: 875, percentage: 7 }
              ]
            },
            leads: {
              current_month: 85,
              previous_month: 72,
              growth: 18.1,
              sources: [
                { source: "Website Form", value: 32, percentage: 37.6 },
                { source: "LinkedIn", value: 18, percentage: 21.2 },
                { source: "Email Campaigns", value: 15, percentage: 17.6 },
                { source: "Referrals", value: 12, percentage: 14.1 },
                { source: "Other", value: 8, percentage: 9.4 }
              ]
            },
            conversions: {
              leads_to_meetings: 35.3,
              meetings_to_proposals: 62.5,
              proposals_to_clients: 42.1,
              overall_conversion: 9.4
            },
            social_media: {
              followers: {
                linkedin: 3250,
                twitter: 2800,
                instagram: 1950,
                facebook: 2200
              },
              engagement: {
                linkedin: 2.8,
                twitter: 1.9,
                instagram: 3.6,
                facebook: 2.1
              }
            },
            content_performance: {
              blog_views: 4800,
              average_time_on_page: 2.8,
              top_performing: [
                { title: "10 Web Design Trends for 2023", views: 850, conversions: 12 },
                { title: "How to Choose the Right Marketing Agency", views: 720, conversions: 15 },
                { title: "SEO Best Practices for Small Businesses", views: 680, conversions: 9 }
              ]
            }
          });
        }, 500);
      });
    } catch (error) {
      return handleApiError(error, {});
    }
  },
  
  getMarketingTrends: async (): Promise<MarketingTrend[]> => {
    try {
      // Mock implementation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: "Rise of AI-Powered Content Creation",
              description: "AI tools for content creation are becoming mainstream, with 64% of marketers planning to use them in 2023.",
              relevance_score: 92,
              category: "Content Marketing",
              source: "Marketing AI Institute",
              discovered_at: "2023-05-10T09:00:00Z",
              actionable: true,
              suggested_actions: [
                "Evaluate top AI writing tools for our content team",
                "Test AI-generated content against human-written for performance",
                "Develop guidelines for AI-assisted content creation"
              ]
            },
            {
              id: 2,
              title: "Video Content Continues to Dominate",
              description: "Short-form video content driving 2.5x higher engagement rates than other content formats.",
              relevance_score: 88,
              category: "Video Marketing",
              source: "HubSpot Research",
              discovered_at: "2023-05-05T14:30:00Z",
              actionable: true,
              suggested_actions: [
                "Increase short-form video production for social channels",
                "Test vertical video formats for mobile audience",
                "Develop video strategy for product demonstrations"
              ]
            },
            {
              id: 3,
              title: "First-Party Data Strategy Essential",
              description: "With third-party cookies being phased out, 78% of marketers are investing in first-party data collection.",
              relevance_score: 95,
              category: "Data Privacy",
              source: "Gartner",
              discovered_at: "2023-04-28T11:15:00Z",
              actionable: true,
              suggested_actions: [
                "Audit current data collection practices",
                "Implement zero-party data collection strategies",
                "Develop value exchange for customer data sharing"
              ]
            },
            {
              id: 4,
              title: "Voice Search Optimization",
              description: "Voice searches now account for 30% of all searches, with different query patterns than text.",
              relevance_score: 75,
              category: "SEO",
              source: "Search Engine Journal",
              discovered_at: "2023-05-12T10:45:00Z",
              actionable: false,
              suggested_actions: [
                "Optimize content for conversational keywords",
                "Create FAQ content that answers common voice queries",
                "Ensure local SEO is optimized for voice search"
              ]
            },
            {
              id: 5,
              title: "Sustainability in Marketing",
              description: "73% of consumers consider sustainability important in their purchasing decisions.",
              relevance_score: 80,
              category: "Brand Strategy",
              source: "Nielsen",
              discovered_at: "2023-05-03T09:30:00Z",
              actionable: true,
              suggested_actions: [
                "Audit sustainability practices to highlight in marketing",
                "Develop eco-friendly messaging framework",
                "Create case studies on sustainability initiatives"
              ]
            }
          ]);
        }, 500);
      });
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getCompetitorInsights: async (): Promise<CompetitorInsight[]> => {
    try {
      // Mock implementation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              competitor_name: "Agency X",
              category: "Service Offering",
              description: "Launched AI-assisted design service with 7-day turnaround guarantee",
              source: "Company Website",
              discovered_at: "2023-05-08T14:30:00Z",
              impact_level: "high",
              opportunity: "Develop our own AI design capabilities with shorter turnaround time",
              threat: "May lose design-focused clients looking for faster turnaround",
              recommended_action: "Research AI design tools and develop similar capability within 30 days"
            },
            {
              id: 2,
              competitor_name: "Digital Solutions Inc",
              category: "Pricing Strategy",
              description: "Introduced tiered subscription model for ongoing services",
              source: "Industry Newsletter",
              discovered_at: "2023-05-02T10:15:00Z",
              impact_level: "medium",
              opportunity: "Analyze our project-based pricing compared to subscription model",
              threat: "May lose clients seeking predictable monthly costs",
              recommended_action: "Develop subscription options for core services and test with select clients"
            },
            {
              id: 3,
              competitor_name: "WebPro Group",
              category: "Content Marketing",
              description: "Launched industry podcast with guest experts, trending #3 in marketing category",
              source: "Social Media",
              discovered_at: "2023-04-25T16:45:00Z",
              impact_level: "medium",
              opportunity: "Create our own podcast focusing on our specific expertise areas",
              threat: "Competitor gaining thought leadership position through high-visibility content",
              recommended_action: "Evaluate podcast production resources and develop content strategy"
            },
            {
              id: 4,
              competitor_name: "CreativeForce",
              category: "Talent Acquisition",
              description: "Hired three senior designers from top agencies",
              source: "LinkedIn",
              discovered_at: "2023-05-10T09:30:00Z",
              impact_level: "low",
              opportunity: "Review our own talent strategy and employee value proposition",
              threat: "Potential escalation of talent competition in the market",
              recommended_action: "Survey current team on satisfaction and development opportunities"
            },
            {
              id: 5,
              competitor_name: "Agency X",
              category: "Client Acquisition",
              description: "Won three major accounts in financial services sector",
              source: "Industry News",
              discovered_at: "2023-05-12T11:00:00Z",
              impact_level: "high",
              opportunity: "Develop specialized offering for financial services clients",
              threat: "Competitor gaining stronghold in lucrative industry vertical",
              recommended_action: "Create case studies of our financial sector work and develop targeted outreach"
            }
          ]);
        }, 500);
      });
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getMarketingPlans: async (): Promise<MarketingPlan[]> => {
    try {
      // Mock implementation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: "Q3 2023 Growth Plan",
              description: "Focused on lead generation and brand awareness through content marketing and paid advertising",
              status: "active",
              start_date: "2023-07-01T00:00:00Z",
              end_date: "2023-09-30T23:59:59Z",
              goals: [
                {
                  id: 1,
                  title: "Increase website traffic",
                  target: "20,000 monthly visitors",
                  current: "15,500 monthly visitors",
                  progress: 77.5
                },
                {
                  id: 2,
                  title: "Grow qualified leads",
                  target: "120 leads per month",
                  current: "95 leads per month",
                  progress: 79.2
                },
                {
                  id: 3,
                  title: "Improve social engagement",
                  target: "5% engagement rate",
                  current: "3.8% engagement rate",
                  progress: 76
                }
              ],
              strategies: [
                {
                  id: 1,
                  title: "Content Marketing Campaign",
                  description: "Create and distribute valuable content targeting key buyer personas",
                  channels: ["Blog", "LinkedIn", "Email", "Industry Publications"],
                  budget: 15000,
                  metrics: [
                    {
                      name: "Content pieces published",
                      target: "24",
                      current: "18"
                    },
                    {
                      name: "Content downloads",
                      target: "500",
                      current: "385"
                    },
                    {
                      name: "Lead conversion rate",
                      target: "3.5%",
                      current: "2.9%"
                    }
                  ]
                },
                {
                  id: 2,
                  title: "Paid Advertising Strategy",
                  description: "Targeted ads on search and social platforms to drive qualified traffic",
                  channels: ["Google Ads", "LinkedIn Ads", "Display Network"],
                  budget: 25000,
                  metrics: [
                    {
                      name: "Click-through rate",
                      target: "2.5%",
                      current: "2.1%"
                    },
                    {
                      name: "Cost per lead",
                      target: "$50",
                      current: "$62"
                    },
                    {
                      name: "ROAS",
                      target: "3.5x",
                      current: "2.8x"
                    }
                  ]
                }
              ],
              overall_progress: 75
            },
            {
              id: 2,
              title: "Website Redesign & SEO Campaign",
              description: "Complete website overhaul with focus on conversion optimization and search visibility",
              status: "draft",
              start_date: "2023-08-15T00:00:00Z",
              end_date: "2023-12-31T23:59:59Z",
              goals: [
                {
                  id: 4,
                  title: "Improve organic traffic",
                  target: "10,000 monthly organic visits",
                  current: "6,000 monthly organic visits",
                  progress: 60
                },
                {
                  id: 5,
                  title: "Increase conversion rate",
                  target: "3.5% site conversion rate",
                  current: "2.2% site conversion rate",
                  progress: 62.9
                },
                {
                  id: 6,
                  title: "Reduce bounce rate",
                  target: "35% bounce rate",
                  current: "52% bounce rate",
                  progress: 40
                }
              ],
              strategies: [
                {
                  id: 3,
                  title: "UX Redesign",
                  description: "Complete redesign focusing on user experience and conversion paths",
                  channels: ["Website"],
                  budget: 35000,
                  metrics: [
                    {
                      name: "User testing score",
                      target: "85/100",
                      current: "Design phase"
                    },
                    {
                      name: "Page load speed",
                      target: "< 2 seconds",
                      current: "3.5 seconds"
                    }
                  ]
                },
                {
                  id: 4,
                  title: "SEO Content Strategy",
                  description: "Keyword research and content optimization for target keywords",
                  channels: ["Website", "Blog"],
                  budget: 18000,
                  metrics: [
                    {
                      name: "Keyword rankings",
                      target: "50 in top 10",
                      current: "22 in top 10"
                    },
                    {
                      name: "Organic CTR",
                      target: "3.8%",
                      current: "2.5%"
                    }
                  ]
                }
              ],
              overall_progress: 15
            }
          ]);
        }, 500);
      });
    } catch (error) {
      return handleApiError(error, []);
    }
  },
  
  getMarketingPlanById: async (planId: number): Promise<MarketingPlan | null> => {
    try {
      // In a real implementation, this would call the API with the specific ID
      const plans = await marketingService.getMarketingPlans();
      const plan = plans.find(p => p.id === planId) || null;
      return plan;
    } catch (error) {
      return handleApiError(error, null);
    }
  },
  
  analyzeMeetingTranscript: async (transcript: string) => {
    try {
      // Mock implementation for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            summary: "30-minute discovery call with potential client discussing website redesign and marketing services. Client expressed concerns about current website performance and lead generation.",
            key_points: [
              "Client's current website is 3+ years old and not mobile-friendly",
              "Main goals: improve conversion rate and modernize brand image",
              "Budget range: $15,000-20,000 for website, $2,500/month for ongoing marketing",
              "Timeline: would like to launch new site within 3 months",
              "Decision process: needs to get approval from CEO"
            ],
            action_items: [
              {
                task: "Send proposal with website redesign options",
                assigned_to: "Marketing Team",
                due_date: "2023-05-20"
              },
              {
                task: "Share case studies of similar clients",
                assigned_to: "Account Manager",
                due_date: "2023-05-18"
              },
              {
                task: "Schedule follow-up call with CEO",
                assigned_to: "Sales Representative",
                due_date: "2023-05-25"
              }
            ],
            sentiment_analysis: {
              overall: "positive",
              interest_level: "high",
              concerns: ["timeline", "budget approval process"],
              opportunities: ["potential for ongoing services beyond initial website"]
            },
            next_steps_recommendation: "Prepare detailed proposal with multiple options based on budget range. Include specific examples addressing mobile optimization and conversion rate improvements. Schedule follow-up within 7 days."
          });
        }, 800);
      });
    } catch (error) {
      return handleApiError(error, null);
    }
  }
};

export default marketingService;
