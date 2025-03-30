
import { supabase } from '@/integrations/supabase/client';
import { apiRequest } from '@/utils/apiUtils';

export interface EmailOutreach {
  id: number;
  subject: string;
  recipient: string;
  recipient_company?: string;
  sent_date: string;
  status: 'sent' | 'opened' | 'replied' | 'no_response';
  response_date?: string;
  follow_up_scheduled?: string;
  campaign_id?: number;
  campaign_name?: string;
}

export interface MarketingMeeting {
  id: number;
  client_name: string;
  attendees: string[];
  date: string;
  time: string;
  duration: number;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  follow_up_actions?: string[];
  meeting_link?: string; // Added for compatibility
}

export interface LeadProfile {
  id: number;
  name: string;
  position?: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: 'new' | 'contacted' | 'meeting_scheduled' | 'meeting_completed' | 'proposal_sent' | 'converted' | 'lost';
  score: number;
  lastContactedAt?: string;
  notes?: string;
  createdAt: string; // Required property
  interactions: any[]; // Required property
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface MarketingPlan {
  id: number;
  name: string;
  period: string;
  goals: string[];
  strategies: {
    channel: string;
    description: string;
    kpis: string[];
  }[];
  budget: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed';
}

export interface MarketingMetrics {
  email_open_rate: number;
  email_response_rate: number;
  meeting_conversion_rate: number;
  lead_to_client_rate: number;
  average_response_time: number;
  campaign_performance: {
    campaign: string;
    leads_generated: number;
    conversion_rate: number;
  }[];
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  strengths: string[];
  weaknesses: string[];
  pricing_strategy: string;
  marketing_channels: string[];
  unique_selling_points: string[];
  recent_changes: string;
  date_updated: string;
}

export interface MarketingTrend {
  id: number;
  trend_name: string;
  description: string;
  relevance_score: number;
  potential_impact: 'low' | 'medium' | 'high';
  adoption_timeline: 'immediate' | 'short_term' | 'long_term';
  relevant_industries: string[];
  action_items: string[];
  date_identified: string;
}

const marketingService = {
  // Campaign methods
  getCampaigns: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      
      // Mock data as fallback
      return [
        {
          id: 1,
          name: "Summer Promotion",
          description: "Special summer offers for existing clients",
          status: "active",
          start_date: "2023-06-01",
          end_date: "2023-08-31",
          budget: 5000,
          roi: 3.2,
          leads_generated: 45
        },
        {
          id: 2,
          name: "Website Launch",
          description: "Promotional campaign for new website launch",
          status: "completed",
          start_date: "2023-05-01",
          end_date: "2023-05-31",
          budget: 3000,
          roi: 2.8,
          leads_generated: 32
        },
        {
          id: 3,
          name: "Q3 Lead Generation",
          description: "Targeted lead generation for Q3",
          status: "planning",
          start_date: "2023-07-01",
          end_date: "2023-09-30",
          budget: 7500,
          roi: null,
          leads_generated: 0
        }
      ];
    }
  },
  
  createCampaign: async (campaignData: any) => {
    try {
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .insert(campaignData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating campaign:', error);
      
      // Mock response
      return {
        id: Math.floor(Math.random() * 1000) + 4,
        ...campaignData,
        created_at: new Date().toISOString()
      };
    }
  },
  
  // Meeting methods
  getMeetings: async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching meetings:', error);
      
      // Mock data as fallback
      return [
        {
          id: 1,
          client_name: "Acme Inc",
          attendees: ["John Smith", "Sarah Johnson"],
          date: "2023-07-05",
          time: "10:00",
          duration: 60,
          topic: "Website redesign kickoff",
          status: "scheduled",
          notes: "",
          follow_up_actions: [],
          meeting_link: "https://meet.google.com/abc-defg-hij"
        },
        {
          id: 2,
          client_name: "TechCorp",
          attendees: ["Michael Brown", "Robert Davis", "Jennifer Wilson"],
          date: "2023-06-28",
          time: "14:30",
          duration: 45,
          topic: "SEO strategy review",
          status: "completed",
          notes: "Client interested in expanding to international markets. Need to prepare proposal for international SEO.",
          follow_up_actions: ["Send international SEO proposal", "Schedule follow-up in 2 weeks"],
          meeting_link: "https://meet.google.com/jkl-mnop-qrs"
        },
        {
          id: 3,
          client_name: "Global Services",
          attendees: ["Amanda Clark", "David Miller"],
          date: "2023-07-10",
          time: "11:15",
          duration: 30,
          topic: "Social media campaign discussion",
          status: "scheduled",
          notes: "",
          follow_up_actions: [],
          meeting_link: "https://meet.google.com/tuv-wxyz-123"
        }
      ];
    }
  },
  
  createMeeting: async (meetingData: any) => {
    try {
      const { data, error } = await supabase
        .from('marketing_meetings')
        .insert(meetingData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating meeting:', error);
      
      // Mock response
      return {
        id: Math.floor(Math.random() * 1000) + 4,
        ...meetingData,
        created_at: new Date().toISOString()
      };
    }
  },
  
  // Analytics methods
  getAnalytics: async (startDate?: string, endDate?: string) => {
    try {
      // This would be a complex query in a real implementation
      
      // Mock data
      return {
        email_metrics: {
          total_sent: 250,
          open_rate: 35.2,
          response_rate: 12.8,
          meeting_conversion: 4.4
        },
        lead_metrics: {
          new_leads: 45,
          qualified_leads: 28,
          converted_to_clients: 6,
          conversion_rate: 13.3
        },
        campaign_performance: [
          { campaign: "Summer Promotion", leads: 18, conversion_rate: 16.7 },
          { campaign: "Website Launch", leads: 12, conversion_rate: 8.3 },
          { campaign: "Email Outreach", leads: 15, conversion_rate: 13.3 }
        ],
        trend_analysis: {
          lead_growth_rate: 15,
          meeting_growth_rate: 8,
          conversion_growth_rate: 5
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return apiRequest('/marketing/analytics', 'get', { startDate, endDate }, {});
    }
  },
  
  // Additional methods needed by components
  getEmailOutreach: async () => {
    // Mock data
    return [
      {
        id: 1,
        subject: "Introduction to Our Services",
        recipient: "john@acmeinc.com",
        recipient_company: "Acme Inc",
        sent_date: "2023-06-15",
        status: "opened",
        response_date: null,
        follow_up_scheduled: "2023-06-22",
        campaign_id: 1,
        campaign_name: "Q2 Lead Generation"
      },
      {
        id: 2,
        subject: "Website Redesign Consultation",
        recipient: "sarah@techcorp.com",
        recipient_company: "TechCorp",
        sent_date: "2023-06-18",
        status: "replied",
        response_date: "2023-06-19",
        follow_up_scheduled: null,
        campaign_id: 1,
        campaign_name: "Q2 Lead Generation"
      },
      {
        id: 3,
        subject: "Follow Up: Our Recent Conversation",
        recipient: "michael@globalservices.com",
        recipient_company: "Global Services",
        sent_date: "2023-06-20",
        status: "sent",
        response_date: null,
        follow_up_scheduled: "2023-06-27",
        campaign_id: 1,
        campaign_name: "Q2 Lead Generation"
      },
      {
        id: 4,
        subject: "Marketing Strategy Proposal",
        recipient: "jennifer@newstart.com",
        recipient_company: "New Start LLC",
        sent_date: "2023-06-21",
        status: "no_response",
        response_date: null,
        follow_up_scheduled: "2023-06-28",
        campaign_id: 2,
        campaign_name: "Summer Promotion"
      },
      {
        id: 5,
        subject: "Social Media Management Services",
        recipient: "robert@innovatech.com",
        recipient_company: "InnovaTech",
        sent_date: "2023-06-22",
        status: "sent",
        response_date: null,
        follow_up_scheduled: "2023-06-29",
        campaign_id: 2,
        campaign_name: "Summer Promotion"
      }
    ];
  },
  
  getLeads: async () => {
    // Mock data
    const mockLeads = [
      {
        id: 1,
        name: "John Smith",
        position: "Marketing Director",
        company: "Acme Inc",
        email: "john@acmeinc.com",
        phone: "555-123-4567",
        source: "other",
        status: "contacted",
        score: 85,
        lastContactedAt: "2023-06-15",
        notes: "Interested in website redesign and SEO services",
        createdAt: "2023-06-01",
        interactions: []
      },
      {
        id: 2,
        name: "Sarah Johnson",
        position: "CEO",
        company: "TechCorp",
        email: "sarah@techcorp.com",
        source: "other",
        status: "meeting_scheduled",
        score: 90,
        lastContactedAt: "2023-06-19",
        notes: "Meeting scheduled for next week to discuss comprehensive digital marketing",
        createdAt: "2023-06-10",
        interactions: []
      },
      {
        id: 3,
        name: "Michael Brown",
        position: "Digital Marketing Manager",
        company: "Global Services",
        email: "michael@globalservices.com",
        phone: "555-987-6543",
        source: "other",
        status: "new",
        score: 70,
        notes: "Found us through LinkedIn post about web design trends",
        createdAt: "2023-06-18",
        interactions: []
      },
      {
        id: 4,
        name: "Jennifer Wilson",
        position: "Operations Manager",
        company: "New Start LLC",
        email: "jennifer@newstart.com",
        phone: "555-456-7890",
        source: "other",
        status: "meeting_completed",
        score: 75,
        lastContactedAt: "2023-06-05",
        notes: "Needs help with brand identity and social media presence",
        createdAt: "2023-05-25",
        interactions: []
      },
      {
        id: 5,
        name: "Robert Davis",
        position: "IT Director",
        company: "InnovaTech",
        email: "robert@innovatech.com",
        source: "other",
        status: "proposal_sent",
        score: 80,
        lastContactedAt: "2023-06-12",
        notes: "Sent proposal for website development and ongoing maintenance",
        createdAt: "2023-06-05",
        interactions: []
      }
    ];
    
    return mockLeads;
  },
  
  getEmailTemplates: async () => {
    return [
      {
        id: 1,
        name: "Initial Outreach",
        subject: "Introduction to Our Services",
        body: `Hello {{name}},\n\nI hope this email finds you well. I'm reaching out from {{company}} to introduce our services that may be of interest to {{client_company}}.\n\nOur team specializes in {{service_area}} and has helped companies like yours achieve {{benefit}}.\n\nWould you be open to a brief conversation to explore how we might be able to help {{client_company}}?\n\nBest regards,\n{{sender_name}}\n{{company}}`,
        category: "Outreach",
        variables: ["name", "company", "client_company", "service_area", "benefit", "sender_name"],
        created_at: "2023-05-01",
        updated_at: "2023-05-01"
      },
      {
        id: 2,
        name: "Follow-up",
        subject: "Following Up: {{previous_subject}}",
        body: `Hello {{name}},\n\nI wanted to follow up on my previous email regarding {{topic}}.\n\nI understand you're busy, but I thought this might be relevant to your current initiatives at {{client_company}}.\n\nWould you have 15 minutes this week for a quick call?\n\nBest regards,\n{{sender_name}}\n{{company}}`,
        category: "Follow-up",
        variables: ["name", "previous_subject", "topic", "client_company", "sender_name", "company"],
        created_at: "2023-05-02",
        updated_at: "2023-05-02"
      },
      {
        id: 3,
        name: "Meeting Confirmation",
        subject: "Confirmation: Our Meeting on {{date}}",
        body: `Hello {{name}},\n\nI'm writing to confirm our meeting on {{date}} at {{time}}.\n\nWe'll be discussing {{meeting_topic}} and how we can help {{client_company}} with {{service_area}}.\n\nHere's the meeting link: {{meeting_link}}\n\nPlease let me know if you need to reschedule or have any questions before our call.\n\nLooking forward to our conversation!\n\nBest regards,\n{{sender_name}}\n{{company}}`,
        category: "Meeting",
        variables: ["name", "date", "time", "meeting_topic", "client_company", "service_area", "meeting_link", "sender_name", "company"],
        created_at: "2023-05-03",
        updated_at: "2023-05-03"
      },
      {
        id: 4,
        name: "Proposal Follow-up",
        subject: "Regarding Our Proposal for {{client_company}}",
        body: `Hello {{name}},\n\nI hope you're doing well. I'm following up regarding the proposal we sent on {{proposal_date}} for {{service_area}}.\n\nHave you had a chance to review it? I'd be happy to address any questions or provide additional information that might be helpful.\n\nWould you have time this week for a brief call to discuss the next steps?\n\nBest regards,\n{{sender_name}}\n{{company}}`,
        category: "Proposal",
        variables: ["name", "client_company", "proposal_date", "service_area", "sender_name", "company"],
        created_at: "2023-05-04",
        updated_at: "2023-05-04"
      },
      {
        id: 5,
        name: "Thank You After Meeting",
        subject: "Thank You for Your Time",
        body: `Hello {{name}},\n\nThank you for taking the time to meet with me today to discuss {{meeting_topic}}.\n\nI appreciated learning more about {{client_company}}'s goals and challenges. Based on our conversation, I think we can help with {{service_area}} by implementing {{solution}}.\n\nI'll follow up with {{next_step}} as we discussed.\n\nFeel free to reach out if you have any questions in the meantime.\n\nBest regards,\n{{sender_name}}\n{{company}}`,
        category: "Follow-up",
        variables: ["name", "meeting_topic", "client_company", "service_area", "solution", "next_step", "sender_name", "company"],
        created_at: "2023-05-05",
        updated_at: "2023-05-05"
      }
    ];
  },
  
  getMarketingPlans: async () => {
    return [
      {
        id: 1,
        name: "Q3 Growth Strategy",
        period: "Q3 2023",
        goals: [
          "Increase lead generation by 25%",
          "Improve conversion rate by 10%",
          "Launch 2 new service offerings"
        ],
        strategies: [
          {
            channel: "Email Marketing",
            description: "Targeted campaigns to existing client database and new prospects",
            kpis: ["Open rate > 25%", "Response rate > 10%", "Meeting conversion > 5%"]
          },
          {
            channel: "Content Marketing",
            description: "Industry-specific blog content and downloadable resources",
            kpis: ["6 new blog posts", "2 white papers", "500 resource downloads"]
          },
          {
            channel: "Social Media",
            description: "Increased presence on LinkedIn and Twitter with industry insights",
            kpis: ["20% follower growth", "15% engagement rate", "5 leads generated"]
          }
        ],
        budget: 15000,
        start_date: "2023-07-01",
        end_date: "2023-09-30",
        status: "active"
      },
      {
        id: 2,
        name: "Website Relaunch Campaign",
        period: "August 2023",
        goals: [
          "Drive 5,000 visitors to new website",
          "Collect 200 new email subscribers",
          "Generate 50 new leads"
        ],
        strategies: [
          {
            channel: "Paid Advertising",
            description: "Google Ads and LinkedIn campaigns targeting key industries",
            kpis: ["CTR > 2%", "CPC < $3.50", "25 lead form submissions"]
          },
          {
            channel: "PR",
            description: "Press releases and media outreach about new website and offerings",
            kpis: ["3 industry publications", "5 backlinks", "1000 referral visits"]
          },
          {
            channel: "Email Announcement",
            description: "Series of emails to existing database introducing new website",
            kpis: ["Open rate > 30%", "Click rate > 15%", "100 return visitors"]
          }
        ],
        budget: 8000,
        start_date: "2023-08-01",
        end_date: "2023-08-31",
        status: "planning"
      },
      {
        id: 3,
        name: "End of Year Client Retention",
        period: "Q4 2023",
        goals: [
          "Renew 90% of existing client contracts",
          "Upsell additional services to 30% of clients",
          "Collect 15 client testimonials"
        ],
        strategies: [
          {
            channel: "Client Success Calls",
            description: "Scheduled strategy calls with all clients to review year and plan next year",
            kpis: ["100% client participation", "85% satisfaction score", "20 upsell opportunities identified"]
          },
          {
            channel: "Client Appreciation",
            description: "Personalized gifts and thank you messages to key clients",
            kpis: ["30 gifts sent", "10 social media mentions", "5 referrals generated"]
          },
          {
            channel: "Year in Review Reports",
            description: "Customized reports showing value delivered through the year",
            kpis: ["100% delivery", "25% response rate", "15 testimonials collected"]
          }
        ],
        budget: 12000,
        start_date: "2023-10-01",
        end_date: "2023-12-31",
        status: "planning"
      }
    ];
  },
  
  getMarketingPlanById: async (planId: number) => {
    const plans = await marketingService.getMarketingPlans();
    return plans.find(plan => plan.id === planId) || null;
  },
  
  getMarketingTrends: async () => {
    return [
      {
        id: 1,
        trend_name: "AI-Powered Content Creation",
        description: "Using artificial intelligence tools to assist in creating and optimizing marketing content",
        relevance_score: 85,
        potential_impact: "high",
        adoption_timeline: "short_term",
        relevant_industries: ["Technology", "Marketing", "Education", "Media"],
        action_items: [
          "Research top AI content creation tools",
          "Test tools for blog and social media content",
          "Develop process for human review and refinement",
          "Train team on effective AI prompt writing"
        ],
        date_identified: "2023-05-15"
      },
      {
        id: 2,
        trend_name: "Interactive Video Content",
        description: "Videos that allow viewer participation through choices, questions, or branching scenarios",
        relevance_score: 75,
        potential_impact: "medium",
        adoption_timeline: "short_term",
        relevant_industries: ["E-commerce", "Education", "Entertainment", "B2B Services"],
        action_items: [
          "Identify suitable interactive video platforms",
          "Develop concept for product demonstration interactive video",
          "Create pilot project with existing client",
          "Measure engagement compared to standard video"
        ],
        date_identified: "2023-06-02"
      },
      {
        id: 3,
        trend_name: "Voice Search Optimization",
        description: "Adapting SEO strategies for voice-based searches through smart speakers and voice assistants",
        relevance_score: 70,
        potential_impact: "medium",
        adoption_timeline: "medium_term",
        relevant_industries: ["Retail", "Local Services", "Hospitality", "Healthcare"],
        action_items: [
          "Audit current content for voice search compatibility",
          "Research common voice search phrases in our industry",
          "Optimize FAQ pages for voice queries",
          "Develop voice search strategy for client websites"
        ],
        date_identified: "2023-06-10"
      },
      {
        id: 4,
        trend_name: "Zero-Party Data Collection",
        description: "Gathering data directly from customers through preference centers, quizzes, and interactive content",
        relevance_score: 90,
        potential_impact: "high",
        adoption_timeline: "immediate",
        relevant_industries: ["All industries"],
        action_items: [
          "Design interactive quizzes for website visitors",
          "Develop preference center for email subscribers",
          "Create value exchange strategy for data collection",
          "Implement data collection points throughout customer journey"
        ],
        date_identified: "2023-05-20"
      },
      {
        id: 5,
        trend_name: "Augmented Reality Marketing",
        description: "Using AR to create immersive product experiences and interactive brand campaigns",
        relevance_score: 65,
        potential_impact: "high",
        adoption_timeline: "long_term",
        relevant_industries: ["Retail", "Real Estate", "Home Furnishings", "Fashion"],
        action_items: [
          "Explore AR development platforms and costs",
          "Identify client products suitable for AR experiences",
          "Develop concept for AR product visualization tool",
          "Research case studies of successful AR marketing campaigns"
        ],
        date_identified: "2023-06-20"
      }
    ];
  },
  
  getCompetitorInsights: async () => {
    return [
      {
        id: 1,
        competitor_name: "Digital Edge Agency",
        strengths: [
          "Strong portfolio of enterprise clients",
          "Award-winning design team",
          "Proprietary analytics platform"
        ],
        weaknesses: [
          "Higher pricing than market average",
          "Long project timelines",
          "Limited social media management capabilities"
        ],
        pricing_strategy: "Premium pricing with value-based packages",
        marketing_channels: ["Industry events", "Referral programs", "Content marketing", "LinkedIn"],
        unique_selling_points: [
          "Industry-specific expertise in finance and healthcare",
          "Guaranteed results with performance-based pricing options",
          "Full-service team with no outsourcing"
        ],
        recent_changes: "Launched new AI-powered analytics dashboard for clients",
        date_updated: "2023-06-05"
      },
      {
        id: 2,
        competitor_name: "WebCraft Solutions",
        strengths: [
          "Rapid deployment methodology",
          "Competitive pricing",
          "Strong technical capabilities"
        ],
        weaknesses: [
          "Less focus on design excellence",
          "Smaller team size",
          "Limited brand strategy services"
        ],
        pricing_strategy: "Tiered service packages with entry-level options",
        marketing_channels: ["Google Ads", "Technical webinars", "GitHub contributions", "Tech blogs"],
        unique_selling_points: [
          "Quick turnaround on development projects",
          "Specialized in e-commerce solutions",
          "Open-source contributions and strong technical community presence"
        ],
        recent_changes: "Added Shopify development as a core service offering",
        date_updated: "2023-06-12"
      },
      {
        id: 3,
        competitor_name: "Growth Spark Partners",
        strengths: [
          "Focus on ROI and performance marketing",
          "Strong data analytics capabilities",
          "Industry-leading conversion rate optimization"
        ],
        weaknesses: [
          "Limited creative design services",
          "Smaller client portfolio",
          "Less established brand reputation"
        ],
        pricing_strategy: "Performance-based pricing with base retainer",
        marketing_channels: ["Case studies", "Email marketing", "LinkedIn", "Industry reports"],
        unique_selling_points: [
          "Guaranteed improvement in conversion metrics",
          "Specialized in SaaS and B2B marketing",
          "Data-driven approach with weekly performance reporting"
        ],
        recent_changes: "Partnered with leading marketing automation platform",
        date_updated: "2023-06-18"
      },
      {
        id: 4,
        competitor_name: "Creative Pulse Agency",
        strengths: [
          "Award-winning creative team",
          "Strong brand strategy capabilities",
          "Impressive client list with recognizable brands"
        ],
        weaknesses: [
          "Higher costs for services",
          "Less technical development expertise",
          "Sometimes prioritizes creativity over performance metrics"
        ],
        pricing_strategy: "Project-based pricing with premium positioning",
        marketing_channels: ["Design awards", "Creative showcases", "Instagram", "Industry speaking engagements"],
        unique_selling_points: [
          "Brand transformation expertise",
          "In-house video and photography capabilities",
          "Strategic partnerships with major advertising platforms"
        ],
        recent_changes: "Expanded video production department with new studio space",
        date_updated: "2023-06-15"
      }
    ];
  },
  
  getMarketingMetrics: async (): Promise<MarketingMetrics> => {
    return {
      email_open_rate: 32.5,
      email_response_rate: 8.7,
      meeting_conversion_rate: 35.0,
      lead_to_client_rate: 15.5,
      average_response_time: 4.2,
      campaign_performance: [
        { campaign: "Q2 Outreach", leads_generated: 28, conversion_rate: 14.3 },
        { campaign: "Website Launch", leads_generated: 35, conversion_rate: 11.4 },
        { campaign: "Industry Webinar", leads_generated: 42, conversion_rate: 16.7 }
      ]
    };
  },
  
  analyzeMeetingTranscript: async (transcriptText: string) => {
    // In a real implementation, this would call an AI service
    
    // Mock response
    return {
      key_topics: [
        "Website redesign requirements",
        "Timeline expectations",
        "Budget considerations",
        "Mobile responsiveness"
      ],
      sentiment: {
        overall: "positive",
        score: 0.78,
        highlights: {
          positive: ["excited about new design", "impressed with portfolio", "looking forward to working together"],
          negative: ["concerned about timeline", "previous vendor issues"]
        }
      },
      action_items: [
        "Send proposal by Friday",
        "Schedule follow-up call next week",
        "Share portfolio examples of e-commerce sites",
        "Provide timeline breakdown for phases"
      ],
      client_preferences: {
        design: ["clean and modern", "easy navigation", "prominent product images"],
        functionality: ["fast loading", "mobile optimized", "easy checkout process"],
        timeline: "Launch by end of quarter"
      },
      potential_upsell: [
        "SEO services",
        "Content creation",
        "Ongoing maintenance plan"
      ]
    };
  }
};

export default marketingService;
