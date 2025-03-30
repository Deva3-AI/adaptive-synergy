
// Mock data for services

// Client Brands
export const mockClientBrands = [
  {
    id: 1,
    client_id: 1,
    name: "Brand One",
    description: "First brand for Social Land",
    logo_url: "/placeholder.svg",
    created_at: "2023-08-01T10:00:00Z"
  },
  {
    id: 2,
    client_id: 1,
    name: "Brand Two",
    description: "Second brand for Social Land",
    logo_url: "/placeholder.svg",
    created_at: "2023-08-05T14:30:00Z"
  },
  {
    id: 3,
    client_id: 2,
    name: "Koala Brand",
    description: "Main brand for Koala Digital",
    logo_url: "/placeholder.svg",
    created_at: "2023-07-20T09:15:00Z"
  }
];

// Brand Tasks
export const mockBrandTasks = [
  {
    id: 1,
    brand_id: 1,
    title: "Redesign Brand Logo",
    description: "Create a modern, updated logo for Brand One",
    status: "in_progress",
    due_date: "2023-09-15",
    assigned_to: 2
  },
  {
    id: 2,
    brand_id: 1,
    title: "Social Media Campaign",
    description: "Plan and execute Q3 social media campaign",
    status: "pending",
    due_date: "2023-10-01",
    assigned_to: 3
  },
  {
    id: 3,
    brand_id: 2,
    title: "Website Update",
    description: "Update website with new product information",
    status: "completed",
    due_date: "2023-08-20",
    assigned_to: 1
  }
];

// Client Preferences
export const mockClientPreferences = [
  {
    client_id: 1,
    communication_channel: "Slack",
    feedback_frequency: "Weekly",
    design_preferences: "Minimalist, modern, bold colors",
    response_time_expectation: "Within 24 hours",
    dos: ["Use brand colors consistently", "Keep copy concise", "Include data visualizations"],
    donts: ["Avoid stock photography", "Don't use script fonts", "Avoid complex layouts"]
  },
  {
    client_id: 2,
    communication_channel: "Discord",
    feedback_frequency: "Bi-weekly",
    design_preferences: "Vibrant, playful, illustration-based",
    response_time_expectation: "Within 48 hours",
    dos: ["Use illustrations", "Be playful with copy", "Include interactive elements"],
    donts: ["Don't be too corporate", "Avoid dense text blocks", "Don't use muted colors"]
  }
];

// Task Attachments
export interface MockTaskAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  description?: string;
  uploaded_by: number;
  upload_date: string;
  url: string;
}

export const mockTaskAttachments: MockTaskAttachment[] = [
  {
    id: 1,
    task_id: 1,
    file_name: "logo_draft_v1.png",
    file_type: "image/png",
    file_size: 2500000,
    description: "First draft of the new logo",
    uploaded_by: 2,
    upload_date: "2023-08-25T10:30:00Z",
    url: "/placeholder.svg"
  },
  {
    id: 2,
    task_id: 1,
    file_name: "brand_guidelines.pdf",
    file_type: "application/pdf",
    file_size: 5000000,
    description: "Current brand guidelines for reference",
    uploaded_by: 1,
    upload_date: "2023-08-20T14:45:00Z",
    url: "/placeholder.svg"
  }
];

// Financial Data
export const mockFinancialRecords = [
  {
    id: 1,
    type: "income",
    amount: 5000,
    description: "Client payment - Project Alpha",
    date: "2023-08-15",
    category: "Sales"
  },
  {
    id: 2,
    type: "expense",
    amount: 1200,
    description: "Software subscriptions",
    date: "2023-08-05",
    category: "Operations"
  },
  {
    id: 3,
    type: "expense",
    amount: 3500,
    description: "Office rent",
    date: "2023-08-01",
    category: "Facilities"
  },
  {
    id: 4,
    type: "income",
    amount: 7500,
    description: "Client payment - Project Beta",
    date: "2023-08-20",
    category: "Sales"
  }
];

// Sales Data
export const mockSalesTrends = {
  data: [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 15000 },
    { name: "Mar", value: 18000 },
    { name: "Apr", value: 16000 },
    { name: "May", value: 21000 },
    { name: "Jun", value: 24000 }
  ],
  insights: [
    "Revenue has increased by 20% compared to the previous quarter",
    "Customer acquisition cost has decreased by 15%",
    "Recurring revenue now accounts for 65% of total revenue",
    "The new service line contributed to 25% of Q2 revenue"
  ],
  activities: [
    {
      id: 1,
      title: "Quarterly Review Meeting",
      date: "Sep 15, 2023",
      time: "10:00 AM"
    },
    {
      id: 2,
      title: "Sales Team Strategy Session",
      date: "Sep 18, 2023",
      time: "2:00 PM"
    },
    {
      id: 3,
      title: "Client Success Story Interview",
      date: "Sep 20, 2023",
      time: "11:30 AM"
    }
  ]
};

