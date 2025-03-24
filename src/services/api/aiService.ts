
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Mock AI service implementation for testing frontend
const mockAnalyzeClientInput = async (text: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    key_requirements: [
      "Website redesign with modern aesthetic",
      "Integration of payment system",
      "Mobile-responsive design",
      "SEO optimization",
      "Content migration from old site"
    ],
    sentiment: Math.random() > 0.3 ? "positive" : Math.random() > 0.5 ? "neutral" : "negative",
    priority_level: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
    suggested_tasks: [
      {
        title: "Initial Design Mockups",
        description: "Create initial mockups based on client requirements and brand guidelines",
        estimated_time: 8
      },
      {
        title: "Develop responsive components",
        description: "Build reusable UI components that work across all device sizes",
        estimated_time: 5
      }
    ]
  };
};

const mockGenerateMarketingInsights = async (campaignData: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    performance_analysis: {
      strengths: [
        "Organic search is your strongest channel, delivering 42% of traffic",
        "Conversion rates have improved 12.3% month-over-month",
        "Email campaigns show high engagement with 15% contribution to overall conversions"
      ],
      weaknesses: [
        "Paid search is underperforming with only 10% traffic contribution",
        "Social media engagement shows inconsistent results across months",
        "Direct traffic is low at 5%, indicating potential brand awareness issues"
      ]
    },
    trend_identification: [
      "Increasing mobile user engagement across all channels",
      "Content-focused marketing shows higher conversion rates than product-focused",
      "Video content is growing in effectiveness particularly on social channels",
      "Peak engagement times are shifting toward evening hours (6-9pm)"
    ],
    optimization_suggestions: [
      {
        area: "Paid Search",
        suggestion: "Reallocate budget to keywords showing highest conversion rates and reduce spend on broad match terms"
      },
      {
        area: "Social Media",
        suggestion: "Increase video content production and optimize posting schedule to evening hours"
      },
      {
        area: "Email Marketing",
        suggestion: "Implement segmentation based on engagement levels and develop targeted content for each segment"
      },
      {
        area: "Content Strategy",
        suggestion: "Develop more educational content for organic search and leverage successful formats across channels"
      }
    ]
  };
};

const mockAnalyzeMeetingTranscript = async (transcript: string, meetingType: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return {
    summary: "In this meeting, the client discussed requirements for their upcoming website redesign project. They emphasized mobile responsiveness, modern design elements, and integration with their existing CRM system. Timeline concerns were addressed, with project completion expected within 6 weeks. Budget constraints were discussed, and the client agreed to the proposed phased approach.",
    keyPoints: [
      "Mobile-first design approach",
      "Three-week timeline for initial designs",
      "Budget includes interactive elements"
    ],
    actionItems: [
      { description: "Create mood board", assignee: "Design Team", priority: "high" },
      { description: "Develop project timeline", assignee: "Project Manager", priority: "medium" },
      { description: "Research animation libraries", assignee: "Dev Team", priority: "low" }
    ],
    clientPreferences: [
      "Minimalist design aesthetic",
      "Bold typography",
      "Subtle animations on scroll"
    ],
    nextSteps: "Schedule follow-up meeting next week to review initial design concepts and discuss feedback process.",
    sentiment: "positive",
    sentiment_analysis: {
      sentiment: "positive",
      confidence: 0.85
    }
  };
};

const mockAnalyzeFinancialData = async (financialRecords: any[]) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    summary_metrics: {
      total_income: 278500,
      total_expenses: 186300,
      net_profit: 92200,
      profit_margin: 33.1,
      recent_trend: "positive"
    },
    financial_health: {
      status: "good",
      explanation: "The company shows a healthy profit margin and positive growth trends. Cash flow is stable with consistent revenue increases over the past quarter."
    },
    key_insights: [
      "Revenue has grown by 18% compared to the same period last year",
      "Marketing expenses show the highest ROI among all expense categories",
      "Operational costs have decreased by 5% due to process optimizations",
      "Client retention rate of 86% is contributing to stable recurring revenue"
    ],
    recommendations: [
      {
        area: "Cash Flow",
        action: "Implement 15-day payment terms for new clients to improve cash position"
      },
      {
        area: "Expense Management",
        action: "Review software subscriptions for potential consolidation to reduce overhead"
      },
      {
        area: "Revenue Growth",
        action: "Expand high-margin service offerings that show strongest client demand"
      }
    ],
    prediction: "Based on current trends, expect 12-15% revenue growth over the next quarter with stable profit margins if expense control measures continue."
  };
};

