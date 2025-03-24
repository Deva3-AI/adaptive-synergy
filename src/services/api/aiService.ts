
import apiClient from '@/utils/apiUtils';

export const aiService = {
  generateSuggestedTasks: async (projectDescription: string, clientId?: number) => {
    try {
      const response = await apiClient.post('/ai/tasks/suggest', {
        project_description: projectDescription,
        client_id: clientId,
      });
      return response.data;
    } catch (error) {
      console.error('Generate suggested tasks error:', error);
      // Return empty array to prevent UI errors
      return { suggested_tasks: [] };
    }
  },
  
  analyzeTaskPerformance: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/ai/tasks/${taskId}/analyze`);
      return response.data;
    } catch (error) {
      console.error('Analyze task performance error:', error);
      // Return default data to prevent UI errors
      return {
        key_points: [],
        suggested_approach: "No suggestions available.",
        estimated_complexity: "Unknown",
        risks: [],
        suggestedTasks: [] // Adding this for compatibility
      };
    }
  },
  
  getTaskInsights: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/ai/tasks/${taskId}/insights`);
      return response.data;
    } catch (error) {
      console.error('Get task insights error:', error);
      return [];
    }
  },
  
  analyzeClientCommunication: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/ai/clients/${clientId}/communication`);
      return response.data;
    } catch (error) {
      console.error('Analyze client communication error:', error);
      return { insights: [] };
    }
  },

  // Add the getAssistantResponse method that's missing
  getAssistantResponse: async (message: string, context: any) => {
    try {
      const response = await apiClient.post('/ai/assistant', {
        message,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Get AI assistant response error:', error);
      return { 
        message: "I apologize, but I'm having trouble processing your request right now."
      };
    }
  }
};
