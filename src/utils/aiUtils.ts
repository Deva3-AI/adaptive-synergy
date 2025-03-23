
import apiClient from '@/utils/apiUtils';
import { clientService } from '@/services/api';
import { taskService } from '@/services/api';
import { toast } from 'sonner';

/**
 * Analyze client input to extract key information and preferences
 */
export const analyzeClientInput = async (text: string, clientHistory?: any[]) => {
  try {
    // In a production environment, this would call an AI service endpoint
    // For now, let's implement a mock version that returns structured data
    
    // Attempt to get real client history if clientId is provided in the text
    const clientIdMatch = text.match(/client[_\s]?id:?\s*(\d+)/i);
    let history = clientHistory || [];
    
    if (clientIdMatch && clientIdMatch[1]) {
      const clientId = parseInt(clientIdMatch[1]);
      try {
        const clientHistoryData = await clientService.getClientHistory(clientId);
        if (clientHistoryData && clientHistoryData.length > 0) {
          history = clientHistoryData;
        }
      } catch (error) {
        console.error('Error fetching client history:', error);
      }
    }
    
    // Mock analyzing the content
    const hasUrgentWords = /urgent|asap|immediately|rush|priority/i.test(text);
    const hasPositiveWords = /love|great|awesome|excellent|happy|pleased/i.test(text);
    const hasNegativeWords = /disappointed|issue|problem|concern|unhappy|dislike/i.test(text);
    
    // Extract potential requirements
    const requirements = [];
    if (/responsive|mobile/i.test(text)) requirements.push('Mobile-responsive design');
    if (/minimalist|clean|simple/i.test(text)) requirements.push('Minimalist design aesthetic');
    if (/bold|vibrant|colorful/i.test(text)) requirements.push('Bold, vibrant color scheme');
    if (/interactive|animation/i.test(text)) requirements.push('Interactive elements and animations');
    if (/content|text|copy/i.test(text)) requirements.push('Content-focused layout');
    if (/modern|contemporary/i.test(text)) requirements.push('Modern, contemporary style');
    if (/landing page|homepage/i.test(text)) requirements.push('Focus on landing page optimization');
    if (/seo|search/i.test(text)) requirements.push('SEO-friendly structure');
    
    // Determine sentiment and priority
    let sentiment = 'neutral';
    if (hasPositiveWords && !hasNegativeWords) sentiment = 'positive';
    if (hasNegativeWords && !hasPositiveWords) sentiment = 'negative';
    
    let priority_level = 'medium';
    if (hasUrgentWords) priority_level = 'high';
    
    // Return structured analysis
    return {
      key_requirements: requirements.length > 0 ? requirements : ['No specific requirements detected'],
      sentiment,
      priority_level,
      suggested_tasks: [
        {
          title: 'Initial design concept',
          description: 'Create initial design concepts based on client requirements',
          estimated_time: 3
        },
        {
          title: 'Content structure planning',
          description: 'Plan content structure and information architecture',
          estimated_time: 2
        }
      ]
    };
  } catch (error) {
    console.error('Error analyzing client input:', error);
    throw error;
  }
};

/**
 * Generate suggested tasks based on client input
 */