export const mockSalesByChannel = [
  { name: "Direct Sales", value: 45 },
  { name: "Partner Referrals", value: 25 },
  { name: "Website", value: 15 },
  { name: "Social Media", value: 10 },
  { name: "Other", value: 5 }
];

export const mockTopProducts = [
  {
    id: 1,
    name: "Web Design Package",
    sales: 24,
    units: 24,
    revenue: 48000,
    growth: 15
  },
  {
    id: 2,
    name: "SEO Service Package",
    sales: 18,
    units: 18,
    revenue: 27000,
    growth: 8
  },
  {
    id: 3,
    name: "Social Media Management",
    sales: 15,
    units: 15,
    revenue: 18000,
    growth: 20
  },
  {
    id: 4,
    name: "Content Writing",
    sales: 12,
    units: 48,
    revenue: 14400,
    growth: -5
  }
];

export const mockSalesGrowthData = {
  trends: [
    { name: "Q1", previous: 100000, current: 120000 },
    { name: "Q2", previous: 120000, current: 150000 },
    { name: "Q3", previous: 140000, current: 180000 },
    { name: "Q4", previous: 160000, current: 200000 }
  ],
  currentPeriod: {
    revenueGrowth: 25,
    customerGrowth: 18
  },
  growthDrivers: [
    { factor: "New Customers", impact: 40, performance: "positive" },
    { factor: "Upsells", impact: 35, performance: "positive" },
    { factor: "Pricing Strategy", impact: 15, performance: "neutral" },
    { factor: "Churn Reduction", impact: 10, performance: "negative" }
  ]
};

export const mockSalesTargets = [
  {
    id: 1,
    category: "Total Revenue",
    current: 180000,
    target: 200000,
    percentage: 90
  },
  {
    id: 2,
    category: "New Customers",
    current: 28,
    target: 30,
    percentage: 93
  },
  {
    id: 3,
    category: "Recurring Revenue",
    current: 85000,
    target: 100000,
    percentage: 85
  },
  {
    id: 4,
    category: "Average Deal Size",
    current: 12000,
    target: 15000,
    percentage: 80
  }
];

export const mockGrowthForecast = {
  chart: [
    { name: "Q1", projected: 220000 },
    { name: "Q2", projected: 250000 },
    { name: "Q3", projected: 285000 },
    { name: "Q4", projected: 320000 }
  ],
  insights: [
    {
      type: "trend",
      text: "Revenue is projected to grow by 25% in the next fiscal year"
    },
    {
      type: "trend",
      text: "Recurring revenue is expected to increase to 70% of total revenue"
    },
    {
      type: "warning",
      text: "Market competition is increasing, which may impact growth in Q3"
    },
    {
      type: "trend",
      text: "New product launch in Q2 expected to accelerate growth by 10%"
    }
  ]
};

export const mockSalesFollowUps = [
  {
    id: 1,
    client_name: "Social Land",
    contact_person: "John Smith",
    last_interaction: "2023-08-25",
    next_followup: "2023-09-10",
    potential_value: 25000,
    status: "pending",
    notes: "Discussed new service package, seemed interested"
  },
  {
    id: 2,
    client_name: "Koala Digital",
    contact_person: "Lisa Johnson",
    last_interaction: "2023-08-28",
    next_followup: "2023-09-05",
    potential_value: 15000,
    status: "pending",
    notes: "Send proposal for website redesign"
  },
  {
    id: 3,
    client_name: "AC Digital",
    contact_person: "Michael Brown",
    last_interaction: "2023-08-20",
    next_followup: "2023-09-01",
    potential_value: 10000,
    status: "completed",
    notes: "Closed deal for social media management"
  }
];

export const mockImprovementSuggestions = [
  {
    id: 1,
    category: "Sales Process",
    suggestion: "Reduce time between first contact and proposal by 20%",
    impact: "high",
    implementation_difficulty: "medium"
  },
  {
    id: 2,
    category: "Client Communication",
    suggestion: "Implement automated follow-up emails after meetings",
    impact: "medium",
    implementation_difficulty: "low"
  },
  {
    id: 3,
    category: "Pricing Strategy",
    suggestion: "Introduce tiered pricing for enterprise clients",
    impact: "high",
    implementation_difficulty: "high"
  }
];

