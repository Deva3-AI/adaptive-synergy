
import { supabase } from '@/integrations/supabase/client';

const aiService = {
  // Get AI-generated task recommendations for a specific user
  getTaskRecommendations: async (userId: number) => {
    try {
      // In a real implementation, this would use AI to generate personalized task recommendations
      // For now, we'll return mock data that looks reasonable
      
      // First get the user's existing tasks to provide context
      const { data: userTasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', userId)
        .limit(5);
        
      if (error) throw error;
      
      // Mock recommendations based on existing tasks
      const mockRecommendations = [
        {
          task_id: 10001, // Use high IDs to avoid conflicts with real tasks
          title: "Follow up with recent clients",
          description: "Based on your recent task completions, it's a good time to reach out to clients for feedback.",
          priority: "medium",
          estimated_time: 1.5,
          status: "pending"
        },
        {
          task_id: 10002,
          title: "Prepare weekly progress report",
          description: "Your task history shows you typically prepare reports on this day of the week.",
          priority: "high",
          estimated_time: 2,
          status: "pending"
        },
        {
          task_id: 10003,
          title: "Update project documentation",
          description: "Several tasks were recently completed without documentation updates.",
          priority: "low",
          estimated_time: 1,
          status: "pending"
        }
      ];
      
      return mockRecommendations;
    } catch (error) {
      console.error('Error generating task recommendations:', error);
      return [];
    }
  },
  
  // Get AI insights for a specific task
  getTaskInsights: async (taskId: number) => {
    try {
      // In a real implementation, we would analyze the task and related data
      // For demonstration, return mock insights
      return {
        efficiency_score: 85,
        similar_tasks: [
          { id: 123, title: "Similar task from last month", completion_time: 2.5 },
          { id: 456, title: "Related task with same client", completion_time: 3.2 }
        ],
        recommendations: [
          "Based on historical data, this task may take 15% longer than estimated",
          "Consider breaking this into smaller sub-tasks for better tracking",
          "This client typically requires 2 rounds of revisions"
        ]
      };
    } catch (error) {
      console.error(`Error getting insights for task ${taskId}:`, error);
      return null;
    }
  },
  
  // Analyze client communication to extract preferences
  analyzeClientCommunication: async (clientId: number) => {
    try {
      // Get client preferences to provide context
      const { data: preferences, error: preferencesError } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
        
      if (preferencesError && preferencesError.code !== 'PGRST116') {
        throw preferencesError;
      }
      
      // Get recent communications
      const { data: communications, error: communicationsError } = await supabase
        .from('communication_logs')
        .select('message, channel')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (communicationsError) throw communicationsError;
      
      // This would normally use NLP to analyze client communications
      // Return mock data for demonstration
      return {
        communication_style: "Formal",
        preferred_feedback_method: preferences?.preferred_contact_method || "Email",
        response_time_expectation: "Within 24 hours",
        key_priorities: ["Quality", "Timeliness", "Detail-oriented", "Mobile responsiveness"],
        common_revisions: ["Logo size adjustments", "Color palette refinements", "Copy edits", "Font changes"],
        sentiment: "Positive",
        dos: preferences?.dos || ["Provide detailed progress reports", "Adhere to brand guidelines"],
        donts: preferences?.donts || ["Make design decisions without approval", "Miss deadlines"]
      };
    } catch (error) {
      console.error(`Error analyzing client communication for client ${clientId}:`, error);
      
      // Return fallback mock data in case of error
      return {
        communication_style: "Formal",
        preferred_feedback_method: "Email",
        response_time_expectation: "Within 24 hours",
        key_priorities: ["Quality", "Timeliness"],
        common_revisions: ["Logo size adjustments", "Copy edits"],
        sentiment: "Neutral"
      };
    }
  },
  
  // Get manager insights for an employee working on specific tasks
  getManagerInsights: async ({ clientId, taskId }: { clientId?: number, taskId?: number }) => {
    try {
      let insights = [];
      
      if (clientId) {
        // Get client-specific insights
        const clientResult = await this.analyzeClientCommunication(clientId);
        
        if (clientResult) {
          // Generate insights based on client preferences
          insights = [
            {
              id: `client-style-${clientId}`,
              type: 'preference',
              content: `This client prefers a ${clientResult.communication_style.toLowerCase()} communication style. Keep your messages professional and structured.`,
              priority: 'medium',
              acknowledgable: true
            },
            {
              id: `client-response-${clientId}`,
              type: 'deadline',
              content: `The client expects responses ${clientResult.response_time_expectation.toLowerCase()}. Make this a priority.`,
              priority: 'high',
              acknowledgable: true
            }
          ];
          
          // Add insights based on client dos and don'ts
          if (clientResult.dos && clientResult.dos.length > 0) {
            const randomDo = clientResult.dos[Math.floor(Math.random() * clientResult.dos.length)];
            insights.push({
              id: `client-do-${clientId}-${Date.now()}`,
              type: 'tip',
              content: `Remember to: ${randomDo}`,
              priority: 'medium',
              acknowledgable: true
            });
          }
          
          if (clientResult.donts && clientResult.donts.length > 0) {
            const randomDont = clientResult.donts[Math.floor(Math.random() * clientResult.donts.length)];
            insights.push({
              id: `client-dont-${clientId}-${Date.now()}`,
              type: 'warning',
              content: `Avoid: ${randomDont}`,
              priority: 'high',
              acknowledgable: true
            });
          }
        }
      }
      
      if (taskId) {
        // Add task-specific insights
        const taskInsights = await this.getTaskInsights(taskId);
        
        if (taskInsights) {
          // Add insights about task duration and complexity
          insights.push({
            id: `task-time-${taskId}`,
            type: 'deadline',
            content: taskInsights.recommendations[0] || "Monitor time spent on this task carefully based on past performance.",
            priority: 'medium',
            acknowledgable: false
          });
          
          // Add task recommendation
          if (taskInsights.recommendations.length > 1) {
            insights.push({
              id: `task-strategy-${taskId}`,
              type: 'tip',
              content: taskInsights.recommendations[1],
              priority: 'low',
              acknowledgable: true
            });
          }
        }
      }
      
      // Add some general insights if we don't have many
      if (insights.length < 3) {
        insights.push({
          id: `general-tip-${Date.now()}`,
          type: 'tip',
          content: "Consider breaking your work into focused 90-minute sessions for optimal productivity.",
          priority: 'low',
          acknowledgable: false
        });
      }
      
      return insights;
    } catch (error) {
      console.error('Error generating manager insights:', error);
      
      // Return fallback insights in case of error
      return [
        {
          id: `fallback-1`,
          type: 'tip',
          content: "Document your progress regularly to maintain clear communication with clients and team members.",
          priority: 'medium',
          acknowledgable: false
        },
        {
          id: `fallback-2`,
          type: 'deadline',
          content: "Schedule regular breaks to maintain productivity throughout the day.",
          priority: 'low',
          acknowledgable: false
        }
      ];
    }
  }
};

export default aiService;
