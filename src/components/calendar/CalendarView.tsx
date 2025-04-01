
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CalendarEvent, CalendarViewProps } from '@/interfaces/calendar';
import { CalendarIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isWithinInterval, parseISO } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

const eventTypeColors = {
  company: 'bg-blue-500',
  leave: 'bg-amber-500',
  holiday: 'bg-green-500',
  meeting: 'bg-purple-500',
  other: 'bg-gray-500'
};

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  isHR,
  onAddEvent,
  onEditEvent,
  onDeleteEvent
}) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    type: 'company',
    allDay: true,
    start: format(new Date(), 'yyyy-MM-dd')
  });
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : '';
    setNewEvent(prev => ({ ...prev, start: formattedDate }));
  };
  
  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter(event => {
      if (event.start === dateStr) return true;
      if (event.end && event.start <= dateStr && event.end >= dateStr) return true;
      return false;
    });
  };
  
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.type || !newEvent.start) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (onAddEvent) {
      onAddEvent(newEvent as Omit<CalendarEvent, 'id' | 'createdBy'>);
      toast({
        title: "Success",
        description: "Event added successfully",
      });
    }
    
    setIsDialogOpen(false);
    setNewEvent({
      title: '',
      description: '',
      type: 'company',
      allDay: true,
      start: format(new Date(), 'yyyy-MM-dd')
    });
  };
  
  const handleEditEvent = () => {
    if (!selectedEvent) return;
    
    if (onEditEvent) {
      onEditEvent(selectedEvent);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    }
    
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };
  
  const handleDeleteEvent = () => {
    if (!selectedEvent || !onDeleteEvent) return;
    
    onDeleteEvent(selectedEvent.id);
    toast({
      title: "Success",
      description: "Event deleted successfully",
    });
    
    setIsDialogOpen(false);
    setSelectedEvent(null);
  };
  
  const openEditDialog = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };
  
  const openAddDialog = () => {
    setSelectedEvent(null);
    if (selectedDate) {
      setNewEvent(prev => ({ ...prev, start: format(selectedDate, 'yyyy-MM-dd') }));
    }
    setIsDialogOpen(true);
  };
  
  const renderDayContent = (day: Date) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length === 0) return null;
    
    return (
      <div className="absolute bottom-0 left-0 right-0 px-1">
        {dayEvents.slice(0, 2).map((event, index) => (
          <div 
            key={event.id} 
            className={`${eventTypeColors[event.type]} text-white text-xs px-1 my-0.5 truncate rounded cursor-pointer`}
            onClick={() => openEditDialog(event)}
          >
            {event.title}
          </div>
        ))}
        {dayEvents.length > 2 && (
          <div className="text-xs text-center text-muted-foreground">
            +{dayEvents.length - 2} more
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Company Calendar</CardTitle>
        {isHR && (
          <Button variant="outline" size="sm" onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => (
                  <>
                    <div>{date.getDate()}</div>
                    {renderDayContent(date)}
                  </>
                )
              }}
            />
          </div>
          
          <div className="lg:w-1/4">
            <h3 className="text-lg font-medium mb-4">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            
            {selectedDate && (
              <div className="space-y-4">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map(event => (
                    <div key={event.id} className="border rounded-lg p-3 relative">
                      <div className="flex justify-between">
                        <Badge className={eventTypeColors[event.type]}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                        {isHR && (
                          <div className="space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(event)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => {
                              setSelectedEvent(event);
                              handleDeleteEvent();
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <h4 className="font-medium mt-2">{event.title}</h4>
                      {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                      {event.end && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(parseISO(event.start), 'MMM d')} - {format(parseISO(event.end), 'MMM d')}
                        </p>
                      )}
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Location: {event.location}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Created by: {event.createdBy}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No events for this date
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              <DialogDescription>
                {selectedEvent ? 'Update the event details' : 'Fill in the details for the new event'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={selectedEvent ? selectedEvent.title : newEvent.title}
                  onChange={(e) => selectedEvent 
                    ? setSelectedEvent({...selectedEvent, title: e.target.value})
                    : setNewEvent({...newEvent, title: e.target.value})
                  }
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={selectedEvent ? selectedEvent.description || '' : newEvent.description || ''}
                  onChange={(e) => selectedEvent 
                    ? setSelectedEvent({...selectedEvent, description: e.target.value})
                    : setNewEvent({...newEvent, description: e.target.value})
                  }
                  placeholder="Enter event description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start">Start Date</Label>
                  <Input
                    id="start"
                    type="date"
                    value={selectedEvent ? selectedEvent.start : newEvent.start}
                    onChange={(e) => selectedEvent 
                      ? setSelectedEvent({...selectedEvent, start: e.target.value})
                      : setNewEvent({...newEvent, start: e.target.value})
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end">End Date (Optional)</Label>
                  <Input
                    id="end"
                    type="date"
                    value={selectedEvent ? selectedEvent.end || '' : newEvent.end || ''}
                    onChange={(e) => selectedEvent 
                      ? setSelectedEvent({...selectedEvent, end: e.target.value})
                      : setNewEvent({...newEvent, end: e.target.value})
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={selectedEvent ? selectedEvent.type : newEvent.type}
                  onValueChange={(value: any) => selectedEvent 
                    ? setSelectedEvent({...selectedEvent, type: value})
                    : setNewEvent({...newEvent, type: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company Event</SelectItem>
                    <SelectItem value="leave">Leave</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={selectedEvent ? selectedEvent.location || '' : newEvent.location || ''}
                  onChange={(e) => selectedEvent 
                    ? setSelectedEvent({...selectedEvent, location: e.target.value})
                    : setNewEvent({...newEvent, location: e.target.value})
                  }
                  placeholder="Enter event location"
                />
              </div>
            </div>
            
            <DialogFooter>
              {selectedEvent && (
                <Button variant="destructive" onClick={handleDeleteEvent}>
                  Delete
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={selectedEvent ? handleEditEvent : handleAddEvent}>
                {selectedEvent ? 'Save Changes' : 'Add Event'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
