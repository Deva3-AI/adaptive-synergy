
import { supabase } from '@/integrations/supabase/client';
import { analyzeClientInput, generateSuggestedTasks, getManagerInsights, analyzeClientCommunication, getTaskInsights, getTaskRecommendations } from '@/utils/aiUtils';

// Get client preferences from Supabase
export const getClientPreferences = async (clientId: number) => {
  try {
    const { data, error } = await supabase
      .from('client_preferences')
      .select('*')
      .eq('client_id', clientId)
      .single();
    
    if (error) {
      // Return mock data if no preferences found (for development)
      console.warn('No client preferences found:', error.message);
      return {
        id: 0,
        client_id: clientId,
        preferred_contact_method: 'email',
        communication_frequency: 'weekly',
        design_preferences: {
          colors: ['#3366FF', '#FF6633', '#FFFFFF'],
          style: 'modern',
          fonts: ['Roboto', 'Open Sans']
        },
        industry_specific_requirements: {
          sector: 'Technology',
          target_audience: 'B2B',
          compliance: ['GDPR', 'CCPA']
        },
        dos: [
          'Use high-contrast colors',
          'Include multiple CTAs',
          'Focus on data-driven features'
        ],
        donts: [
          'Avoid complex animations',
          'Don\'t use script fonts',
          'Avoid stock photos when possible'
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    // If data.dos or data.donts don't exist (since they're not in the schema),
    // add them from the design_preferences JSON field as a mock
    if (data) {
      const designPreferences = data.design_preferences || {};
      return {
        ...data,
        dos: designPreferences.dos || [],
        donts: designPreferences.donts || []
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching client preferences:', error);
    throw error;
  }
};

// Analyze client requirements
export const analyzeRequirements = async (input: string) => {
  try {
    return await analyzeClientInput(input);
  } catch (error) {
    console.error('Error analyzing client requirements:', error);
    throw error;
  }
};

// Generate suggested tasks based on client requirements
export const generateTasks = async (input: string, clientId: number) => {
  try {
    // Get client preferences for context
    const preferences = await getClientPreferences(clientId);
    
    return await generateSuggestedTasks(input, clientId);
  } catch (error) {
    console.error('Error generating tasks:', error);
    throw error;
  }
};

// Get manager insights for a client or task
export const getAIManagerInsights = async (params: { clientId: number, taskId?: number }) => {
  try {
    return await getManagerInsights(params);
  } catch (error) {
    console.error('Error getting manager insights:', error);
    throw error;
  }
};

// Analyze client communications
export const analyzeClientCommunications = async (clientId: number) => {
  try {
    return await analyzeClientCommunication(clientId);
  } catch (error) {
    console.error('Error analyzing client communications:', error);
    throw error;
  }
};

// Get AI insights for a task
export const getAITaskInsights = async (taskId: number) => {
  try {
    return await getTaskInsights(taskId);
  } catch (error) {
    console.error('Error getting task insights:', error);
    throw error;
  }
};

// Get AI task recommendations for a user
export const getAITaskRecommendations = async (userId: number) => {
  try {
    return await getTaskRecommendations(userId);
  } catch (error) {
    console.error('Error getting task recommendations:', error);
    throw error;
  }
};

// Create a mock taskService file
export default {
  getClientPreferences,
  analyzeRequirements,
  generateTasks,
  getAIManagerInsights,
  analyzeClientCommunications,
  getAITaskInsights,
  getAITaskRecommendations
};
