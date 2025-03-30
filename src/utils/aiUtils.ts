
import { clientPreferencesData, clientTasksData } from './mockData';

const aiUtils = {
  // Analyze client input to extract requirements, sentiment, and priority
  analyzeClientInput: async (text: string) => {
    try {
      // In a real application, this would call an AI service API
      // For demo purposes, we'll parse the text ourselves with some basic logic
      
      // Extract sentiment
      const positiveWords = ['love', 'great', 'excellent', 'amazing', 'good', 'vibrant', 'bold'];
      const negativeWords = ['dislike', 'bad', 'terrible', 'hate', 'awful', 'poor'];
      
      let sentiment = 'neutral';
      let positiveCount = 0;
      let negativeCount = 0;
      
      positiveWords.forEach(word => {
        if (text.toLowerCase().includes(word)) positiveCount++;
      });
      
      negativeWords.forEach(word => {
        if (text.toLowerCase().includes(word)) negativeCount++;
      });
      
      if (positiveCount > negativeCount) sentiment = 'positive';
      if (negativeCount > positiveCount) sentiment = 'negative';
      
      // Extract priority level
      let priority_level = 'medium';
      if (text.toLowerCase().includes('urgent') || 
          text.toLowerCase().includes('asap') || 
          text.toLowerCase().includes('immediately')) {
        priority_level = 'high';
      }
      
      // Extract key requirements
      const key_requirements = [];
      if (text.toLowerCase().includes('website')) key_requirements.push('Website Development');
      if (text.toLowerCase().includes('logo')) key_requirements.push('Logo Design');
      if (text.toLowerCase().includes('brand')) key_requirements.push('Branding');
      if (text.toLowerCase().includes('social media') || text.toLowerCase().includes('facebook') || text.toLowerCase().includes('instagram')) 
        key_requirements.push('Social Media');
      if (text.toLowerCase().includes('mobile') || text.toLowerCase().includes('responsive')) 
        key_requirements.push('Mobile Optimization');
      
      // If no specific requirements were detected, add a generic one
      if (key_requirements.length === 0) {
        key_requirements.push('General Marketing Services');
      }
      
      return {
        sentiment,
        priority_level,
        key_requirements
      };
    } catch (error) {
      console.error('Error analyzing client input:', error);
      return {
        sentiment: 'neutral',
        priority_level: 'medium',
        key_requirements: ['General Marketing Services']
      };
    }
  },

  // Generate suggested tasks based on client requirements
  generateSuggestedTasks: async (text: string, clientId?: number) => {
    try {
      // In a real app, this would use AI to generate tasks
      // For demo purposes, we'll use basic text matching
      
      const suggested_tasks = [];
      
      // Website related tasks
      if (text.toLowerCase().includes('website')) {
        suggested_tasks.push({
          title: 'Create website wireframes',
          description: 'Develop initial wireframes for client website based on requirements',
          estimated_time: 4,
          priority_level: 'high'
        });
        
        suggested_tasks.push({
          title: 'Design homepage mockup',
          description: 'Create visual design for homepage based on brand guidelines',
          estimated_time: 6,
          priority_level: 'medium'
        });
      }
      
      // Branding related tasks
      if (text.toLowerCase().includes('brand') || text.toLowerCase().includes('logo')) {
        suggested_tasks.push({
          title: 'Develop brand style guide',
          description: 'Create comprehensive brand guidelines including colors, typography, and usage rules',
          estimated_time: 8,
          priority_level: 'medium'
        });
        
        if (text.toLowerCase().includes('logo')) {
          suggested_tasks.push({
            title: 'Design logo concepts',
            description: 'Create 3-5 logo concepts based on client requirements',
            estimated_time: 5,
            priority_level: 'high'
          });
        }
      }
      
      // Social media related tasks
      if (text.toLowerCase().includes('social') || text.toLowerCase().includes('instagram') || text.toLowerCase().includes('facebook')) {
        suggested_tasks.push({
          title: 'Create social media content calendar',
          description: 'Develop 30-day content calendar for client social media accounts',
          estimated_time: 3,
          priority_level: 'medium'
        });
        
        suggested_tasks.push({
          title: 'Design social media templates',
          description: 'Create branded templates for various social media post types',
          estimated_time: 4,
          priority_level: 'low'
        });
      }
      
      // If no specific tasks were detected, add generic ones
      if (suggested_tasks.length === 0) {
        suggested_tasks.push({
          title: 'Initial client consultation',
          description: 'Schedule and conduct detailed requirements gathering session',
          estimated_time: 2,
          priority_level: 'high'
        });
        
        suggested_tasks.push({
          title: 'Develop project proposal',
          description: 'Create detailed project proposal based on client needs',
          estimated_time: 3,
          priority_level: 'medium'
        });
      }
      
      return {
        client_id: clientId,
        analysis: {
          key_themes: ['Design', 'Development', 'Marketing'],
          complexity: 'medium'
        },
        suggested_tasks
      };
    } catch (error) {
      console.error('Error generating suggested tasks:', error);
      return {
        client_id: clientId,
        suggested_tasks: [
          {
            title: 'Project planning',
            description: 'Define project scope and timeline',
            estimated_time: 2,
            priority_level: 'medium'
          }
        ]
      };
    }
  },
  
  // Get manager insights for an employee
  getManagerInsights: async ({ clientId, taskId }: { clientId?: number, taskId?: number }) => {
    try {
      // Simulate AI-generated insights
      let insights = [];
      
      // Add client-specific insights if client ID is provided
      if (clientId) {
        // Get mock client preferences
        const clientPreferences = clientPreferencesData.find(
          client => client.client_id === clientId
        );
        
        if (clientPreferences) {
          // Generate insights based on client preferences
          insights = [
            {
              id: `client-comm-${clientId}`,
              type: 'preference',
              content: `This client prefers ${clientPreferences.preferred_contact_method || 'email'} for communication with ${clientPreferences.communication_frequency || 'weekly'} updates.`,
              priority: 'medium',
              acknowledgable: true
            },
            {
              id: `client-feedback-${clientId}`,
              type: 'deadline',
              content: `Allow time for client feedback. They typically need 2-3 days to review deliverables.`,
              priority: 'medium',
              acknowledgable: true
            }
          ];
          
          // Add insights based on client dos and don'ts
          if (clientPreferences.dos && clientPreferences.dos.length > 0) {
            const randomDo = clientPreferences.dos[Math.floor(Math.random() * clientPreferences.dos.length)];
            insights.push({
              id: `client-do-${clientId}-${Date.now()}`,
              type: 'tip',
              content: `Remember to: ${randomDo}`,
              priority: 'medium',
              acknowledgable: true
            });
          }
          
          if (clientPreferences.donts && clientPreferences.donts.length > 0) {
            const randomDont = clientPreferences.donts[Math.floor(Math.random() * clientPreferences.donts.length)];
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
      
      // Add task-specific insights if task ID is provided
      if (taskId) {
        // Get mock task data
        const task = clientTasksData.find(t => t.task_id === taskId);
        
        if (task) {
          // Add insights about task deadline
          insights.push({
            id: `task-deadline-${taskId}`,
            type: 'deadline',
            content: task.end_time 
              ? `This task is due on ${new Date(task.end_time).toLocaleDateString()}. Plan accordingly.` 
              : `No specific deadline for this task, but aim to complete it within 5 days.`,
            priority: 'high',
            acknowledgable: false
          });
          
          // Add task strategy tip
          insights.push({
            id: `task-strategy-${taskId}`,
            type: 'tip',
            content: `Tasks like this one typically require review before submission. Schedule time for revisions.`,
            priority: 'low',
            acknowledgable: true
          });
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

export default aiUtils;
