
import apiClient, { handleApiError } from '@/utils/apiUtils';

// Mock data generator function to simulate AI responses during development
const generateMockAIResponse = (type: string, input: string) => {
  switch (type) {
    case 'analyze-requirements':
      return {
        keyPoints: [
          'Client needs a responsive website with e-commerce capabilities',
          'Timeline is 6 weeks for the MVP launch',
          'Budget constraints require phased implementation',
          'SEO optimization is a priority for organic traffic',
          'Integration with existing CRM system is required'
        ],
        timeline: 'Based on the requirements, we recommend a 8-week timeline with initial launch at week 6 and refinements in the subsequent 2 weeks.',
        context: 'The client is expanding their business online and this is their first major digital transformation initiative. They have existing brand guidelines that should be followed.',
        suggestedTasks: [
          {
            title: 'Website Design & Wireframing',
            description: 'Create initial wireframes and design mockups for client approval',
            estimatedTime: 12,
            priority: 'high'
          },
          {
            title: 'Frontend Development',
            description: 'Build responsive frontend components with React following approved designs',
            estimatedTime: 24,
            priority: 'high'
          },
          {
            title: 'E-commerce Backend Integration',
            description: 'Implement product catalog, cart and checkout functionality',
            estimatedTime: 20,
            priority: 'medium'
          },
          {
            title: 'CRM System Integration',
            description: 'Connect website with existing client CRM for customer data syncing',
            estimatedTime: 8,
            priority: 'medium'
          },
          {
            title: 'SEO Optimization',
            description: 'Implement meta tags, structured data and performance optimizations',
            estimatedTime: 6,
            priority: 'low'
          }
        ],
        risks: [
          'The 6-week timeline may be tight for full e-commerce functionality',
          'CRM integration might reveal unforeseen compatibility issues',
          'Client may request significant design changes after initial approval'
        ],
        recommendations: [
          'Schedule weekly progress reviews with the client',
          'Prioritize core e-commerce features for MVP',
          'Document all integration points with the CRM early',
          'Create a content delivery schedule for the client'
        ]
      };
    
    case 'general-response':
      // This simulates a general chat response from the AI
      return {
        response: `I've analyzed your question: "${input}"\n\nHere's what I can tell you: This appears to be a question about our platform features or operations. Based on the available information, I would recommend checking the documentation or contacting the support team for more specific guidance. Is there anything specific you're looking to accomplish that I can try to assist with?`
      };
    
    case 'task-analysis':
      return {
        insights: [
          'Task complexity indicates approximately 4-6 hours of work',
          'Similar tasks in the past have required cross-team collaboration',
          'Client typically requests revisions within 48 hours of delivery',
          'This task relates to previous work done in project #1043'
        ],
        recommendations: [
          'Allocate at least 1 day of buffer time before the deadline',
          'Prepare alternate design options based on client history',
          'Check with the design team for existing assets',
          'Reference similar deliverables from project #1043'
        ],
        relevant_resources: [
          'Design System Guidelines (internal)',
          'Previous client feedback document',
          'Similar deliverable from March 2022'
        ]
      };
      
    case 'virtual-manager':
      return {
        daily_priorities: [
          {
            task_id: 101,
            title: 'Complete homepage redesign',
            client: 'Acme Corp',
            urgency: 'high',
            reason: 'Due tomorrow and client is waiting on this'
          },
          {
            task_id: 102,
            title: 'Review content strategy',
            client: 'TechStart Inc',
            urgency: 'medium',
            reason: 'Meeting scheduled for later this week'
          },
          {
            task_id: 103,
            title: 'Create email templates',
            client: 'Global Services',
            urgency: 'low',
            reason: 'Part of ongoing project with flexible timeline'
          }
        ],
        schedule_optimizations: [
          'Group similar design tasks between 9-11am when creativity is highest',
          'Schedule client communications after lunch when response times are faster',
          'Block 3-4pm for deep focus work with minimal interruptions'
        ],
        reminders: [
          'Weekly team meeting tomorrow at 10:00 AM',
          'Acme Corp invoice due in 3 days',
          'Renew software licenses by end of month'
        ],
        performance_insights: {
          completed_tasks: 23,
          avg_completion_time: '2.3 days',
          on_time_rate: '87%',
          client_satisfaction: '4.8/5',
          areas_for_improvement: [
            'Project documentation could be more detailed',
            'Estimated timelines were off by 15% on average'
          ]
        }
      };
      
    case 'client-insights':
      return {
        client_preferences: {
          communication: 'Prefers email for updates, calls for urgent matters',
          meeting_frequency: 'Bi-weekly, Tuesday mornings preferred',
          feedback_style: 'Provides detailed written feedback, appreciates visual examples',
          decision_making: 'Committee-based, requires time for internal discussions'
        },
        historical_data: {
          avg_response_time: '24 hours',
          revision_requests: '2.4 per deliverable',
          payment_history: 'Consistent, typically pays within 7 days of invoice',
          common_feedback: [
            'Emphasis on modern, clean design',
            'Prefers detailed analytics reports',
            'Values case studies and examples'
          ]
        },
        dos_and_donts: {
          do: [
            'Provide multiple options for key decisions',
            'Include context for design choices',
            'Set clear expectations for timeline',
            'Document all communication in project management system'
          ],
          dont: [
            'Rush decisions without proper consultation',
            'Use industry jargon without explanation',
            'Assume preferences based on other clients',
            'Schedule meetings on Friday afternoons'
          ]
        },
        relationship_health: {
          overall_score: '8.5/10',
          strengths: ['Clear communication', 'Timely deliverables', 'Quality of work'],
          areas_for_improvement: ['Proactive updates', 'Strategic recommendations'],
          opportunities: ['Cross-selling to marketing department', 'Annual retainer potential']
        }
      };
      
    default:
      return { response: "I'm not sure how to help with that specific request." };
  }
};

