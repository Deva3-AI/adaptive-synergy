
export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  type: 'meeting' | 'event' | 'holiday' | 'leave' | 'other';
  createdBy: string;
}
