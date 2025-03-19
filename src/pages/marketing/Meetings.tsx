
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarClock, Users, Video, Calendar, Check, X, Clock, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DashboardCard from "@/components/dashboard/DashboardCard";

const MarketingMeetings = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meeting Scheduler</h1>
          <p className="text-muted-foreground">
            Schedule and manage your meetings with leads and clients
          </p>
        </div>
        <Button>
          <CalendarClock className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Next at 2:00 PM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Confirmations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 high priority leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's Schedule</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">5 more than last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Today's Schedule"
          icon={<Calendar className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {[
              {
                title: "Product Demo with Acme Corp",
                time: "10:00 AM - 11:00 AM",
                type: "Video Call",
                attendees: 3,
                status: "completed"
              },
              {
                title: "Initial Discovery Call with NewTech",
                time: "12:30 PM - 1:15 PM",
                type: "Phone Call",
                attendees: 2,
                status: "completed"
              },
              {
                title: "Marketing Strategy with GlobalMedia",
                time: "2:00 PM - 3:00 PM",
                type: "Video Call",
                attendees: 5,
                status: "upcoming"
              },
              {
                title: "Follow-up with LeadGen Inc",
                time: "4:30 PM - 5:00 PM",
                type: "Video Call",
                attendees: 2,
                status: "upcoming"
              }
            ].map((meeting, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <div className={`px-4 py-2 flex items-center justify-between ${
                  meeting.status === "completed" ? "bg-muted" : 
                  meeting.status === "upcoming" ? "bg-primary/10" : ""
                }`}>
                  <div className="flex items-center">
                    {meeting.status === "completed" ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <Clock className="h-4 w-4 text-primary mr-2" />
                    )}
                    <span className="text-sm font-medium">{meeting.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                      {meeting.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{meeting.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{meeting.attendees} attendees</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8">
                      {meeting.status === "upcoming" ? (
                        <>
                          Join
                          <Video className="ml-2 h-3 w-3" />
                        </>
                      ) : (
                        <>
                          View Notes
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard
          title="Pending Confirmations"
          icon={<Clock className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {[
              {
                name: "Sarah Johnson",
                company: "InnovateX",
                position: "Marketing Director",
                proposed: ["Tomorrow at 10:00 AM", "Tomorrow at 2:00 PM", "Friday at 11:00 AM"],
                priority: "high"
              },
              {
                name: "Michael Chang",
                company: "TechVentures",
                position: "CEO",
                proposed: ["Thursday at 9:00 AM", "Friday at 3:00 PM"],
                priority: "high"
              },
              {
                name: "Emma Wilson",
                company: "DesignHub",
                position: "Creative Director",
                proposed: ["Next Monday at 1:00 PM", "Next Tuesday at 11:00 AM"],
                priority: "medium"
              }
            ].map((lead, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{lead.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        lead.priority === "high" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {lead.priority} priority
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {lead.position} at {lead.company}
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <p className="text-xs font-medium">Proposed times:</p>
                      {lead.proposed.map((time, timeIndex) => (
                        <div key={timeIndex} className="flex items-center justify-between text-sm">
                          <span>{time}</span>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-6 w-6">
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-6 w-6">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default MarketingMeetings;
