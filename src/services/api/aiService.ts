
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task } from '@/interfaces/tasks';
import axios from 'axios';
import config from '@/config/config';

const aiService = {
  /**
   * Get a response from the AI assistant
   * @param message - User message
   */
  getResponse: async (message: string) => {
    try {
      const response = await supabase.functions.invoke('ai-assistant', {
        body: { message },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting AI response:', error);
      return { response: 'Sorry, I encountered an error processing your request.' };
    }
  },

  /**
   * Analyze client requirements
   * @param requirements - Text of client requirements
   */
  analyzeRequirements: async (requirements: string) => {
    try {
      const response = await supabase.functions.invoke('analyze-requirements', {
        body: { requirements },
      });
      
      return response.data || {
        keyPoints: ['Identified client need for a responsive website'],
        timeline: 'Estimated 2-3 weeks for completion',
        context: 'Client is looking for a modern web application',
        suggestedTasks: [
          {
            title: 'Create project wireframes',
            description: 'Design initial wireframes based on client requirements',
            estimatedTime: 4,
            priority: 'high'
          },
          {
            title: 'Setup project structure',
            description: 'Initialize the codebase and setup CI/CD pipeline',
            estimatedTime: 2,
            priority: 'medium'
          }
        ],
        risks: ['Tight deadline may affect quality'],
        recommendations: ['Schedule regular check-ins']
      };
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      toast.error('Failed to analyze requirements');
      throw error;
    }
  },

  /**
   * Analyze a specific task
   * @param taskId - Task ID
   * @param taskDetails - Task details
   */
  analyzeTask: async (taskId: number, taskDetails: any) => {
    try {
      const response = await supabase.functions.invoke('analyze-task', {
        body: { taskId, ...taskDetails },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error analyzing task:', error);
      toast.error('Failed to analyze task');
      throw error;
    }
  },

  /**
   * Get AI task recommendations
   * @param userId - User ID
   */
  getAITaskRecommendations: async (userId: number) => {
    try {
      const response = await supabase.functions.invoke('task-recommendations', {
        body: { userId },
      });
      
      if (response.error) throw response.error;
      
      return response.data || [
        {
          task_id: 1,
          title: 'Complete project documentation',
          description: 'Update project documentation with recent changes',
          client_id: 2,
          estimated_time: 2,
          priority: 'medium'
        },
        {
          task_id: 2,
          title: 'Fix responsive layout issues',
          description: 'Address mobile layout problems on the dashboard',
          client_id: 1,
          estimated_time: 3,
          priority: 'high'
        }
      ];
    } catch (error) {
      console.error('Error getting AI task recommendations:', error);
      return [];
    }
  },

  /**
   * Generate coding suggestions
   * @param taskId - Task ID
   */
  generateCodingSuggestions: async (taskId: number) => {
    try {
      const response = await supabase.functions.invoke('coding-suggestions', {
        body: { taskId },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating coding suggestions:', error);
      return { suggestions: [] };
    }
  },

  /**
   * Generate performance report
   * @param employeeId - Employee ID
   * @param timeframe - Timeframe (week, month, year)
   */
  generatePerformanceReport: async (employeeId: number, timeframe: string) => {
    try {
      const response = await supabase.functions.invoke('performance-report', {
        body: { employeeId, timeframe },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generating performance report:', error);
      return null;
    }
  },

  /**
   * Get manager insights for the virtual manager
   * @param employeeId - Employee ID
   */
  getManagerInsights: async (employeeId: number) => {
    try {
      const response = await supabase.functions.invoke('manager-insights', {
        body: { employeeId },
      });
      
      if (response.error) throw response.error;
      
      return response.data || {
        priorityTasks: [
          {
            id: 1,
            title: 'Complete client deliverable',
            dueDate: '2023-08-15',
            status: 'in_progress'
          }
        ],
        suggestions: [
          'Consider breaking down the current task into smaller chunks',
          'Schedule a check-in with the client to verify requirements'
        ],
        workloadInsight: 'Your current workload is 20% higher than the previous week',
        timeManagement: {
          productive: 65,
          meetings: 20,
          administrative: 15
        },
        upcomingDeadlines: [
          {
            id: 5,
            title: 'Submit quarterly report',
            dueDate: '2023-08-20'
          }
        ]
      };
    } catch (error) {
      console.error('Error getting manager insights:', error);
      return {
        priorityTasks: [],
        suggestions: [],
        workloadInsight: '',
        timeManagement: { productive: 0, meetings: 0, administrative: 0 },
        upcomingDeadlines: []
      };
    }
  }
};

export default aiService;
