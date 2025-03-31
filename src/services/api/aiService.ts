
import axios from 'axios';
import { mockAIResponse, mockInsights } from '@/utils/mockData';

const aiService = {
  getResponse: async (message: string) => {
    try {
      const response = await axios.post('/api/ai/chat', { message });
      return response.data;
    } catch (error) {
      console.error('AI chat error:', error);
      // Return mock data for development
      return mockAIResponse;
    }
  },
  
  analyzeRequirements: async (requirements: string) => {
    try {
      const response = await axios.post('/api/ai/analyze-requirements', { requirements });
      return response.data;
    } catch (error) {
      console.error('Analyze requirements error:', error);
      return {
        summary: "Analyzed requirements summary would appear here",
        keyPoints: ["Key point 1", "Key point 2", "Key point 3"],
        suggestions: ["Suggestion 1", "Suggestion 2"]
      };
    }
  },
  
  analyzeTask: async (taskId: number, taskDetails: any) => {
    try {
      const response = await axios.post(`/api/ai/analyze-task/${taskId}`, taskDetails);
      return response.data;
    } catch (error) {
      console.error('Analyze task error:', error);
      return {
        insights: [
          { type: "deadline", content: "This task may take longer than estimated." },
          { type: "quality", content: "Consider adding more detail to requirements." }
        ]
      };
    }
  },
  
  generateInsights: async (data: any) => {
    try {
      const response = await axios.post('/api/ai/generate-insights', { data });
      return response.data;
    } catch (error) {
      console.error('Generate insights error:', error);
      return mockInsights;
    }
  },
  
  generateManagerInsights: async (taskId: number) => {
    try {
      const response = await axios.get(`/api/ai/manager-insights/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Manager insights error:', error);
      return [
        {
          type: "deadline",
          title: "Deadline Risk",
          description: "This task may require more time than estimated based on similar tasks.",
          priority: "high"
        },
        {
          type: "quality",
          title: "Quality Check",
          description: "Double check client requirements before submitting.",
          priority: "medium"
        },
        {
          type: "planning",
          title: "Resource Planning",
          description: "Consider breaking this task into smaller sub-tasks.",
          priority: "low"
        }
      ];
    }
  },
  
  generatePerformanceReport: async (employeeId: number, timeframe: string) => {
    try {
      const response = await axios.get(`/api/ai/performance-report/${employeeId}?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Performance report error:', error);
      return {
        summary: "Overall strong performance with on-time delivery.",
        metrics: {
          productivity: 85,
          quality: 92,
          collaboration: 88
        },
        strengths: ["Excellent communication", "Consistently delivers on time"],
        improvements: ["Could improve documentation", "Occasional estimation issues"],
        recommendations: ["Consider additional training in estimation techniques"]
      };
    }
  },
  
  generateAITaskRecommendations: async (clientId: number) => {
    try {
      const response = await axios.get(`/api/ai/task-recommendations?clientId=${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Task recommendations error:', error);
      return [
        {
          task_id: 101,
          title: "Follow up on client feedback",
          description: "The client provided feedback on the last deliverable that should be addressed.",
          priority: "high",
          estimated_time: 2,
          client_id: clientId
        },
        {
          task_id: 102,
          title: "Prepare weekly progress report",
          description: "Create and share the weekly progress report with the client.",
          priority: "medium",
          estimated_time: 1,
          client_id: clientId
        },
        {
          task_id: 103,
          title: "Update project documentation",
          description: "Ensure all project documentation is up to date with recent changes.",
          priority: "low",
          estimated_time: 3,
          client_id: clientId
        }
      ];
    }
  }
};

export default aiService;
