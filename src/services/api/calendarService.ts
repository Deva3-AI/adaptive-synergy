
import { CalendarEvent } from '@/interfaces/calendar';
import { addDays, format } from 'date-fns';

// Mock data for calendar events
const today = new Date();
const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'Company Meeting',
    description: 'Quarterly company meeting to discuss goals and progress',
    start: format(today, 'yyyy-MM-dd'),
    allDay: true,
    type: 'meeting',
    createdBy: 'HR Team',
    location: 'Main Conference Room'
  },
  {
    id: 2,
    title: 'Independence Day',
    description: 'National holiday - office closed',
    start: format(addDays(today, 5), 'yyyy-MM-dd'),
    allDay: true,
    type: 'holiday',
    createdBy: 'HR Team'
  },
  {
    id: 3,
    title: 'John Doe - Vacation',
    description: 'Annual leave',
    start: format(addDays(today, 7), 'yyyy-MM-dd'),
    end: format(addDays(today, 14), 'yyyy-MM-dd'),
    allDay: true,
    type: 'leave',
    createdBy: 'HR Team',
    userId: 1
  },
  {
    id: 4,
    title: 'Team Building',
    description: 'Team building activity at Adventure Park',
    start: format(addDays(today, 20), 'yyyy-MM-dd'),
    allDay: true,
    type: 'company',
    createdBy: 'HR Team',
    location: 'Adventure Park'
  }
];

const calendarService = {
  // Get all calendar events
  getEvents: async (): Promise<CalendarEvent[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...calendarEvents];
  },

  // Get events for a specific user
  getUserEvents: async (userId: number): Promise<CalendarEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return calendarEvents.filter(
      event => event.userId === userId || event.type === 'company' || event.type === 'holiday'
    );
  },

  // Add a new event (HR only)
  addEvent: async (event: Omit<CalendarEvent, 'id'>, userRole: string): Promise<CalendarEvent | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user is HR
    if (userRole !== 'hr' && userRole !== 'admin') {
      console.error('Only HR can add events');
      return null;
    }
    
    const newEvent: CalendarEvent = {
      id: Math.max(...calendarEvents.map(e => e.id)) + 1,
      ...event
    };
    
    calendarEvents.push(newEvent);
    return newEvent;
  },

  // Update an existing event (HR only)
  updateEvent: async (event: CalendarEvent, userRole: string): Promise<CalendarEvent | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user is HR
    if (userRole !== 'hr' && userRole !== 'admin') {
      console.error('Only HR can update events');
      return null;
    }
    
    const index = calendarEvents.findIndex(e => e.id === event.id);
    if (index === -1) return null;
    
    calendarEvents[index] = event;
    return event;
  },

  // Delete an event (HR only)
  deleteEvent: async (eventId: number, userRole: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if user is HR
    if (userRole !== 'hr' && userRole !== 'admin') {
      console.error('Only HR can delete events');
      return false;
    }
    
    const index = calendarEvents.findIndex(e => e.id === eventId);
    if (index === -1) return false;
    
    calendarEvents.splice(index, 1);
    return true;
  }
};

export default calendarService;
