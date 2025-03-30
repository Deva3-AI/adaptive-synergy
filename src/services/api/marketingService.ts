
import { apiRequest } from "@/utils/apiUtils";

// Define interfaces for the data types
export interface EmailOutreach {
  id: number;
  subject: string;
  recipient: string;
  sentDate: string;
  status: string;
  openRate?: number;
  clickRate?: number;
  responseRate?: number;
  meetingsBooked?: number;
}

export interface MarketingMeeting {
  id: number;
  leadName: string;
  leadCompany: string;
  scheduledDate: string;
  status: "scheduled" | "completed" | "cancelled";
  meetingType: "intro" | "demo" | "proposal" | "follow_up";
  attendees?: string[];
  duration?: number;
  notes?: string;
  outcome?: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  position: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: "new" | "contacted" | "meeting_scheduled" | "meeting_completed" | "proposal_sent" | "converted" | "lost";
  score: number;
  lastContactedAt?: string;
  notes?: string;
  createdAt: string;
  interactions: {
    date: string;
    type: string;
    notes: string;
  }[];
}

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
        scheduledDate: "2023-12-15T10:00:00Z",
        status: "scheduled",
        meetingType: "intro",
        attendees: ["John Smith", "Sarah Johnson"],
        duration: 30,
        notes: "Initial meeting to discuss potential website redesign"
      },
      {
        id: 2,
        leadName: "Emma Davis",
        leadCompany: "Tech Innovations",
        scheduledDate: "2023-12-12T14:30:00Z",
        status: "scheduled",
        meetingType: "demo",
        attendees: ["Emma Davis", "Michael Brown", "David Wilson"],
        duration: 45,
        notes: "Product demo focusing on CMS features"
      },
      {
        id: 3,
        leadName: "Robert Johnson",
        leadCompany: "Global Marketing",
        scheduledDate: "2023-12-08T09:15:00Z",
        status: "completed",
        meetingType: "proposal",
        attendees: ["Robert Johnson", "Jennifer Lee"],
        duration: 60,
        notes: "Proposal presentation for comprehensive marketing package",
        outcome: "Requested additional information on pricing"
      }
    ];
    
    return mockMeetings;
  },

  // Create a meeting
  createMeeting: async (meetingData: any) => {
    // In a real implementation, this would insert into a meetings table
    // For now, we'll return mock data with the provided data
    const newMeeting: MarketingMeeting = {
      id: Math.floor(Math.random() * 1000),
      leadName: meetingData.leadName,
      leadCompany: meetingData.leadCompany,
      scheduledDate: meetingData.scheduledDate,
      status: meetingData.status || "scheduled",
      meetingType: meetingData.meetingType,
      attendees: meetingData.attendees,
      duration: meetingData.duration,
      notes: meetingData.notes
    };
    
    return newMeeting;
  },

  // Get marketing analytics
  getAnalytics: async (startDate?: string, endDate?: string) => {
    // In a real implementation, this would aggregate data based on the date range
    // For now, we'll return mock data
    return {
      emailMetrics: {
        sent: 5420,
        opened: 2356,
        openRate: 43.5,
        clicked: 876,
        clickRate: 16.2,
        responded: 412,
        responseRate: 7.6
      },
      leadMetrics: {
        total: 532,
        newThisPeriod: 87,
        converted: 48,
        conversionRate: 9.0,
        averageTimeToConversion: 32
      },
      channelPerformance: [
        { channel: "Email Outreach", leads: 215, conversion: 8.4 },
        { channel: "Website Contact", leads: 142, conversion: 12.6 },
        { channel: "Referrals", leads: 95, conversion: 15.8 },
        { channel: "Social Media", leads: 80, conversion: 6.2 }
      ],
      campaignPerformance: [
        { name: "Summer Email Campaign", roi: 320, conversions: 75 },
        { name: "Product Launch", roi: 450, conversions: 120 },
        { name: "Referral Program", roi: 280, conversions: 35 }
      ]
    };
  },

  // Get email templates
  getEmailTemplates: async () => {
    return [
      {
        id: 1,
        name: "Introduction Email",
        subject: "Introducing our services to [Company]",
        body: "Dear [Name],\n\nI hope this email finds you well. I'm reaching out because I came across [Company] and was impressed by your [specific detail about the company].\n\nAt [Our Company], we specialize in...",
        variables: ["Name", "Company", "specific detail about the company", "Our Company"],
        category: "Outreach",
        performanceStats: {
          openRate: 48.2,
          responseRate: 12.5,
          averageTimeToResponse: "1.5 days"
        }
      },
      {
        id: 2,
        name: "Follow-up After Meeting",
        subject: "Follow-up: Our conversation about [Topic]",
        body: "Hi [Name],\n\nThank you for taking the time to speak with me yesterday about [Topic]. I really appreciated your insights on [specific point from conversation].\n\nAs promised, I'm sending...",
        variables: ["Name", "Topic", "specific point from conversation"],
        category: "Follow-up",
        performanceStats: {
          openRate: 62.8,
          responseRate: 28.5,
          averageTimeToResponse: "12 hours"
        }
      },
      {
        id: 3,
        name: "Proposal Email",
        subject: "[Company] - Our Proposal for [Service]",
        body: "Dear [Name],\n\nBased on our recent discussions about your needs for [Service], I'm pleased to attach our detailed proposal.\n\nThe proposal includes...",
        variables: ["Name", "Company", "Service"],
        category: "Proposal",
        performanceStats: {
          openRate: 72.5,
          responseRate: 32.0,
          averageTimeToResponse: "2 days"
        }
      }
    ];
  },

  // Get email outreach data
  getEmailOutreach: async () => {
    const mockOutreachData: EmailOutreach[] = [
      {
        id: 1,
        subject: "Introduction to Our Services",
        recipient: "john.smith@acmecorp.com",
        sentDate: "2023-11-28T09:45:00Z",
        status: "opened",
        openRate: 2,
        clickRate: 1,
        responseRate: 1,
        meetingsBooked: 1
      },
      {
        id: 2,
        subject: "Follow-up: Website Redesign Discussion",
        recipient: "sarah.johnson@techstart.io",
        sentDate: "2023-11-25T14:30:00Z",
        status: "replied",
        openRate: 3,
        clickRate: 2,
        responseRate: 1,
        meetingsBooked: 1
      },
      {
        id: 3,
        subject: "Proposal for Digital Marketing Services",
        recipient: "michael.wong@globallogistics.com",
        sentDate: "2023-11-22T11:15:00Z",
        status: "clicked",
        openRate: 2,
        clickRate: 1,
        responseRate: 0,
        meetingsBooked: 0
      },
      {
        id: 4,
        subject: "New Feature Announcement: AI-Powered Analytics",
        recipient: "emma@creativedesign.co",
        sentDate: "2023-11-18T10:00:00Z",
        status: "opened",
        openRate: 1,
        clickRate: 0,
        responseRate: 0,
        meetingsBooked: 0
      },
      {
        id: 5,
        subject: "Invitation: Exclusive Webinar on Market Trends",
        recipient: "david.miller@innovativetech.com",
        sentDate: "2023-11-15T15:45:00Z",
        status: "not_opened",
        openRate: 0,
        clickRate: 0,
        responseRate: 0,
        meetingsBooked: 0
      }
    ];
    
    return mockOutreachData;
  },

  // Get lead profiles
  getLeads: async () => {
    const mockLeads: LeadProfile[] = [
      {
        id: 1,
        name: "John Smith",
        position: "Marketing Director",
        company: "Acme Corporation",
        email: "john.smith@acmecorp.com",
        phone: "(555) 123-4567",
        source: "other",
        status: "contacted",
        score: 85,
        lastContactedAt: "2023-11-28T09:45:00Z",
        notes: "Showed interest in website redesign services",
        createdAt: "2023-10-15T14:30:00Z",
        interactions: [
          {
            date: "2023-11-28T09:45:00Z",
            type: "email",
            notes: "Sent introduction email"
          },
          {
            date: "2023-11-29T11:20:00Z",
            type: "email",
            notes: "Received reply, expressing interest"
          }
        ]
      },
      {
        id: 2,
        name: "Sarah Johnson",
        position: "CEO",
        company: "TechStart Inc.",
        email: "sarah.johnson@techstart.io",
        source: "other",
        status: "meeting_scheduled",
        score: 92,
        lastContactedAt: "2023-11-25T14:30:00Z",
        notes: "Meeting scheduled to discuss comprehensive digital marketing",
        createdAt: "2023-09-20T10:15:00Z",
        interactions: [
          {
            date: "2023-11-20T14:30:00Z",
            type: "email",
            notes: "Sent follow-up email after LinkedIn connection"
          },
          {
            date: "2023-11-22T11:45:00Z",
            type: "call",
            notes: "Brief introductory call, very positive"
          },
          {
            date: "2023-11-25T14:30:00Z",
            type: "email",
            notes: "Scheduled meeting for Dec 5th"
          }
        ]
      },
      {
        id: 3,
        name: "Michael Wong",
        position: "Operations Manager",
        company: "Global Logistics Ltd.",
        email: "michael.wong@globallogistics.com",
        phone: "(555) 321-7890",
        source: "other",
        status: "new",
        score: 65,
        notes: "Found through LinkedIn research, logistics industry",
        createdAt: "2023-11-10T09:30:00Z",
        interactions: []
      },
      {
        id: 4,
        name: "Emma Lewis",
        position: "Creative Director",
        company: "Creative Design Co.",
        email: "emma@creativedesign.co",
        phone: "(555) 456-7890",
        source: "other",
        status: "meeting_completed",
        score: 78,
        lastContactedAt: "2023-11-18T10:00:00Z",
        notes: "Meeting focused on potential partnership for client projects",
        createdAt: "2023-10-05T13:45:00Z",
        interactions: [
          {
            date: "2023-10-15T11:30:00Z",
            type: "email",
            notes: "Initial contact through referral"
          },
          {
            date: "2023-11-02T14:00:00Z",
            type: "meeting",
            notes: "Introductory meeting, showed interest in collaboration"
          },
          {
            date: "2023-11-18T10:00:00Z",
            type: "email",
            notes: "Sent meeting summary and next steps"
          }
        ]
      },
      {
        id: 5,
        name: "David Miller",
        position: "CTO",
        company: "Innovative Tech Solutions",
        email: "david.miller@innovativetech.com",
        source: "other",
        status: "proposal_sent",
        score: 88,
        lastContactedAt: "2023-11-15T15:45:00Z",
        notes: "Very interested in our enterprise solutions",
        createdAt: "2023-09-01T11:20:00Z",
        interactions: [
          {
            date: "2023-09-15T10:30:00Z",
            type: "meeting",
            notes: "Initial consultation about needs"
          },
          {
            date: "2023-10-20T14:15:00Z",
            type: "demo",
            notes: "Product demonstration for their team"
          },
          {
            date: "2023-11-15T15:45:00Z",
            type: "email",
            notes: "Sent detailed proposal for services"
          }
        ]
      }
    ];
    
    return mockLeads;
  },

  // Get marketing plans
  getMarketingPlans: async () => {
    return [
      {
        id: 1,
        title: "Q1 2024 Growth Strategy",
        status: "draft",
        createdAt: "2023-11-20T15:30:00Z",
        targetAudience: "SMB Technology Companies",
        objectives: [
          "Increase lead generation by 25%",
          "Improve email conversion rates to 12%",
          "Launch 2 new service packages"
        ],
        channels: ["Email", "LinkedIn", "Industry Events", "Content Marketing"],
        budget: 15000,
        metrics: {
          leadTarget: 150,
          conversionTarget: 12,
          revenueTarget: 120000
        }
      },
      {
        id: 2,
        title: "Website Relaunch Campaign",
        status: "approved",
        createdAt: "2023-11-15T11:45:00Z",
        targetAudience: "Existing Clients and Active Prospects",
        objectives: [
          "Showcase new service offerings",
          "Generate 50 qualified leads",
          "Increase website traffic by 40%"
        ],
        channels: ["Email", "Social Media", "Paid Search", "PR"],
        budget: 8500,
        metrics: {
          trafficTarget: 10000,
          leadTarget: 50,
          conversionTarget: 15
        }
      },
      {
        id: 3,
        title: "Enterprise Client Acquisition",
        status: "in_progress",
        createdAt: "2023-10-28T09:15:00Z",
        targetAudience: "Enterprise Companies ($50M+ Revenue)",
        objectives: [
          "Secure 3 new enterprise clients",
          "Establish presence at key industry events",
          "Develop targeted content for enterprise needs"
        ],
        channels: ["Direct Outreach", "Executive Events", "Industry Publications", "Targeted Advertising"],
        budget: 25000,
        metrics: {
          leadTarget: 30,
          meetingTarget: 15,
          newClientTarget: 3
        }
      }
    ];
  },

  // Get marketing plan by ID
  getMarketingPlanById: async (planId: number) => {
    const plans = await marketingService.getMarketingPlans();
    return plans.find(plan => plan.id === planId) || null;
  },

  // Get marketing trends
  getMarketingTrends: async () => {
    return {
      industryTrends: [
        {
          id: 1,
          title: "AI-Powered Content Creation",
          description: "Growing adoption of AI tools for content generation and optimization, leading to increased efficiency and personalization.",
          impact: "high",
          actionItems: [
            "Evaluate top AI content platforms for our workflow",
            "Test AI-generated content against traditional methods",
            "Develop framework for human-AI collaboration"
          ]
        },
        {
          id: 2,
          title: "Video-First Marketing",
          description: "Short-form video continuing to dominate engagement metrics across platforms, with increased preference for authentic over polished content.",
          impact: "medium",
          actionItems: [
            "Increase video content production by 30%",
            "Develop short-form video strategy for social channels",
            "Test video vs. static content in email campaigns"
          ]
        },
        {
          id: 3,
          title: "Privacy-Focused Marketing",
          description: "Continued evolution of privacy regulations and cookie deprecation requiring new approaches to targeting and measurement.",
          impact: "high",
          actionItems: [
            "Audit current tracking and data collection practices",
            "Develop first-party data strategy",
            "Test contextual targeting approaches"
          ]
        }
      ],
      keyMetricsShift: [
        { metric: "Email Open Rate", past: "18.5%", current: "22.3%", trend: "increasing" },
        { metric: "Social Engagement", past: "3.8%", current: "4.2%", trend: "stable" },
        { metric: "Video Completion Rate", past: "55%", current: "68%", trend: "increasing" },
        { metric: "Cost Per Lead", past: "$45", current: "$38", trend: "decreasing" },
        { metric: "Organic Traffic", past: "18,500", current: "22,300", trend: "increasing" }
      ],
      recommendedActions: [
        "Increase investment in video content production and distribution",
        "Develop comprehensive first-party data strategy",
        "Test AI-powered content creation for specific marketing channels",
        "Enhance email personalization to leverage improved open rates",
        "Develop thought leadership content around emerging trends"
      ]
    };
  },

  // Get competitor insights
  getCompetitorInsights: async () => {
    return {
      topCompetitors: [
        {
          name: "Digital Dynamics",
          strengths: ["Comprehensive service offerings", "Strong enterprise client base", "Advanced analytics capabilities"],
          weaknesses: ["Higher pricing", "Longer delivery timelines", "Less personalized service"],
          marketShare: 18,
          trendsDirection: "stable"
        },
        {
          name: "CreativeForce Agency",
          strengths: ["Award-winning creative", "Strong brand recognition", "Innovative campaigns"],
          weaknesses: ["Limited technical capabilities", "Focus on larger clients only", "Less data-driven approach"],
          marketShare: 15,
          trendsDirection: "decreasing"
        },
        {
          name: "TechMarketing Solutions",
          strengths: ["Cutting-edge technology integration", "Specialized in B2B tech", "Competitive pricing"],
          weaknesses: ["Limited creative capabilities", "Newer to the market", "Smaller team size"],
          marketShare: 12,
          trendsDirection: "increasing"
        }
      ],
      competitiveAdvantages: [
        {
          category: "Service Delivery",
          ourPosition: "faster",
          description: "Our average project turnaround is 15 days faster than the industry average",
          leverageStrategy: "Emphasize quick turnaround times in marketing materials and client conversations"
        },
        {
          category: "Client Support",
          ourPosition: "stronger",
          description: "Our dedicated account management model provides more personalized service than competitors' team-based approach",
          leverageStrategy: "Highlight client testimonials that emphasize our responsive support"
        },
        {
          category: "Pricing",
          ourPosition: "competitive",
          description: "Our service packages are priced within industry averages, with better included features",
          leverageStrategy: "Create clear comparison charts showing value advantage"
        }
      ],
      marketGaps: [
        {
          opportunity: "AI-Enhanced Services",
          competitorCoverage: "low",
          potentialImpact: "high",
          timeToImplement: "medium",
          description: "Few competitors are effectively incorporating AI into service offerings"
        },
        {
          opportunity: "SMB-Focused Packages",
          competitorCoverage: "medium",
          potentialImpact: "medium",
          timeToImplement: "short",
          description: "Gap for affordable, scaled-down versions of enterprise services for smaller businesses"
        },
        {
          opportunity: "Sustainability Marketing",
          competitorCoverage: "low",
          potentialImpact: "increasing",
          timeToImplement: "medium",
          description: "Growing demand for sustainable marketing practices not being met by current offerings"
        }
      ]
    };
  },

  // Analyze meeting transcript
  analyzeMeetingTranscript: async (transcript: string) => {
    // In a real implementation, this would use NLP to analyze the transcript
    // For now, we'll return mock analysis
    return {
      summary: "The meeting focused on the client's need for a website redesign with improved user experience and integrated e-commerce capabilities. The client emphasized mobile responsiveness and modern design aesthetic.",
      keyPoints: [
        "Current website is 3+ years old and not mobile-friendly",
        "Target launch date is Q1 2024",
        "Budget range is $15,000-$20,000",
        "E-commerce functionality is critical requirement",
        "Client wants to maintain their existing brand colors and logo"
      ],
      sentimentAnalysis: {
        overall: "positive",
        specificConcerns: ["timeline concerns", "previous negative experience with other agency"],
        enthusiasticAbout: ["our portfolio examples", "proposed UX process"]
      },
      actionItems: [
        {
          task: "Send detailed proposal with timeline",
          assignedTo: "Account Manager",
          dueDate: "Within 5 business days"
        },
        {
          task: "Schedule UX workshop",
          assignedTo: "UX Designer",
          dueDate: "After proposal approval"
        },
        {
          task: "Create project plan with milestones",
          assignedTo: "Project Manager",
          dueDate: "After proposal approval"
        }
      ],
      followUpRecommendations: [
        "Share case studies of similar e-commerce projects",
        "Provide detailed explanation of our QA process to address previous negative experience",
        "Include mobile-specific designs in the proposal"
      ]
    };
  },

  // Get marketing metrics
  getMarketingMetrics: async () => {
    return {
      topline: {
        leadGeneration: {
          current: 145,
          target: 150,
          previousPeriod: 128,
          percentChange: 13.3
        },
        conversionRate: {
          current: 18.5,
          target: 20,
          previousPeriod: 16.8,
          percentChange: 10.1
        },
        customerAcquisitionCost: {
          current: 850,
          target: 800,
          previousPeriod: 925,
          percentChange: -8.1
        },
        returnOnMarketingInvestment: {
          current: 4.2,
          target: 4.5,
          previousPeriod: 3.8,
          percentChange: 10.5
        }
      },
      channelPerformance: [
        { channel: "Email Marketing", leads: 42, conversion: 22.5, cac: 105, roi: 6.2 },
        { channel: "Content Marketing", leads: 38, conversion: 15.8, cac: 220, roi: 3.8 },
        { channel: "Social Media", leads: 25, conversion: 12.5, cac: 185, roi: 2.9 },
        { channel: "Paid Search", leads: 22, conversion: 18.2, cac: 280, roi: 2.5 },
        { channel: "Direct Outreach", leads: 18, conversion: 33.3, cac: 350, roi: 5.1 }
      ],
      campaignPerformance: [
        { campaign: "Fall Email Sequence", status: "active", budget: 2500, spent: 1800, leads: 35, conversion: 22.9, roi: 3.8 },
        { campaign: "Industry Whitepaper", status: "completed", budget: 3500, spent: 3500, leads: 42, conversion: 16.7, roi: 3.2 },
        { campaign: "LinkedIn Advertising", status: "active", budget: 4000, spent: 2200, leads: 28, conversion: 14.3, roi: 2.1 },
        { campaign: "Webinar Series", status: "upcoming", budget: 5000, spent: 1200, leads: 15, conversion: 0, roi: 0 }
      ],
      contentEffectiveness: [
        { title: "10 Trends in Digital Marketing", type: "blog", views: 3500, engagement: 4.5, leads: 15, conversion: 20.0 },
        { title: "Complete Guide to SEO", type: "whitepaper", views: 850, engagement: 8.2, leads: 28, conversion: 17.9 },
        { title: "Marketing Automation Demo", type: "video", views: 1250, engagement: 6.8, leads: 18, conversion: 22.2 },
        { title: "Industry Benchmark Report", type: "report", views: 950, engagement: 9.5, leads: 22, conversion: 27.3 }
      ]
    };
  }
};

export default marketingService;