export const generateSuggestedTasks = async (text: string, clientId?: number) => {
  try {
    // Get client information if clientId is provided
    let clientInfo = null;
    if (clientId) {
      try {
        clientInfo = await clientService.getClientById(clientId);
      } catch (error) {
        console.error('Error fetching client info:', error);
      }
    }
    
    // For a real implementation, we would call an AI service here
    // For now, generate some mock tasks based on the input text
    
    // Get more client context if available
    let clientContext = '';
    if (clientInfo) {
      clientContext = `Client: ${clientInfo.client_name}\n`;
      if (clientInfo.description) {
        clientContext += `Description: ${clientInfo.description}\n`;
      }
    }
    
    // Combine client context with input text
    const fullText = clientContext + text;
    
    // Analyze for common design/development tasks
    const tasks = [];
    
    if (/website|webpage|web page|landing page/i.test(fullText)) {
      tasks.push({
        title: 'Website design',
        description: 'Create design mockups for the website based on client requirements',
        estimated_time: 4,
        priority: 'high'
      });
      
      tasks.push({
        title: 'Responsive layout development',
        description: 'Develop responsive layouts that work on all device sizes',
        estimated_time: 3,
        priority: 'medium'
      });
    }
    
    if (/logo|brand|identity/i.test(fullText)) {
      tasks.push({
        title: 'Logo design concepts',
        description: 'Create initial logo design concepts',
        estimated_time: 3,
        priority: 'high'
      });
      
      tasks.push({
        title: 'Brand identity guidelines',
        description: 'Develop comprehensive brand identity guidelines',
        estimated_time: 5,
        priority: 'medium'
      });
    }
    
    if (/social media|facebook|instagram|twitter/i.test(fullText)) {
      tasks.push({
        title: 'Social media graphics',
        description: 'Design graphics for social media platforms',
        estimated_time: 2,
        priority: 'medium'
      });
      
      tasks.push({
        title: 'Social media content calendar',
        description: 'Create content calendar for social media posts',
        estimated_time: 3,
        priority: 'low'
      });
    }
    
    if (/seo|search engine|ranking/i.test(fullText)) {
      tasks.push({
        title: 'SEO audit',
        description: 'Perform SEO audit of existing website',
        estimated_time: 3,
        priority: 'medium'
      });
      
      tasks.push({
        title: 'SEO implementation',
        description: 'Implement SEO improvements based on audit findings',
        estimated_time: 4,
        priority: 'high'
      });
    }
    
    // If no specific tasks were identified, add some generic ones
    if (tasks.length === 0) {
      tasks.push({
        title: 'Project planning',
        description: 'Define project scope, goals, and deliverables',
        estimated_time: 2,
        priority: 'high'
      });
      
      tasks.push({
        title: 'Client research',
        description: 'Research client industry and competitors',
        estimated_time: 3,
        priority: 'medium'
      });
      
      tasks.push({
        title: 'Initial design concepts',
        description: 'Create initial design concepts based on project requirements',
        estimated_time: 4,
        priority: 'high'
      });
    }
    
    return {
      suggested_tasks: tasks
    };
  } catch (error) {
    console.error('Error generating suggested tasks:', error);
    throw error;
  }
};

/**
 * Analyze employee performance data
 */
export const analyzeEmployeePerformance = async (employeeId: number, startDate?: string, endDate?: string) => {
  try {
    // This would normally call the backend API
    // Mock implementation for now
    return {
      metrics: {
        productivity_score: 85,
        tasks_completed: 24,
        average_task_time: 3.5,
        on_time_completion_rate: 92
      },
      trends: {
        productivity: 'improving',
        quality: 'stable',
        punctuality: 'improving'
      },
      areas_for_improvement: [
        'Task estimation could be more accurate',
        'Communication frequency during longer tasks'
      ],
      strengths: [
        'Consistently high-quality deliverables',
        'Excellent client satisfaction ratings',
        'Good at handling complex tasks'
      ]
    };
  } catch (error) {
    console.error('Error analyzing employee performance:', error);
    throw error;
  }
};

/**
 * Analyze meeting transcript for action items and insights
 */
export const analyzeMeetingTranscript = async (transcript: string) => {
  try {
    // This would normally call an AI service
    // Mock implementation for now
    
    // Detect action items (sentences with action verbs followed by will/should/to)
    const actionItemRegex = /(will|should|needs to|going to|must|have to) (create|update|review|prepare|send|complete|develop|implement|finalize|follow up|contact|organize|schedule)/gi;
    const actionItemMatches = transcript.match(actionItemRegex) || [];
    
    // Extract potential action items using regex
    const actionItems = Array.from(new Set(
      [...actionItemMatches, ...extractActionItems(transcript)]
    )).slice(0, 5);
    
    // Detect key topics discussed
    const topicRegex = /(discussed|talked about|mentioned|focused on|regarding|about) ([^,.!?;]+)/gi;
    const topicMatches = [];
    let match;
    while ((match = topicRegex.exec(transcript)) !== null) {
      topicMatches.push(match[2].trim());
    }
    
    // Get unique topics
    const keyTopics = Array.from(new Set(topicMatches)).slice(0, 5);
    
    // Simulate detecting decisions
    const decisionsRegex = /(decided|agreed|concluded|determined|resolved) (to|that|on) ([^,.!?;]+)/gi;
    const decisionMatches = [];
    while ((match = decisionsRegex.exec(transcript)) !== null) {
      decisionMatches.push(match[3].trim());
    }
    
    // Get unique decisions
    const decisions = Array.from(new Set(decisionMatches)).slice(0, 3);
    
    return {
      action_items: actionItems.length > 0 ? actionItems : ["No specific action items detected"],
      key_topics: keyTopics.length > 0 ? keyTopics : ["No specific topics detected"],
      decisions: decisions.length > 0 ? decisions : ["No specific decisions detected"],
      sentiment: detectSentiment(transcript),
      summary: generateSummary(transcript)
    };
  } catch (error) {
    console.error('Error analyzing meeting transcript:', error);
    throw error;
  }
};

