
// Mock data for various services

// Mock AI responses
export const mockAIResponse = {
  content: "This is a sample AI response. I've analyzed your request and have some suggestions.",
  confidence: 0.85,
  timestamp: new Date().toISOString()
};

export const mockInsights = [
  { id: 1, insight: "Task completion rates have improved by 15% this month." },
  { id: 2, insight: "Client communication frequency has increased." },
  { id: 3, insight: "Recurring bottlenecks identified in design review phase." }
];

// Mock user data
export const mockUserData = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role_id: 2 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role_id: 3 },
    { id: 3, name: "Admin User", email: "admin@example.com", role_id: 1 }
  ],
  roles: [
    { role_id: 1, role_name: "admin" },
    { role_id: 2, role_name: "employee" },
    { role_id: 3, role_name: "client" },
    { role_id: 4, role_name: "marketing" },
    { role_id: 5, role_name: "hr" },
    { role_id: 6, role_name: "finance" }
  ],
  permissions: [
    { id: 1, name: "view_dashboard" },
    { id: 2, name: "manage_users" },
    { id: 3, name: "manage_tasks" }
  ],
  activity: [
    { id: 1, userId: 1, action: "Logged in", timestamp: new Date().toISOString() },
    { id: 2, userId: 1, action: "Updated profile", timestamp: new Date().toISOString() }
  ],
  tasks: [
    { id: 1, title: "Complete project plan", status: "in_progress", priority: "high" },
    { id: 2, title: "Client meeting", status: "pending", priority: "medium" }
  ],
  dashboardData: {
    tasksSummary: { total: 25, completed: 15, inProgress: 8, pending: 2 },
    recentActivity: [
      { id: 1, action: "Task completed", timestamp: new Date().toISOString() },
      { id: 2, action: "New task assigned", timestamp: new Date().toISOString() }
    ]
  }
};

// Mock marketing data
export const mockMarketingData = {
  campaigns: [
    { id: 1, title: "Summer Promotion", status: "active", leads_generated: 45 },
    { id: 2, title: "Product Launch", status: "planned", leads_generated: 0 }
  ],
  leads: [
    { id: 1, name: "Company A", contact: "Jane", email: "jane@companya.com", status: "new" },
    { id: 2, name: "Company B", contact: "John", email: "john@companyb.com", status: "contacted" }
  ],
  metrics: {
    conversion_rate: "12.5%",
    email_open_rate: "28.3%",
    click_through_rate: "3.2%"
  },
  plans: [
    { 
      id: 1, 
      title: "Q3 Growth Strategy",
      objectives: ["Increase lead gen by 20%", "Improve conversion by 5%"],
      tactics: ["Email campaign", "Social media push", "Content marketing"]
    }
  ],
  trends: [
    { id: 1, name: "Video Marketing", trend: "rising", relevance: "high" },
    { id: 2, name: "Voice Search", trend: "rising", relevance: "medium" }
  ],
  competitorInsights: [
    { 
      id: 1, 
      competitor: "CompetitorX", 
      impact: "medium",
      type: "product",
      description: "Launched new feature targeting our core market",
      discoveredAt: new Date().toISOString(),
      source: "Press release",
      suggestedResponse: "Accelerate our product roadmap for similar features"
    }
  ]
};

