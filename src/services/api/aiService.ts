
// Mock AI service
const mockAIResponse = {
  keyPoints: [
    'Modern website design with emphasis on brand colors',
    'Mobile-responsive layout required',
    'Integration with existing CRM system needed',
    'Content management system for easy updates'
  ],
  timeline: 'Based on the requirements, estimated completion time is 4-6 weeks',
  context: 'Client has previously mentioned their target audience is primarily mobile users, which aligns with the mobile-responsive requirement.',
  suggestedTasks: [
    {
      title: 'Create wireframes for homepage',
      description: 'Design initial wireframes based on client requirements',
      priority: 'high',
      estimatedTime: 8
    },
    {
      title: 'Develop responsive layout',
      description: 'Implement the responsive design across all screen sizes',
      priority: 'high',
      estimatedTime: 16
    },
    {
      title: 'Set up CRM integration',
      description: 'Configure connections between website and existing CRM',
      priority: 'medium',
      estimatedTime: 12
    }
  ]
};

const mockInsights = {
  clientPreferences: {
    designStyle: 'Modern and minimalist',
    colorPreference: 'Blue and white with orange accents',
    contentTone: 'Professional but friendly',
    revisionPractices: 'Usually requires 2-3 rounds of revisions'
  },
  communicationPatterns: {
    responseTime: 'Usually responds within 24 hours',
    decisionMakers: ['Marketing Director', 'CEO'],
    meetingPreference: 'Prefers video calls over phone calls',
    feedbackStyle: 'Provides specific, actionable feedback'
  },
  projectHistory: {
    completedProjects: 3,
    averageSatisfaction: 4.7,
    commonChallenges: [
      'Timeline adjustments',
      'Scope expansions mid-project'
    ]
  },
  recommendations: [
    'Schedule regular check-ins every Friday',
    'Document all requirements in detail before starting work',
    'Allow extra buffer time for revisions in project timeline'
  ]
};

const mockManagerInsights = {
  clientTendencies: [
    'Prefers detailed progress reports',
    'Often requests last-minute changes',
    'Responds best to visual presentations',
    'Values timely communication above all'
  ],
  performanceInsights: [
    'Task completion rate is 15% above average',
    'Quality ratings consistently above 4.5/5',
    'Response time to client queries could be improved'
  ],
  recommendedActions: [
    'Schedule bi-weekly progress reviews',
    'Allocate buffer time for revision cycles',
    'Prepare visual mockups for all major deliverables'
  ]
};

const mockTaskRecommendations = [
  {
    task_id: 1,
    title: 'Revise homepage wireframes',
    description: 'Update the design based on recent client feedback',
    priority: 'high',
    estimated_time: 4,
    client_id: 1
  },
  {
    task_id: 2,
    title: 'Prepare monthly performance report',
    description: 'Compile analytics data and create visualization dashboard',
    priority: 'medium',
    estimated_time: 3,
    client_id: 1
  },
  {
    task_id: 3,
    title: 'Schedule strategy meeting',
    description: 'Align on Q3 marketing objectives with client team',
    priority: 'low',
    estimated_time: 2,
    client_id: 2
  }
];

const aiService = {
  analyzeRequirements: async (requirements: string) => {
    // Simulate API call
    return mockAIResponse;
  },
  
  getClientInsights: async (clientId: number) => {
    // Simulate API call
    return mockInsights;
  },
  
  generateTaskSuggestions: async (requirements: string, clientId: number) => {
    // Simulate API call
    return {
      tasks: mockAIResponse.suggestedTasks,
      client_id: clientId
    };
  },
  
  // Adding the missing methods that cause TypeScript errors
  getResponse: async (query: string) => {
    // Simulate AI response
    return {
      content: `Here's my analysis of your query: "${query.substring(0, 30)}..."\n\nBased on the context provided, I recommend focusing on client communication and deadline management. The client has previously expressed concerns about timeline visibility.`,
      response: `Here's my analysis of your query: "${query.substring(0, 30)}..."\n\nBased on the context provided, I recommend focusing on client communication and deadline management. The client has previously expressed concerns about timeline visibility.`
    };
  },
  
  generateManagerInsights: async (userId: number) => {
    // Simulate API call for virtual manager insights
    return mockManagerInsights;
  },
  
  generateAITaskRecommendations: async (userId: number) => {
    // Simulate API call for AI task recommendations
    return mockTaskRecommendations;
  }
};

export default aiService;
