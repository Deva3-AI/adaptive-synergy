
// Mock data for various services

// Client
export const mockClientBrands = [
  {
    id: 1,
    client_id: 1,
    name: "Social Land",
    description: "Social media marketing brand",
    logo_url: "/brands/social-land.png",
    created_at: "2023-01-15T09:30:00Z"
  },
  {
    id: 2,
    client_id: 1,
    name: "Tech Innovate",
    description: "Technology solutions brand",
    logo_url: "/brands/tech-innovate.png",
    created_at: "2023-02-20T11:45:00Z"
  },
  {
    id: 3,
    client_id: 2,
    name: "Koala Digital",
    description: "Digital marketing agency",
    logo_url: "/brands/koala-digital.png",
    created_at: "2023-03-10T14:20:00Z"
  }
];

export const mockBrandTasks = [
  {
    id: 101,
    brand_id: 1,
    title: "Create Instagram campaign",
    description: "Design and launch an Instagram campaign for product X",
    status: "in_progress",
    due_date: "2023-11-30T23:59:59Z"
  },
  {
    id: 102,
    brand_id: 1,
    title: "Optimize Facebook ads",
    description: "Analyze and optimize existing Facebook ad campaigns",
    status: "pending",
    due_date: "2023-12-15T23:59:59Z"
  },
  {
    id: 103,
    brand_id: 2,
    title: "Update website content",
    description: "Refresh content on the homepage and about page",
    status: "completed",
    due_date: "2023-11-10T23:59:59Z"
  }
];

export const mockClientPreferences = [
  {
    client_id: 1,
    communication_channel: "Slack",
    feedback_frequency: "Weekly",
    design_preferences: "Minimalist, modern, blue color palette",
    dos: ["Provide regular updates", "Use data-driven insights", "Include case studies"],
    donts: ["Last-minute changes", "Generic templates", "Technical jargon"]
  },
  {
    client_id: 2,
    communication_channel: "Email",
    feedback_frequency: "Bi-weekly",
    design_preferences: "Bold, colorful, playful",
    dos: ["Creative concepts", "Video content", "Social proof"],
    donts: ["Corporate tone", "Long paragraphs", "Stock photos"]
  }
];

// User Tasks
export const mockUserTasks = [
  {
    task_id: 1,
    title: "Design website homepage",
    description: "Create a responsive design for the client's homepage",
    client_id: 1,
    status: "in_progress",
    start_time: "2023-11-01T09:00:00Z",
    estimated_time: 8,
    actual_time: 0,
    created_at: "2023-10-29T14:30:00Z",
    updated_at: "2023-11-01T09:00:00Z"
  },
  {
    task_id: 2,
    title: "Implement authentication system",
    description: "Set up user authentication with JWT tokens",
    client_id: 2,
    status: "pending",
    estimated_time: 12,
    created_at: "2023-10-30T11:15:00Z",
    updated_at: "2023-10-30T11:15:00Z"
  },
  {
    task_id: 3,
    title: "SEO optimization",
    description: "Optimize meta tags and content for better search ranking",
    client_id: 1,
    status: "completed",
    start_time: "2023-10-27T10:00:00Z",
    end_time: "2023-10-28T17:00:00Z",
    estimated_time: 6,
    actual_time: 7.5,
    created_at: "2023-10-25T09:45:00Z",
    updated_at: "2023-10-28T17:00:00Z"
  }
];

// Task Attachments
export const mockTaskAttachments = [
  {
    id: 1,
    task_id: 1,
    file_name: "homepage-wireframe.pdf",
    file_type: "application/pdf",
    file_size: 2560000,
    uploaded_by: 1,
    upload_date: "2023-10-29T15:20:00Z",
    url: "/attachments/homepage-wireframe.pdf",
    description: "Initial wireframe for homepage design"
  },
  {
    id: 2,
    task_id: 1,
    file_name: "color-palette.png",
    file_type: "image/png",
    file_size: 1280000,
    uploaded_by: 1,
    upload_date: "2023-10-30T09:15:00Z",
    url: "/attachments/color-palette.png",
    description: "Approved color palette for the project"
  }
];

