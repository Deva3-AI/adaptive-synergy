
import { dateToString, getTimeDifference } from '@/utils/dateUtils';

// Platform types
export type PlatformType = 'email' | 'slack' | 'trello' | 'discord' | 'asana';

// Interface for platform message
export interface PlatformMessage {
  id: string;
  platform: PlatformType;
  client_id: number;
  user_id: number;
  content: string;
  timestamp: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  type: 'message' | 'comment' | 'task' | 'email';
}

// Interface for platform statistics
export interface PlatformStatistics {
  platform: PlatformType;
  messageCount: number;
  avgResponseTime: number;
  clientSentiment: { positive: number; neutral: number; negative: number };
}

// Helper function to get random sentiment distribution
const getRandomSentiment = () => {
  return {
    positive: Math.floor(Math.random() * 70) + 20,
    neutral: Math.floor(Math.random() * 50) + 10,
    negative: Math.floor(Math.random() * 30)
  };
};

// Calculate response time between messages
const calculateResponseTime = (messages: PlatformMessage[]): number => {
  if (messages.length < 2) return 0;
  
  let totalResponseTime = 0;
  let responseCount = 0;
  
  for (let i = 1; i < messages.length; i++) {
    const prevTimestamp = new Date(messages[i-1].timestamp);
    const currTimestamp = new Date(messages[i].timestamp);
    
    // Only count if messages are within 24 hours of each other
    const diffMs = getTimeDifference(prevTimestamp, currTimestamp);
    
    if (diffMs > 0 && diffMs < 24 * 60 * 60 * 1000) {
      totalResponseTime += diffMs;
      responseCount++;
    }
  }
  
  // Return average in minutes
  return responseCount > 0 ? Math.round(totalResponseTime / responseCount / (1000 * 60)) : 0;
};

// Analyze platform messages
export const analyzePlatformMessages = (
  messages: PlatformMessage[],
  platform: PlatformType,
  startDate?: Date | string,
  endDate?: Date | string
): PlatformStatistics => {
  // Filter messages by date range if provided
  let filteredMessages = [...messages];
  
  if (startDate || endDate) {
    filteredMessages = messages.filter(msg => {
      const msgDate = new Date(msg.timestamp);
      
      if (startDate && endDate) {
        const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
        const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
        return msgDate >= start && msgDate <= end;
      } else if (startDate) {
        const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
        return msgDate >= start;
      } else if (endDate) {
        const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
        return msgDate <= end;
      }
      
      return true;
    });
  }
  
  // Filter by platform if specified
  if (platform) {
    filteredMessages = filteredMessages.filter(msg => msg.platform === platform);
  }
  
  // Calculate statistics
  const messageCount = filteredMessages.length;
  const avgResponseTime = calculateResponseTime(filteredMessages);
  
  // Count sentiment distribution - in real system this would be from actual sentiment analysis
  const sentiments = filteredMessages.map(msg => msg.sentiment || 'neutral');
  const clientSentiment = {
    positive: sentiments.filter(s => s === 'positive').length,
    neutral: sentiments.filter(s => s === 'neutral').length,
    negative: sentiments.filter(s => s === 'negative').length
  };
  
  return {
    platform,
    messageCount,
    avgResponseTime,
    clientSentiment: messageCount > 0 ? clientSentiment : getRandomSentiment()
  };
};

export default {
  analyzePlatformMessages
};
