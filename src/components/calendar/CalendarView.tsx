
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarEvent } from '@/interfaces/calendar';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
  isHR: boolean;
  onAddEvent: (event: Omit<CalendarEvent, 'id' | 'createdBy'>) => void;
  onEditEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (eventId: number) => void;
}

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(['meeting', 'event', 'holiday', 'leave', 'other']),
  start: z.date(),
  end: z.date(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  isHR, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent 
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      type: 'event',
      start: new Date(),
      end: new Date(),
    },
  });
  
  const handleAddEvent = () => {
    setIsEditing(false);
    form.reset({
      title: '',
      description: '',
      location: '',
      type: 'event',
      start: selectedDate || new Date(),
      end: selectedDate || new Date(),
    });
    setIsDialogOpen(true);
  };
  
  const handleViewEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsViewEventDialogOpen(true);
  };
  
  const handleEditEvent = () => {
    if (!selectedEvent) return;
    
    setIsEditing(true);
    form.reset({
      title: selectedEvent.title,
      description: selectedEvent.description || '',
      location: selectedEvent.location || '',
      type: selectedEvent.type,
      start: selectedEvent.start,
      end: selectedEvent.end,
    });
    setIsViewEventDialogOpen(false);
    setIsDialogOpen(true);
  };
  
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    
    onDeleteEvent(selectedEvent.id);
    setIsViewEventDialogOpen(false);
  };
  
  const onSubmit = (values: EventFormValues) => {
    if (isEditing && selectedEvent) {
      onEditEvent({
        ...selectedEvent,
        ...values,
      });
    } else {
      onAddEvent(values);
    }
    
    setIsDialogOpen(false);
  };
  
  const dateHasEvent = (date: Date): boolean => {
    return events.some(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {selectedDate ? format(selectedDate, 'MMMM yyyy') : 'Calendar'}
        </h2>
        
        {isHR && (
          <Button onClick={handleAddEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ hasEvent: dateHasEvent }}
            modifiersClassNames={{ hasEvent: 'bg-primary/10' }}
            className="rounded-md border"
          />
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-4">
              {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
            </h3>
            
            {selectedDate && (
              <div className="space-y-3">
                {getEventsForDay(selectedDate).length > 0 ? (
                  getEventsForDay(selectedDate).map(event => (
                    <div 
                      key={event.id} 
                      className="flex flex-col p-3 border rounded-md cursor-pointer hover:bg-secondary/50"
                      onClick={() => handleViewEvent(event)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{event.title}</h4>
                        <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                          {event.type}
                        </span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                      </div>
                      
                      {event.location && (
                        <div className="text-sm mt-1">
                          Location: {event.location}
                        </div>
                      )}
                      
                      {event.description && (
                        <div className="text-sm mt-1 line-clamp-2">
                          {event.description}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No events scheduled for this day.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add/Edit Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                        <SelectItem value="leave">Leave</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                          value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''} 
                          onChange={(e) => field.onChange(new Date(e.target.value))} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="end"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="datetime-local" 
                          {...field} 
                          value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''} 
                          onChange={(e) => field.onChange(new Date(e.target.value))} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">{isEditing ? 'Update' : 'Add'} Event</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* View Event Dialog */}
      <Dialog open={isViewEventDialogOpen} onOpenChange={setIsViewEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                    {selectedEvent.type}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    Created by {selectedEvent.createdBy}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-medium">Date & Time</h4>
                  <p className="text-sm">
                    {format(new Date(selectedEvent.start), 'EEEE, MMMM d, yyyy')}
                    <br />
                    {format(new Date(selectedEvent.start), 'h:mm a')} - {format(new Date(selectedEvent.end), 'h:mm a')}
                  </p>
                </div>
                
                {selectedEvent.location && (
                  <div>
                    <h4 className="text-sm font-medium">Location</h4>
                    <p className="text-sm">{selectedEvent.location}</p>
                  </div>
                )}
                
                {selectedEvent.description && (
                  <div>
                    <h4 className="text-sm font-medium">Description</h4>
                    <p className="text-sm">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
              
              {isHR && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleEditEvent}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  
                  <Button variant="destructive" onClick={handleDeleteEvent}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
