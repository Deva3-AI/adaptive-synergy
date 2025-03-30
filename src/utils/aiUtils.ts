
import { 
  mockClientPreferences, 
  mockTasks, 
  mockClientFeedback, 
  mockEmployeePerformance,
  mockFinancialData,
  mockMeetingAnalysis
} from './mockData';
import { supabase } from '@/integrations/supabase/client';

// Mock AI analysis of client requirements
export const analyzeClientInput = async (input: string) => {
  // In a real application, this would call an actual AI service
  console.log('Analyzing client input:', input);
  
  // Simulate analysis result
  return {
    sentiment: input.toLowerCase().includes('urgent') || input.toLowerCase().includes('asap') ? 'negative' : 'positive',
    priority_level: input.toLowerCase().includes('urgent') || input.toLowerCase().includes('asap') ? 'high' : 'medium',
    key_requirements: extractKeywords(input),
  };
};

// Mock AI generation of tasks based on client requirements
export const generateSuggestedTasks = async (input: string, clientId: number) => {
  // In a real application, this would call an actual AI service
  console.log('Generating tasks from input:', input);
  
  // Get client preferences if available
  const preferences = mockClientPreferences.find(pref => pref.client_id === clientId);
  
  // Simulate task generation result
  return {
    suggested_tasks: [
      {
        title: 'Design mockup based on requirements',
        description: `Create initial design mockups based on client input: "${input.substring(0, 50)}..."`,
        priority_level: input.toLowerCase().includes('urgent') ? 'high' : 'medium',
        estimated_time: 4,
        client_id: clientId,
        dos: preferences?.dos || [],
        donts: preferences?.donts || []
      },
      {
        title: 'Create content outline',
        description: 'Develop content structure and outline based on design requirements',
        priority_level: 'medium',
        estimated_time: 2,
        client_id: clientId,
        dos: preferences?.dos || [],
        donts: preferences?.donts || []
      },
      {
        title: 'Setup project structure',
        description: 'Initialize project files and structure following best practices',
        priority_level: 'low',
        estimated_time: 1,
        client_id: clientId,
        dos: preferences?.dos || [],
        donts: preferences?.donts || []
      }
    ]
  };
};

// AI Manager providing insights based on client preferences and history
export const getManagerInsights = async (params: { clientId: number, taskId?: number }) => {
  // In a real application, this would analyze actual client data from the database
  console.log('Generating manager insights for client:', params.clientId);
  
  const preferences = mockClientPreferences.find(pref => pref.client_id === params.clientId);
  const clientTasks = mockTasks.filter(task => task.client_id === params.clientId);
  const clientFeedback = mockClientFeedback.filter(fb => fb.client_id === params.clientId);
  
  if (!preferences) {
    return {
      insights: [
        "No historical data available for this client.",
        "Consider gathering preferences during initial meetings."
      ],
      warnings: [],
      suggestions: ["Document client preferences after the first project."]
    };
  }
  
  // Calculate average completion time compared to estimated time
  const completedTasks = clientTasks.filter(task => task.status === 'completed' && task.actual_time);
  const timeEfficiency = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => sum + (task.estimated_time / (task.actual_time || 1)), 0) / completedTasks.length
    : 0;
  
  // Analysis based on preferences and history
  return {
    insights: [
      `Client prefers ${preferences.preferred_contact_method} for communication.`,
      `Client expects updates ${preferences.communication_frequency}.`,
      `Average time efficiency for this client: ${(timeEfficiency * 100).toFixed(0)}%`,
      `Client's preferred style: ${preferences.design_preferences.style}`,
    ],
    warnings: [
      ...preferences.donts.map(dont => `⚠️ ${dont}`),
      ...(timeEfficiency < 0.8 ? ["⚠️ Tasks for this client tend to take longer than estimated."] : [])
    ],
    suggestions: [
      ...preferences.dos.map(dos => `✓ ${dos}`),
      `Consider using ${preferences.design_preferences.fonts.join(', ')} for typography.`,
      `Primary color palette: ${preferences.design_preferences.colors.join(', ')}`,
      ...(clientFeedback.length > 0 
        ? [`Previous feedback: "${clientFeedback[0].comment}"`] 
        : [])
    ]
  };
};

// AI Client Intelligence - Analyzing client communications
export const analyzeClientCommunication = async (clientId: number) => {
  console.log('Analyzing client communications for client:', clientId);
  
  // In a real application, this would analyze emails, chat logs, etc.
  return {
    common_phrases: ["ASAP", "brand guidelines", "mobile-first"],
    tone_analysis: {
      formal: 75,
      technical: 60,
      urgent: 45
    },
    response_expectations: {
      average_response_time: "4 hours",
      preferred_time: "morning",
      weekend_communication: "rare"
    },
    topic_frequency: [
      { topic: "Deadlines", frequency: "very high" },
      { topic: "Budget", frequency: "medium" },
      { topic: "Design Feedback", frequency: "high" }
    ]
  };
};

