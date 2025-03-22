
import { PlatformMessage } from '@/utils/platformIntegrations';
import { aiService } from './aiService';
import { toast } from 'sonner';

/**
 * Service for analyzing platform messages using AI
 */
export class PlatformAnalysisService {
  /**
   * Analyzes messages from a platform to extract requirements and insights
   */
  async analyzeMessages(messages: PlatformMessage[]): Promise<any> {
    try {
      if (!messages || messages.length === 0) {
        return {
          requirements: [],
          sentiment: 'neutral',
          priority: 'medium',
          suggested_tasks: []
        };
      }
      
      // Format messages for analysis
      const messageText = messages
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .map(msg => `[${msg.platform}] ${msg.sender} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`)
        .join('\n\n');
      
      // Use the AI service to analyze the text
      const analysis = await aiService.analyzeClientInput(messageText);
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing platform messages:', error);
      toast.error('Failed to analyze messages');
      return {
        requirements: [],
        sentiment: 'neutral',
        priority: 'medium',
        suggested_tasks: []
      };
    }
  }
  
  /**
   * Generates task suggestions based on platform messages
   */
  async generateTaskSuggestions(messages: PlatformMessage[], clientId?: number): Promise<any> {
    try {
      if (!messages || messages.length === 0) {
        return {
          suggested_tasks: []
        };
      }
      
      // Format messages for analysis
      const messageText = messages
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .map(msg => `[${msg.platform}] ${msg.sender} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`)
        .join('\n\n');
      
      // Use the AI service to generate task suggestions
      const suggestions = await aiService.generateSuggestedTasks(messageText, clientId);
      
      return suggestions;
    } catch (error) {
      console.error('Error generating task suggestions:', error);
      toast.error('Failed to generate task suggestions');
      return {
        suggested_tasks: []
      };
    }
  }

  /**
   * Extracts context information from platform messages for the AI assistant
   */
  async extractContextFromMessages(messages: PlatformMessage[]): Promise<any> {
    try {
      if (!messages || messages.length === 0) {
        return {
          topics: [],
          key_entities: [],
          timeline: [],
          sentiment_overview: 'neutral'
        };
      }
      
      // Format messages for analysis
      const messageText = messages
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .map(msg => `[${msg.platform}] ${msg.sender} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`)
        .join('\n\n');
      
      // Use AI to extract structured context - falls back to mock data if API fails
      const result = await aiService.extractContextData(messageText);
      
      return result;
    } catch (error) {
      console.error('Error extracting context from messages:', error);
      return {
        topics: ['Communication', 'Requirements', 'Feedback'],
        key_entities: [{name: 'Project', type: 'work'}, {name: 'Client', type: 'person'}],
        timeline: [],
        sentiment_overview: 'neutral'
      };
    }
  }
}

export const platformAnalysisService = new PlatformAnalysisService();

export default platformAnalysisService;
