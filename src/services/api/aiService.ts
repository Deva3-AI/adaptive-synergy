
import api from '../api';
import { mockAIResponse, mockInsights } from '@/utils/mockData';

const aiService = {
  getResponse: async (message: string) => {
    try {
      const response = await api.post('/ai/assistant', { query: message });
      return response.data;
    } catch (error) {
      console.error('AI response error:', error);
      // Return mock data during development
      return { content: mockAIResponse };
    }
  },

  analyzeRequirements: async (requirements: string) => {
    try {
      const response = await api.post('/ai/analyze-client-input', { text: requirements });
      return response.data;
    } catch (error) {
      console.error('Analyze requirements error:', error);
      return {
        tasks: [],
        priority_levels: [],
        sentiment: 'neutral',
        key_points: []
      };
    }
  },

  analyzeTask: async (taskId: number, taskDetails: any) => {
    try {
      const response = await api.post('/ai/analyze-task', { task_id: taskId, task_details: taskDetails });
      return response.data;
    } catch (error) {
      console.error('Analyze task error:', error);
      return mockInsights;
    }
  },

  generateInsights: async (data: any) => {
    try {
      const response = await api.post('/ai/generate-insights', data);
      return response.data;
    } catch (error) {
      console.error('Generate insights error:', error);
      return mockInsights;
    }
  },

  generateManagerInsights: async (taskId: number | null) => {
    if (!taskId) return {};
    
    try {
      const response = await api.get(`/ai/manager-insights/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Manager insights error:', error);
      return {
        tips: [
          "Break down the task into smaller, manageable subtasks",
          "Check similar past projects for reference",
          "Schedule a quick call with the client to clarify any ambiguities"
        ],
        timeline_risk: "medium",
        timeline_suggestions: [
          "Start with the most complex part first",
          "Set aside extra time for client revisions",
          "Consider parallel work on independent components"
        ],
        quality_insights: [
          "This client values detailed documentation",
          "Include explanatory comments in deliverables",
          "Previous similar tasks had revision requests about color schemes"
        ],
        resources: [
          {
            title: "Similar Project Documentation",
            url: "https://example.com/docs"
          },
          {
            title: "Client Style Guide",
            url: "https://example.com/style-guide"
          }
        ]
      };
    }
  },

  generateAITaskRecommendations: async (clientId: number) => {
    try {
      const response = await api.get(`/ai/task-recommendations/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Task recommendations error:', error);
      return [];
    }
  },
  
  generatePerformanceReport: async (employeeId: number, timeframe: string) => {
    try {
      const response = await api.get(`/ai/performance-report/${employeeId}?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Performance report error:', error);
      return {};
    }
  }
};

export default aiService;
