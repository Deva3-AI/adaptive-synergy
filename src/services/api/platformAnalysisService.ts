
import { dateToString } from '@/utils/dateUtils';

export type PlatformType = 'slack' | 'discord' | 'gmail' | 'trello' | 'asana' | 'all';

export interface PlatformMessage {
  id: string;
  content: string;
  sender: string;
  receiver?: string;
  timestamp: string | Date;
  platform: PlatformType;
  metadata?: Record<string, any>;
}

export interface PlatformStatistics {
  messageCount: number;
  topSenders: Array<{ sender: string; count: number }>;
  messagesByDay: Record<string, number>;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  keywordFrequency: Record<string, number>;
  insights: string[];
}

const platformAnalysisService = {
  analyzePlatformMessages: (
    messages: PlatformMessage[],
    platform: PlatformType,
    startDate?: string | Date,
    endDate?: string | Date
  ): PlatformStatistics => {
    // Filter messages by date range if provided
    let filteredMessages = [...messages];
    
    if (startDate || endDate) {
      const start = startDate ? new Date(dateToString(startDate)).getTime() : 0;
      const end = endDate ? new Date(dateToString(endDate)).getTime() : Date.now();
      
      filteredMessages = messages.filter(msg => {
        const msgDate = new Date(dateToString(msg.timestamp));
        const msgTime = msgDate.getTime();
        return msgTime >= start && msgTime <= end;
      });
    }
    
    // Filter by platform if not 'all'
    if (platform !== 'all') {
      filteredMessages = filteredMessages.filter(msg => msg.platform === platform);
    }
    
    // Return mock statistics for demo purposes
    return {
      messageCount: filteredMessages.length,
      topSenders: [
        { sender: 'John Doe', count: 42 },
        { sender: 'Jane Smith', count: 36 },
        { sender: 'Mike Johnson', count: 28 }
      ],
      messagesByDay: {
        'Mon': 65,
        'Tue': 78,
        'Wed': 92,
        'Thu': 86,
        'Fri': 73,
        'Sat': 35,
        'Sun': 28
      },
      sentimentAnalysis: {
        positive: 45,
        neutral: 40,
        negative: 15
      },
      keywordFrequency: {
        'design': 37,
        'responsive': 24,
        'deadline': 18,
        'feedback': 15,
        'review': 12
      },
      insights: [
        'Communication volume peaks on Wednesdays',
        'Most discussions revolve around design considerations',
        'Sentiment is generally positive with focus on collaboration',
        'Response times are averaging 2.3 hours during work days'
      ]
    };
  },
  
  analyzeMessages: async (messages: PlatformMessage[]) => {
    // Mock implementation for client insights
    return {
      key_requirements: [
        'Modern, minimalist design',
        'Mobile-responsive layout',
        'Interactive elements for user engagement'
      ],
      sentiment: 'positive',
      priority_level: 'high',
      suggested_tasks: [
        {
          title: 'Create wireframes for homepage',
          description: 'Develop low-fidelity wireframes focusing on content hierarchy and user flow',
          estimated_time: 3
        },
        {
          title: 'Design mobile-responsive components',
          description: 'Create component library ensuring consistent experience across devices',
          estimated_time: 4
        }
      ]
    };
  },
  
  generateTaskSuggestions: async (messages: PlatformMessage[], clientId: number) => {
    // Mock implementation for task suggestions
    return {
      suggested_tasks: [
        {
          title: 'Create wireframes for homepage',
          description: 'Develop low-fidelity wireframes focusing on content hierarchy and user flow',
          estimated_time: 3,
          priority: 'high'
        },
        {
          title: 'Design mobile-responsive components',
          description: 'Create component library ensuring consistent experience across devices',
          estimated_time: 4,
          priority: 'medium'
        },
        {
          title: 'Implement interactive prototype',
          description: 'Develop clickable prototype to demonstrate key functionality',
          estimated_time: 5,
          priority: 'medium'
        }
      ]
    };
  }
};

export default platformAnalysisService;