// Task Statistics
export const mockTaskStatistics = {
  completed_tasks: 24,
  pending_tasks: 12,
  in_progress_tasks: 8,
  overdue_tasks: 3,
  completion_rate: 75,
  avg_completion_time: 5.2,
  monthly_trends: [
    { month: "Jan", completed: 18, assigned: 23 },
    { month: "Feb", completed: 21, assigned: 25 },
    { month: "Mar", completed: 24, assigned: 28 },
    { month: "Apr", completed: 20, assigned: 24 },
    { month: "May", completed: 22, assigned: 26 }
  ],
  task_distribution: [
    { category: "Design", count: 15 },
    { category: "Development", count: 22 },
    { category: "Marketing", count: 10 },
    { category: "Content", count: 8 }
  ]
};

// Financial Records
export const mockFinancialRecords = [
  {
    id: 1,
    type: "income",
    amount: 25000,
    description: "Client project payment",
    date: "2023-10-15",
    category: "Project Revenue"
  },
  {
    id: 2,
    type: "expense",
    amount: 1200,
    description: "Office rent",
    date: "2023-10-01",
    category: "Facilities"
  },
  {
    id: 3,
    type: "expense",
    amount: 3500,
    description: "Employee salaries",
    date: "2023-10-05",
    category: "Payroll"
  },
  {
    id: 4,
    type: "income",
    amount: 15000,
    description: "Consulting services",
    date: "2023-10-20",
    category: "Services"
  }
];

// Sales Trends
export const mockSalesTrends = {
  data: [
    { date: "2023-06-01", value: 45000 },
    { date: "2023-07-01", value: 52000 },
    { date: "2023-08-01", value: 49000 },
    { date: "2023-09-01", value: 58000 },
    { date: "2023-10-01", value: 62000 },
    { date: "2023-11-01", value: 68000 }
  ],
  insights: [
    "Q3 sales increased by 22% compared to Q2",
    "Web development services show the strongest growth at 35%",
    "Average deal size has increased from $8,500 to $12,500",
    "Recurring revenue clients now account for 65% of total revenue"
  ],
  activities: [
    { id: 1, title: "Client review meeting", date: "Nov 28, 2023", time: "10:00 AM" },
    { id: 2, title: "Proposal presentation", date: "Nov 30, 2023", time: "2:30 PM" },
    { id: 3, title: "Contract renewal discussion", date: "Dec 2, 2023", time: "11:00 AM" }
  ]
};

// Sales By Channel
export const mockSalesByChannel = [
  { name: "Direct", value: 45 },
  { name: "Referral", value: 30 },
  { name: "Partnership", value: 15 },
  { name: "Online", value: 10 }
];

// Top Products
export const mockTopProducts = [
  {
    id: 1,
    name: "Web Development",
    sales: 32,
    units: 32,
    revenue: 320000,
    growth: 15
  },
  {
    id: 2,
    name: "Digital Marketing",
    sales: 28,
    units: 28,
    revenue: 224000,
    growth: 12
  },
  {
    id: 3,
    name: "UI/UX Design",
    sales: 24,
    units: 24,
    revenue: 144000,
    growth: 8
  },
  {
    id: 4,
    name: "SEO Services",
    sales: 18,
    units: 18,
    revenue: 90000,
    growth: -5
  }
];

// Sales Growth Data
export const mockSalesGrowthData = {
  trends: [
    { month: "Jan", current: 45000, previous: 38000 },
    { month: "Feb", current: 48000, previous: 40000 },
    { month: "Mar", current: 52000, previous: 42000 },
    { month: "Apr", current: 49000, previous: 45000 },
    { month: "May", current: 56000, previous: 46000 },
    { month: "Jun", current: 60000, previous: 48000 }
  ],
  currentPeriod: {
    revenueGrowth: 20,
    customerGrowth: 15
  },
  growthDrivers: [
    { factor: "New Clients", impact: 35, performance: "positive" },
    { factor: "Upselling", impact: 28, performance: "positive" },
    { factor: "Referrals", impact: 22, performance: "positive" },
    { factor: "Retention", impact: 15, performance: "neutral" }
  ]
};

// Sales Targets
export const mockSalesTargets = [
  {
    id: 1,
    category: "Overall Revenue",
    current: 420000,
    target: 500000,
    percentage: 84
  },
  {
    id: 2,
    category: "New Clients",
    current: 18,
    target: 20,
    percentage: 90
  },
  {
    id: 3,
    category: "Upsell Revenue",
    current: 85000,
    target: 100000,
    percentage: 85
  },
  {
    id: 4,
    category: "Referral Sales",
    current: 120000,
    target: 125000,
    percentage: 96
  }
];

