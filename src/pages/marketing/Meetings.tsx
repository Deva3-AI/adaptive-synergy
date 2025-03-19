
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Video, Phone, Users, PlusCircle, User, MapPin, FileText, Check, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

// Sample data
const upcomingMeetings = [
  {
    id: 1,
    title: "Project Kick-off: ABC Corp",
    date: "2023-09-20T14:00:00",
    duration: 60,
    type: "video",
    client: "ABC Corporation",
    contact: "John Smith",
    position: "Marketing Director",
    prepared: true,
  },
  {
    id: 2,
    title: "Proposal Review: XYZ Ltd",
    date: "2023-09-21T10:30:00",
    duration: 45,
    type: "phone",
    client: "XYZ Limited",
    contact: "Sarah Johnson",
    position: "CEO",
    prepared: true,
  },
  {
    id: 3,
    title: "Follow-up: 123 Industries",
    date: "2023-09-22T15:45:00",
    duration: 30,
    type: "video",
    client: "123 Industries",
    contact: "Robert Davis",
    position: "Product Manager",
    prepared: false,
  },
  {
    id: 4,
    title: "Initial Consultation: New Prospect",
    date: "2023-09-25T13:15:00",
    duration: 60,
    type: "in-person",
    client: "New Prospect Inc.",
    contact: "Emma Williams",
    position: "Operations Director",
    prepared: false,
    address: "123 Business Str, Suite 303, New York, NY",
  },
];

// Past meetings data
const pastMeetings = [
  {
    id: 101,
    title: "Service Review: Existing Client",
    date: "2023-09-15T11:00:00",
    duration: 60,
    type: "video",
    client: "Existing Client Co.",
    contact: "Michael Brown",
    position: "CTO",
    notes: "Discussed current implementation and identified areas for improvement. Client is satisfied but requested additional features.",
    followups: [
      "Send proposal for new features by Sept 20",
      "Schedule technical discussion with development team",
    ],
  },
  {
    id: 102,
    title: "Strategy Session: Marketing Agency",
    date: "2023-09-14T09:30:00",
    duration: 90,
    type: "in-person",
    client: "Top Marketing Agency",
    contact: "Jennifer Lee",
    position: "Creative Director",
    notes: "Presented Q4 marketing strategy. Client approved budget but suggested timeline adjustments.",
    followups: [
      "Revise timeline document",
      "Confirm media placement options",
      "Send updated agreement by EOW",
    ],
  },
];

// Meeting type icon
const getMeetingTypeIcon = (type: string) => {
  switch (type) {
    case "video":
      return <Video className="h-4 w-4" />;
    case "phone":
      return <Phone className="h-4 w-4" />;
    case "in-person":
      return <Users className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const MarketingMeetings = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meeting Schedule</h1>
          <p className="text-muted-foreground">
            Manage client meetings and follow-ups
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Your schedule for the next two weeks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {upcomingMeetings.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="sm:w-1/4">
                    <div className="flex items-center space-x-2 mb-1">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(meeting.date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{format(new Date(meeting.date), "h:mm a")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getMeetingTypeIcon(meeting.type)}
                      <span className="capitalize">{meeting.type}</span>
                    </div>
                  </div>
                  
                  <div className="sm:w-2/4">
                    <h3 className="font-semibold mb-1">{meeting.title}</h3>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{meeting.contact}</span>
                      <span className="text-xs text-muted-foreground">({meeting.position})</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{meeting.client}</div>
                    {meeting.type === "in-person" && meeting.address && (
                      <div className="flex items-center space-x-2 mt-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{meeting.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="sm:w-1/4 flex flex-row sm:flex-col sm:items-end gap-2 mt-2 sm:mt-0">
                    <Button variant="outline" size="sm" className="sm:w-full">Agenda</Button>
                    <div className="flex items-center space-x-1 text-xs">
                      <span>Preparation:</span>
                      {meeting.prepared ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Meetings</CardTitle>
              <CardDescription>Recent meetings and their outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="meetings">
                <TabsList className="mb-4">
                  <TabsTrigger value="meetings">Meetings</TabsTrigger>
                  <TabsTrigger value="followups">Follow-ups</TabsTrigger>
                </TabsList>
                <TabsContent value="meetings" className="space-y-4">
                  {pastMeetings.map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                        <div>
                          <h3 className="font-medium">{meeting.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{format(new Date(meeting.date), "MMM d, yyyy")}</span>
                            <span>•</span>
                            <span>{format(new Date(meeting.date), "h:mm a")}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              {getMeetingTypeIcon(meeting.type)}
                              <span className="ml-1 capitalize">{meeting.type}</span>
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Meeting Notes
                        </Button>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">Summary:</div>
                        <p className="text-sm text-muted-foreground">{meeting.notes}</p>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-1">Follow-up Items:</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {meeting.followups.map((item, i) => (
                            <li key={i} className="flex items-start">
                              <Check className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="followups">
                  <div className="rounded-md border p-8 text-center">
                    <h3 className="font-medium">Follow-up Tasks View</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pending follow-up items would appear here
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>View and select meeting dates</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
            />
            
            <div className="mt-6">
              <h3 className="font-medium mb-3">Today's Schedule</h3>
              <div className="space-y-2">
                {upcomingMeetings.length > 0 ? (
                  <div className="p-3 rounded-md bg-muted/50 text-sm">
                    <div className="font-medium">Project Kick-off: ABC Corp</div>
                    <div className="flex justify-between mt-1 text-muted-foreground">
                      <span>2:00 PM - 3:00 PM</span>
                      <span className="flex items-center">
                        <Video className="h-3 w-3 mr-1" />
                        Video
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No meetings scheduled for today.</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Meeting
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Note
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingMeetings;
