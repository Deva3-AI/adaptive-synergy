
import { aiService } from '@/services/api/aiService';
import clientService from '@/services/api/clientService';
import taskService from '@/services/api/taskService';
import { toast } from 'sonner';
import { dateToString } from '@/utils/dateUtils';

/**
 * AI Utilities for task management and client insights
 */
export const aiUtils = {
  /**
   * Analyzes client requirements and generates task suggestions
   */
  analyzeClientRequirements: async (clientId: number, requirementText: string) => {
    try {
      // Get client history to provide context
      const clientHistory = await clientService.getClientDetails(clientId);
      
      // Analyze the requirements using AI
      const analysis = await aiService.analyzeClientInput(requirementText, clientHistory);
      
      return {
        keyRequirements: analysis.key_requirements || [],
        sentiment: analysis.sentiment || 'neutral',
        priorityLevel: analysis.priority_level || 'medium',
        suggestedTasks: analysis.suggested_tasks || []
      };
    } catch (error) {
      console.error('Error analyzing client requirements:', error);
      toast.error('Failed to analyze client requirements');
      
      // Return fallback data
      return {
        keyRequirements: [],
        sentiment: 'neutral',
        priorityLevel: 'medium',
        suggestedTasks: []
      };
    }
  },
  
  /**
   * Gets virtual manager insights based on client and task
   */
  getManagerInsights: async ({ clientId, taskId }: { clientId?: number; taskId?: number }) => {
    try {
      let clientData = null;
      let taskData = null;
      
      // Get client data if clientId is provided
      if (clientId) {
        clientData = await clientService.getClientDetails(clientId);
      }
      
      // Get task data if taskId is provided
      if (taskId) {
        taskData = await taskService.getTaskDetails(taskId);
        
        // If task has client_id but no clientId was provided, get client data
        if (taskData.client_id && !clientId) {
          clientData = await clientService.getClientDetails(taskData.client_id);
        }
      }
      
      // If neither client nor task data is available, return empty insights
      if (!clientData && !taskData) {
        return [];
      }
      
      // Mock insights for demo purposes
      // In production, this would call the AI service
      return [
        {
          id: '1',
          type: 'tip',
          content: `This client typically responds well to clean, minimalist designs with plenty of whitespace.`,
          priority: 'medium'
        },
        {
          id: '2',
          type: 'warning',
          content: 'Based on previous feedback, avoid serif fonts and dark background colors for this client.',
          priority: 'high'
        },
        {
          id: '3',
          type: 'deadline',
          content: `Similar tasks for this client have taken an average of ${taskData?.estimated_time || 8} hours to complete.`,
          priority: 'medium'
        },
        {
          id: '4',
          type: 'preference',
          content: 'Client has expressed preference for detailed progress updates throughout the project lifecycle.',
          priority: 'low'
        }
      ];
    } catch (error) {
      console.error('Error getting manager insights:', error);
      return [];
    }
  },
  
  /**
   * Predicts task completion time based on historical data
   */
  predictTaskTime: async (taskDescription: string, clientId?: number) => {
    try {
      let clientHistory = [];
      
      if (clientId) {
        clientHistory = await clientService.getClientTasks(clientId);
      }
      
      const prediction = await aiService.analyzeClientInput(taskDescription, clientHistory);
      
      return {
        estimatedTime: prediction.estimated_time || 8,
        complexity: prediction.task_complexity || 'moderate',
        recommendedSkills: prediction.recommended_skills || [],
        potentialChallenges: prediction.potential_challenges || []
      };
    } catch (error) {
      console.error('Error predicting task time:', error);
      
      // Return fallback data
      return {
        estimatedTime: 8,
        complexity: 'moderate',
        recommendedSkills: [],
        potentialChallenges: []
      };
    }
  },
  
  /**
   * Analyzes task progress based on attachments and progress description
   */
  analyzeTaskProgress: async (taskId: number) => {
    try {
      return await taskService.analyzeTaskProgress(taskId);
    } catch (error) {
      console.error('Error analyzing task progress:', error);
      return {
        analysis: "Unable to analyze task progress at this time.",
        suggestions: []
      };
    }
  }
};

// Export all the functions that are being imported in other files
export const analyzeEmployeePerformance = async (attendanceData: any[], taskData: any[]) => {
  try {
    // This would call the AI service in production
    // For now returning mock data
    return {
      metrics: {
        avg_hours_worked: 7.5,
        task_completion_rate: 85,
        efficiency_rate: 92
      },
      performance_assessment: {
        rating: 'good',
        explanation: 'Employee shows consistent performance with high task completion rate and good efficiency.'
      },
      strengths: [
        'Completes tasks ahead of schedule',
        'High quality of work',
        'Good communication with clients'
      ],
      improvement_areas: [
        'Could improve documentation',
        'Occasional delays in status updates'
      ],
      recommendations: [
        'Consider for more complex design tasks',
        'Provide additional training on project management tools',
        'Schedule regular check-ins to maintain consistency'
      ]
    };
  } catch (error) {
    console.error('Error analyzing employee performance:', error);
    throw error;
  }
};

