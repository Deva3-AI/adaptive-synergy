
/**
 * AI Utilities for performing AI-related operations throughout the application
 */
import axios from 'axios';
import { toast } from 'sonner';
import { aiService } from '@/services/api/aiService';

interface AIRequestOptions {
  endpoint: string;
  data: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

// Base URL for AI API calls
const AI_API_BASE_URL = import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/ai';

/**
 * Makes a request to the AI API
 */
export const callAIService = async ({ endpoint, data, onSuccess, onError }: AIRequestOptions) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${AI_API_BASE_URL}/${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    
    if (onSuccess) {
      onSuccess(response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error calling AI service (${endpoint}):`, error);
    
    if (onError) {
      onError(error);
    } else {
      toast.error('AI service request failed. Please try again.');
    }
    
    throw error;
  }
};

/**
 * Analyzes client input to extract requirements, sentiment, and priority
 */
export const analyzeClientInput = async (text: string, clientHistory?: any[]) => {
  return aiService.analyzeClientInput(text, clientHistory);
};

/**
 * Predicts task timeline based on task description and historical data
 */
export const predictTaskTimeline = async (taskDescription: string, clientHistory?: any[]) => {
  try {
    return callAIService({
      endpoint: 'predict-task-timeline',
      data: { task_description: taskDescription, client_history: clientHistory },
    });
  } catch (error) {
    console.log('Error predicting task timeline, using fallback data');
    return {
      estimated_time: 8,
      task_complexity: "moderate",
      recommended_skills: ["development", "design", "content"],
      potential_challenges: ["Timeline constraints", "Technical complexity"]
    };
  }
};

/**
 * Analyzes meeting transcript to extract summary, action items, and insights
 */
export const analyzeMeetingTranscript = async (transcript: string, meetingType: string) => {
  return aiService.analyzeMeetingTranscript(transcript, meetingType);
};

/**
 * Generates marketing insights from campaign data
 */
export const generateMarketingInsights = async (campaignData: any, marketSegment?: string) => {
  return aiService.generateMarketingInsights(campaignData, marketSegment);
};

/**
 * Analyzes financial data to generate insights and predictions
 */
export const analyzeFinancialData = async (financialRecords: any[]) => {
  return aiService.analyzeFinancialData(financialRecords);
};

/**
 * Analyzes employee performance based on attendance and task completion
 */
export const analyzeEmployeePerformance = async (attendanceData: any[], taskData: any[]) => {
  return aiService.analyzeEmployeePerformance(attendanceData, taskData);
};

/**
 * Generates suggested tasks based on client requirements
 */
export const generateSuggestedTasks = async (clientRequirements: string, clientId?: number) => {
  return aiService.generateSuggestedTasks(clientRequirements, clientId);
};

/**
 * Generates performance improvement insights for employees
 */
export const generatePerformanceInsights = async (employeeId: number) => {
  return aiService.generatePerformanceInsights(employeeId);
};

export default {
  analyzeClientInput,
  predictTaskTimeline,
  analyzeMeetingTranscript,
  generateMarketingInsights,
  analyzeFinancialData,
  analyzeEmployeePerformance,
  generateSuggestedTasks,
  generatePerformanceInsights
};
