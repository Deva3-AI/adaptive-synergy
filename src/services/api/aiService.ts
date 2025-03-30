
import apiClient from '@/utils/apiUtils';

const aiService = {
  analyzeTaskPerformance: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/ai/tasks/${taskId}/performance`);
      return response.data;
    } catch (error) {
      console.error('Analyze task performance error:', error);
      return {
        key_points: [],
        suggested_approach: '',
        estimated_complexity: 'medium',
        risks: []
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
  
  analyzeClientFeedback: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/ai/clients/${clientId}/feedback-analysis`);
      return response.data;
    } catch (error) {
      console.error('Analyze client feedback error:', error);
      return {
        sentiment: 'neutral',
        key_points: [],
        suggestions: []
      };
    }
  },
  
  generateContentSuggestions: async (data: any) => {
    try {
      const response = await apiClient.post('/ai/content-suggestions', data);
      return response.data;
    } catch (error) {
      console.error('Generate content suggestions error:', error);
      return [];
    }
  },
  
  generateTaskDescription: async (taskTitle: string, clientId?: number) => {
    try {
      let url = `/ai/generate-task-description?title=${encodeURIComponent(taskTitle)}`;
      if (clientId) {
        url += `&client_id=${clientId}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Generate task description error:', error);
      return '';
    }
  },
  
  getSuggestedTasks: async (userId: number) => {
    try {
      const response = await apiClient.get(`/ai/users/${userId}/suggested-tasks`);
      return response.data;
    } catch (error) {
      console.error('Get suggested tasks error:', error);
      return [];
    }
  },
  
  getProductivityInsights: async (userId: number) => {
    try {
      const response = await apiClient.get(`/ai/users/${userId}/productivity-insights`);
      return response.data;
    } catch (error) {
      console.error('Get productivity insights error:', error);
      return {
        productivity_score: 0,
        trends: [],
        suggestions: []
      };
    }
  }
};

export default aiService;
