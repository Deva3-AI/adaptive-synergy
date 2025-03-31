
import axios from 'axios';
import { mockAIResponse, mockInsights } from '@/utils/mockData';

const aiService = {
  getResponse: async (message: string): Promise<any> => {
    try {
      // In a real app, this would call an AI API
      console.log('AI prompt:', message);
      
      // For demo purposes, simulate an API call
      const mockResponse = {
        content: `This is a simulated AI response to: "${message.substring(0, 30)}..."`,
        timestamp: new Date().toISOString()
      };
      
      return mockResponse;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return mockAIResponse;
    }
  },
  
  analyzeRequirements: async (requirements: string): Promise<any> => {
    try {
      // In a real app, this would call an AI API to analyze client requirements
      console.log('Analyzing requirements:', requirements.substring(0, 30) + '...');
      
      // For demo purposes, return mock analysis
      return {
        key_points: [
          'Website redesign with modern aesthetic',
          'Mobile responsiveness is critical',
          'E-commerce functionality needed',
          'SEO optimization required'
        ],
        estimated_complexity: 'medium',
        suggested_timeline: '6-8 weeks',
        recommended_approach: 'Start with wireframes and user journey mapping before moving to design',
        potential_challenges: [
          'Integration with existing payment processor',
          'Migration of current product database'
        ]
      };
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      throw error;
    }
  },
  
  analyzeTask: async (taskId: number, taskDetails: any): Promise<any> => {
    try {
      // In a real app, this would call an AI API
      console.log('Analyzing task:', taskId);
      
      // For demo purposes, return mock analysis
      return {
        efficiency_score: 85,
        estimated_completion_time: '4.5 hours',
        similar_past_tasks: [
          { id: 123, title: 'Homepage redesign for Tech Co', completion_time: '5 hours' },
          { id: 145, title: 'Landing page for marketing campaign', completion_time: '3.5 hours' }
        ],
        suggestions: [
          'Consider using the component library from the Tech Co project',
          'Allocate extra time for client feedback rounds',
          'Prepare mobile mockups early'
        ]
      };
    } catch (error) {
      console.error('Error analyzing task:', error);
      throw error;
    }
  },
  
  generateInsights: async (data: any): Promise<any> => {
    try {
      // In a real app, this would call an AI API to analyze business data
      console.log('Generating insights from data');
      
      // For demo purposes, return mock insights
      return {
        key_metrics: {
          client_satisfaction: '92%',
          project_completion_rate: '95%',
          average_delivery_time: '2.3 days ahead of schedule'
        },
        trends: [
          'Increasing demand for video content creation',
          'Higher client retention in Q2 compared to Q1',
          'Growing interest in AI integration services'
        ],
        recommendations: [
          'Consider expanding video production capabilities',
          'Implement structured client onboarding to improve early satisfaction',
          'Develop AI service offerings based on current client needs'
        ]
      };
    } catch (error) {
      console.error('Error generating insights:', error);
      return mockInsights;
    }
  },
  
  generateManagerInsights: async (taskId: number): Promise<any> => {
    try {
      // In a real app, this would call an AI API or analyze task data
      console.log('Generating manager insights for task:', taskId);
      
      // For demo purposes, return mock insights
      return {
        task_status: 'on track',
        performance_analysis: {
          efficiency: 'above average',
          quality: 'excellent',
          communication: 'good'
        },
        client_specific_notes: [
          'Client prefers detailed explanations',
          'Quick response time is highly valued',
          'Visual examples have been well-received'
        ],
        suggested_approaches: [
          'Include progress visuals in updates',
          'Schedule brief check-in call midway',
          'Provide options for final deliverable format'
        ]
      };
    } catch (error) {
      console.error('Error generating manager insights:', error);
      throw error;
    }
  },
  
  generateAITaskRecommendations: async (clientId: number): Promise<any> => {
    try {
      // In a real app, this would analyze client history and preferences
      console.log('Generating task recommendations for client:', clientId);
      
      // For demo purposes, return mock recommendations
      return {
        recommended_tasks: [
          {
            title: 'Monthly social media content refresh',
            priority: 'high',
            description: 'Update social media content based on upcoming promotions and events',
            estimated_time: '4 hours',
            suggested_assignee: 'Marketing Specialist'
          },
          {
            title: 'SEO performance review',
            priority: 'medium',
            description: 'Analyze current search rankings and suggest optimizations',
            estimated_time: '3 hours',
            suggested_assignee: 'SEO Specialist'
          },
          {
            title: 'Email campaign for product launch',
            priority: 'high',
            description: 'Create email sequence for upcoming product launch',
            estimated_time: '5 hours',
            suggested_assignee: 'Content Writer'
          }
        ],
        reasoning: [
          'Based on client\'s quarterly marketing plan',
          'Aligns with stated business objectives',
          'Follows successful pattern from previous campaigns'
        ]
      };
    } catch (error) {
      console.error('Error generating task recommendations:', error);
      throw error;
    }
  }
};

export default aiService;