/**
 * Analyze financial data to generate insights
 */
export const analyzeFinancialData = async (financialData: any) => {
  try {
    // This would normally call a financial analysis service
    // Mock implementation for now
    return {
      trends: {
        revenue: financialData.revenue_increasing ? 'increasing' : 'decreasing',
        expenses: financialData.expenses_increasing ? 'increasing' : 'decreasing',
        profit_margin: calculateTrend(financialData.profit_margins || [])
      },
      insights: [
        'Revenue has grown 15% compared to the previous quarter',
        'Client acquisition cost has decreased by 8%',
        'Recurring revenue represents 65% of total revenue'
      ],
      recommendations: [
        'Focus on expanding recurring revenue streams',
        'Optimize resource allocation to high-value clients',
        'Consider strategic investments in marketing automation'
      ],
      risk_factors: [
        'Increasing competition in the primary market segment',
        'Potential economic slowdown in Q3-Q4',
        'Rising operational costs'
      ]
    };
  } catch (error) {
    console.error('Error analyzing financial data:', error);
    throw error;
  }
};

/**
 * Generate marketing insights from campaign data
 */
export const generateMarketingInsights = async (campaignData: any, marketSegment?: string) => {
  try {
    // This would normally call a marketing analytics service
    // Mock implementation for now
    return {
      performance_metrics: {
        average_conversion_rate: 3.2,
        click_through_rate: 2.8,
        cost_per_acquisition: 45,
        return_on_ad_spend: 320
      },
      top_performing_channels: [
        { channel: 'Email', performance: 'high', conversion_rate: 4.5 },
        { channel: 'Social Media', performance: 'medium', conversion_rate: 2.8 },
        { channel: 'Search', performance: 'high', conversion_rate: 3.9 }
      ],
      audience_insights: [
        '35-44 age group shows highest engagement',
        'Tech industry professionals convert at 2x the average rate',
        'Content focused on ROI generates more qualified leads'
      ],
      recommendations: [
        'Increase budget allocation to email campaigns by 15%',
        'Develop more ROI-focused content for the tech industry segment',
        'Test new ad creatives targeting the 35-44 age demographic'
      ]
    };
  } catch (error) {
    console.error('Error generating marketing insights:', error);
    throw error;
  }
};

/**
 * Predict task timeline based on historical data
 */
export const predictTaskTimeline = async (taskData: any) => {
  try {
    // This would normally use ML models to predict task timelines
    // Mock implementation for now
    const baseEstimate = taskData.estimated_hours || 10;
    const complexity = taskData.complexity || 'medium';
    
    let adjustedEstimate = baseEstimate;
    if (complexity === 'high') {
      adjustedEstimate *= 1.5;
    } else if (complexity === 'low') {
      adjustedEstimate *= 0.8;
    }
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + adjustedEstimate);
    
    return {
      original_estimate: baseEstimate,
      adjusted_estimate: adjustedEstimate,
      predicted_start_date: startDate.toISOString(),
      predicted_end_date: endDate.toISOString(),
      confidence_score: 0.85,
      risk_factors: [
        complexity === 'high' ? 'High task complexity might lead to delays' : null,
        taskData.dependencies > 2 ? 'Multiple dependencies increase risk of delays' : null,
        taskData.new_technology ? 'New technology might require additional learning time' : null
      ].filter(Boolean)
    };
  } catch (error) {
    console.error('Error predicting task timeline:', error);
    throw error;
  }
};

/**
 * Helper function to extract action items from text
 */
const extractActionItems = (text: string): string[] => {
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  return sentences.filter(s => {
    return /\b(need|should|will|must|going to|have to)\b/i.test(s) && 
           /\b(create|update|review|follow|send|prepare|contact|schedule|call|email|complete|finish)\b/i.test(s);
  });
};

/**
 * Helper function to detect sentiment in text
 */
const detectSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
  const positiveWords = ['good', 'great', 'excellent', 'happy', 'excited', 'pleased', 'agree', 'best', 'success'];
  const negativeWords = ['bad', 'poor', 'terrible', 'unhappy', 'disappointed', 'disagree', 'problem', 'issue', 'fail'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];
  
  for (const word of words) {
    if (positiveWords.includes(word)) positiveScore++;
    if (negativeWords.includes(word)) negativeScore++;
  }
  
  if (positiveScore > negativeScore * 2) return 'positive';
  if (negativeScore > positiveScore * 2) return 'negative';
  return 'neutral';
};

