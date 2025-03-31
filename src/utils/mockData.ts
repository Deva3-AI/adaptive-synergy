
// Mock user data
export const mockUserData = {
  users: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'employee',
      department: 'Design',
      joinDate: '2022-01-15',
      client_name: null,
      roles: [{ role_name: 'employee', role_id: 2 }]
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'hr',
      department: 'Human Resources',
      joinDate: '2021-05-10',
      client_name: null,
      roles: [{ role_name: 'hr', role_id: 3 }]
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'finance',
      department: 'Finance',
      joinDate: '2021-08-22',
      client_name: null,
      roles: [{ role_name: 'finance', role_id: 4 }]
    },
    {
      id: 4,
      name: 'Bob Williams',
      email: 'bob@example.com',
      role: 'marketing',
      department: 'Marketing',
      joinDate: '2022-03-05',
      client_name: null,
      roles: [{ role_name: 'marketing', role_id: 5 }]
    },
    {
      id: 5,
      name: 'Acme Corp',
      email: 'acme@example.com',
      role: 'client',
      joinDate: '2021-11-15',
      client_name: 'Acme Corp',
      client_id: 1,
      roles: [{ role_name: 'client', role_id: 6 }]
    },
  ],
  
  tasks: [
    {
      task_id: 1,
      id: 1,
      title: 'Design homepage',
      description: 'Create homepage design for Acme Corp website',
      client_id: 1,
      client_name: 'Acme Corp',
      assigned_to: 1,
      assignee_name: 'John Doe',
      status: 'in_progress',
      priority: 'high',
      due_date: '2023-06-30',
      created_at: '2023-06-01',
      updated_at: '2023-06-15',
      progress: 75,
      estimated_hours: 20,
      actual_hours: 15,
      comments: [
        { id: 1, task_id: 1, user_id: 1, comment: 'Working on the hero section', created_at: '2023-06-10' },
        { id: 2, task_id: 1, user_id: 5, comment: 'Please add more blue to the color scheme', created_at: '2023-06-12' }
      ],
    },
    {
      task_id: 2,
      id: 2,
      title: 'Develop API endpoints',
      description: 'Create backend API endpoints for user management',
      client_id: null,
      client_name: 'Internal',
      assigned_to: 1,
      assignee_name: 'John Doe',
      status: 'pending',
      priority: 'medium',
      due_date: '2023-07-15',
      created_at: '2023-06-05',
      updated_at: '2023-06-05',
      progress: 0,
      estimated_hours: 30,
      actual_hours: 0,
      comments: [],
    },
    {
      task_id: 3,
      id: 3,
      title: 'Finalize quarterly budget',
      description: 'Complete Q2 budget allocation for all departments',
      client_id: null,
      client_name: 'Internal',
      assigned_to: 3,
      assignee_name: 'Alice Johnson',
      status: 'completed',
      priority: 'high',
      due_date: '2023-06-15',
      created_at: '2023-05-20',
      updated_at: '2023-06-14',
      progress: 100,
      estimated_hours: 15,
      actual_hours: 12,
      comments: [],
    },
  ],
  
  attendance: [
    {
      attendance_id: 1,
      user_id: 1,
      login_time: '2023-06-15T09:00:00',
      logout_time: '2023-06-15T17:30:00',
      work_date: '2023-06-15',
    },
    {
      attendance_id: 2,
      user_id: 1,
      login_time: '2023-06-16T08:45:00',
      logout_time: '2023-06-16T17:15:00',
      work_date: '2023-06-16',
    },
    {
      attendance_id: 3,
      user_id: 1,
      login_time: '2023-06-19T09:10:00',
      logout_time: null,
      work_date: '2023-06-19',
    },
  ],
  
  performance: [
    {
      user_id: 1,
      task_completion_rate: 92,
      quality_score: 88,
      efficiency_score: 85,
      responsiveness: 90,
      overall_score: 89,
      comparison_to_avg: 5,
      trends: [
        { period: 'Jan', score: 82 },
        { period: 'Feb', score: 84 },
        { period: 'Mar', score: 87 },
        { period: 'Apr', score: 89 },
      ],
    },
  ],
  
  leaveBalances: [
    {
      user_id: 1,
      annual: 20,
      sick: 10,
      used_annual: 5,
      used_sick: 2,
      remaining_annual: 15,
      remaining_sick: 8,
    },
  ],
  
  clients: [
    {
      client_id: 1,
      client_name: 'Acme Corp',
      description: 'Retail company',
      contact_info: 'acme@example.com',
      created_at: '2021-11-15',
    },
  ],
};

