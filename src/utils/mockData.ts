
export const mockClientPreferences = [
  {
    id: 1,
    client_id: 1,
    preferred_contact_method: 'email',
    communication_frequency: 'weekly',
    design_preferences: {
      colors: ['#3366FF', '#FF6633', '#FFFFFF'],
      style: 'modern',
      fonts: ['Roboto', 'Open Sans']
    },
    industry_specific_requirements: {
      sector: 'Technology',
      target_audience: 'B2B',
      compliance: ['GDPR', 'CCPA']
    },
    dos: [
      'Use high-contrast colors',
      'Include multiple CTAs',
      'Focus on data-driven features'
    ],
    donts: [
      'Avoid complex animations',
      'Don\'t use script fonts',
      'Avoid stock photos when possible'
    ]
  },
  {
    id: 2,
    client_id: 2,
    preferred_contact_method: 'slack',
    communication_frequency: 'daily',
    design_preferences: {
      colors: ['#222222', '#F5F5F5', '#00AA55'],
      style: 'minimalist',
      fonts: ['Helvetica', 'Montserrat']
    },
    industry_specific_requirements: {
      sector: 'E-commerce',
      target_audience: 'B2C',
      compliance: ['PCI DSS']
    },
    dos: [
      'Emphasize product photos',
      'Use whitespace effectively',
      'Include social proof'
    ],
    donts: [
      'Don\'t use more than 3 colors',
      'Avoid flashy elements',
      'No pop-ups on mobile'
    ]
  }
];

export const mockTasks = [
  {
    id: 1,
    title: 'Design homepage banner',
    description: 'Create a banner for the homepage featuring new products',
    client_id: 1,
    assigned_to: 1,
    status: 'completed',
    estimated_time: 3,
    actual_time: 2.5,
    created_at: '2023-03-01T09:00:00Z',
    completed_at: '2023-03-01T11:30:00Z'
  },
  {
    id: 2,
    title: 'Design email newsletter',
    description: 'Create a weekly newsletter template',
    client_id: 1,
    assigned_to: 1,
    status: 'in_progress',
    estimated_time: 4,
    actual_time: null,
    created_at: '2023-03-02T13:00:00Z',
    completed_at: null
  },
  {
    id: 3,
    title: 'Redesign product page',
    description: 'Update the product page layout for better conversions',
    client_id: 2,
    assigned_to: 1,
    status: 'pending',
    estimated_time: 8,
    actual_time: null,
    created_at: '2023-03-03T10:00:00Z',
    completed_at: null
  }
];

export const mockClientFeedback = [
  {
    id: 1,
    task_id: 1,
    client_id: 1,
    rating: 5,
    comment: "Excellent work! The banner looks perfect and matches our brand perfectly.",
    created_at: '2023-03-01T14:30:00Z'
  },
  {
    id: 2,
    task_id: 2,
    client_id: 2,
    rating: 4,
    comment: "Good work but I'd like to see more focus on product images in the next iteration.",
    created_at: '2023-03-02T16:45:00Z'
  }
];

export const mockEmployeePerformance = {
  metrics: {
    avg_hours_worked: 7.8,
    task_completion_rate: 92,
    efficiency_rate: 86,
    quality_score: 4.5
  },
  performance_assessment: {
    rating: 'excellent',
    explanation: 'Consistently delivers high-quality work ahead of schedule with great attention to detail.'
  },
  strengths: [
    'Exceptional time management',
    'Strong communication skills',
    'High attention to detail'
  ],
  improvement_areas: [
    'Could benefit from more advanced UI/UX training',
    'Occasionally needs to ask for more details about requirements'
  ],
  recommendations: [
    'Assign to more complex design projects',
    'Consider for mentoring junior designers',
    'Provide advanced UI/UX training opportunity'
  ]
};

export const mockFinancialData = {
  summary_metrics: {
    net_profit: 45820,
    profit_margin: 23.5,
    recent_trend: 'increasing'
  },
  financial_health: {
    status: 'Good',
    explanation: 'The company is maintaining a healthy profit margin with steady growth in revenue over the past quarter.'
  },
  key_insights: [
    'Revenue has increased by 12% compared to last quarter',
    'Client acquisition costs decreased by 7%',
    'Top 3 clients account for 35% of total revenue'
  ],
  recommendations: [
    { area: 'Resource Allocation', action: 'Consider hiring additional designers to handle increased workload' },
    { area: 'Client Management', action: 'Develop retention strategies for top 3 clients to mitigate concentration risk' },
    { area: 'Pricing Strategy', action: 'Evaluate current pricing model for potential optimization' }
  ],
  prediction: 'Based on current trends, expect 15-20% growth in revenue over the next quarter, assuming client retention remains stable.'
};

export const mockMeetingAnalysis = {
  summary: [
    "Client expressed satisfaction with the latest design deliverables but has concerns about timeline for the website launch.",
    "The team agreed to prioritize the homepage and product pages for the first phase of launch.",
    "Budget for additional features was discussed and tentatively approved, pending final confirmation next week."
  ],
  action_items: [
    { task: "Revise project timeline", assignee: "Project Manager", priority: "High" },
    { task: "Create detailed design specs for homepage", assignee: "Design Lead", priority: "High" },
    { task: "Prepare budget proposal for additional features", assignee: "Account Manager", priority: "Medium" },
    { task: "Schedule follow-up meeting for next Thursday", assignee: "Assistant", priority: "Low" }
  ],
  key_insights: [
    "Client seems particularly concerned about meeting the holiday season deadline",
    "There's an opportunity to upsell additional design services for phase 2",
    "Technical implementation will require close coordination with client's IT team"
  ],
  sentiment_analysis: {
    sentiment: "positive",
    confidence: 0.78,
    notes: "Client expressed frustration about previous delays but overall tone remained constructive and positive about future work"
  }
};
