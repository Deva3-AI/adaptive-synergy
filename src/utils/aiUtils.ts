
import { toast } from 'sonner';
import { aiService, clientService } from '@/services/api';
import { Task } from '@/interfaces/task';
import taskService from '@/services/api/taskService';

// AI Utility functions for various AI-powered features throughout the application

/**
 * Analyze client requirements text to suggest tasks
 */
export const analyzeClientRequirements = async (clientId: number, requirementsText: string) => {
  try {
    // Get client history and context for better results
    const client = await clientService.getClientById(clientId);
    
    // Call AI service to analyze requirements
    const analysis = await aiService.analyzeClientInput(requirementsText);
    
    return {
      analysis: analysis.analysis,
      suggestedTasks: analysis.suggested_tasks || []
    };
  } catch (error) {
    console.error('Error analyzing client requirements:', error);
    toast.error('Failed to analyze requirements');
    return {
      analysis: "Unable to analyze requirements at this time.",
      suggestedTasks: []
    };
  }
};

/**
 * Get virtual manager insights for a task
 */
export const getManagerInsights = async ({ clientId, taskId }: { clientId?: number, taskId?: number }) => {
  try {
    let insights = [];
    
    if (clientId) {
      const client = await clientService.getClientById(clientId);
      const history = await clientService.getClientHistory(clientId);
      
      // Generate insights based on client history
      const preferencesInsights = history
        .filter((item: any) => item.type === 'preference')
        .map((item: any) => ({
          id: `pref-${item.id}`,
          type: 'preference',
          content: `Client prefers ${item.description}`,
          priority: 'medium'
        }));
      
      insights = [...insights, ...preferencesInsights];
    }
    
    if (taskId) {
      const task = await taskService.getTaskDetails(taskId);
      
      // Generate insights based on task
      if (task.status === 'in_progress') {
        insights.push({
          id: `deadline-${taskId}`,
          type: 'deadline',
          content: `This task ${task.estimated_time ? `has an estimated time of ${task.estimated_time} hours` : 'has no estimated time set'}`,
          priority: 'high'
        });
      }
    }
    
    // If no insights were generated, add some default ones
    if (insights.length === 0) {
      insights = [
        {
          id: 'default-1',
          type: 'tip',
          content: 'Make sure to read the requirements carefully before starting',
          priority: 'medium'
        },
        {
          id: 'default-2',
          type: 'deadline',
          content: 'Try to complete this task within the estimated time',
          priority: 'medium'
        }
      ];
    }
    
    return insights;
  } catch (error) {
    console.error('Error getting manager insights:', error);
    return [];
  }
};

/**
 * Analyze meeting transcript to generate summary and insights
 */
export const analyzeMeetingTranscript = async (transcript: string) => {
  try {
    const result = await aiService.analyzeMeetingTranscript(transcript);
    return result;
  } catch (error) {
    console.error('Error analyzing meeting transcript:', error);
    toast.error('Failed to analyze transcript');
    return {
      summary: "Unable to analyze transcript at this time.",
      action_items: [],
      key_insights: [],
      sentiment_analysis: {
        sentiment: "neutral",
        confidence: 0.5
      }
    };
  }
};

/**
 * Analyze employee performance based on attendance and task data
 */
export const analyzeEmployeePerformance = async (attendanceData: any[], taskData: any[]) => {
  try {
    // Return mock data for now
    return {
      metrics: {
        avg_hours_worked: 7.5,
        task_completion_rate: 85,
        efficiency_rate: 92
      },
      performance_assessment: {
        rating: 'good',
        explanation: 'Employee shows consistent performance with good time management skills.'
      },
      strengths: [
        'Completes tasks ahead of schedule',
        'Maintains high quality of work',
        'Responsive to client requirements'
      ],
      improvement_areas: [
        'Could improve on documentation',
        'Occasionally misses details in complex tasks'
      ],
      recommendations: [
        'Consider assigning more complex design tasks',
        'Provide opportunities for client communication training',
        'Regular check-ins to ensure alignment with client expectations'
      ]
    };
  } catch (error) {
    console.error('Error analyzing employee performance:', error);
    toast.error('Failed to analyze employee performance');
    return null;
  }
};

/**
 * Analyze financial data to generate insights
 */
export const analyzeFinancialData = async (financialData: any) => {
  try {
    const result = await aiService.analyzeFinancialData(financialData);
    return result;
  } catch (error) {
    console.error('Error analyzing financial data:', error);
    toast.error('Failed to analyze financial data');
    return {
      insights: [
        "Unable to generate financial insights at this time."
      ],
      recommendations: [],
      trends: []
    };
  }
};

/**
 * Generate marketing insights based on campaign data
 */
export const generateMarketingInsights = async (campaignData: any) => {
  try {
    const result = await aiService.generateMarketingInsights(campaignData);
    return result;
  } catch (error) {
    console.error('Error generating marketing insights:', error);
    toast.error('Failed to generate marketing insights');
    return {
      insights: [
        "Unable to generate marketing insights at this time."
      ],
      recommendations: [],
      trends: []
    };
  }
};

/**
 * Analyze client input text for insights
 */
export const analyzeClientInput = async (text: string, clientHistory?: any[]) => {
  try {
    const result = await aiService.analyzeClientInput(text, clientHistory);
    return result;
  } catch (error) {
    console.error('Error analyzing client input:', error);
    toast.error('Failed to analyze client input');
    return {
      insights: [
        "Unable to analyze client input at this time."
      ],
      requirements: [],
      suggestions: []
    };
  }
};

/**
 * Generate suggested tasks based on client input
 */
export const generateSuggestedTasks = async (text: string, clientId: number) => {
  try {
    const result = await aiService.generateTaskSuggestions(text, clientId);
    return result;
  } catch (error) {
    console.error('Error generating suggested tasks:', error);
    toast.error('Failed to generate task suggestions');
    return {
      suggested_tasks: []
    };
  }
};

// Create an aiUtils object to export all functions
const aiUtils = {
  analyzeClientRequirements,
  getManagerInsights,
  analyzeMeetingTranscript,
  analyzeEmployeePerformance,
  analyzeFinancialData,
  generateMarketingInsights,
  analyzeClientInput,
  generateSuggestedTasks
};

export { aiUtils };
export default aiUtils;
