
import apiClient from '@/utils/apiUtils';

const aiService = {
  generateTaskSuggestions: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/ai/task-suggestions/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error generating task suggestions for client ${clientId}:`, error);
      return [];
    }
  },

  analyzeClientFeedback: async (feedbackText: string) => {
    try {
      const response = await apiClient.post('/ai/analyze-feedback', { feedbackText });
      return response.data;
    } catch (error) {
      console.error('Error analyzing client feedback:', error);
      return null;
    }
  },

  predictTaskDuration: async (taskDescription: string, taskType: string) => {
    try {
      const response = await apiClient.post('/ai/predict-duration', { taskDescription, taskType });
      return response.data;
    } catch (error) {
      console.error('Error predicting task duration:', error);
      return { hours: 0, confidence: 0 };
    }
  },

  generateMeetingInsights: async (meetingNotes: string) => {
    try {
      const response = await apiClient.post('/ai/meeting-insights', { meetingNotes });
      return response.data;
    } catch (error) {
      console.error('Error generating meeting insights:', error);
      return { actionItems: [], keyPoints: [], sentimentAnalysis: {} };
    }
  },

  analyzeProjectTrends: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/ai/project-trends/${clientId}`);
      return response.data;
    } catch (error) {
      console.error(`Error analyzing project trends for client ${clientId}:`, error);
      return { trends: [], predictions: [], recommendations: [] };
    }
  },

  getAssistantResponse: async (query: string) => {
    try {
      const response = await apiClient.post('/ai/assistant', { query });
      return response.data;
    } catch (error) {
      console.error('Error getting AI assistant response:', error);
      return { response: "I couldn't process your request at this time." };
    }
  },

  getProductivityInsights: async (userId: number) => {
    try {
      const response = await apiClient.get(`/ai/productivity-insights/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting productivity insights for user ${userId}:`, error);
      return {
        averageTaskCompletion: 0,
        productiveHours: [],
        improvementAreas: [],
        strengths: []
      };
    }
  },

  getSuggestedTasks: async (userId: number) => {
    try {
      const response = await apiClient.get(`/ai/suggested-tasks/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting suggested tasks for user ${userId}:`, error);
      return [];
    }
  },

  generateSuggestedTasks: async (clientId: number, taskType?: string) => {
    try {
      const params = taskType ? { taskType } : {};
      const response = await apiClient.get(`/ai/generate-tasks/${clientId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error generating suggested tasks:', error);
      return [];
    }
  }
};

export default aiService;
