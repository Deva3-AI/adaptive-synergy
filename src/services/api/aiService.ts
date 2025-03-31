
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
  }
};

export default aiService;
