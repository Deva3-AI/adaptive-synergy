
import { supabase } from '@/integrations/supabase/client';

/**
 * AI Service for accessing AI-powered features
 */
const aiService = {
  /**
   * Get client preferences from the AI system
   */
  getClientPreferences: async (clientId: number) => {
    try {
      // First check if we have stored preferences
      const { data: preferences, error } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
        
      if (error) {
        console.error('Error fetching client preferences:', error);
        return null;
      }
      
      return preferences;
    } catch (error) {
      console.error('Error in getClientPreferences:', error);
      return null;
    }
  },
  
  /**
   * Analyze client requirements from text input
   */
  analyzeRequirements: async (input: string) => {
    try {
      // This would typically call an AI service API
      // For now, we're using a mock implementation
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      return {
        sentiment: input.toLowerCase().includes('urgent') ? 'urgent' : 'normal',
        priority_level: input.toLowerCase().includes('important') ? 'high' : 'medium',
        key_requirements: input.split('.').filter(item => item.trim().length > 10)
      };
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      return {
        sentiment: 'normal',
        priority_level: 'medium',
        key_requirements: []
      };
    }
  },
  
  /**
   * Get client communication analysis
   */
  analyzeClientCommunication: async (clientId: number) => {
    try {
      // This would typically call an AI service API
      // For now, we're returning mock data
      return {
        common_requests: [
          "Logo placement in top-right corner",
          "Use vibrant color palette",
          "Keep designs minimal and modern"
        ],
        communication_style: "Formal, prefers detailed explanations",
        response_time_preference: "Expects responses within 4 hours",
        insights: [
          "Client usually requests revisions on color choices",
          "Prefers clear timelines for deliverables",
          "Often references competitor websites"
        ]
      };
    } catch (error) {
      console.error('Error analyzing client communication:', error);
      return null;
    }
  },
  
  /**
   * Get task insights for a specific task
   */
  getTaskInsights: async (taskId: number) => {
    try {
      // First check if we have stored insights
      const { data: insights, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error('Error fetching task insights:', error);
        return null;
      }
      
      if (insights && insights.length > 0) {
        return insights[0];
      }
      
      // If no insights stored, generate new ones
      // This would call an AI service
      const mockInsight = {
        task_id: taskId,
        insight: "Based on past projects, this task may take 2-3 hours longer than estimated. Consider allocating additional time for client revisions.",
        created_at: new Date().toISOString()
      };
      
      return mockInsight;
    } catch (error) {
      console.error('Error in getTaskInsights:', error);
      return null;
    }
  },
  
  /**
   * Get Virtual Manager insights based on context
   */
  getManagerInsights: async ({ client_id, task_type, user_id }: { client_id?: number, task_type?: string, user_id?: number }) => {
    try {
      // This would typically call an AI service API
      // For now, we're returning mock data based on the parameters
      let insights = [];
      
      if (client_id) {
        // Get client-specific insights
        const { data: clientPrefs } = await supabase
          .from('client_preferences')
          .select('*')
          .eq('client_id', client_id)
          .single();
          
        if (clientPrefs) {
          // Format specific client dos and don'ts
          const clientDesignPrefs = clientPrefs.design_preferences || {};
          insights.push(`Client prefers ${clientDesignPrefs.style || 'modern'} design style`);
          
          if (clientPrefs.dos) {
            insights.push(`DO: ${clientPrefs.dos[0]}`);
          }
          
          if (clientPrefs.donts) {
            insights.push(`DON'T: ${clientPrefs.donts[0]}`);
          }
        }
      }
      
      if (task_type) {
        // Add task-type specific insights
        if (task_type.toLowerCase().includes('design')) {
          insights.push("Design tasks for this client typically require 2 revision cycles");
          insights.push("Check brand guidelines before submitting first draft");
        } else if (task_type.toLowerCase().includes('content')) {
          insights.push("Content should be approx. 500 words per section");
          insights.push("Include SEO keywords in headlines and first paragraph");
        }
      }
      
      if (user_id) {
        // Add user-specific insights
        const { data: tasks } = await supabase
          .from('tasks')
          .select('title, status, created_at')
          .eq('assigned_to', user_id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (tasks && tasks.length > 0) {
          insights.push(`You've completed ${tasks.length} similar tasks recently`);
          
          // Calculate average completion time
          insights.push("Your average completion time is faster than team average");
        }
      }
      
      // Add general insights if we don't have enough
      if (insights.length < 3) {
        insights.push("Schedule regular updates with the client throughout the task");
        insights.push("Document all client feedback for future reference");
      }
      
      return insights;
    } catch (error) {
      console.error('Error in getManagerInsights:', error);
      return ["Error retrieving insights. Check task details directly."];
    }
  },
  
  /**
   * Get AI task recommendations
   */
  getAITaskRecommendations: async (userId: number) => {
    try {
      // In a real app, this would call an AI service API
      // For now, return mock recommendations
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API call
      
      return [
        {
          task_id: 1001,
          title: "Optimize landing page for conversion",
          description: "Review and update the landing page content to improve conversion rates. Focus on call-to-action placement and value proposition clarity.",
          priority: "high",
          estimated_time: 3,
          status: "pending"
        },
        {
          task_id: 1002,
          title: "Create email newsletter template",
          description: "Design a reusable email template for the monthly newsletter that matches brand guidelines and has responsive design.",
          priority: "medium",
          estimated_time: 4,
          status: "pending"
        },
        {
          task_id: 1003,
          title: "Update product image gallery",
          description: "Refresh the product gallery with new images and optimize for faster loading. Ensure alt tags are descriptive for SEO.",
          priority: "medium",
          estimated_time: 2,
          status: "pending"
        }
      ];
    } catch (error) {
      console.error('Error in getAITaskRecommendations:', error);
      return [];
    }
  },
  
  /**
   * Get a response from the AI assistant
   */
  getResponse: async (userInput: string) => {
    try {
      // This would typically call an AI service API
      // For now, we're using a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Simple keyword-based responses
      if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
        return { response: "Hello! How can I assist you today with your work?" };
      } else if (userInput.toLowerCase().includes('task')) {
        return { 
          response: "I can help you manage tasks. Would you like me to help you prioritize your current tasks, or suggest new tasks based on your recent work?" 
        };
      } else if (userInput.toLowerCase().includes('client')) {
        return { 
          response: "To help with client work, I need to know which client you're referring to. Can you provide the client name or ID?" 
        };
      } else if (userInput.toLowerCase().includes('report')) {
        return { 
          response: "I can generate various reports for you. Would you like a task completion report, client interaction report, or something else?" 
        };
      } else {
        return { 
          response: "I'm here to help with your work. You can ask me about your tasks, clients, or request assistance with specific workflows." 
        };
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      return { response: "I'm sorry, I encountered an error processing your request. Please try again later." };
    }
  }
};

export default aiService;
