
import { aiService } from '@/services/api/aiService';
import { clientService, taskService } from '@/services/api';
import { toast } from 'sonner';

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
      const clientHistory = await clientService.getClientHistory(clientId);
      
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
        clientData = await clientService.getClientById(clientId);
      }
      
      // Get task data if taskId is provided
      if (taskId) {
        taskData = await taskService.getTaskDetails(taskId);
        
        // If task has client_id but no clientId was provided, get client data
        if (taskData.client_id && !clientId) {
          clientData = await clientService.getClientById(taskData.client_id);
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
        clientHistory = await clientService.getClientHistory(clientId);
      }
      
      const prediction = await aiService.predictTaskTimeline(taskDescription, clientHistory);
      
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

export default aiUtils;
