
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
        title: "Frontend Development",
        description: "Implement responsive frontend with modern UI framework",
        estimated_time: 24
      },
      {
        title: "Payment Integration",
        description: "Integrate payment gateway as per client requirements",
        estimated_time: 12
      },
      {
        title: "Content Migration",
        description: "Migrate content from old website preserving SEO value",
        estimated_time: 6
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
    action_items: [
      {
        task: "Create initial design mockups (3 options)",
        assignee: "Design Team"
      },
      {
        task: "Research CRM integration options",
        assignee: "Tech Team"
      },
      {
        task: "Develop detailed project timeline",
        assignee: "Project Manager"
      },
      {
        task: "Schedule follow-up meeting for next week",
        assignee: "Account Manager"
      }
    ],
    key_insights: [
      "Client prioritizes mobile experience above desktop",
      "Previous vendor had communication issues that client wants to avoid",
      "Client has future e-commerce expansion plans for Q2 next year",
      "Multiple stakeholders will need to approve design concepts"
    ],
    sentiment_analysis: {
      sentiment: Math.random() > 0.7 ? "positive" : Math.random() > 0.4 ? "neutral" : "negative",
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
        priority_level: "high"
      },
      {
        title: "Frontend Development",
        description: "Implement responsive frontend using React and Tailwind CSS",
        estimated_time: 24,
        priority_level: "medium"
      },
      {
        title: "Backend API Implementation",
        description: "Develop RESTful APIs for client data management and integration",
        estimated_time: 16,
        priority_level: "medium"
      },
      {
        title: "Payment Gateway Integration",
        description: "Integrate secure payment processing with Stripe and PayPal options",
        estimated_time: 12,
        priority_level: "high"
      },
      {
        title: "Content Migration",
        description: "Migrate existing content to new platform with SEO preservation",
        estimated_time: 6,
        priority_level: "medium"
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
  
  // List of potential responses based on keywords in the query
  const keywordResponses: Record<string, string> = {
    // General inquiries
    'hello': `Hello! I'm the Hive Assistant. I can help you with information about tasks, clients, employees, and projects.`,
    'help': `I can assist you with various aspects of the Hive platform. You can ask about clients, tasks, employees, financial data, or request AI insights on specific topics.`,
    
    // Task related
    'task': `Based on your current data, you have ${context.tasks?.length || 0} tasks in the system. ${context.tasks?.filter(t => t.status === 'pending').length || 0} are pending, ${context.tasks?.filter(t => t.status === 'in_progress').length || 0} are in progress, and ${context.tasks?.filter(t => t.status === 'completed').length || 0} are completed.`,
    'deadline': `I notice you have ${context.tasks?.filter(t => t.status !== 'completed').length || 0} open tasks. Would you like me to help prioritize them based on deadlines and importance?`,
    
    // Client related
    'client': `You currently have ${context.clients?.length || 0} clients in your system. The most active clients based on task count are ${context.clients?.slice(0, 3).map(c => c.client_name).join(', ')}.`,
    
    // Employee related
    'employee': `Your team consists of ${context.employees?.length || 0} employees across various roles. Would you like to see performance metrics or attendance data?`,
    'performance': `Based on the available data, I can analyze employee performance across task completion rates, punctuality, and efficiency. Would you like me to generate a detailed report?`,
    
    // Financial
    'finance': `I can provide financial insights based on your revenue, expenses, and profit margins. Would you like me to analyze trends or suggest optimization opportunities?`,
    'invoice': `Your invoice management system shows various clients with different payment statuses. I can help track overdue payments and suggest follow-up actions.`,
    
    // AI features
    'ai feature': `Hive has several AI-powered features, including client input analysis, task timeline prediction, meeting transcript analysis, financial data insights, and employee performance evaluation. Which would you like to know more about?`,
    'suggest': `Based on your current projects and tasks, I'd recommend focusing on completing high-priority client deliverables first. Would you like specific task recommendations?`,
    
    // Analytics
    'analytics': `I can provide analytics on various aspects of your business including client satisfaction, project timelines, resource utilization, and financial performance. What specific area are you interested in?`,
    'report': `I can generate comprehensive reports on project status, employee productivity, client engagement, or financial performance. Which type of report would be most useful for you right now?`,
    
    // Insights
    'insight': `Based on your current data, I notice that projects for Client A typically take 20% longer than estimated. Consider adjusting your time estimates for future projects with them.`
  };
  
  // Default fallback response
  let response = `I understand you're asking about "${query}". While I don't have specific information on this exact query, I can help with details about your clients, tasks, employees, or provide AI-powered insights if you ask more specifically.`;
  
  // Check for keyword matches
  const lowercaseQuery = query.toLowerCase();
  for (const [keyword, reply] of Object.entries(keywordResponses)) {
    if (lowercaseQuery.includes(keyword)) {
      response = reply;
      break;
    }
  }
  
  // Special case for task-specific questions
  if (lowercaseQuery.includes('task') && /\d+/.test(lowercaseQuery)) {
    const taskIdMatch = lowercaseQuery.match(/\d+/);
    if (taskIdMatch && context.tasks) {
      const taskId = parseInt(taskIdMatch[0]);
      const task = context.tasks.find(t => t.task_id === taskId);
      
      if (task) {
        response = `Task #${taskId}: "${task.title}" is currently ${task.status}. ${
          task.assigned_to 
            ? `It's assigned to ${task.assignee_name || 'an employee'}.` 
            : 'It's not assigned to anyone yet.'
        } ${
          task.estimated_time 
            ? `The estimated completion time is ${task.estimated_time} hours.` 
            : ''
        }`;
      }
    }
  }
  
  // Special case for client-specific questions
  if (lowercaseQuery.includes('client') && /\d+/.test(lowercaseQuery)) {
    const clientIdMatch = lowercaseQuery.match(/\d+/);
    if (clientIdMatch && context.clients) {
      const clientId = parseInt(clientIdMatch[0]);
      const client = context.clients.find(c => c.client_id === clientId);
      
      if (client) {
        const clientTasks = context.tasks?.filter(t => t.client_id === clientId) || [];
        response = `Client #${clientId}: "${client.client_name}". ${
          client.description ? `Description: ${client.description}.` : ''
        } They have ${clientTasks.length} tasks in the system (${
          clientTasks.filter(t => t.status === 'completed').length
        } completed, ${
          clientTasks.filter(t => t.status !== 'completed').length
        } open).`;
      }
    }
  }
  
  return {
    message: response,
    confidence: 0.85,
    sources: []
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
  
  analyzeMeetingTranscript: async (transcript: string, meetingType: string) => {
    try {
      const response = await axios.post(`${API_URL}/ai/analyze-meeting-transcript`, {
        transcript, 
        meeting_type: meetingType
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for meeting transcript analysis');
      return mockAnalyzeMeetingTranscript(transcript, meetingType);
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
  
  analyzeEmployeePerformance: async (attendanceData: any[], taskData: any[]) => {
    try {
      const response = await axios.post(`${API_URL}/ai/analyze-employee-performance`, {
        attendance_data: attendanceData,
        task_data: taskData
      });
      return response.data;
    } catch (error) {
      console.log('Using mock AI service for employee performance analysis');
      return mockAnalyzeEmployeePerformance(attendanceData, taskData);
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
      console.log('Using mock AI service for task suggestion');
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
  }
};

export default aiService;
