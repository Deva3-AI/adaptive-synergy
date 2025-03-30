
import { supabase } from '@/integrations/supabase/client';

/**
 * AI service for managing AI-related operations
 */
const aiService = {
  /**
   * Analyze requirements from input text
   */
  analyzeRequirements: async (input: string) => {
    try {
      // Simulate AI analysis with mock data
      // In a real app, this would call an AI service
      const mockAnalysis = {
        sentiment: Math.random() > 0.7 ? 'positive' : Math.random() > 0.5 ? 'neutral' : 'negative',
        priority_level: Math.random() > 0.7 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low',
        key_requirements: [
          'Responsive layout',
          'Brand color consistency',
          'Mobile optimization',
          'Fast loading times',
          'User-friendly navigation'
        ].slice(0, Math.floor(Math.random() * 5) + 1)
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return mockAnalysis;
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      throw error;
    }
  },
  
  /**
   * Get client-specific AI insights
   */
  getClientInsights: async (clientId: number) => {
    try {
      // Fetch client data for context
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      if (clientError) throw clientError;
      
      // Fetch client preferences
      const { data: clientPreferences, error: prefError } = await supabase
        .from('client_preferences')
        .select('*')
        .eq('client_id', clientId)
        .single();
      
      // Mock AI-generated insights based on client data
      const insights = {
        communication_style: `Based on past interactions, this client prefers ${clientPreferences?.preferred_contact_method || 'email'} communication with ${clientPreferences?.communication_frequency || 'weekly'} updates.`,
        design_preferences: `This client typically favors ${clientPreferences?.design_preferences?.style || 'modern'} design aesthetics.`,
        dos: clientPreferences?.dos || ['Be responsive', 'Provide regular updates'],
        donts: clientPreferences?.donts || ['Avoid technical jargon', 'Don\'t miss deadlines'],
        improvement_suggestions: [
          'Consider sending updates more frequently',
          'Include more visual examples in proposals',
          'Schedule regular feedback sessions'
        ]
      };
      
      return insights;
    } catch (error) {
      console.error(`Error getting AI insights for client ${clientId}:`, error);
      return {
        communication_style: 'No data available',
        design_preferences: 'No data available',
        dos: [],
        donts: [],
        improvement_suggestions: []
      };
    }
  },
  
  /**
   * Generate personalized task recommendations for a user
   */
  getAITaskRecommendations: async (userId: number) => {
    try {
      // Fetch user's past tasks for context
      const { data: userTasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (tasksError) throw tasksError;
      
      // Mock AI-generated task recommendations
      const mockRecommendations = [
        {
          task_id: 1001,
          title: 'Review client feedback on landing page',
          description: 'Client has sent feedback on the new landing page design. Review and prepare implementation plan.',
          priority: 'high',
          estimated_time: 1.5,
          status: 'pending'
        },
        {
          task_id: 1002,
          title: 'Update brand guidelines document',
          description: 'Several new brand elements have been developed in recent projects. Update the central guidelines to reflect these changes.',
          priority: 'medium',
          estimated_time: 2,
          status: 'pending'
        },
        {
          task_id: 1003,
          title: 'Prepare weekly progress report',
          description: 'Compile status updates for all active projects into a weekly summary for management review.',
          priority: 'medium',
          estimated_time: 1,
          status: 'pending'
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockRecommendations;
    } catch (error) {
      console.error(`Error getting AI task recommendations for user ${userId}:`, error);
      return [];
    }
  },
  
  /**
   * Get insights for a specific task
   */
  getTaskInsights: async (taskId: number) => {
    try {
      // Fetch task data
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .select(`
          *,
          clients (*)
        `)
        .eq('task_id', taskId)
        .single();
      
      if (taskError) throw taskError;
      
      // Mock AI-generated insights
      const insights = {
        estimated_completion_time: Math.round((taskData.estimated_time || 2) * (Math.random() * 0.4 + 0.8) * 10) / 10, // Slight variation around estimated time
        complexity_score: Math.round(Math.random() * 100),
        similar_tasks_avg_time: Math.round((taskData.estimated_time || 2) * (Math.random() * 0.6 + 0.7) * 10) / 10,
        suggested_approaches: [
          'Break this task into smaller sub-tasks for better tracking',
          'Consider referencing similar past projects for efficiency',
          'Schedule a brief check-in halfway through the task timeline'
        ],
        potential_challenges: [
          'This type of task has historically required more client feedback than initially expected',
          'Technical complexity may be higher than appears at first glance',
          'Resource coordination might be needed for timely completion'
        ]
      };
      
      return insights;
    } catch (error) {
      console.error(`Error getting AI insights for task ${taskId}:`, error);
      return null;
    }
  },
  
  /**
   * Analyze communication with a client
   */
  analyzeClientCommunication: async (clientId: number) => {
    try {
      // Fetch recent communication logs
      const { data: commLogs, error: commError } = await supabase
        .from('communication_logs')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (commError) throw commError;
      
      // Mock AI analysis of communication patterns
      const analysis = {
        response_time_avg: Math.round(Math.random() * 24 * 10) / 10, // Random hours between 0-24
        sentiment_trend: Math.random() > 0.7 ? 'increasingly positive' : Math.random() > 0.4 ? 'stable' : 'declining',
        common_topics: ['design feedback', 'timeline updates', 'budget discussions'],
        suggested_improvements: [
          'Consider more frequent status updates',
          'Proactively address potential timeline concerns',
          'Include more visual examples in communications'
        ],
        communication_quality_score: Math.round(Math.random() * 40 + 60) // Score between 60-100
      };
      
      return analysis;
    } catch (error) {
      console.error(`Error analyzing client communication for client ${clientId}:`, error);
      return null;
    }
  },
  
  /**
   * Get virtual manager insights
   */
  getManagerInsights: async ({ clientId, userId, taskId }: { clientId?: number, userId?: number, taskId?: number }) => {
    try {
      let insights = [];
      
      // Add client-specific insights if clientId is provided
      if (clientId) {
        // Fetch client preferences
        const { data: clientPreferences, error: prefError } = await supabase
          .from('client_preferences')
          .select('*')
          .eq('client_id', clientId)
          .single();
        
        if (clientPreferences) {
          // Add insights based on client preferences
          if (clientPreferences.dos && clientPreferences.dos.length > 0) {
            insights.push({
              type: 'reminder',
              category: 'client_preference',
              title: 'Client Do\'s',
              content: `Remember: ${clientPreferences.dos.join(', ')}`,
              importance: 'medium'
            });
          }
          
          if (clientPreferences.donts && clientPreferences.donts.length > 0) {
            insights.push({
              type: 'warning',
              category: 'client_preference',
              title: 'Client Don\'ts',
              content: `Avoid: ${clientPreferences.donts.join(', ')}`,
              importance: 'high'
            });
          }
        }
      }
      
      // Add task-specific insights if taskId is provided
      if (taskId) {
        // Fetch task details
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('task_id', taskId)
          .single();
        
        if (taskData) {
          // Check if the task might be at risk of delay
          const today = new Date();
          const dueDate = taskData.end_time ? new Date(taskData.end_time) : null;
          
          if (dueDate && dueDate.getTime() - today.getTime() < 2 * 24 * 60 * 60 * 1000) { // Less than 2 days remaining
            insights.push({
              type: 'alert',
              category: 'deadline',
              title: 'Approaching Deadline',
              content: `This task is due in less than 2 days`,
              importance: 'high'
            });
          }
        }
      }
      
      // Add some general insights
      insights.push({
        type: 'suggestion',
        category: 'productivity',
        title: 'Productivity Tip',
        content: 'Consider using time blocking to improve focus on complex tasks',
        importance: 'low'
      });
      
      // Add personalized insights if userId is provided
      if (userId) {
        insights.push({
          type: 'reminder',
          category: 'personal',
          title: 'Weekly Report Due',
          content: 'Remember to submit your weekly progress report by Friday',
          importance: 'medium'
        });
      }
      
      return insights;
    } catch (error) {
      console.error('Error getting manager insights:', error);
      return [];
    }
  },
  
  /**
   * Get a response from the AI assistant
   */
  getResponse: async (query: string) => {
    try {
      // In a production app, this would call an actual AI service API
      // For now, we'll simulate with mock responses
      
      // Simple keyword matching for demo purposes
      const lowercaseQuery = query.toLowerCase();
      let response = '';
      
      if (lowercaseQuery.includes('hello') || lowercaseQuery.includes('hi')) {
        response = "Hello! I'm your AI assistant. How can I help you today?";
      } else if (lowercaseQuery.includes('task') && lowercaseQuery.includes('recommend')) {
        response = "Based on your current workload and skills, I recommend focusing on the client feedback task first, as it has the highest priority and shortest timeline.";
      } else if (lowercaseQuery.includes('client') && (lowercaseQuery.includes('preference') || lowercaseQuery.includes('like'))) {
        response = "This client typically prefers modern design with minimalist aesthetics. They value timely communication and detailed progress reports. Their feedback cycle is usually weekly.";
      } else if (lowercaseQuery.includes('deadline') || lowercaseQuery.includes('overdue')) {
        response = "You have 3 upcoming deadlines this week. The most urgent is the website mockup for Client X due tomorrow at 5PM.";
      } else if (lowercaseQuery.includes('performance') || lowercaseQuery.includes('productivity')) {
        response = "Your task completion rate is 15% above average this month. Your strongest area is design implementation, while project documentation has opportunity for improvement.";
      } else if (lowercaseQuery.includes('summary') || lowercaseQuery.includes('overview')) {
        response = "Currently, you have 7 active tasks across 3 different clients. Your workload is approximately 85% of your ideal capacity based on historical data. Two tasks require attention in the next 48 hours.";
      } else {
        response = "I understand you're asking about " + query.substring(0, 30) + "... To give you the most helpful answer, could you provide a bit more context or specify what aspect you're interested in?";
      }
      
      // Simulate a delay for a more realistic AI response experience
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { response };
    } catch (error) {
      console.error('Error getting AI response:', error);
      return { 
        response: "I'm sorry, I encountered an error processing your request. Please try again later." 
      };
    }
  }
};

export default aiService;