const aiService = {
  // General AI conversation response
  getResponse: async (message: string): Promise<any> => {
    try {
      // In a production environment, this would call an API
      // return await apiClient.post('/ai/chat', { message });
      
      // For development, we'll use mock data
      return generateMockAIResponse('general-response', message);
    } catch (error) {
      return handleApiError(error, { response: "I apologize, but I'm having trouble processing your request." });
    }
  },
  
  // Analyze client requirements
  analyzeRequirements: async (requirements: string): Promise<any> => {
    try {
      // In a production environment, this would call an API
      // return await apiClient.post('/ai/analyze-requirements', { requirements });
      
      // For development, we'll use mock data
      return generateMockAIResponse('analyze-requirements', requirements);
    } catch (error) {
      return handleApiError(error, { error: "Failed to analyze requirements" });
    }
  },
  
  // Analyze task to provide insights
  analyzeTask: async (taskId: number, taskDetails: any): Promise<any> => {
    try {
      // In a production environment, this would call an API
      // return await apiClient.post(`/ai/analyze-task/${taskId}`, taskDetails);
      
      // For development, we'll use mock data
      return generateMockAIResponse('task-analysis', JSON.stringify(taskDetails));
    } catch (error) {
      return handleApiError(error, { error: "Failed to analyze task" });
    }
  },
  
  // Get virtual manager insights
  getVirtualManagerInsights: async (userId: number): Promise<any> => {
    try {
      // In a production environment, this would call an API
      // return await apiClient.get(`/ai/virtual-manager/${userId}`);
      
      // For development, we'll use mock data
      return generateMockAIResponse('virtual-manager', '');
    } catch (error) {
      return handleApiError(error, { error: "Failed to get virtual manager insights" });
    }
  },
  
  // Get client-specific insights
  getClientInsights: async (clientId: number): Promise<any> => {
    try {
      // In a production environment, this would call an API
      // return await apiClient.get(`/ai/client-insights/${clientId}`);
      
      // For development, we'll use mock data
      return generateMockAIResponse('client-insights', '');
    } catch (error) {
      return handleApiError(error, { error: "Failed to get client insights" });
    }
  },
  
  // Generate email template suggestions
  generateEmailTemplate: async (purpose: string, context: string): Promise<any> => {
    try {
      // In a production environment, this would call an API
      // return await apiClient.post('/ai/generate-email', { purpose, context });
      
      // For development, we'll simulate response
      return {
        subject: `Suggested subject for ${purpose}`,
        body: `Dear {client_name},\n\nThank you for your interest in our services. Based on our conversation about ${context}, I wanted to follow up with some additional information.\n\n[Details about relevant services]\n\nWould you be available for a quick call next week to discuss this further?\n\nBest regards,\n{your_name}\n{your_position}`,
        variables: ['{client_name}', '{your_name}', '{your_position}'],
        notes: 'This template is designed for initial client outreach, focusing on establishing value proposition. Customize the service details based on the specific client needs.'
      };
    } catch (error) {
      return handleApiError(error, { error: "Failed to generate email template" });
    }
  },
  
  // Analyze meeting transcript
  analyzeMeetingTranscript: async (transcript: string): Promise<any> => {
    try {
      // In a production environment, this would call an API
      // return await apiClient.post('/ai/analyze-meeting', { transcript });
      
      // For development, we'll simulate response
      return {
        summary: "The meeting focused on the client's needs for a new marketing campaign targeting small business owners. The client wants to increase brand awareness and generate leads through social media and email marketing.",
        key_points: [
          "Client is looking for a comprehensive marketing strategy",
          "Target audience is small business owners in the tech sector",
          "Budget is around $10,000-$15,000 for the initial campaign",
          "Timeline is 3 months with a potential extension",
          "Client prefers data-driven approach with regular reporting"
        ],
        action_items: [
          { task: "Create initial campaign proposal", assignee: "Marketing Team", deadline: "Next Friday" },
          { task: "Research similar campaigns in tech sector", assignee: "Research Team", deadline: "Wednesday" },
          { task: "Develop budget breakdown", assignee: "Finance Team", deadline: "Monday" },
          { task: "Draft email templates", assignee: "Content Team", deadline: "Next Tuesday" }
        ],
        client_pain_points: [
          "Previous agencies didn't provide enough reporting",
          "Struggled to track ROI from marketing efforts",
          "Limited success with previous social media campaigns",
          "Needs help with messaging and positioning"
        ],
        opportunities: [
          "Client has untapped email list of 5,000+ contacts",
          "Client has good content that can be repurposed",
          "Client is open to testimonial videos",
          "Client has budget for paid social campaigns"
        ],
        follow_up_schedule: {
          next_meeting: "Two weeks from today",
          deliverables: [
            "Initial campaign proposal",
            "Budget breakdown",
            "Timeline for implementation",
            "KPI tracking methodology"
          ]
        }
      };
    } catch (error) {
      return handleApiError(error, { error: "Failed to analyze meeting transcript" });
    }
  },
  
  // Generate performance report
  generatePerformanceReport: async (employeeId: number, timeframe: string): Promise<any> => {
    try {
      // In a production environment, this would call an API
      // return await apiClient.post('/ai/performance-report', { employeeId, timeframe });
      
      // For development, we'll simulate response
      return {
        summary: "Overall strong performance with exceptional client satisfaction scores and consistent delivery. Time management could be improved for more efficient workflows.",
        metrics: {
          tasks_completed: 32,
          on_time_completion_rate: "87%",
          average_task_time: "2.3 days",
          client_satisfaction: "4.8/5",
          collaboration_score: "4.2/5"
        },
        strengths: [
          "Excellent client communication and relationship management",
          "High-quality deliverables that exceed expectations",
          "Strong problem-solving skills",
          "Adaptable to changing project requirements"
        ],
        areas_for_improvement: [
          "Time estimation accuracy (typically underestimated by 15%)",
          "Documentation thoroughness could be enhanced",
          "Internal communication with team members",
          "Project status updates frequency"
        ],
        recommendations: [
          "Schedule regular check-ins for projects lasting more than 2 weeks",
          "Utilize time tracking tools more consistently",
          "Share knowledge through internal documentation",
          "Participate in upcoming training on project management methodologies"
        ],
        comparison_to_goals: {
          productivity: {
            goal: "30 tasks per month",
            actual: "32 tasks",
            status: "Exceeding"
          },
          quality: {
            goal: "4.5/5 client satisfaction",
            actual: "4.8/5",
            status: "Exceeding"
          },
          efficiency: {
            goal: "90% on-time delivery",
            actual: "87%",
            status: "Slightly Below"
          }
        }
      };
    } catch (error) {
      return handleApiError(error, { error: "Failed to generate performance report" });
    }
  }
};

export default aiService;
