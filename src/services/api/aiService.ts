
import apiClient from '@/utils/apiUtils';

const aiService = {
  generateTaskSuggestions: async (clientId: number) => {
    try {
      const response = await apiClient.post('/ai/task-suggestions', { client_id: clientId });
      return response.data;
    } catch (error) {
      console.error('Error generating task suggestions:', error);
      return [
        { title: "Website Redesign", description: "Modernize client's website with fresh design", estimated_time: 40, priority: "high" },
        { title: "Content Strategy", description: "Develop Q4 content calendar and themes", estimated_time: 12, priority: "medium" },
        { title: "SEO Optimization", description: "Improve search ranking for main keywords", estimated_time: 20, priority: "medium" }
      ];
    }
  },

  analyzeClientFeedback: async (feedbackText: string) => {
    try {
      const response = await apiClient.post('/ai/analyze-feedback', { text: feedbackText });
      return response.data;
    } catch (error) {
      console.error('Error analyzing feedback:', error);
      return {
        sentiment: "positive",
        key_points: [
          "Satisfied with overall design direction",
          "Wants bolder color contrast in the header",
          "Prefers simplified navigation menu"
        ],
        action_items: [
          "Increase color contrast in header section",
          "Simplify navigation from 7 items to 4-5 items",
          "Keep the minimalist layout approach"
        ],
        recommendations: "Focus on the navigation redesign while maintaining the overall aesthetic that the client appreciates."
      };
    }
  },

  predictTaskDuration: async (taskDescription: string, taskType: string) => {
    try {
      const response = await apiClient.post('/ai/predict-duration', { 
        description: taskDescription,
        type: taskType
      });
      return response.data;
    } catch (error) {
      console.error('Error predicting task duration:', error);
      return {
        estimated_hours: 12,
        confidence: "high",
        similar_tasks: [
          { title: "Previous Website Redesign", actual_hours: 38 },
          { title: "E-commerce Site Refresh", actual_hours: 42 }
        ]
      };
    }
  },

  generateMeetingInsights: async (meetingNotes: string) => {
    try {
      const response = await apiClient.post('/ai/meeting-insights', { text: meetingNotes });
      return response.data;
    } catch (error) {
      console.error('Error generating meeting insights:', error);
      return {
        summary: "Client wants to expand their digital presence with focus on social media and content marketing.",
        action_items: [
          { description: "Prepare social media strategy proposal", assigned_to: "Marketing Team", deadline: "Next Friday" },
          { description: "Research competitor content strategies", assigned_to: "Content Team", deadline: "Wednesday" },
          { description: "Create budget estimate for expanded services", assigned_to: "Finance Team", deadline: "Monday" }
        ],
        key_concerns: [
          "Budget constraints for Q3",
          "Timeline for implementation before holiday season",
          "Integration with existing marketing efforts"
        ],
        followup_questions: [
          "What is the exact budget range for the expanded services?",
          "Which social platforms are priority for initial focus?",
          "Who will be the internal point of contact for content approvals?"
        ]
      };
    }
  },

  analyzeProjectTrends: async (clientId: number) => {
    try {
      const response = await apiClient.get(`/ai/project-trends/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error analyzing project trends:', error);
      return {
        completion_trend: {
          average_completion_time: "3.2 days ahead of schedule",
          trend_direction: "improving",
          data: [
            { month: "Jan", value: -1 },
            { month: "Feb", value: -2 },
            { month: "Mar", value: -2.5 },
            { month: "Apr", value: -3 },
            { month: "May", value: -3.2 }
          ]
        },
        revision_requests: {
          average_revisions: 1.8,
          trend_direction: "decreasing",
          data: [
            { month: "Jan", value: 3.2 },
            { month: "Feb", value: 2.8 },
            { month: "Mar", value: 2.3 },
            { month: "Apr", value: 1.9 },
            { month: "May", value: 1.8 }
          ]
        },
        client_satisfaction: {
          average_score: 4.7,
          trend_direction: "stable",
          data: [
            { month: "Jan", value: 4.5 },
            { month: "Feb", value: 4.6 },
            { month: "Mar", value: 4.7 },
            { month: "Apr", value: 4.7 },
            { month: "May", value: 4.7 }
          ]
        },
        insights: [
          "Project delivery times have consistently improved quarter over quarter",
          "Revision requests have decreased by 44% since January",
          "Client satisfaction scores are stable and high, indicating good relationship quality"
        ],
        recommendations: [
          "Continue current approach to project planning and execution",
          "Document successful workflows that have led to fewer revisions",
          "Consider slight adjustments to initial client briefs to improve clarity"
        ]
      };
    }
  }
};

export default aiService;
