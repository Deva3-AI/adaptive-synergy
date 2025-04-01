
export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start: string; // ISO format date
  end?: string; // ISO format date
  allDay?: boolean;
  type: 'company' | 'leave' | 'holiday' | 'meeting' | 'other';
  createdBy: string;
  userId?: number; // If it's a user-specific event like leave
  color?: string;
  location?: string;
}

export interface CalendarViewProps {
  events: CalendarEvent[];
  isHR: boolean;
  onAddEvent?: (event: Omit<CalendarEvent, 'id' | 'createdBy'>) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: number) => void;
}