export const analyzeFinancialData = async (financialRecords: any[]) => {
  try {
    // This would call the AI service in production
    // For now returning mock data
    return {
      financial_health: {
        status: 'Good',
        explanation: 'Overall financial health is positive with stable revenue growth and controlled expenses.'
      },
      summary_metrics: {
        net_profit: 24500,
        profit_margin: 18.5,
        recent_trend: 'upward'
      },
      key_insights: [
        'Revenue has increased by 15% compared to previous quarter',
        'Client acquisition cost has decreased by 8%',
        'Recurring revenue streams show stability'
      ],
      recommendations: [
        { area: 'Marketing', action: 'Increase budget allocation for high-performing channels' },
        { area: 'Operations', action: 'Review resource allocation for better efficiency' },
        { area: 'Client Retention', action: 'Implement loyalty program for long-term clients' }
      ],
      prediction: 'Based on current trends, projected growth of 12-15% expected in next quarter if market conditions remain stable.'
    };
  } catch (error) {
    console.error('Error analyzing financial data:', error);
    throw error;
  }
};

export const analyzeMeetingTranscript = async (transcript: string, meetingType: string) => {
  try {
    // This would call the AI service in production
    // For now returning mock data
    return {
      summary: [
        'Meeting focused on Q3 marketing strategy and upcoming product launch',
        'Team agreed on shifting resources to digital channels',
        'Budget approval needed for new campaign series'
      ],
      action_items: [
        { task: 'Create detailed campaign calendar', assignee: 'Marketing Team' },
        { task: 'Finalize budget proposal', assignee: 'Finance Team' },
        { task: 'Schedule follow-up meeting next week', assignee: 'Project Manager' }
      ],
      key_insights: [
        'Social media campaigns outperforming traditional channels',
        'Customer feedback indicates preference for video content',
        'Competitor analysis shows opportunity in mobile-first approach'
      ],
      sentiment_analysis: {
        sentiment: 'positive',
        confidence: 0.87
      }
    };
  } catch (error) {
    console.error('Error analyzing meeting transcript:', error);
    throw error;
  }
};

export const generateMarketingInsights = async (campaignData: any, marketSegment?: string) => {
  try {
    // This would call the AI service in production
    // For now returning mock data
    return {
      performance_summary: 'Campaign shows strong engagement metrics with 23% higher CTR than industry average.',
      audience_insights: [
        'Highest engagement from 25-34 age group',
        'Mobile users converting at 15% higher rate than desktop',
        'Evening content consumption peaks between 7-9pm'
      ],
      content_analysis: {
        top_performing: 'Video testimonials and case studies',
        underperforming: 'Text-heavy blog posts',
        recommendations: 'Focus on visual storytelling and interactive content'
      },
      channel_efficiency: [
        { channel: 'Instagram', efficiency: 'High', roi: 3.2 },
        { channel: 'Email', efficiency: 'Medium', roi: 2.1 },
        { channel: 'Search', efficiency: 'High', roi: 2.8 }
      ],
      competitive_gap: 'Leading in social engagement, opportunity to improve in SEO visibility.',
      next_steps: [
        'Reallocate budget to high-performing channels',
        'Develop more video content for key segments',
        'A/B test landing pages for conversion optimization'
      ]
    };
  } catch (error) {
    console.error('Error generating marketing insights:', error);
    throw error;
  }
};

export const analyzeClientInput = async (text: string, clientHistory?: any[]) => {
  try {
    // This would call the AI service in production
    // For now returning mock data
    return {
      key_requirements: [
        'Modern, minimalist design',
        'Mobile-responsive layout',
        'Interactive elements for user engagement'
      ],
      sentiment: 'positive',
      priority_level: 'high',
      estimated_time: 12,
      task_complexity: 'moderate',
      recommended_skills: ['UI/UX Design', 'Frontend Development'],
      potential_challenges: ['Tight timeline', 'Complex responsive requirements'],
      suggested_tasks: [
        {
          title: 'Create wireframes for homepage',
          description: 'Develop low-fidelity wireframes focusing on content hierarchy and user flow',
          estimated_time: 3
        },
        {
          title: 'Design mobile-responsive components',
          description: 'Create component library ensuring consistent experience across devices',
          estimated_time: 4
        },
        {
          title: 'Implement interactive prototype',
          description: 'Develop clickable prototype to demonstrate key functionality',
          estimated_time: 5
        }
      ]
    };
  } catch (error) {
    console.error('Error analyzing client input:', error);
    throw error;
  }
};

export const generateSuggestedTasks = async (requirements: string, clientId?: number) => {
  try {
    // This would call the AI service in production
    // For now returning mock data
    return {
      suggested_tasks: [
        {
          title: 'Create wireframes for homepage',
          description: 'Develop low-fidelity wireframes focusing on content hierarchy and user flow',
          estimated_time: 3,
          priority: 'high'
        },
        {
          title: 'Design mobile-responsive components',
          description: 'Create component library ensuring consistent experience across devices',
          estimated_time: 4,
          priority: 'medium'
        },
        {
          title: 'Implement interactive prototype',
          description: 'Develop clickable prototype to demonstrate key functionality',
          estimated_time: 5,
          priority: 'medium'
        }
      ]
    };
  } catch (error) {
    console.error('Error generating suggested tasks:', error);
    return { suggested_tasks: [] };
  }
};

export default aiUtils;
