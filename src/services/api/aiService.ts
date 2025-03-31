
import apiClient from '@/utils/apiUtils';

const aiService = {
  getResponse: async (message: string) => {
    try {
      const response = await apiClient.post('/ai/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  },

  analyzeRequirements: async (requirements: string) => {
    try {
      const response = await apiClient.post('/ai/analyze-requirements', { requirements });
      return response.data;
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      
      // Return mock data for development
      return {
        key_requirements: [
          'Responsive design for all device sizes',
          'User authentication with social login',
          'Real-time notifications',
          'Data visualization dashboard'
        ],
        suggested_tasks: [
          {
            title: 'Implement responsive layout',
            description: 'Create responsive grid system that adapts to different screen sizes',
            estimated_time: 8,
            priority: 'high'
          },
          {
            title: 'Set up authentication system',
            description: 'Implement user login/signup with Google and Facebook integration',
            estimated_time: 12,
            priority: 'high'
          }
        ],
        technical_considerations: [
          'Consider using React Context API for state management',
          'Implement lazy loading for better performance',
          'Use WebSockets for real-time features'
        ],
        clarity_score: 85,
        completeness_score: 78
      };
    }
  },

  analyzeTask: async (taskId: number, taskDetails: any) => {
    try {
      const response = await apiClient.post('/ai/analyze-task', { taskId, taskDetails });
      return response.data;
    } catch (error) {
      console.error('Error analyzing task:', error);
      throw error;
    }
  },

  generateTaskBreakdown: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/ai/task-breakdown/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating task breakdown:', error);
      throw error;
    }
  },

  getClientPreferences: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/ai/client-preferences/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting client preferences:', error);
      
      // Return mock data for development
      return {
        communication_style: 'Formal',
        design_preferences: {
          color_scheme: 'Blue and white, professional',
          typography: 'Clean, modern sans-serif',
          layout: 'Minimalist with ample white space'
        },
        feedback_patterns: [
          'Prefers detailed explanations',
          'Values clean, intuitive interfaces',
          'Requests prompt responses'
        ],
        past_satisfaction: {
          design: 4.8,
          communication: 4.5,
          timeliness: 4.2,
          overall: 4.6
        },
        dos: [
          'Provide regular status updates',
          'Include detailed documentation',
          'Maintain consistent design language'
        ],
        donts: [
          'Use technical jargon without explanation',
          'Make assumptions without confirmation',
          'Submit work without internal review'
        ]
      };
    }
  },

  getAITaskRecommendations: async (userId: number) => {
    try {
      const response = await apiClient.get(`/ai/task-recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting task recommendations:', error);
      
      // Return mock data for development
      return [
        {
          title: 'Update client dashboard with new metrics',
          description: 'Add revenue and conversion metrics to the client dashboard',
          estimated_time: 4,
          priority: 'high',
          skills_match: 95,
          reason: 'Based on your recent work on dashboard components'
        },
        {
          title: 'Create mobile responsive templates',
          description: 'Develop new responsive email templates for marketing campaign',
          estimated_time: 6,
          priority: 'medium',
          skills_match: 88,
          reason: 'Aligns with your expertise in responsive design'
        }
      ];
    }
  },

  generatePerformanceReport: async (employeeId: number, timeframe: string) => {
    try {
      const response = await apiClient.get(`/ai/performance-report/${employeeId}?timeframe=${timeframe}`);
      return response.data;
    } catch (error) {
      console.error('Error generating performance report:', error);
      throw error;
    }
  },

  generateManagerInsights: async (taskId: number) => {
    try {
      const response = await apiClient.get(`/ai/manager-insights/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error generating manager insights:', error);
      
      // Return mock data for development
      return {
        tips: [
          'Client prefers detailed progress updates',
          'Similar tasks took 20% longer than estimated in the past',
          'Break down the animation work into smaller components'
        ],
        timeline_risk: 'medium',
        timeline_suggestions: [
          'Consider allocating additional time for client revisions',
          'Prepare design options in advance to expedite approval'
        ],
        quality_insights: [
          'Client has previously praised attention to typography details',
          'Previous feedback emphasized consistent use of brand colors'
        ],
        resources: [
          {
            title: 'Brand guidelines document',
            url: '/documents/brand-guidelines.pdf'
          },
          {
            title: 'Previous similar project',
            url: '/projects/123'
          }
        ]
      };
    }
  }
};

export default aiService;