// Marketing Data
export const mockEmailTemplates = [
  {
    id: 1,
    name: "New Client Welcome",
    subject: "Welcome to Our Services!",
    description: "Initial welcome email for new clients",
    created_at: "2023-07-15",
    last_modified: "2023-08-10",
    performance: {
      opens: 92,
      clicks: 78,
      responses: 45
    }
  },
  {
    id: 2,
    name: "Project Follow-up",
    subject: "Following Up on Your Project",
    description: "Follow-up email after project completion",
    created_at: "2023-06-20",
    last_modified: "2023-08-05",
    performance: {
      opens: 88,
      clicks: 65,
      responses: 40
    }
  },
  {
    id: 3,
    name: "Service Proposal",
    subject: "Custom Proposal for Your Business",
    description: "Email template for sending service proposals",
    created_at: "2023-08-01",
    last_modified: "2023-08-15",
    performance: {
      opens: 95,
      clicks: 82,
      responses: 60
    }
  }
];

export const mockEmailOutreach = {
  campaigns: [
    {
      id: 1,
      name: "Q3 Client Re-engagement",
      status: "active",
      emails_sent: 150,
      opens: 120,
      responses: 35,
      meetings_booked: 12
    },
    {
      id: 2,
      name: "New Service Announcement",
      status: "completed",
      emails_sent: 200,
      opens: 180,
      responses: 45,
      meetings_booked: 15
    },
    {
      id: 3,
      name: "Referral Program",
      status: "planned",
      emails_sent: 0,
      opens: 0,
      responses: 0,
      meetings_booked: 0
    }
  ],
  metrics: {
    total_emails: 350,
    average_open_rate: 85.7,
    average_response_rate: 22.9,
    meetings_booked: 27
  },
  upcoming_emails: 125
};

export const mockLeads = [
  {
    id: 1,
    name: "Tech Innovators Inc.",
    contact_person: "Sarah Johnson",
    email: "sarah@techinnovators.com",
    phone: "555-123-4567",
    source: "Website Form",
    status: "New",
    created_at: "2023-08-28",
    notes: "Interested in web development services",
    assigned_to: "Mike Brown"
  },
  {
    id: 2,
    name: "Creative Solutions Co.",
    contact_person: "David Lee",
    email: "david@creativesolutions.co",
    phone: "555-987-6543",
    source: "Referral",
    status: "Contacted",
    created_at: "2023-08-25",
    notes: "Referred by Social Land, looking for branding services",
    assigned_to: "Jane Smith"
  },
  {
    id: 3,
    name: "Global Retail Group",
    contact_person: "Amanda White",
    email: "amanda@globalretail.com",
    phone: "555-456-7890",
    source: "LinkedIn",
    status: "Meeting Scheduled",
    created_at: "2023-08-22",
    notes: "Meeting scheduled for Sep 5 to discuss e-commerce solutions",
    assigned_to: "Mike Brown"
  },
  {
    id: 4,
    name: "Health Innovations Ltd.",
    contact_person: "Robert Chen",
    email: "robert@healthinnovations.com",
    phone: "555-789-0123",
    source: "Conference",
    status: "Qualified",
    created_at: "2023-08-20",
    notes: "Met at HealthTech conference, needs a new website and digital marketing",
    assigned_to: "Jane Smith"
  }
];

export const mockMarketingPlans = [
  {
    id: 1,
    title: "Q4 Social Media Growth Strategy",
    description: "Comprehensive plan to increase social media engagement and followers",
    status: "active",
    created_at: "2023-08-15",
    timeline: "Sep 1 - Dec 31, 2023",
    kpis: [
      "Increase followers by 25%",
      "Improve engagement rate to 3.5%",
      "Generate 20 qualified leads"
    ],
    tasks: [
      "Content calendar creation",
      "Audience analysis",
      "Paid promotion strategy",
      "Weekly performance reviews"
    ]
  },
  {
    id: 2,
    title: "Website SEO Improvement Plan",
    description: "Strategy to improve website organic search rankings and traffic",
    status: "draft",
    created_at: "2023-08-20",
    timeline: "Oct 1 - Dec 31, 2023",
    kpis: [
      "Improve key rankings by 10 positions",
      "Increase organic traffic by 35%",
      "Reduce bounce rate by 15%"
    ],
    tasks: [
      "Technical SEO audit",
      "Content gap analysis",
      "Keyword optimization",
      "Backlink acquisition"
    ]
  },
  {
    id: 3,
    title: "Email Marketing Automation",
    description: "Implementation of automated email workflows for lead nurturing",
    status: "completed",
    created_at: "2023-07-10",
    timeline: "Jul 15 - Aug 31, 2023",
    kpis: [
      "Set up 5 automated workflows",
      "Increase email open rate to 25%",
      "Improve click-through rate to 3.2%"
    ],
    tasks: [
      "Email template design",
      "Workflow mapping",
      "A/B testing setup",
      "Performance tracking"
    ]
  }
];

