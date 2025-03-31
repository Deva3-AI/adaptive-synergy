// Central file for all mock data

export const mockUserData = {
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "employee",
      department: "Development",
      joinDate: "2022-01-15",
      client_name: null,
      roles: [{ role_name: "employee", role_id: 2 }]
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "admin",
      department: "Management",
      joinDate: "2021-05-10",
      client_name: null,
      roles: [{ role_name: "admin", role_id: 1 }]
    },
    {
      id: 3,
      name: "Acme Corp",
      email: "contact@acme.com",
      role: "client",
      client_id: 1,
      client_name: "Acme Corp",
      roles: [{ role_name: "client", role_id: 3 }]
    }
  ],
  roles: [
    { role_id: 1, role_name: "admin" },
    { role_id: 2, role_name: "employee" },
    { role_id: 3, role_name: "client" },
    { role_id: 4, role_name: "marketing" },
    { role_id: 5, role_name: "hr" },
    { role_id: 6, role_name: "finance" }
  ],
  clients: [
    {
      id: 1,
      name: "Acme Corp",
      contact_person: "John Smith",
      email: "john@acme.com",
      phone: "+1 555-123-4567",
      status: "active"
    },
    {
      id: 2,
      name: "TechGiant Inc",
      contact_person: "Sarah Johnson",
      email: "sarah@techgiant.com",
      phone: "+1 555-987-6543",
      status: "active"
    }
  ]
};

export const mockFinanceData = {
  invoices: [
    {
      id: 1,
      invoice_number: "INV-2023-001",
      client_id: 1,
      client_name: "Acme Corp",
      amount: 5000,
      status: "paid",
      issue_date: "2023-01-15",
      due_date: "2023-02-15",
      payment_date: "2023-02-10"
    },
    {
      id: 2,
      invoice_number: "INV-2023-002",
      client_id: 2,
      client_name: "TechGiant Inc",
      amount: 7500,
      status: "pending",
      issue_date: "2023-02-01",
      due_date: "2023-03-01",
      payment_date: null
    }
  ],
  financialRecords: [
    {
      record_id: 1,
      record_type: "expense",
      amount: 1200,
      description: "Office rent",
      record_date: "2023-01-05",
      created_at: "2023-01-05T10:30:00Z"
    },
    {
      record_id: 2,
      record_type: "income",
      amount: 5000,
      description: "Client payment - Acme Corp",
      record_date: "2023-01-10",
      created_at: "2023-01-10T14:15:00Z"
    }
  ],
  salesMetrics: {
    // Sales metrics data
  },
  salesTrends: {
    // Sales trends data
  },
  salesByChannel: {
    // Sales by channel data
  },
  topProducts: {
    // Top products data
  },
  salesGrowth: {
    // Sales growth data
  },
  salesTargets: {
    // Sales targets data
  },
  growthForecast: {
    // Growth forecast data
  },
  salesFollowUps: {
    // Sales follow-ups data
  },
  improvementSuggestions: {
    // Improvement suggestions data
  },
  teamCostsAnalysis: {
    // Team costs analysis data
  },
  financialOverview: {
    summary_metrics: {
      net_profit: 45000,
      profit_margin: 22.5,
      recent_trend: "positive"
    },
    financial_health: {
      status: "good",
      explanation: "Strong cash flow and steady growth"
    },
    key_insights: [
      "Revenue increased by 15% compared to last quarter",
      "Operating expenses reduced by 5%",
      "New client acquisitions have increased profitability"
    ],
    recommendations: [
      {
        area: "Expenses",
        action: "Review software subscriptions for potential consolidation"
      },
      {
        area: "Pricing",
        action: "Consider 5-10% increase for enterprise clients"
      }
    ],
    prediction: "Projected 20% growth in next quarter if current trends continue"
  },
  financialMetrics: {
    // Financial metrics data
  }
};

export const mockClientData = {
  preferences: {
    "Acme Corp": {
      color_scheme: "Professional blues and grays",
      communication_preference: "Email, weekly updates",
      feedback_style: "Direct and detailed",
      revision_expectations: "Quick turnaround, minimal revisions",
      decision_makers: ["Marketing Director", "CEO"],
      typical_turnaround: "3-5 business days"
    },
    "TechGiant": {
      color_scheme: "Modern purples and teals",
      communication_preference: "Slack, daily updates",
      feedback_style: "Collaborative and iterative",
      revision_expectations: "Multiple rounds expected",
      decision_makers: ["Product Manager", "Design Lead", "CTO"],
      typical_turnaround: "1-2 business days"
    }
  }
};

export const mockTaskData = {
  tasks: [
    {
      id: 1,
      title: "Website Redesign",
      description: "Redesign the company website with modern UI/UX",
      client_id: 1,
      client_name: "Acme Corp",
      assigned_to: 1,
      assignee_name: "John Doe",
      status: "in_progress",
      priority: "high",
      due_date: "2023-03-15",
      created_at: "2023-02-15",
      updated_at: "2023-02-20",
      progress: 60,
      estimated_hours: 40,
      actual_hours: 25
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Develop a mobile app for client's service",
      client_id: 2,
      client_name: "TechGiant Inc",
      assigned_to: 3,
      assignee_name: "Sarah Johnson",
      status: "pending",
      priority: "medium",
      due_date: "2023-04-10",
      created_at: "2023-02-25",
      updated_at: "2023-02-25",
      progress: 0,
      estimated_hours: 120,
      actual_hours: 0
    }
  ]
};

export const mockClientFeedbackData = {
  // Client feedback data
};

export const mockEmployeePerformanceData = {
  // Employee performance data
};

export const mockMeetingAnalysisData = {
  // Meeting analysis data
};
