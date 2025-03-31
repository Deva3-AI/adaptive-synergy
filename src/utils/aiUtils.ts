
import { mockUserData, mockFinanceData } from './mockData';

// Client-related utilities
export const analyzeClientInput = async (clientInput: string) => {
  // Mock implementation
  return {
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
    priority_level: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
    key_requirements: [
      'Modern design aesthetic',
      'Mobile responsiveness',
      'Fast loading times',
      'Clear call-to-action elements'
    ],
    suggested_response: 'Thank you for providing these details! I understand your requirements and will prioritize them accordingly.'
  };
};

export const generateSuggestedTasks = async (clientInput: string, clientId: number) => {
  // Mock implementation
  return {
    suggested_tasks: [
      {
        title: 'Create wireframes for homepage',
        description: 'Design initial wireframes based on client requirements',
        priority_level: 'high',
        estimated_time: 4,
        assignee: null
      },
      {
        title: 'Develop responsive layout',
        description: 'Implement the responsive design across all screen sizes',
        priority_level: 'medium',
        estimated_time: 6,
        assignee: null
      },
      {
        title: 'Optimize loading performance',
        description: 'Improve page load times through asset optimization',
        priority_level: 'medium',
        estimated_time: 3,
        assignee: null
      }
    ],
    client_id: clientId
  };
};

// Employee-related utilities
export const analyzeEmployeePerformance = async (attendanceData: any[]) => {
  // Mock implementation
  return {
    metrics: {
      avg_hours_worked: 7.5,
      task_completion_rate: 85,
      efficiency_rate: 92
    },
    performance_assessment: {
      rating: ['excellent', 'good', 'average', 'poor'][Math.floor(Math.random() * 4)],
      explanation: 'Based on the analysis of work patterns, task completion rates, and efficiency metrics.'
    },
    strengths: [
      'Consistent work schedule',
      'High task completion rate',
      'Excellent collaboration with team members'
    ],
    improvement_areas: [
      'Could improve estimation accuracy',
      'Consider taking more initiative on complex tasks'
    ],
    recommendations: [
      'Schedule regular check-ins with team members',
      'Participate in estimation workshops to improve accuracy',
      'Consider cross-training in related skill areas'
    ]
  };
};

// Financial analysis utilities
export const analyzeFinancialData = async (financialRecords: any[]) => {
  // Mock implementation using some data from mockFinanceData
  return {
    financial_health: {
      status: ['excellent', 'good', 'satisfactory', 'concerning', 'critical'][Math.floor(Math.random() * 5)],
      explanation: 'Based on current cash flow, revenue trends, and expense patterns.'
    },
    summary_metrics: {
      net_profit: 125000,
      profit_margin: 18.5,
      recent_trend: 'upward'
    },
    key_insights: [
      'Revenue has increased by 15% compared to the same period last year',
      'Operating expenses have decreased by 7% due to recent optimization efforts',
      'Client retention rate remains strong at 85%'
    ],
    recommendations: [
      { area: 'Cash Flow', action: 'Implement a more aggressive invoicing schedule' },
      { area: 'Expenses', action: 'Review subscription services for potential consolidation' },
      { area: 'Revenue', action: 'Explore upselling opportunities with existing clients' }
    ],
    prediction: 'Based on current trends, expect a 10-12% growth in the next quarter if market conditions remain stable.'
  };
};

// Meeting analysis utilities
export const analyzeMeetingTranscript = async (transcript: string) => {
  // Mock implementation
  return {
    summary: 'This meeting covered project timelines, resource allocation, and next steps for the upcoming product launch.',
    action_items: [
      { task: 'Update project timeline', assignee: 'Project Manager', deadline: '2023-06-15' },
      { task: 'Allocate additional resources to design team', assignee: 'Resource Manager', deadline: '2023-06-10' },
      { task: 'Prepare marketing materials', assignee: 'Marketing Lead', deadline: '2023-06-20' }
    ],
    key_insights: [
      'Team is concerned about meeting the current deadline',
      'Additional design resources are needed to complete all requested features',
      'Marketing team needs assets at least two weeks before launch'
    ],
    sentiment_analysis: {
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
      confidence: 0.85
    }
  };
};

// Marketing insights utilities
export const generateMarketingInsights = async (marketingData: any) => {
  // Mock implementation
  return {
    trends: [
      { name: 'Social Media Engagement', value: '+15%', impact: 'positive' },
      { name: 'Email Open Rates', value: '-3%', impact: 'negative' },
      { name: 'Website Traffic', value: '+8%', impact: 'positive' }
    ],
    recommendations: [
      'Increase content frequency on high-performing social channels',
      'Revise email subject line strategy to improve open rates',
      'Optimize top landing pages for conversion'
    ],
    competitor_analysis: [
      { competitor: 'CompanyX', strength: 'Video content', weakness: 'Response time' },
      { competitor: 'CompanyY', strength: 'SEO ranking', weakness: 'Social presence' }
    ],
    opportunity_areas: [
      'Video tutorials for product features',
      'Industry-specific case studies',
      'Collaborative webinars with partners'
    ]
  };
};

// Export other utility functions as needed