// Analyze employee performance based on attendance and task data
export const analyzeEmployeePerformance = async (
  attendanceData: any[],
  taskData: any[]
) => {
  console.log('Analyzing employee performance:', {
    attendanceRecords: attendanceData.length,
    taskRecords: taskData.length
  });
  
  // In a real app, this would do actual analysis of the provided data
  // For now, return mock data
  return mockEmployeePerformance;
};

// Analyze financial data for insights
export const analyzeFinancialData = async (financialRecords: any[]) => {
  console.log('Analyzing financial data:', {
    recordCount: financialRecords.length
  });
  
  // Mock financial analysis
  return mockFinancialData;
};

// Analyze meeting transcript
export const analyzeMeetingTranscript = async (transcript: string) => {
  console.log('Analyzing meeting transcript of length:', transcript.length);
  
  // In a real application, this would call an LLM API
  return mockMeetingAnalysis;
};

// Generate marketing insights based on data
export const generateMarketingInsights = async (marketingData: any) => {
  console.log('Generating marketing insights from data:', marketingData);
  
  // Mock marketing insights
  return {
    audience_insights: [
      "Primary audience engages most on weekday mornings",
      "Content with case studies gets 40% more engagement",
      "Mobile traffic accounts for 67% of total visitors"
    ],
    content_recommendations: [
      "Create more in-depth case studies",
      "Develop mobile-optimized interactive elements",
      "Increase video content focusing on product demonstrations"
    ],
    competitor_analysis: [
      "Main competitor XYZ has increased social media posting frequency by 35%",
      "Competitors are focusing on sustainability messaging",
      "Industry trend toward simplified UX with faster load times"
    ],
    growth_opportunities: [
      "Expand into educational content targeting entry-level professionals",
      "Develop partnerships with complementary service providers",
      "Test pricing tiers for premium content access"
    ]
  };
};

// Get task recommendations for a user
export const getTaskRecommendations = async (userId: number) => {
  // In a real app, this would analyze the user's skills, availability, and historical performance
  console.log('Getting task recommendations for user:', userId);
  
  return [
    {
      task_id: 101,
      title: "Review website design for Client A",
      description: "Evaluate the latest mockups and provide feedback before client presentation",
      priority: "high",
      estimated_time: 2,
      status: "pending"
    },
    {
      task_id: 102,
      title: "Create social media templates for Client B",
      description: "Design Instagram and Facebook post templates following brand guidelines",
      priority: "medium",
      estimated_time: 4,
      status: "pending"
    },
    {
      task_id: 103,
      title: "Update portfolio with recent projects",
      description: "Add recent client work to the company portfolio website",
      priority: "low",
      estimated_time: 3,
      status: "pending"
    }
  ];
};

// Get AI insights about a specific task
export const getTaskInsights = async (taskId: number) => {
  console.log('Getting AI insights for task:', taskId);
  
  return {
    time_estimation: {
      predicted_hours: 3.5,
      confidence: 0.85,
      similar_tasks_avg: 4.2
    },
    recommended_approach: [
      "Start with wireframes before high-fidelity designs",
      "Focus on responsive layouts first",
      "Consider accessibility requirements from the beginning"
    ],
    potential_challenges: [
      "Client has previously requested multiple revision rounds",
      "Project requirements may be subject to change",
      "Integration with existing systems may require developer collaboration"
    ],
    resource_recommendations: [
      "Design library XYZ has relevant templates",
      "Check project #456 for similar implementation",
      "Team member Jane has expertise in this client's industry"
    ]
  };
};

// Helper function to extract keywords from text
function extractKeywords(text: string): string[] {
  const keywords = [
    "logo",
    "website",
    "banner",
    "email",
    "newsletter",
    "brochure",
    "social media",
    "advertisement",
    "marketing",
    "branding",
    "mobile",
    "app",
    "responsive",
    "modern",
    "minimalist",
    "corporate",
    "colorful",
    "professional",
    "creative",
    "innovative"
  ];
  
  const words = text.toLowerCase().split(/\W+/);
  const foundKeywords = new Set<string>();
  
  // Find single keywords
  for (const word of words) {
    if (keywords.includes(word)) {
      foundKeywords.add(word);
    }
  }
  
  // Find compound keywords
  for (const keyword of keywords) {
    if (keyword.includes(' ') && text.toLowerCase().includes(keyword)) {
      foundKeywords.add(keyword);
    }
  }
  
  return Array.from(foundKeywords);
}
