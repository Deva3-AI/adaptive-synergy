
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarView } from '@/components/calendar/CalendarView';
import { CalendarEvent } from '@/interfaces/calendar';
import { calendarService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/use-auth';

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
        createdBy: user?.name || 'System'
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