// Growth Forecast
export const mockGrowthForecast = {
  chart: [
    { month: "Dec", projected: 75000, range: [70000, 80000] },
    { month: "Jan", projected: 78000, range: [72000, 84000] },
    { month: "Feb", projected: 82000, range: [75000, 89000] },
    { month: "Mar", projected: 85000, range: [78000, 92000] }
  ],
  insights: [
    { 
      type: "positive", 
      text: "Projected 15% YoY growth in Q1 based on current pipeline and market conditions" 
    },
    { 
      type: "positive", 
      text: "Web development services expected to remain the top revenue generator with 22% growth" 
    },
    { 
      type: "warning", 
      text: "Potential economic slowdown in Q2 may impact growth in the design services sector" 
    },
    { 
      type: "positive", 
      text: "New partnership opportunities could add additional 10-15% to revenue projections" 
    }
  ]
};

// Sales Follow-ups
export const mockSalesFollowUps = [
  {
    id: 1,
    clientName: "Acme Corporation",
    contactPerson: "John Smith",
    email: "john@acmecorp.com",
    phone: "+1 555-123-4567",
    type: "call",
    dueDate: "2023-11-28",
    status: "pending",
    notes: "Follow up on the proposal sent last week, address any questions about pricing structure."
  },
  {
    id: 2,
    clientName: "TechStart Inc",
    contactPerson: "Sarah Johnson",
    email: "sarah@techstart.com",
    phone: "+1 555-987-6543",
    type: "meeting",
    dueDate: "2023-12-01",
    status: "pending",
    notes: "Schedule a demo of the new platform features, focus on automation capabilities."
  },
  {
    id: 3,
    clientName: "Global Retail Group",
    contactPerson: "Michael Brown",
    email: "michael@grg.com",
    phone: "+1 555-456-7890",
    type: "email",
    dueDate: "2023-11-25",
    status: "pending",
    notes: "Send case studies relevant to their industry, particularly focusing on ROI metrics."
  }
];

// Improvement Suggestions
export const mockImprovementSuggestions = [
  {
    id: 1,
    title: "Implement Value-Based Pricing",
    description: "Transition from hourly to value-based pricing for select services to increase margins and better communicate value to clients.",
    priority: "high"
  },
  {
    id: 2,
    title: "Develop Industry-Specific Packages",
    description: "Create tailored service packages for key industries (healthcare, finance, education) to streamline proposals and capitalize on expertise.",
    priority: "medium"
  },
  {
    id: 3,
    title: "Enhance CRM Usage",
    description: "Improve data capture in CRM system to better track touchpoints, improve forecasting, and identify upsell opportunities.",
    priority: "high"
  }
];

// Marketing Email Templates
export const mockEmailTemplates = [
  {
    id: 1,
    name: "New Client Welcome",
    subject: "Welcome to Our Agency!",
    content: "Hello [Client Name],\n\nWe're thrilled to welcome you to [Agency Name]! We're excited to start working with you on [Project Description]...",
    created_at: "2023-06-15",
    last_used: "2023-11-05",
    performance: {
      open_rate: 85,
      response_rate: 72
    }
  },
  {
    id: 2,
    name: "Project Proposal",
    subject: "Your Custom [Service] Proposal",
    content: "Hello [Client Name],\n\nThank you for the opportunity to present our proposal for [Project Name]...",
    created_at: "2023-07-22",
    last_used: "2023-11-12",
    performance: {
      open_rate: 92,
      response_rate: 68
    }
  },
  {
    id: 3,
    name: "Follow-up Meeting",
    subject: "Next Steps After Our Meeting",
    content: "Hello [Client Name],\n\nThank you for your time today discussing [Meeting Topic]...",
    created_at: "2023-08-10",
    last_used: "2023-11-18",
    performance: {
      open_rate: 78,
      response_rate: 65
    }
  }
];

// Email Outreach Data
export const mockEmailOutreach = [
  {
    id: 1,
    recipient: "John Smith",
    recipientCompany: "Acme Corp",
    subject: "Digital Marketing Partnership Opportunity",
    status: "opened",
    sentAt: "2023-11-15T09:30:00Z",
    source: "linkedin",
    followUpScheduled: true
  },
  {
    id: 2,
    recipient: "Emily Johnson",
    recipientCompany: "Tech Innovators",
    subject: "Web Development Services Proposal",
    status: "replied",
    sentAt: "2023-11-16T10:15:00Z",
    source: "referral",
    followUpScheduled: false
  },
  {
    id: 3,
    recipient: "Michael Brown",
    recipientCompany: "Global Retail Group",
    subject: "E-commerce Optimization Solutions",
    status: "sent",
    sentAt: "2023-11-18T14:45:00Z",
    source: "cold_outreach",
    followUpScheduled: true
  },
  {
    id: 4,
    recipient: "Sarah Williams",
    recipientCompany: "Education First",
    subject: "Digital Transformation Partnership",
    status: "bounced",
    sentAt: "2023-11-17T11:30:00Z",
    source: "conference",
    followUpScheduled: false
  }
];

