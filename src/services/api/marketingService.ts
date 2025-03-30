
import { apiRequest } from "@/utils/apiUtils";
import { EmailOutreach, LeadProfile, MarketingMeeting } from "@/interfaces/marketing";

const marketingService = {
  // Get all marketing campaigns
  getCampaigns: async () => {
    return apiRequest('/marketing/campaigns', 'get', undefined, [
      {
        id: 1,
        name: "Summer Email Campaign",
        status: "active",
        startDate: "2023-06-01",
        endDate: "2023-08-31",
        budget: 5000,
        metrics: {
          sent: 2500,
          opened: 1200,
          clicked: 350,
          converted: 75
        }
      },
      {
        id: 2,
        name: "Product Launch",
        status: "completed",
        startDate: "2023-03-15",
        endDate: "2023-04-15",
        budget: 7500,
        metrics: {
          sent: 5000,
          opened: 2800,
          clicked: 850,
          converted: 120
        }
      },
      {
        id: 3,
        name: "Referral Program",
        status: "planning",
        startDate: "2023-09-01",
        endDate: "2023-11-30",
        budget: 3000
      }
    ]);
  },

  // Create a new marketing campaign
  createCampaign: async (campaignData: any) => {
    return apiRequest('/marketing/campaigns', 'post', campaignData, {
      id: Math.floor(Math.random() * 1000),
      ...campaignData
    });
  },

  // Get meetings
  getMeetings: async () => {
    // In a real implementation, this would fetch from a meetings table
    // For now, we'll return mock data
    const mockMeetings: MarketingMeeting[] = [
      {
        id: 1,
        leadName: "John Smith",
        leadCompany: "ABC Corp",
        scheduledTime: "2023-06-28T10:00:00Z",
        duration: 60,
        platform: "google_meet",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        status: "scheduled",
        notes: "Initial discovery call",
        agenda: ["Introduction", "Needs assessment", "Service overview", "Next steps"]
      },
      {
        id: 2,
        leadName: "Sarah Johnson",
        leadCompany: "XYZ Inc",
        scheduledTime: "2023-06-25T14:30:00Z",
        duration: 45,
        platform: "zoom",
        meetingLink: "https://zoom.us/j/123456789",
        status: "completed",
        notes: "Follow-up to discuss proposal",
        agenda: ["Review proposal", "Address questions", "Discuss timeline", "Next steps"]
      },
      {
        id: 3,
        leadName: "Michael Brown",
        leadCompany: "Acme Solutions",
        scheduledTime: "2023-07-03T11:00:00Z",
        duration: 30,
        platform: "teams",
        meetingLink: "https://teams.microsoft.com/l/meetup-join/...",
        status: "scheduled",
        notes: "Product demo",
        agenda: ["Demo preparation", "Feature showcase", "Q&A", "Pricing discussion"]
      }
    ];
    return mockMeetings;
  },

  // Create a meeting
  createMeeting: async (meetingData: any) => {
    // In a real implementation, this would insert into a meetings table
    // For now, we'll return mock data
    return {
      id: Math.floor(Math.random() * 1000),
      ...meetingData,
      status: "scheduled"
    };
  },

  // Get analytics data
  getAnalytics: async (startDate?: string, endDate?: string) => {
    // In a real implementation, this would be aggregated analytics data
    // For now, we'll return mock data
    return {
      total_campaigns: 12,
      active_campaigns: 3,
      total_leads: 145,
      lead_conversion_rate: 18,
      campaign_performance: [
        {
          id: 1,
          name: "Summer Email Campaign",
          metrics: {
            impressions: 5000,
            clicks: 750,
            conversions: 120,
            ctr: 15,
            cvr: 16
          }
        },
        {
          id: 2,
          name: "Product Launch",
          metrics: {
            impressions: 12000,
            clicks: 2200,
            conversions: 350,
            ctr: 18.3,
            cvr: 15.9
          }
        }
      ],
      channel_performance: [
        { channel: "Email", leads: 85, conversions: 15 },
        { channel: "Social", leads: 35, conversions: 8 },
        { channel: "Referral", leads: 25, conversions: 10 }
      ]
    };
  },

  // Get marketing email outreach data
  getEmailOutreach: async () => {
    // In a real implementation, this would fetch from an email_outreach table
    // For now, we'll return mock data
    const mockEmails: EmailOutreach[] = [
      {
        id: 1,
        recipient: "john.doe@example.com",
        recipientCompany: "ABC Corp",
        subject: "Introduction to Our Services",
        status: "opened",
        sentAt: "2023-06-20T08:30:00Z",
        openedAt: "2023-06-20T10:15:00Z",
        source: "lead_generation",
        followUpScheduled: true,
        followUpDate: "2023-06-27T09:00:00Z"
      },
      {
        id: 2,
        recipient: "jane.smith@example.com",
        recipientCompany: "XYZ Inc",
        subject: "Proposal for Marketing Services",
        status: "replied",
        sentAt: "2023-06-18T14:00:00Z",
        openedAt: "2023-06-18T15:30:00Z",
        repliedAt: "2023-06-19T09:20:00Z",
        source: "referral",
        followUpScheduled: false
      },
      {
        id: 3,
        recipient: "michael.johnson@example.com",
        recipientCompany: "Acme Solutions",
        subject: "Follow-up from Our Meeting",
        status: "sent",
        sentAt: "2023-06-22T11:45:00Z",
        source: "meeting_follow_up",
        followUpScheduled: false
      },
      {
        id: 4,
        recipient: "sarah.williams@example.com",
        recipientCompany: "Global Tech",
        subject: "Special Offer for You",
        status: "bounced",
        sentAt: "2023-06-21T09:00:00Z",
        source: "campaign",
        followUpScheduled: false
      }
    ];
    return mockEmails;
  },

  // Get lead profiles
  getLeads: async () => {
    // In a real implementation, this would fetch from a leads table
    // For now, we'll return mock data
    const mockLeads: LeadProfile[] = [
      {
        id: 1,
        name: "John Smith",
        position: "Marketing Director",
        company: "ABC Corp",
        email: "john.smith@abccorp.com",
        phone: "+1-555-123-4567",
        source: "Website",
        status: "contacted",
        score: 85,
        lastContactedAt: "2023-06-15T14:30:00Z",
        notes: "Interested in our content marketing services."
      },
      {
        id: 2,
        name: "Sarah Johnson",
        position: "CEO",
        company: "XYZ Inc",
        email: "sarah.johnson@xyzinc.com",
        source: "Referral",
        status: "meeting_scheduled",
        score: 90,
        lastContactedAt: "2023-06-18T09:45:00Z",
        notes: "Referred by Michael Brown. Looking for comprehensive marketing strategy."
      },
      {
        id: 3,
        name: "David Wilson",
        position: "CMO",
        company: "Acme Solutions",
        email: "david.wilson@acmesolutions.com",
        phone: "+1-555-987-6543",
        source: "LinkedIn",
        status: "new",
        score: 65,
        notes: "Connected on LinkedIn. Needs to expand social media presence."
      },
      {
        id: 4,
        name: "Emily Davis",
        position: "Director of Operations",
        company: "Global Tech",
        email: "emily.davis@globaltech.com",
        phone: "+1-555-456-7890",
        source: "Conference",
        status: "meeting_completed",
        score: 75,
        lastContactedAt: "2023-06-10T13:00:00Z",
        notes: "Met at Tech Conference 2023. Interested in our analytics services."
      },
      {
        id: 5,
        name: "Michael Rodriguez",
        position: "Marketing Manager",
        company: "Innovative Startups",
        email: "michael.rodriguez@innovativestartups.com",
        source: "Email Campaign",
        status: "proposal_sent",
        score: 80,
        lastContactedAt: "2023-06-20T10:30:00Z",
        notes: "Responded to our Q2 email campaign. Proposal sent for content and social services."
      }
    ];
    return mockLeads;
  },

  // Get marketing plans
  getMarketingPlans: async () => {
    // In a real implementation, this would fetch from a marketing_plans table
    // For now, we'll return mock data
    return [
      {
        id: 1,
        title: "Q3 Marketing Strategy",
        description: "Comprehensive marketing strategy for Q3 2023",
        created_at: "2023-06-01",
        status: "active",
        progress: 25,
        content: "This strategy focuses on increasing brand awareness through content marketing and social media engagement."
      },
      {
        id: 2,
        title: "Product Launch Campaign",
        description: "Marketing campaign for the new product launch",
        created_at: "2023-05-15",
        status: "active",
        progress: 60,
        content: "Multi-channel campaign including email, social media, and PR for the upcoming product launch in August."
      },
      {
        id: 3,
        title: "Content Calendar Q3",
        description: "Content planning for Q3 2023",
        created_at: "2023-06-10",
        status: "draft",
        progress: 80,
        content: "Detailed content calendar with blog posts, social media updates, and newsletter content for July-September."
      }
    ];
  },

  // Get marketing plan by ID
  getMarketingPlanById: async (planId: number) => {
    // In a real implementation, this would fetch a specific plan
    // For now, we'll return mock data based on the provided ID
    const mockPlans = [
      {
        id: 1,
        title: "Q3 Marketing Strategy",
        description: "Comprehensive marketing strategy for Q3 2023",
        created_at: "2023-06-01",
        status: "active",
        progress: 25,
        content: "This strategy focuses on increasing brand awareness through content marketing and social media engagement. The key objectives include:\n\n1. Increase website traffic by 20%\n2. Generate 50 new leads\n3. Improve social media engagement by 25%\n4. Publish 12 blog posts\n5. Send 6 email newsletters"
      },
      {
        id: 2,
        title: "Product Launch Campaign",
        description: "Marketing campaign for the new product launch",
        created_at: "2023-05-15",
        status: "active",
        progress: 60,
        content: "Multi-channel campaign including email, social media, and PR for the upcoming product launch in August. The campaign will be executed in three phases:\n\n1. Pre-launch (July): Build anticipation\n2. Launch (August): Maximize visibility and initial sales\n3. Post-launch (September): Gather feedback and maintain momentum"
      },
      {
        id: 3,
        title: "Content Calendar Q3",
        description: "Content planning for Q3 2023",
        created_at: "2023-06-10",
        status: "draft",
        progress: 80,
        content: "Detailed content calendar with blog posts, social media updates, and newsletter content for July-September. The content themes include:\n\n1. Industry trends and insights\n2. Customer success stories\n3. Product features and benefits\n4. How-to guides and tutorials\n5. Company news and updates"
      }
    ];
    
    return mockPlans.find(plan => plan.id === planId) || null;
  },

  // Get marketing trends
  getMarketingTrends: async () => {
    // In a real implementation, this would be from an analysis or external API
    // For now, we'll return mock data
    return {
      trending_topics: [
        { topic: "AI in Marketing", growth: 35, relevance: "high" },
        { topic: "Video Content", growth: 28, relevance: "high" },
        { topic: "Social Commerce", growth: 42, relevance: "medium" },
        { topic: "Voice Search", growth: 15, relevance: "medium" },
        { topic: "Augmented Reality", growth: 22, relevance: "low" }
      ],
      channel_trends: [
        { channel: "TikTok", growth: 45, audience_fit: "medium" },
        { channel: "LinkedIn", growth: 18, audience_fit: "high" },
        { channel: "Instagram", growth: 12, audience_fit: "high" },
        { channel: "Email", growth: 5, audience_fit: "high" },
        { channel: "YouTube", growth: 25, audience_fit: "medium" }
      ],
      content_performance: {
        top_performing: "how-to guides",
        engagement_rate: 18.5,
        conversion_rate: 3.2,
        recommended_focus: "video tutorials"
      }
    };
  },

  // Get competitor insights
  getCompetitorInsights: async () => {
    // In a real implementation, this would be from an analysis or external API
    // For now, we'll return mock data
    return {
      main_competitors: [
        {
          name: "Competitor A",
          strengths: ["Strong social media presence", "High-quality blog content"],
          weaknesses: ["Limited service offerings", "Poor mobile experience"],
          market_share: 22
        },
        {
          name: "Competitor B",
          strengths: ["Comprehensive service range", "Strong industry partnerships"],
          weaknesses: ["Outdated website", "Inconsistent content quality"],
          market_share: 18
        },
        {
          name: "Competitor C",
          strengths: ["Innovative technology", "Strong customer testimonials"],
          weaknesses: ["Higher pricing", "Limited geographical presence"],
          market_share: 15
        }
      ],
      content_gap_analysis: {
        underserved_topics: ["Industry-specific case studies", "Technical tutorials", "ROI calculators"],
        content_opportunities: ["Create interactive tools", "Develop industry benchmarks", "Produce video case studies"]
      },
      keyword_opportunities: [
        { keyword: "industry solutions", difficulty: "medium", search_volume: 1200, relevance: "high" },
        { keyword: "service comparison guide", difficulty: "low", search_volume: 800, relevance: "high" },
        { keyword: "implementation best practices", difficulty: "medium", search_volume: 950, relevance: "medium" }
      ]
    };
  },

  // Analyze meeting transcript
  analyzeMeetingTranscript: async (transcriptData: string) => {
    // In a real implementation, this would pass the transcript to an AI service
    // For now, we'll return mock analysis
    return {
      key_topics: ["Service pricing", "Timeline", "Integration requirements", "Support options"],
      sentiment: "positive",
      client_needs: ["Cost-effective solution", "Quick implementation", "Ongoing training"],
      follow_up_items: [
        { item: "Send detailed pricing breakdown", priority: "high" },
        { item: "Schedule technical assessment", priority: "medium" },
        { item: "Share case studies", priority: "medium" }
      ],
      recommendations: [
        "Focus on ROI in the proposal",
        "Highlight implementation timeline",
        "Address integration concerns early"
      ]
    };
  },

  // Get email templates
  getEmailTemplates: async () => {
    // In a real implementation, this would fetch from an email_templates table
    // For now, we'll return mock data
    return [
      {
        id: 1,
        name: "Initial Outreach",
        subject: "Introduction: How we can help [Company]",
        body: "Dear [Name],\n\nI hope this email finds you well. I recently came across [Company] and was impressed by [specific observation].\n\nAt [Our Company], we specialize in [services] that help businesses like yours [benefit].\n\nWould you be open to a brief conversation to explore how we might be able to help [Company] [specific goal]?\n\nBest regards,\n[Your Name]",
        category: "lead_generation",
        performance: {
          open_rate: 28,
          reply_rate: 12
        }
      },
      {
        id: 2,
        name: "Meeting Follow-up",
        subject: "Thank you for our conversation today",
        body: "Hi [Name],\n\nThank you for taking the time to meet with me today. I enjoyed our conversation about [topic] and learning more about your goals for [Company].\n\nAs discussed, I'll [next step] by [date]. In the meantime, here's [resource] that you might find helpful.\n\nPlease don't hesitate to reach out if you have any questions.\n\nBest regards,\n[Your Name]",
        category: "follow_up",
        performance: {
          open_rate: 65,
          reply_rate: 35
        }
      },
      {
        id: 3,
        name: "Proposal Delivery",
        subject: "Your Custom Proposal from [Our Company]",
        body: "Dear [Name],\n\nI'm pleased to present our proposal for [services] for [Company].\n\nBased on our discussions, we've tailored our approach to address your specific needs of [needs]. The attached proposal outlines our recommended strategy, timeline, and investment.\n\nI'd be happy to schedule a call to walk through the details and answer any questions you might have.\n\nBest regards,\n[Your Name]",
        category: "proposal",
        performance: {
          open_rate: 72,
          reply_rate: 45
        }
      }
    ];
  },

  // Get marketing metrics
  getMarketingMetrics: async () => {
    // In a real implementation, this would be aggregated metrics
    // For now, we'll return mock data
    return {
      lead_generation: {
        total_leads: 145,
        qualified_leads: 68,
        lead_conversion_rate: 12.5,
        cost_per_lead: 35,
        lead_sources: [
          { source: "Website", count: 65, percentage: 45 },
          { source: "Email", count: 32, percentage: 22 },
          { source: "Social", count: 28, percentage: 19 },
          { source: "Events", count: 12, percentage: 8 },
          { source: "Referral", count: 8, percentage: 6 }
        ]
      },
      content_performance: {
        total_views: 25000,
        average_engagement_rate: 3.2,
        top_performing_content: [
          { title: "Industry Guide 2023", views: 3500, conversions: 45 },
          { title: "Case Study: Client Success", views: 2800, conversions: 38 },
          { title: "How-to Tutorial", views: 2200, conversions: 25 }
        ]
      },
      campaign_metrics: {
        active_campaigns: 3,
        average_open_rate: 25.8,
        average_click_rate: 3.2,
        average_conversion_rate: 1.5,
        roi: 320
      }
    };
  }
};

export default marketingService;
