
import { CalendarEvent } from '@/interfaces/calendar';

// Mock calendar service implementation
const events: CalendarEvent[] = [
  {
    id: 1,
    title: 'Company Meeting',
    start: new Date(2023, 5, 10, 10, 0),
    end: new Date(2023, 5, 10, 11, 30),
    description: 'Monthly company-wide meeting',
    location: 'Main Conference Room',
    type: 'meeting',
    createdBy: 'HR Department'
  },
  {
    id: 2,
    title: 'Team Building',
    start: new Date(2023, 5, 15, 13, 0),
    end: new Date(2023, 5, 15, 17, 0),
    description: 'Team building activities',
    location: 'Central Park',
    type: 'event',
    createdBy: 'HR Department'
  },
  {
    id: 3,
    title: 'Public Holiday - Independence Day',
    start: new Date(2023, 6, 4),
    end: new Date(2023, 6, 4),
    description: 'Independence Day holiday',
    type: 'holiday',
    createdBy: 'System'
  }
];

export const calendarService = {
  getEvents: async (): Promise<CalendarEvent[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve([...events]), 500);
    });
  },
  
  addEvent: async (event: Omit<CalendarEvent, 'id' | 'createdBy'>, userRole: string): Promise<CalendarEvent | null> => {
    // Only HR and admin can add events
    if (userRole !== 'hr' && userRole !== 'admin') {
      return null;
    }
    
    const newEvent: CalendarEvent = {
      id: events.length + 1,
      createdBy: 'HR Department',
      ...event
    };
    
    events.push(newEvent);
    return newEvent;
  },
  
  updateEvent: async (event: CalendarEvent, userRole: string): Promise<CalendarEvent | null> => {
    // Only HR and admin can update events
    if (userRole !== 'hr' && userRole !== 'admin') {
      return null;
    }
    
    const index = events.findIndex(e => e.id === event.id);
    if (index === -1) {
      return null;
    }
    
    events[index] = event;
    return event;
  },
  
  deleteEvent: async (eventId: number, userRole: string): Promise<boolean> => {
    // Only HR and admin can delete events
    if (userRole !== 'hr' && userRole !== 'admin') {
      return false;
    }
    
    const index = events.findIndex(e => e.id === eventId);
    if (index === -1) {
      return false;
    }
    
    events.splice(index, 1);
    return true;
  }
};

export default calendarService;