/**
 * Helper function to generate a simple summary
 */
const generateSummary = (text: string): string => {
  // Very simplified summary - first 100 words
  const words = text.split(/\s+/);
  if (words.length <= 100) return text;
  return words.slice(0, 100).join(' ') + '...';
};

/**
 * Helper function to calculate trend from array of numbers
 */
const calculateTrend = (values: number[]): 'increasing' | 'decreasing' | 'stable' => {
  if (values.length < 2) return 'stable';
  
  const firstHalf = values.slice(0, Math.floor(values.length / 2));
  const secondHalf = values.slice(Math.floor(values.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const percentChange = ((secondAvg - firstAvg) / firstAvg) * 100;
  
  if (percentChange > 5) return 'increasing';
  if (percentChange < -5) return 'decreasing';
  return 'stable';
};

/**
 * Extract context data from text
 */
export const extractContextData = async (text: string) => {
  try {
    // This would normally use NLP to extract structured data
    // Mock implementation for now
    const entities = {};
    
    // Extract potential client names
    const clientRegex = /client:?\s*([^,.;]+)/i;
    const clientMatch = text.match(clientRegex);
    if (clientMatch && clientMatch[1]) {
      Object.assign(entities, { client: clientMatch[1].trim() });
    }
    
    // Extract potential project names
    const projectRegex = /project:?\s*([^,.;]+)/i;
    const projectMatch = text.match(projectRegex);
    if (projectMatch && projectMatch[1]) {
      Object.assign(entities, { project: projectMatch[1].trim() });
    }
    
    // Extract potential dates
    const dateRegex = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (\d{1,2})(?:st|nd|rd|th)?,? \d{4}/i;
    const dateMatch = text.match(dateRegex);
    if (dateMatch && dateMatch[0]) {
      Object.assign(entities, { date: dateMatch[0].trim() });
    }
    
    // Extract potential amounts/numbers
    const amountRegex = /\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
    const amounts = [];
    let amountMatch;
    while ((amountMatch = amountRegex.exec(text)) !== null) {
      amounts.push(amountMatch[0].trim());
    }
    if (amounts.length > 0) {
      Object.assign(entities, { amounts });
    }
    
    return {
      entities,
      keywords: extractKeywords(text),
      intents: detectIntents(text)
    };
  } catch (error) {
    console.error('Error extracting context data:', error);
    throw error;
  }
};

/**
 * Helper function to extract keywords
 */
const extractKeywords = (text: string): string[] => {
  // This would normally use a proper keyword extraction algorithm
  // Simplified mock implementation
  const stopWords = ['a', 'an', 'the', 'and', 'but', 'for', 'on', 'in', 'with', 'to', 'of', 'at', 'by', 'is', 'was', 'were'];
  const words = text.toLowerCase().match(/\b(\w{3,})\b/g) || [];
  const filteredWords = words.filter(word => !stopWords.includes(word));
  
  // Count occurrences
  const wordCounts: Record<string, number> = {};
  for (const word of filteredWords) {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }
  
  // Sort by count and take top 10
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
};

/**
 * Helper function to detect intents in text
 */
const detectIntents = (text: string): string[] => {
  // This would normally use a proper intent classification model
  // Simplified mock implementation
  const intents = [];
  
  if (/\b(need|want|looking for)\b/i.test(text)) {
    intents.push('request');
  }
  
  if (/\b(question|how|what|when|why|who)\b/i.test(text)) {
    intents.push('question');
  }
  
  if (/\b(problem|issue|error|wrong|not working)\b/i.test(text)) {
    intents.push('problem');
  }
  
  if (/\b(thank|thanks|appreciate|grateful)\b/i.test(text)) {
    intents.push('gratitude');
  }
  
  if (/\b(feedback|opinion|thought|suggestion)\b/i.test(text)) {
    intents.push('feedback');
  }
  
  return intents.length > 0 ? intents : ['general'];
};

export default {
  analyzeClientInput,
  generateSuggestedTasks,
  analyzeEmployeePerformance,
  analyzeMeetingTranscript,
  analyzeFinancialData,
  generateMarketingInsights,
  predictTaskTimeline,
  extractContextData
};