const mockAnalyzeEmployeePerformance = async (attendanceData: any[], taskData: any[]) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  return {
    metrics: {
      avg_hours_worked: 7.8,
      punctuality_rate: 94.5,
      task_completion_rate: 87.3,
      avg_task_time: 4.2,
      efficiency_rate: 105.8
    },
    performance_assessment: {
      rating: "excellent",
      explanation: "Overall performance is excellent with high efficiency and punctuality. Task completion rates are above team average."
    },
    strengths: [
      "Consistently completes tasks ahead of estimated timeframes",
      "Excellent punctuality with 94.5% on-time rate",
      "Takes on complex tasks with high success rate",
      "Efficient time management across multiple projects"
    ],
    improvement_areas: [
      "Occasional overcommitment to simultaneous tasks",
      "Documentation could be more thorough on completed projects",
      "Some variance in productivity during afternoon hours"
    ],
    recommendations: [
      "Consider implementing time blocking techniques for focused work periods",
      "Establish structured documentation process for knowledge sharing",
      "Prioritize complex tasks during morning hours for optimal productivity",
      "Consider mentoring junior team members in time management techniques"
    ]
  };
};

const mockGenerateSuggestedTasks = async (clientRequirements: string, clientId?: number) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2200));
  
  return {
    suggested_tasks: [
      {
        title: "Website Design Mockups",
        description: "Create initial design concepts based on client brand guidelines and requirements",
        estimated_time: 8,
        priority: "high"
      },
      {
        title: "Frontend Development",
        description: "Implement responsive frontend using React and Tailwind CSS",
        estimated_time: 24,
        priority: "medium"
      },
      {
        title: "Backend API Implementation",
        description: "Develop RESTful APIs for client data management and integration",
        estimated_time: 16,
        priority: "medium"
      },
      {
        title: "Payment Gateway Integration",
        description: "Integrate secure payment processing with Stripe and PayPal options",
        estimated_time: 12,
        priority: "high"
      },
      {
        title: "Content Migration",
        description: "Migrate existing content to new platform with SEO preservation",
        estimated_time: 6,
        priority: "medium"
      }
    ]
  };
};

const mockGeneratePerformanceInsights = async (employeeId: number) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    performance_summary: "The employee shows strong overall performance with high efficiency and quality standards. Task completion rates are above team average with excellent technical skills.",
    key_metrics: {
      task_completion_rate: 92,
      quality_score: 4.8,
      efficiency_rate: 108,
      collaboration_score: 4.6
    },
    strengths: [
      "Exceptional technical problem-solving abilities",
      "Consistent delivery of high-quality work",
      "Proactive communication with team members and clients",
      "Adapts quickly to changing requirements and priorities"
    ],
    improvement_areas: [
      "Documentation could be more comprehensive for complex tasks",
      "Time estimation accuracy varies on larger projects",
      "Could delegate more effectively on team projects"
    ],
    recommendations: [
      "Implement structured documentation approach for knowledge sharing",
      "Consider breaking down larger tasks for more accurate time estimation",
      "Participate in leadership training to enhance delegation skills",
      "Share technical expertise through internal training sessions"
    ],
    growth_opportunities: [
      "Technical leadership role within the team",
      "Client-facing project management responsibilities",
      "Mentoring junior team members",
      "Specialization in emerging technologies relevant to business goals"
    ]
  };
};

const mockGetAssistantResponse = async (query: string, context: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Enhanced contextual response based on user query and knowledge base
  const { user, knowledgeBase, previousMessages } = context;
  const lowercaseQuery = query.toLowerCase();
  
  // Function to generate more specific responses based on knowledge base
  const generateContextualResponse = () => {
    // Role-specific recommendations based on knowledge
    if (lowercaseQuery.includes('grow') || lowercaseQuery.includes('10x') || lowercaseQuery.includes('scaling')) {
      return `Based on our current data, here are steps to help achieve 10X growth in 12 months:

1. **Client Expansion**: With ${knowledgeBase?.clients?.clientCount || 'your current'} clients, focus on increasing project scope with your top ${Math.min(3, knowledgeBase?.clients?.recentClients?.length || 0)} clients.

2. **Operational Efficiency**: Your task completion rate is ${knowledgeBase?.tasks?.completionRate || 'currently suboptimal'}. Improving this by 20% would significantly increase capacity without adding resources.

3. **Team Scaling**: Strategic hiring in ${knowledgeBase?.employees?.departments?.slice(0, 2).join(' and ') || 'key departments'} would address current bottlenecks.

4. **Marketing Channels**: Based on communication patterns, invest more in client referral programs and targeted digital marketing.

5. **Process Automation**: Implement AI-driven workflow management to reduce manual task handling by 40%.

Would you like me to elaborate on any of these strategies?`;
    }
    
    // Task and productivity insights
    if (lowercaseQuery.includes('task') || lowercaseQuery.includes('productivity') || lowercaseQuery.includes('work')) {
      const pendingTasks = knowledgeBase?.tasks?.pending || 0;
      const inProgressTasks = knowledgeBase?.tasks?.inProgress || 0;
      const completionRate = knowledgeBase?.tasks?.completionRate || '0%';
      
      return `Here's an overview of current task status:

- Pending tasks: ${pendingTasks}
- In-progress tasks: ${inProgressTasks}
- Overall completion rate: ${completionRate}
${knowledgeBase?.tasks?.highPriorityTasks?.length ? 
`- High priority tasks requiring attention: ${knowledgeBase.tasks.highPriorityTasks.slice(0, 3).join(', ')}` : ''}

To improve productivity, consider:
1. Focusing on high-priority items first
2. Breaking down large tasks into smaller, manageable units
3. Implementing time-blocking techniques
4. Leveraging AI-assisted task analysis to optimize resource allocation

Would you like specific strategies for improving task completion rates?`;
    }
    
    // Default response with general insights
    return `Based on your company data, here are some key insights:

- Client portfolio: ${knowledgeBase?.clients?.clientCount || 0} clients currently active
- Task management: ${knowledgeBase?.tasks?.total || 0} total tasks with ${knowledgeBase?.tasks?.completionRate || '0%'} completion rate
- Team composition: ${knowledgeBase?.employees?.employeeCount || 0} employees across ${knowledgeBase?.employees?.departments?.length || 0} departments
- Communication: Primary topics include ${knowledgeBase?.communication?.topics?.slice(0, 3).join(', ') || 'various business topics'}

I can provide more specific insights if you ask about clients, tasks, team performance, or growth strategies. What would you like to know more about?`;
  };
  
  // Generate response based on context
  let response = generateContextualResponse();
  
  return {
    message: response,
    confidence: 0.92,
    sources: []
  };
};

