
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarView } from '@/components/calendar/CalendarView';
import { CalendarEvent } from '@/interfaces/calendar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Mock service until we create a proper calendar service
const calendarService = {
  getEvents: async (): Promise<CalendarEvent[]> => {
    return [
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
  },
  
  addEvent: async (event: Omit<CalendarEvent, 'id' | 'createdBy'>, userRole: string): Promise<CalendarEvent | null> => {
    // Mock implementation
    if (userRole === 'hr' || userRole === 'admin') {
      return {
        id: Math.floor(Math.random() * 1000),
        createdBy: 'HR Department',
        ...event
      };
    }
    return null;
  },
  
  updateEvent: async (event: CalendarEvent, userRole: string): Promise<CalendarEvent | null> => {
    // Mock implementation
    if (userRole === 'hr' || userRole === 'admin') {
      return event;
    }
    return null;
  },
  
  deleteEvent: async (eventId: number, userRole: string): Promise<boolean> => {
    // Mock implementation
    return userRole === 'hr' || userRole === 'admin';
  }
};

const CompanyCalendar = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isHR = user?.role === 'hr' || user?.role === 'admin';
  
  const { data = [], isLoading, refetch } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: () => calendarService.getEvents(),
  });
  
  const handleAddEvent = async (event: Omit<CalendarEvent, 'id' | 'createdBy'>) => {
    try {
      const userRole = user?.role || 'employee';
      const newEvent = await calendarService.addEvent({
        ...event,
      }, userRole);
      
      if (newEvent) {
        toast({
          title: "Success",
          description: "Event added successfully",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "You don't have permission to add events",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event",
        variant: "destructive"
      });
    }
  };
  
  const handleEditEvent = async (event: CalendarEvent) => {
    try {
      const userRole = user?.role || 'employee';
      const updatedEvent = await calendarService.updateEvent(event, userRole);
      
      if (updatedEvent) {
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "You don't have permission to update events",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteEvent = async (eventId: number) => {
    try {
      const userRole = user?.role || 'employee';
      const success = await calendarService.deleteEvent(eventId, userRole);
      
      if (success) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description: "You don't have permission to delete events",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center">
        Loading calendar...
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Company Calendar</h1>
      <p className="text-muted-foreground mb-6">
        View company events, holidays, and leave schedules
        {isHR && ". As an HR member, you can add, edit, and delete events."}
      </p>
      
      <CalendarView 
        events={data as CalendarEvent[]}
        isHR={isHR}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />
    </div>
  );
};

export default CompanyCalendar;