// Mock AI response data
export const mockAIResponse = {
  text: "I've analyzed the task and here are my recommendations...",
  suggestions: [
    "Add more visual elements to increase engagement",
    "Simplify the navigation structure",
    "Ensure mobile responsiveness for all screen sizes"
  ],
  confidence: 0.92
};

// Mock insights data
export const mockInsights = {
  performanceInsights: {
    summary: "Performance is above average",
    strengths: ["Timely delivery", "Quality of work"],
    areas_for_improvement: ["Documentation", "Communication frequency"],
    recommendations: [
      "Schedule regular check-ins with clients",
      "Create documentation templates for consistency"
    ]
  },
  taskInsights: {
    complexity: "Medium",
    estimated_time: "4-6 hours",
    similar_tasks: [
      { id: 12, title: "Design product page", completion_time: "5.2 hours" },
      { id: 8, title: "Create landing page mockup", completion_time: "4.8 hours" }
    ],
    potential_challenges: [
      "Integration with existing design system",
      "Client preferences may require multiple iterations"
    ],
    recommended_approach: "Start with wireframes before detailed design"
  }
};

// Mock client preferences data
export const mockClientPreferences = {
  "Acme Corp": {
    color_scheme: "Blue and gray",
    communication_preference: "Email for formal updates, Slack for quick questions",
    feedback_style: "Detailed and specific",
    revision_expectations: "Usually requires 2-3 rounds of revisions",
    decision_makers: ["John (CEO)", "Sarah (Marketing Director)"],
    typical_turnaround: "Responds within 24-48 hours"
  }
};

// Mock tasks data
export const mockTasks = [
  {
    id: 1,
    title: "Design homepage",
    description: "Create homepage design for Acme Corp website",
    client_id: 1,
    client_name: "Acme Corp",
    assigned_to: 1,
    assignee_name: "John Doe",
    status: "in_progress",
    priority: "high",
    due_date: "2023-06-30",
    created_at: "2023-06-01",
    updated_at: "2023-06-15",
    progress: 75,
    estimated_hours: 20,
    actual_hours: 15
  }
];

// Mock client feedback data
export const mockClientFeedback = [
  {
    task_id: 1,
    client_id: 1,
    rating: 4.5,
    comment: "Great work on the design, just need a few tweaks to the color scheme",
    date: "2023-05-15"
  }
];

// Mock employee performance data
export const mockEmployeePerformance = {
  user_id: 1,
  name: "John Doe",
  department: "Design",
  overall_rating: 4.2,
  metrics: {
    quality: 4.5,
    timeliness: 4.0,
    communication: 4.2,
    problem_solving: 4.0,
    teamwork: 4.3
  },
  completed_tasks: 45,
  on_time_completion_rate: 0.92,
  average_task_time: "12.5 hours",
  skill_ratings: {
    "UI Design": 4.8,
    "UX Design": 4.3,
    "Prototyping": 4.5,
    "Frontend Development": 3.8
  }
};

// Mock finance data
export const mockFinanceData = {
  summary_metrics: {
    net_profit: 124500,
    profit_margin: 0.28,
    recent_trend: "upward"
  },
  financial_health: {
    status: "good",
    explanation: "Strong cash flow and improving profit margins"
  },
  key_insights: [
    "Client A revenue increased by 15% compared to last quarter",
    "Operating expenses decreased by 8% due to remote work policies",
    "New service line showing 22% profit margin, exceeding projections"
  ],
  recommendations: [
    { area: "Invoicing", action: "Implement automated reminders for overdue invoices" },
    { area: "Services", action: "Expand high-margin service offerings like UX consulting" }
  ],
  prediction: "Revenue projected to grow 18-22% in next quarter based on current pipeline"
};

