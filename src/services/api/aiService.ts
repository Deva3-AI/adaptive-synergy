
import apiClient from '@/utils/apiUtils';

const aiService = {
  getResponse: async (query: string) => {
    try {
      const response = await apiClient.post('/ai/query', { query });
      return response.data;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return { response: "I'm sorry, I couldn't process your request at the moment." };
    }
  },
  
  analyzeData: async (data: any, type: string) => {
    try {
      const response = await apiClient.post('/ai/analyze', { data, type });
      return response.data;
    } catch (error) {
      console.error('Error analyzing data with AI:', error);
      return null;
    }
  },
  
  generateSuggestions: async (context: any) => {
    try {
      const response = await apiClient.post('/ai/suggestions', { context });
      return response.data;
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      return [];
    }
  },
  
  getTaskRecommendations: async (userId: number) => {
    try {
      const response = await apiClient.get(`/ai/task-recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting task recommendations for user ${userId}:`, error);
      return [];
    }
  }
};

export default aiService;
