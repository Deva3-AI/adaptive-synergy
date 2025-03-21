
/**
 * AI Utilities for performing AI-related operations throughout the application
 */
import axios from 'axios';
import { toast } from 'sonner';

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
  return callAIService({
    endpoint: 'analyze-client-input',
    data: { text, client_history: clientHistory },
  });
};

/**
 * Predicts task timeline based on task description and historical data
 */
export const predictTaskTimeline = async (taskDescription: string, clientHistory?: any[]) => {
  return callAIService({
    endpoint: 'predict-task-timeline',
    data: { task_description: taskDescription, client_history: clientHistory },
  });
};

/**
 * Analyzes meeting transcript to extract summary, action items, and insights
 */
export const analyzeMeetingTranscript = async (transcript: string, meetingType: string) => {
  return callAIService({
    endpoint: 'analyze-meeting-transcript',
    data: { transcript, meeting_type: meetingType },
  });
};

/**
 * Generates marketing insights from campaign data
 */
export const generateMarketingInsights = async (campaignData: any, marketSegment?: string) => {
  return callAIService({
    endpoint: 'generate-marketing-insights',
    data: { campaign_data: campaignData, market_segment: marketSegment },
  });
};

/**
 * Analyzes financial data to generate insights and predictions
 */
export const analyzeFinancialData = async (financialRecords: any[]) => {
  return callAIService({
    endpoint: 'analyze-financial-data',
    data: { financial_records: financialRecords },
  });
};

/**
 * Analyzes employee performance based on attendance and task completion
 */
export const analyzeEmployeePerformance = async (attendanceData: any[], taskData: any[]) => {
  return callAIService({
    endpoint: 'analyze-employee-performance',
    data: { attendance_data: attendanceData, task_data: taskData },
  });
};

/**
 * Generates suggested tasks based on client requirements
 */
export const generateSuggestedTasks = async (clientRequirements: string, clientId?: number) => {
  return callAIService({
    endpoint: 'generate-suggested-tasks',
    data: { 
      client_requirements: clientRequirements,
      client_id: clientId
    },
  });
};

/**
 * Generates performance improvement insights for employees
 */
export const generatePerformanceInsights = async (employeeId: number) => {
  return callAIService({
    endpoint: 'generate-performance-insights',
    data: { employee_id: employeeId },
  });
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