// Mock meeting analysis data
export const mockMeetingAnalysis = {
  summary: "Initial discovery call with potential client in healthcare sector",
  key_points: [
    "Client needs a patient portal with strong security features",
    "Budget is approximately $50-75K",
    "Timeline: must launch by Q3",
    "Decision committee includes CTO, CMO, and Patient Experience Director"
  ],
  sentiment: "Positive - client showed high interest in our portfolio",
  action_items: [
    { task: "Send security compliance documentation", assignee: "Legal team", due_date: "2023-06-25" },
    { task: "Prepare preliminary project plan", assignee: "Project Manager", due_date: "2023-06-28" },
    { task: "Schedule demo of similar healthcare projects", assignee: "Sales Rep", due_date: "2023-06-30" }
  ],
  follow_up: "Schedule technical discovery session by end of week",
  opportunity_score: 85
};

// Marketing data
export const mockMarketingData = {
  campaigns: [
    {
      id: 1,
      title: "Summer Product Launch",
      description: "Launch campaign for new summer product line",
      type: "product_launch",
      status: "active",
      startDate: "2023-06-01",
      endDate: "2023-07-15",
      budget: 15000,
      target: {
        audience: "Young professionals",
        location: "Urban centers",
        demographic: ["25-34", "high income", "tech-savvy"]
      },
      kpis: [
        {
          name: "Leads",
          value: 120,
          target: 200,
          unit: "leads"
        },
        {
          name: "Conversion Rate",
          value: 3.5,
          target: 5,
          unit: "%"
        }
      ],
      channels: ["email", "social_media", "display_ads"],
      owner: "Sarah Johnson",
      team: ["Mike", "Lisa", "David"],
      createdAt: "2023-05-15",
      updatedAt: "2023-06-05"
    }
  ],
  
  meetings: [
    {
      id: 1,
      title: "Product Demo with Acme Corp",
      description: "Demonstrate new features to Acme Corp team",
      date: "2023-06-25",
      time: "10:00 AM",
      duration: 60,
      platform: "Zoom",
      participants: ["John (Sales)", "Mike (Product)", "Sarah (Acme Corp)", "Tom (Acme Corp)"],
      agenda: ["Introduction", "Product demonstration", "Q&A", "Next steps"],
      notes: "Acme Corp is interested in our enterprise plan",
      followUp: ["Send pricing information", "Schedule technical deep dive"],
      status: "scheduled",
      leadName: "Sarah Brown",
      leadCompany: "Acme Corp",
      scheduledTime: "2023-06-25T10:00:00"
    }
  ],
  
  leads: [
    {
      id: 1,
      name: "John Smith",
      company: "Tech Innovations Inc",
      email: "john@techinnovations.com",
      phone: "555-123-4567",
      address: "123 Tech Blvd, San Francisco, CA",
      status: "qualified",
      source: "website",
      rating: 4,
      notes: "Interested in enterprise solution",
      lastContact: "2023-06-10",
      nextContact: "2023-06-20",
      tags: ["enterprise", "high-value"],
      createdAt: "2023-05-20",
      updatedAt: "2023-06-10"
    }
  ],
  
  emailOutreach: [
    {
      id: 1,
      subject: "Introducing Our New Service",
      recipients: ["john@example.com", "sarah@example.com"],
      recipient: "John Smith",
      recipientCompany: "Acme Corp",
      content: "Dear valued customer, we're excited to introduce our new service...",
      sentDate: "2023-06-15",
      sentAt: "2023-06-15",
      status: "sent",
      openRate: 42.5,
      clickRate: 18.3,
      responseRate: 8.7,
      source: "newsletter",
      followUpScheduled: true,
      follow_up_scheduled: true,
      follow_up_date: "2023-06-25",
      tags: ["product_launch", "all_customers"]
    }
  ],
  
  marketingTrends: [
    {
      id: 1,
      title: "Rise of Video Content in B2B Marketing",
      description: "B2B companies are increasingly using video content in their marketing strategies, leading to higher engagement rates and better conversion.",
      category: "Content Strategy",
      relevance_score: 8.5,
      relevanceScore: 8.5,
      source: "Industry Report",
      discoveredAt: "2023-05-20",
      actionable: true,
      suggestedActions: [
        "Create product demo videos",
        "Develop customer testimonial video series",
        "Incorporate video in email campaigns"
      ],
      impact: "high"
    }
  ],
  
  competitorInsights: [
    {
      id: 1,
      competitor: "TechRival Inc",
      competitor_name: "TechRival Inc",
      description: "TechRival has reduced their enterprise pricing by 15% for new customers",
      type: "Pricing Change",
      impact: "medium",
      discoveredAt: "2023-06-05",
      source: "Customer Feedback",
      suggestedResponse: "Emphasize our superior features and support rather than competing on price. Consider special offers for loyal customers."
    }
  ],
  
  marketingPlans: [
    {
      id: 1,
      title: "Q3 Growth Strategy",
      description: "Comprehensive marketing plan for Q3 focused on increasing market share in the enterprise segment",
      objectives: [
        "Increase lead generation by 20%",
        "Improve conversion rate by 5%",
        "Launch 2 new marketing campaigns"
      ],
      strategy: "Focus on targeted content marketing and account-based marketing approaches",
      tactics: [
        "Create enterprise-focused content",
        "Implement ABM for top 20 target accounts",
        "Optimize lead nurturing sequences"
      ],
      timeline: {
        startDate: "2023-07-01",
        endDate: "2023-09-30",
        milestones: [
          {
            date: "2023-07-15",
            description: "Launch new content hub"
          },
          {
            date: "2023-08-01",
            description: "Start ABM campaigns"
          }
        ]
      },
      budget: 50000,
      resources: ["Marketing team", "Content creators", "Design team"],
      metrics: [
        {
          name: "Lead Generation",
          target: 500,
          unit: "leads"
        },
        {
          name: "Conversion Rate",
          target: 8,
          unit: "%"
        }
      ],
      status: "active",
      owner: "Marketing Director",
      createdAt: "2023-06-10",
      updatedAt: "2023-06-15"
    }
  ],
  
  emailTemplates: [
    {
      id: 1,
      name: "Product Introduction",
      subject: "Introducing {{product_name}}: Revolutionize Your Workflow",
      content: "Dear {{recipient_name}},\n\nWe're excited to introduce {{product_name}} that can help your team...",
      variables: ["recipient_name", "recipient_company", "product_name"],
      category: "Product Marketing",
      performance: {
        openRate: 35.2,
        clickRate: 12.8,
        responseRate: 5.4
      },
      createdAt: "2023-05-01",
      updatedAt: "2023-05-15"
    }
  ],
  
  marketingMetrics: {
    period: "Jun 2023",
    metrics: {
      leads: 245,
      meetings: 45,
      opportunities: 28,
      conversions: 12,
      revenue: 75000
    },
    channels: [
      {
        name: "Organic Search",
        value: 85,
        percentage: 34.7
      },
      {
        name: "Social Media",
        value: 65,
        percentage: 26.5
      },
      {
        name: "Email",
        value: 48,
        percentage: 19.6
      },
      {
        name: "Referral",
        value: 47,
        percentage: 19.2
      }
    ],
    campaigns: [
      {
        name: "Summer Product Launch",
        leads: 120,
        meetings: 25,
        conversions: 8,
        roi: 3.2
      },
      {
        name: "Industry Webinar",
        leads: 85,
        meetings: 15,
        conversions: 3,
        roi: 2.5
      }
    ],
    trends: [
      {
        date: "2023-01",
        leads: 180,
        meetings: 32,
        conversions: 8
      },
      {
        date: "2023-02",
        leads: 195,
        meetings: 35,
        conversions: 9
      },
      {
        date: "2023-03",
        leads: 210,
        meetings: 38,
        conversions: 10
      },
      {
        date: "2023-04",
        leads: 225,
        meetings: 40,
        conversions: 11
      },
      {
        date: "2023-05",
        leads: 235,
        meetings: 42,
        conversions: 12
      },
      {
        date: "2023-06",
        leads: 245,
        meetings: 45,
        conversions: 12
      }
    ]
  }
};