// Finance mock data
export const mockFinanceData = {
  invoices: [
    {
      id: 1,
      invoice_number: "INV-2023-001",
      client_name: "Acme Corp",
      amount: 5000,
      status: "paid",
      issue_date: "2023-06-01",
      due_date: "2023-06-15"
    },
    {
      id: 2,
      invoice_number: "INV-2023-002",
      client_name: "TechStart Inc",
      amount: 3500,
      status: "pending",
      issue_date: "2023-06-10",
      due_date: "2023-06-25"
    }
  ],
  financialRecords: [
    {
      id: 1,
      record_type: "income",
      amount: 5000,
      description: "Client payment",
      category: "sales",
      date: "2023-06-05"
    },
    {
      id: 2,
      record_type: "expense",
      amount: 1200,
      description: "Office rent",
      category: "facilities",
      date: "2023-06-01"
    }
  ],
  salesMetrics: {
    total_revenue: 125000,
    growth_rate: "12.5%",
    average_deal_size: 4500,
    conversion_rate: "18.2%",
    monthly_trend: [
      { month: "Jan", revenue: 10000, target: 9000 },
      { month: "Feb", revenue: 12000, target: 11000 },
      { month: "Mar", revenue: 11500, target: 12000 }
    ],
    by_service: [
      { name: "Consulting", value: 45000 },
      { name: "Development", value: 65000 },
      { name: "Support", value: 15000 }
    ]
  },
  financialOverview: {
    summary_metrics: {
      net_profit: 35000,
      profit_margin: 28.5,
      recent_trend: "positive"
    },
    financial_health: {
      status: "good",
      explanation: "Strong cash flow and healthy profit margins"
    },
    key_insights: [
      "Revenue grew 12.5% compared to last quarter",
      "Operating expenses increased by only 5%",
      "New service line contributing 15% to total revenue"
    ],
    recommendations: [
      { area: "Pricing", action: "Consider 5-10% increase for premium services" },
      { area: "Expenses", action: "Review software subscriptions for potential savings" }
    ],
    prediction: "Projected to exceed annual target by 8% if current trends continue"
  },
  financialMetrics: {
    currentPeriod: {
      revenue: 125000,
      expenses: 90000,
      profit: 35000
    },
    previousPeriod: {
      revenue: 110000,
      expenses: 85000,
      profit: 25000
    },
    metrics: [
      { name: "Revenue Growth", value: "13.6%", trend: "positive" },
      { name: "Profit Margin", value: "28%", trend: "positive" },
      { name: "Cash Flow", value: "$42,000", trend: "positive" },
      { name: "Customer Acquisition Cost", value: "$420", trend: "neutral" }
    ]
  },
  upsellOpportunities: [
    {
      id: 1,
      client_name: "Acme Corp",
      current_services: ["Web Development"],
      potential_services: ["SEO", "Maintenance"],
      estimated_value: 2500,
      probability: "high"
    },
    {
      id: 2,
      client_name: "TechStart Inc",
      current_services: ["Consulting"],
      potential_services: ["Development", "Training"],
      estimated_value: 7500,
      probability: "medium"
    }
  ],
  financialPlans: [
    {
      id: 1,
      title: "Q3 Financial Strategy",
      objectives: ["Increase profit margin by 2%", "Reduce overhead by 5%"],
      initiatives: [
        { title: "Pricing structure review", status: "in_progress" },
        { title: "Vendor consolidation", status: "planned" }
      ],
      metrics: [
        { name: "Profit Margin", target: "30%" },
        { name: "Overhead Ratio", target: "22%" }
      ]
    }
  ],
  salesFollowUps: [
    {
      id: 1,
      clientName: "Acme Corp",
      contactPerson: "John Smith",
      email: "john@acmecorp.com",
      phone: "+1 234 567 8900",
      type: "call",
      dueDate: "2023-07-15",
      notes: "Follow up on proposal for website redesign",
      status: "pending"
    },
    {
      id: 2,
      clientName: "TechStart Inc",
      contactPerson: "Jane Doe",
      email: "jane@techstart.com",
      phone: "+1 234 567 8901",
      type: "email",
      dueDate: "2023-07-10",
      notes: "Send additional information about our services",
      status: "pending"
    }
  ],
  improvementSuggestions: [
    {
      id: 1,
      title: "Implement structured follow-up process",
      description: "Create templated follow-up emails and scheduled reminders",
      priority: "high"
    },
    {
      id: 2,
      title: "Enhance proposal templates",
      description: "Include more case studies and social proof in proposals",
      priority: "medium"
    }
  ],
  salesGrowthData: {
    trends: [
      { month: "Jan", value: 5 },
      { month: "Feb", value: 8 },
      { month: "Mar", value: 12 },
      { month: "Apr", value: 10 },
      { month: "May", value: 15 },
      { month: "Jun", value: 18 }
    ],
    currentPeriod: {
      revenueGrowth: 15.5,
      customerGrowth: 12.3
    },
    growthDrivers: [
      { factor: "New clients", impact: 45, performance: "positive" },
      { factor: "Upsells", impact: 30, performance: "positive" },
      { factor: "Pricing", impact: 15, performance: "neutral" },
      { factor: "Retention", impact: 10, performance: "negative" }
    ]
  },
  salesTargets: [
    {
      id: 1,
      category: "Total Revenue",
      current: 125000,
      target: 150000,
      percentage: 83
    },
    {
      id: 2,
      category: "New Clients",
      current: 8,
      target: 10,
      percentage: 80
    },
    {
      id: 3,
      category: "Upsells",
      current: 12,
      target: 15,
      percentage: 80
    },
    {
      id: 4,
      category: "Average Deal Size",
      current: 4500,
      target: 5000,
      percentage: 90
    }
  ],
  growthForecast: {
    chart: [
      { name: "Q3", value: 15 },
      { name: "Q4", value: 18 },
      { name: "Q1", value: 12 },
      { name: "Q2", value: 20 }
    ],
    insights: [
      { type: "positive", text: "New service line expected to add 15% to revenue" },
      { type: "positive", text: "Enterprise client segment growing 25% faster than SMB" },
      { type: "warning", text: "Potential economic slowdown may impact Q1 projections" }
    ]
  },
  weeklyReports: [
    {
      id: 1,
      title: "Weekly Sales Report",
      period: "Jul 1-7, 2023",
      sales: 28500,
      target: 30000,
      progress: 95,
      performanceData: [
        { name: "Mon", value: 5000 },
        { name: "Tue", value: 4800 },
        { name: "Wed", value: 5200 },
        { name: "Thu", value: 4500 },
        { name: "Fri", value: 9000 }
      ],
      metrics: {
        conversionRate: 15.2,
        prevConversionRate: 14.8,
        avgSaleValue: 2375,
        prevAvgSaleValue: 2250,
        newLeads: 25,
        prevNewLeads: 22,
        closedDeals: 12,
        prevClosedDeals: 10
      }
    }
  ],
  monthlyReports: [
    {
      id: 1,
      title: "Monthly Sales Report",
      period: "June 2023",
      sales: 125000,
      target: 120000,
      progress: 104,
      yearlyTrend: [
        { name: "Jan", value: 85000 },
        { name: "Feb", value: 95000 },
        { name: "Mar", value: 105000 },
        { name: "Apr", value: 110000 },
        { name: "May", value: 115000 },
        { name: "Jun", value: 125000 }
      ]
    }
  ],
  salesTrends: [
    { month: "Jan", revenue: 85000, target: 80000 },
    { month: "Feb", revenue: 95000, target: 90000 },
    { month: "Mar", revenue: 105000, target: 100000 },
    { month: "Apr", revenue: 110000, target: 105000 },
    { month: "May", revenue: 115000, target: 110000 },
    { month: "Jun", revenue: 125000, target: 120000 }
  ],
  salesByChannel: [
    { name: "Direct Sales", value: 45 },
    { name: "Website", value: 25 },
    { name: "Partners", value: 15 },
    { name: "Referrals", value: 15 }
  ],
  topProducts: [
    {
      id: 1,
      name: "Web Development",
      sales: 15,
      units: 15,
      revenue: 75000,
      growth: 12
    },
    {
      id: 2,
      name: "UI/UX Design",
      sales: 12,
      units: 12,
      revenue: 36000,
      growth: 15
    },
    {
      id: 3,
      name: "Mobile Development",
      sales: 8,
      units: 8,
      revenue: 48000,
      growth: 20
    }
  ],
  teamCosts: {
    departmentCosts: [
      { name: "Development", value: 45000 },
      { name: "Design", value: 25000 },
      { name: "Marketing", value: 15000 },
      { name: "Admin", value: 10000 }
    ],
    costTrends: [
      { month: "Jan", value: 90000 },
      { month: "Feb", value: 92000 },
      { month: "Mar", value: 95000 },
      { month: "Apr", value: 94000 },
      { month: "May", value: 96000 },
      { month: "Jun", value: 95000 }
    ],
    insights: [
      "Development team costs increased 5% due to new hire",
      "Design team costs stable despite increased output",
      "Marketing costs reduced due to automation"
    ]
  }
};

