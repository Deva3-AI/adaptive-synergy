
import { supabase } from '@/integrations/supabase/client';

interface AIRequest {
  clientId?: number;
  taskId?: number;
  userId?: number;
  input?: string;
}

interface AIResponse {
  response: string;
}

/**
 * Service for AI-related API calls
 */
const aiService = {
  /**
   * Analyze client requirements from input text
   */
  analyzeRequirements: async (input: string) => {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        sentiment: "positive",
        priority_level: "high",
        key_requirements: [
          "Responsive design",
          "Mobile compatibility",
          "Dark mode support",
          "Fast loading times"
        ]
      };
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      throw error;
    }
  },
  
  /**
   * Get client-specific insights
   */
  getClientInsights: async (clientId: number) => {
    try {
      // First, get client preferences from the database
      const { data: preferences, error } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (error) throw error;
      
      // Generate insights (in a real app, this would call an AI service)
      const insights = {
        communication_style: "Prefers detailed email updates twice a week",
        design_preferences: "Modern, minimalist design with dark mode option",
        dos: ["Send weekly updates", "Provide detailed documentation", "Include visual mockups"],
        donts: ["Make major changes without approval", "Use jargon", "Miss deadlines"],
        improvement_suggestions: [
          "Include more visual examples in presentations",
          "Schedule regular video calls for complex topics",
          "Provide earlier notice for deadline adjustments"
        ]
      };
      
      return insights;
    } catch (error) {
      console.error('Error getting client insights:', error);
      throw error;
    }
  },
  
  /**
   * Get task recommendations for a user
   */
  getAITaskRecommendations: async (userId: number) => {
    try {
      // Mock implementation - in a real app this would use ML to analyze previous tasks
      // and suggest new ones or optimized work patterns
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return [
        {
          task_id: 101,
          title: "Optimize landing page performance",
          description: "The client's landing page needs performance tuning. Focus on image optimization and lazy loading.",
          priority: "high",
          estimated_time: 3,
          status: "pending"
        },
        {
          task_id: 102,
          title: "Update client branding assets",
          description: "Client has requested a refresh of their logo usage across all platforms.",
          priority: "medium",
          estimated_time: 2,
          status: "pending"
        },
        {
          task_id: 103,
          title: "Create responsive email template",
          description: "Design and develop a responsive email template for the client's newsletter.",
          priority: "low",
          estimated_time: 4,
          status: "pending"
        }
      ];
    } catch (error) {
      console.error('Error getting task recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Get insights for a task
   */
  getTaskInsights: async (taskId: number) => {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        estimated_completion_time: "3.5 hours",
        similar_tasks: [
          { id: 45, title: "Update product catalog", completion_time: "2h 40m" },
          { id: 62, title: "Revise homepage layout", completion_time: "3h 15m" }
        ],
        suggested_approach: [
          "Break down the task into smaller components",
          "Start with wireframing before moving to high-fidelity",
          "Use the client's existing color palette for consistency"
        ],
        potential_challenges: [
          "Client has frequently requested revisions on previous similar tasks",
          "Integration with their CMS might require additional time"
        ]
      };
    } catch (error) {
      console.error(`Error getting task insights for task ${taskId}:`, error);
      throw error;
    }
  },
  
  /**
   * Analyze client communication patterns
   */
  analyzeClientCommunication: async (clientId: number) => {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return {
        communication_frequency: "High (15 messages per week)",
        response_time: "Average 2.5 hours",
        common_topics: ["Design feedback", "Timeline inquiries", "Feature requests"],
        sentiment_trend: "Mostly positive with occasional concerns about deadlines",
        suggested_actions: [
          "Pre-emptively address timeline in updates",
          "Include more visual progress updates",
          "Schedule a monthly review call"
        ]
      };
    } catch (error) {
      console.error(`Error analyzing communication for client ${clientId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get virtual manager insights
   */
  getManagerInsights: async ({ clientId, taskId }: AIRequest) => {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 900));
      
      return {
        insights: [
          "Client typically prefers weekly updates on Thursdays",
          "Similar projects have averaged 15% over initial time estimates",
          "Client responds well to visual examples and mockups",
          "Previous feedback indicates emphasis on mobile responsiveness"
        ],
        warnings: [
          "Client has rejected designs with dark color schemes in the past",
          "Budget constraints mentioned in recent communications"
        ],
        suggestions: [
          "Include before/after examples in your presentations",
          "Schedule intermediate check-ins for feedback on complex features",
          "Document all client-requested changes with timestamps",
          "Prepare alternative design options for potentially controversial elements"
        ]
      };
    } catch (error) {
      console.error('Error getting manager insights:', error);
      throw error;
    }
  },
  
  /**
   * Get response from AI Assistant
   */
  getResponse: async (input: string): Promise<AIResponse> => {
    try {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Simple response logic based on input keywords
      let responseText = "";
      
      if (input.includes("deadline") || input.includes("due date")) {
        responseText = "I recommend setting a clear timeline with buffer days for revisions. Based on similar tasks, you'll likely need 3-5 business days.";
      } else if (input.includes("budget") || input.includes("cost")) {
        responseText = "Looking at similar projects, the estimated cost would be $1,500-2,000. I suggest breaking this down into design, development, and testing phases in your proposal.";
      } else if (input.includes("client") || input.includes("feedback")) {
        responseText = "This client typically provides detailed feedback within 24 hours. Their primary concerns tend to be mobile responsiveness and load times.";
      } else {
        responseText = "I need more specific information to provide helpful guidance. Could you clarify what aspect of the project you need assistance with?";
      }
      
      return { response: responseText };
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  }
};

export default aiService;