// Lead Profiles
export const mockLeads = [
  {
    id: 1,
    name: "David Chen",
    company: "Innovate Solutions",
    position: "Marketing Director",
    email: "david@innovatesolutions.com",
    phone: "+1 555-123-7890",
    source: "Website Contact Form",
    status: "new",
    score: 85,
    lastContactedAt: null,
    notes: "Interested in a complete website redesign and SEO services"
  },
  {
    id: 2,
    name: "Amanda Rodriguez",
    company: "Global Retail Inc",
    position: "Digital Manager",
    email: "amanda@globalretail.com",
    phone: "+1 555-456-7890",
    source: "LinkedIn Outreach",
    status: "contacted",
    score: 72,
    lastContactedAt: "2023-11-10T15:30:00Z",
    notes: "Needs help with e-commerce optimization and social media marketing"
  },
  {
    id: 3,
    name: "James Wilson",
    company: "Tech Startup Hub",
    position: "CEO",
    email: "james@techstartup.com",
    phone: "+1 555-789-1234",
    source: "Referral",
    status: "meeting_scheduled",
    score: 90,
    lastContactedAt: "2023-11-15T10:00:00Z",
    notes: "Looking for full-service digital marketing for their new product launch"
  },
  {
    id: 4,
    name: "Sophia Lee",
    company: "Healthcare Solutions",
    position: "Content Manager",
    email: "sophia@healthcaresolutions.com",
    phone: "+1 555-234-5678",
    source: "Content Download",
    status: "proposal_sent",
    score: 65,
    lastContactedAt: "2023-11-08T09:15:00Z",
    notes: "Interested specifically in content marketing and SEO for healthcare industry"
  }
];

// Marketing Plans
export const mockMarketingPlans = [
  {
    id: 1,
    title: "Q1 Growth Strategy",
    description: "Comprehensive plan for Q1 focusing on lead generation and conversion optimization",
    created_at: "2023-10-15",
    updated_at: "2023-11-05",
    owner: "Marketing Team",
    status: "in_progress",
    progress: 35,
    content: "Detailed strategy document outlining objectives, tactics, and KPIs for Q1 growth initiatives."
  },
  {
    id: 2,
    title: "Social Media Expansion",
    description: "Strategy to expand presence across new social platforms and improve engagement",
    created_at: "2023-11-01",
    updated_at: "2023-11-10",
    owner: "Social Media Team",
    status: "in_progress",
    progress: 20,
    content: "Platform-specific strategies, content calendars, and performance metrics for social media expansion."
  },
  {
    id: 3,
    title: "Content Marketing Refresh",
    description: "Updated approach to content creation and distribution across channels",
    created_at: "2023-10-20",
    updated_at: "2023-11-15",
    owner: "Content Team",
    status: "draft",
    progress: 65,
    content: "Analysis of existing content performance and strategies for improving content quality, distribution, and conversion."
  }
];

// Marketing Trends
export const mockMarketingTrends = [
  {
    id: 1,
    category: "Content Marketing",
    trend: "Video-first Content Strategy",
    description: "Shifting focus to short-form videos as primary content format across platforms",
    impact_level: "high",
    adoption_rate: 72,
    insights: [
      "60% higher engagement than static content",
      "Most effective for awareness and consideration stages",
      "Requires additional production resources and expertise"
    ]
  },
  {
    id: 2,
    category: "Social Media",
    trend: "Private Community Building",
    description: "Creating exclusive communities rather than focusing solely on broad reach",
    impact_level: "medium",
    adoption_rate: 45,
    insights: [
      "Higher engagement and customer loyalty",
      "Provides valuable first-party data",
      "Requires consistent management and value provision"
    ]
  },
  {
    id: 3,
    category: "SEO",
    trend: "AI-Generated Content Optimization",
    description: "Using AI tools to create and optimize content for search visibility",
    impact_level: "high",
    adoption_rate: 58,
    insights: [
      "Enables scale while maintaining quality with proper oversight",
      "Requires human editing and optimization",
      "Search engines increasingly able to detect purely AI content"
    ]
  }
];

