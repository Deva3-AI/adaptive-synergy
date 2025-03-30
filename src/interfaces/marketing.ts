
export interface EmailOutreach {
  id: number;
  recipient: string;
  recipientCompany: string;
  subject: string;
  status: 'sent' | 'opened' | 'replied' | 'bounced' | 'scheduled';
  sentAt: string;
  source: string;
  followUpScheduled: boolean;
}

export interface CompetitorInsight {
  id: number;
  competitor_name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: string;
  discoveredAt: string;
  source: string;
  suggestedResponse: string;
}

export interface MarketingMeeting {
  id: number;
  leadName: string;
  leadCompany: string;
  scheduledTime: string;
  duration: number;
  platform: string;
  status: string;
  notes?: string;
  followUpDate?: string;
}
