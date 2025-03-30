
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
          priority: "Medium",
          estimated_time: 1.5,
          status: "pending"
        },
        {
          task_id: 10002,
          title: "Prepare weekly progress report",
          description: "Your task history shows you typically prepare reports on this day of the week.",
          priority: "High",
          estimated_time: 2,
          status: "pending"
        },
        {
          task_id: 10003,
          title: "Update project documentation",
          description: "Several tasks were recently completed without documentation updates.",
          priority: "Low",
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
      // This would normally use NLP to analyze client communications
      // Return mock data for demonstration
      return {
        communication_style: "Formal",
        preferred_feedback_method: "Email",
        response_time_expectation: "Within 24 hours",
        key_priorities: ["Quality", "Timeliness", "Detail-oriented"],
        common_revisions: ["Logo size adjustments", "Color palette refinements", "Copy edits"]
      };
    } catch (error) {
      console.error(`Error analyzing client communication for client ${clientId}:`, error);
      return null;
    }
  }
};

export default aiService;
