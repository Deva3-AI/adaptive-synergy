
export interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'general' | 'hr' | 'company' | 'event';
  isPinned?: boolean;
  attachmentUrl?: string;
}
