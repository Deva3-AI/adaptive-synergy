
// Define marketing interface types to be used across the application
export interface EmailOutreach {
  id: number;
  subject: string;
  recipient: string;
  status: "sent" | "opened" | "clicked" | "replied" | "bounced";
  sent_at: string;
  response_rate: number;
  recipientCompany?: string;
  source?: string;
  followUpScheduled?: boolean;
  sentAt?: string;
}

export interface MarketingMeeting {
  id: number;
  title: string;
  date: string;
  attendees: string[];
  notes: string;
  follow_up_date?: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  leadName: string;
  leadCompany: string;
  scheduledTime: string;
  duration: number;
  platform: string;
}

export interface LeadProfile {
  id: number;
  name: string;
  company: string;
  email: string;
  phone?: string;
  source: string;
  status: "new" | "contacted" | "qualified" | "proposal" | "closed" | "lost";
  created_at: string;
  position?: string;
  score?: number;
  lastContactedAt?: string;
}