export const mockMarketingTrends = {
  trends: [
    {
      id: 1,
      name: "AI Content Creation",
      relevance: "high",
      adoption_stage: "early majority",
      description: "Using AI tools to generate and optimize content",
      potential_impact: "Reduce content creation time by 40%, improve personalization"
    },
    {
      id: 2,
      name: "Video-First Social Strategy",
      relevance: "high",
      adoption_stage: "early majority",
      description: "Prioritizing short-form video content across platforms",
      potential_impact: "Increase engagement by 35%, improve brand recall"
    },
    {
      id: 3,
      name: "Zero-Party Data Collection",
      relevance: "medium",
      adoption_stage: "early adopters",
      description: "Directly collecting data that customers intentionally share",
      potential_impact: "Improve targeting precision, prepare for cookie-less future"
    },
    {
      id: 4,
      name: "Sustainable Marketing",
      relevance: "medium",
      adoption_stage: "innovators",
      description: "Highlighting environmental and social responsibility",
      potential_impact: "Appeal to conscious consumers, build brand loyalty"
    }
  ],
  recommended_actions: [
    "Invest in AI content tools and training",
    "Develop video content strategy for all major platforms",
    "Create direct data collection touchpoints",
    "Highlight existing sustainability practices"
  ]
};

export const mockCompetitorInsights = [
  {
    competitor: "Digital Apex",
    strengths: ["Strong social media presence", "Proprietary technology platform", "Premium pricing"],
    weaknesses: ["Limited service offerings", "Small team size", "Regional focus only"],
    recent_moves: ["Launched new AI service", "Hired industry influencer", "Redesigned website"],
    market_share: 15
  },
  {
    competitor: "WebSphere Solutions",
    strengths: ["Comprehensive service range", "Large team", "International presence"],
    weaknesses: ["Higher prices", "Slower delivery times", "Less personalized service"],
    recent_moves: ["Acquired smaller agency", "New enterprise client announcements", "Rebranding initiative"],
    market_share: 22
  },
  {
    competitor: "Nimble Digital",
    strengths: ["Competitive pricing", "Fast turnaround times", "Strong client testimonials"],
    weaknesses: ["Less established brand", "Smaller portfolio", "Limited expertise in some areas"],
    recent_moves: ["Aggressive social media campaign", "New partnership program", "Free resource library launch"],
    market_share: 8
  }
];

// Task data
export const mockUserTasks = [
  {
    task_id: 101,
    title: "Complete website redesign",
    description: "Update the client's website with new branding and improved UX",
    status: "in_progress",
    priority: "high",
    progress: 60,
    client_id: 1,
    client_name: "Social Land",
    assigned_to: 1
  },
  {
    task_id: 102,
    title: "SEO optimization",
    description: "Improve search rankings for key terms",
    status: "pending",
    priority: "medium",
    progress: 0,
    client_id: 2,
    client_name: "Koala Digital",
    assigned_to: 1
  },
  {
    task_id: 103,
    title: "Content calendar creation",
    description: "Develop Q4 content calendar for social media",
    status: "completed",
    priority: "medium",
    progress: 100,
    client_id: 3,
    client_name: "AC Digital",
    assigned_to: 1
  }
];

export const mockTaskStatistics = {
  completion_rate: 85,
  on_time_completion: 92,
  average_task_duration: 4.3,
  tasks_by_status: [
    { name: "Completed", value: 45 },
    { name: "In Progress", value: 12 },
    { name: "Pending", value: 8 },
    { name: "Cancelled", value: 2 }
  ],
  tasks_by_priority: [
    { name: "High", value: 15 },
    { name: "Medium", value: 32 },
    { name: "Low", value: 20 }
  ],
  recent_completions: [
    {
      id: 1,
      title: "Website Launch",
      completed_date: "2023-08-25",
      client: "Tech Innovators"
    },
    {
      id: 2,
      title: "Brand Guidelines",
      completed_date: "2023-08-23",
      client: "Creative Solutions"
    },
    {
      id: 3,
      title: "Marketing Campaign",
      completed_date: "2023-08-20",
      client: "Health Innovations"
    }
  ]
};
