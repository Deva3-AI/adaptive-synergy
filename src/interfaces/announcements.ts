
export interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'hr' | 'general' | 'company' | 'event';
  isPinned: boolean;
  attachmentUrl?: string;
}
