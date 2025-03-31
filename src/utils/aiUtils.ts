import { mockUserData } from './mockData';
import { mockFinanceData } from './mockData';
import { mockClientData } from './mockData';
import { mockTaskData } from './mockData';
import { mockClientFeedbackData } from './mockData';
import { mockEmployeePerformanceData } from './mockData';
import { mockMeetingAnalysisData } from './mockData';

// Define AI utility functions for generating insights

// Client preference analysis
export const analyzeClientPreferences = (clientName: string) => {
  // In a real app, this would use NLP to analyze client communications and feedback
  // For now, we'll return mock data
  
  // Convert client preferences object to array for easier access
  const clientPreferences = mockClientData.preferences;
  
  // Check if client exists in our mock data
  if (clientName in clientPreferences) {
    return clientPreferences[clientName];
  }
  
  // Return default preferences if client not found
  return {
    color_scheme: "Professional blues and grays",
    communication_preference: "Email, weekly updates",
    feedback_style: "Direct and detailed",
    revision_expectations: "Quick turnaround, minimal revisions",
    decision_makers: ["Marketing Director", "CEO"],
    typical_turnaround: "3-5 business days"
  };
};

// Task time estimation
export const estimateTaskTime = (taskType: string, complexity: string, clientName: string) => {
  // In a real app, this would use ML to predict task duration based on historical data
  // For now, we'll use simple logic with mock data
  
  // Base estimates in hours
  const baseEstimates = {
    "design": 4,
    "development": 8,
    "content": 3,
    "revision": 2
  };
  
  // Complexity multipliers
  const complexityMultipliers = {
    "low": 0.7,
    "medium": 1.0,
    "high": 1.5,
    "very high": 2.0
  };
  
  // Client-specific adjustments (some clients need more time)
  const clientAdjustments = {
    "Acme Corp": 1.2,
    "TechGiant": 0.9,
    "StartupBuddy": 1.1
  };
  
  // Calculate estimate
  const taskTypeKey = taskType.toLowerCase() as keyof typeof baseEstimates;
  const complexityKey = complexity.toLowerCase() as keyof typeof complexityMultipliers;
  
  const baseEstimate = baseEstimates[taskTypeKey] || 5; // Default to 5 hours if task type not found
  const complexityMultiplier = complexityMultipliers[complexityKey] || 1.0;
  const clientAdjustment = clientAdjustments[clientName as keyof typeof clientAdjustments] || 1.0;
  
  return baseEstimate * complexityMultiplier * clientAdjustment;
};

// Employee performance analysis
export const analyzeEmployeePerformance = (employeeId: number) => {
  // In a real app, this would analyze task history, time tracking, and feedback
  // For now, we'll return mock data
  
  const tasks = mockTaskData.tasks;
  const employeeTasks = tasks.filter(task => task.assigned_to === employeeId);
  
  if (employeeTasks.length === 0) {
    return {
      efficiency: 0,
      quality: 0,
      consistency: 0,
      strengths: [],
      areas_for_improvement: []
    };
  }
  
  // Calculate completion efficiency (estimated vs actual time)
  let totalEfficiency = 0;
  let taskCount = 0;
  
  employeeTasks.forEach(task => {
    if (task.estimated_hours && task.actual_hours) {
      const taskEfficiency = task.estimated_hours / task.actual_hours;
      totalEfficiency += taskEfficiency;
      taskCount++;
    }
  });
  
  const averageEfficiency = taskCount > 0 ? totalEfficiency / taskCount : 0;
  
  // Return analysis
  return {
    efficiency: Math.min(averageEfficiency, 1) * 100, // Cap at 100%
    quality: 85, // Mock value
    consistency: 90, // Mock value
    strengths: ["Communication", "Technical skills"],
    areas_for_improvement: ["Time estimation", "Documentation"]
  };
};

// More AI utility functions can be added here...

export default {
  analyzeClientPreferences,
  estimateTaskTime,
  analyzeEmployeePerformance
};