// HR mock data
export const mockHRData = {
  employees: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Developer",
      department: "Engineering",
      joinDate: "2022-01-15"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Designer",
      department: "Design",
      joinDate: "2022-03-10"
    }
  ],
  attendance: [
    {
      id: 1,
      employee_id: 1,
      login_time: "2023-07-10T09:00:00",
      logout_time: "2023-07-10T17:30:00",
      work_date: "2023-07-10"
    },
    {
      id: 2,
      employee_id: 2,
      login_time: "2023-07-10T09:15:00",
      logout_time: "2023-07-10T17:45:00",
      work_date: "2023-07-10"
    }
  ],
  payslips: [
    {
      id: 1,
      employee_id: 1,
      employee_name: "John Doe",
      payment_date: "2023-06-30",
      period_start: "2023-06-01",
      period_end: "2023-06-30",
      basic_salary: 5000,
      allowances: 500,
      deductions: 1000,
      net_salary: 4500,
      status: "paid",
      month: "June",
      year: 2023,
      paidDate: "2023-06-30"
    },
    {
      id: 2,
      employee_id: 2,
      employee_name: "Jane Smith",
      payment_date: "2023-06-30",
      period_start: "2023-06-01",
      period_end: "2023-06-30",
      basic_salary: 4500,
      allowances: 400,
      deductions: 900,
      net_salary: 4000,
      status: "paid",
      month: "June",
      year: 2023,
      paidDate: "2023-06-30"
    }
  ],
  leaveRequests: [
    {
      id: 1,
      employee_id: 1,
      employee_name: "John Doe",
      start_date: "2023-07-15",
      end_date: "2023-07-20",
      reason: "Vacation",
      status: "approved",
      leaveType: "annual",
      days: 5
    },
    {
      id: 2,
      employee_id: 2,
      employee_name: "Jane Smith",
      start_date: "2023-07-25",
      end_date: "2023-07-25",
      reason: "Medical appointment",
      status: "pending",
      leaveType: "sick",
      days: 1
    }
  ],
  recruitmentData: {
    openPositions: [
      {
        id: 1,
        title: "Senior Developer",
        department: "Engineering",
        posted_date: "2023-06-01",
        status: "open",
        applicants_count: 15
      },
      {
        id: 2,
        title: "UX Designer",
        department: "Design",
        posted_date: "2023-06-15",
        status: "open",
        applicants_count: 8
      }
    ],
    candidates: [
      {
        id: 1,
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 234 567 8902",
        job_id: 1,
        job_title: "Senior Developer",
        resume_url: "/resumes/alice-johnson.pdf",
        application_date: "2023-06-05",
        skills: ["JavaScript", "React", "Node.js"],
        experience: 5,
        education: "B.S. Computer Science",
        status: "screening",
        interview_date: "2023-07-15",
        notes: "Strong frontend experience",
        rating: 4,
        last_contact: "2023-06-30"
      },
      {
        id: 2,
        name: "Bob Williams",
        email: "bob@example.com",
        phone: "+1 234 567 8903",
        job_id: 2,
        job_title: "UX Designer",
        resume_url: "/resumes/bob-williams.pdf",
        application_date: "2023-06-20",
        skills: ["Figma", "User Research", "Prototyping"],
        experience: 3,
        education: "B.A. Design",
        status: "new",
        interview_date: null,
        notes: "Portfolio shows good visual design skills",
        rating: 3,
        last_contact: "2023-06-25"
      }
    ]
  }
};