const mockAnalyzeTaskProgress = async (taskId: number, progressData: any) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    analysis: "Based on your current progress, you're on track to complete this task within the estimated timeframe. The approach you're taking aligns well with the project requirements.",
    suggestions: [
      "Consider breaking down the implementation phase into smaller subtasks for better tracking",
      "Document decision points for future reference, especially regarding the component architecture",
      "Schedule a brief check-in with the client to validate your current direction"
    ],
    completion_percentage: 42,
    efficiency_score: 8.5,
    quality_assessment: "Above expectations"
  };
};

// Exported AI service functions that utilize either real API calls or mock implementations
export const aiService = {
  analyzeClientInput: async (text: string, clientHistory?: any[]) => {
    try {
      // Try to call the real API first
      const response = await axios.post(`${API_URL}/ai/analyze-client-input`, {
        text,
        client_history: clientHistory
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for client input analysis');
      // Fall back to mock implementation
      return mockAnalyzeClientInput(text);
    }
  },
  
  generateMarketingInsights: async (campaignData: any, marketSegment?: string) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-marketing-insights`, {
        campaign_data: campaignData,
        market_segment: marketSegment
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for marketing insights');
      return mockGenerateMarketingInsights(campaignData);
    }
  },
  
  analyzeMeetingTranscript: async (data: { text: string; meetingId?: number }) => {
    try {
      const response = await axios.post(`${API_URL}/ai/analyze-meeting-transcript`, {
        transcript: data.text,
        meeting_id: data.meetingId,
        meeting_type: "client"
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for meeting transcript analysis');
      return mockAnalyzeMeetingTranscript(data.text, "client");
    }
  },
  
  analyzeFinancialData: async (financialRecords: any[]) => {
    try {
      const response = await axios.post(`${API_URL}/ai/analyze-financial-data`, {
        financial_records: financialRecords
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for financial data analysis');
      return mockAnalyzeFinancialData(financialRecords);
    }
  },
  
  analyzeEmployeePerformance: async (employeeId: number) => {
    try {
      const response = await axios.post(`${API_URL}/ai/analyze-employee-performance`, {
        employee_id: employeeId
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for employee performance analysis');
      // Mock data for demonstration
      return mockAnalyzeEmployeePerformance([], []);
    }
  },
  
  generateSuggestedTasks: async (clientRequirements: string, clientId?: number) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-suggested-tasks`, {
        client_requirements: clientRequirements,
        client_id: clientId
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for task suggestions');
      return mockGenerateSuggestedTasks(clientRequirements, clientId);
    }
  },
  
  generatePerformanceInsights: async (employeeId: number) => {
    try {
      const response = await axios.post(`${API_URL}/ai/generate-performance-insights`, {
        employee_id: employeeId
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for performance insights');
      return mockGeneratePerformanceInsights(employeeId);
    }
  },
  
  getAssistantResponse: async (query: string, context: any) => {
    try {
      const response = await axios.post(`${API_URL}/ai/assistant`, {
        query,
        context
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for assistant response');
      return mockGetAssistantResponse(query, context);
    }
  },
  
  analyzeTaskProgress: async (taskId: number, progressData: any) => {
    try {
      const response = await axios.post(`${API_URL}/ai/analyze-task-progress`, {
        task_id: taskId,
        progress_data: progressData
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for task progress analysis');
      return mockAnalyzeTaskProgress(taskId, progressData);
    }
  }
};