// Competitor Insights
export const mockCompetitorInsights = [
  {
    id: 1,
    competitor_name: "Digital Innovators",
    strengths: [
      "Strong presence in healthcare and finance verticals",
      "Proprietary analytics platform",
      "Large team with specialized expertise"
    ],
    weaknesses: [
      "Higher pricing structure",
      "Slower project turnaround times",
      "Less focus on small business clients"
    ],
    recent_moves: [
      "Launched new AI-powered marketing automation tool",
      "Acquired smaller social media agency",
      "Expanded into the European market"
    ],
    threat_level: "high"
  },
  {
    id: 2,
    competitor_name: "CreativeForce Agency",
    strengths: [
      "Award-winning creative work",
      "Strong brand recognition",
      "Innovative campaign approaches"
    ],
    weaknesses: [
      "Limited technical capabilities",
      "Less data-driven approach",
      "Customer service complaints"
    ],
    recent_moves: [
      "Rebranded agency and positioning",
      "Introduced performance-based pricing model",
      "New focus on sustainability-focused clients"
    ],
    threat_level: "medium"
  },
  {
    id: 3,
    competitor_name: "Growth Hackers Inc",
    strengths: [
      "Lower pricing model",
      "Quick project implementation",
      "Strong results for startups"
    ],
    weaknesses: [
      "Limited service depth",
      "Small team with capacity constraints",
      "Less established with enterprise clients"
    ],
    recent_moves: [
      "Launched productized service offerings",
      "New venture funding round",
      "Released free marketing tools to generate leads"
    ],
    threat_level: "medium"
  }
];

// Add weekly and monthly reports
export const mockWeeklyReports = [
  {
    id: 1,
    title: "Weekly Sales Report",
    period: "Nov 13-19, 2023",
    sales: 58000,
    target: 55000,
    progress: 105,
    performanceData: [
      { day: "Mon", sales: 12000 },
      { day: "Tue", sales: 9500 },
      { day: "Wed", sales: 11000 },
      { day: "Thu", sales: 8500 },
      { day: "Fri", sales: 17000 }
    ],
    metrics: {
      conversionRate: 4.2,
      prevConversionRate: 3.8,
      avgSaleValue: 2850,
      prevAvgSaleValue: 2700,
      newLeads: 35,
      prevNewLeads: 32,
      closedDeals: 20,
      prevClosedDeals: 18
    }
  },
  {
    id: 2,
    title: "Weekly Sales Report",
    period: "Nov 6-12, 2023",
    sales: 52000,
    target: 53000,
    progress: 98,
    performanceData: [
      { day: "Mon", sales: 10500 },
      { day: "Tue", sales: 11000 },
      { day: "Wed", sales: 9000 },
      { day: "Thu", sales: 10500 },
      { day: "Fri", sales: 11000 }
    ],
    metrics: {
      conversionRate: 3.8,
      prevConversionRate: 3.5,
      avgSaleValue: 2700,
      prevAvgSaleValue: 2650,
      newLeads: 32,
      prevNewLeads: 30,
      closedDeals: 18,
      prevClosedDeals: 17
    }
  }
];

export const mockMonthlyReports = [
  {
    id: 1,
    title: "Monthly Sales Report",
    period: "October 2023",
    sales: 235000,
    target: 220000,
    progress: 107,
    performanceData: [
      { week: "Week 1", sales: 52000 },
      { week: "Week 2", sales: 58000 },
      { week: "Week 3", sales: 62000 },
      { week: "Week 4", sales: 63000 }
    ],
    metrics: {
      conversionRate: 4.1,
      prevConversionRate: 3.7,
      avgSaleValue: 2800,
      prevAvgSaleValue: 2600,
      newLeads: 120,
      prevNewLeads: 110,
      closedDeals: 84,
      prevClosedDeals: 78
    }
  },
  {
    id: 2,
    title: "Monthly Sales Report",
    period: "September 2023",
    sales: 210000,
    target: 215000,
    progress: 98,
    performanceData: [
      { week: "Week 1", sales: 45000 },
      { week: "Week 2", sales: 52000 },
      { week: "Week 3", sales: 58000 },
      { week: "Week 4", sales: 55000 }
    ],
    metrics: {
      conversionRate: 3.7,
      prevConversionRate: 3.6,
      avgSaleValue: 2600,
      prevAvgSaleValue: 2550,
      newLeads: 110,
      prevNewLeads: 105,
      closedDeals: 78,
      prevClosedDeals: 75
    }
  }
];
