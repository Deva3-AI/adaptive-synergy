
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Plus, RefreshCw } from "lucide-react";
import MeetingAnalysisCard from "@/components/ai/MeetingAnalysisCard";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MarketingMeetings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
          <p className="text-muted-foreground">
            Schedule, manage, and analyze your marketing meetings
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          title="Meeting Management"
          icon={<Calendar className="h-5 w-5" />}
        >
          <div className="space-y-6">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                <TabsTrigger value="past" className="flex-1">Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="space-y-4 pt-2">
                {[
                  {
                    title: "Client Onboarding Call",
                    date: "Tomorrow, 10:00 AM",
                    participants: ["You", "Jane Smith", "Mark Wilson"],
                    client: "Koala Digital",
                    type: "Zoom"
                  },
                  {
                    title: "Marketing Strategy Review",
                    date: "Sep 28, 3:30 PM",
                    participants: ["You", "Team Lead", "Client Team"],
                    client: "AC Digital",
                    type: "Google Meet"
                  },
                  {
                    title: "Campaign Planning",
                    date: "Oct 3, 2:00 PM",
                    participants: ["You", "Marketing Team"],
                    client: "Internal",
                    type: "Office"
                  }
                ].map((meeting, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{meeting.title}</CardTitle>
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          {meeting.type}
                        </span>
                      </div>
                      <CardDescription>{meeting.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-col space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Client:</span> {meeting.client}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Participants:</span> {meeting.participants.join(", ")}
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="past" className="space-y-4 pt-2">
                {[
                  {
                    title: "Campaign Review",
                    date: "Sep 18, 11:00 AM",
                    participants: ["You", "Design Team", "Client Team"],
                    client: "Social Land",
                    type: "Zoom",
                    hasTranscript: true
                  },
                  {
                    title: "Monthly Progress Update",
                    date: "Sep 10, 2:30 PM",
                    participants: ["You", "Project Manager", "Client"],
                    client: "Muse Digital",
                    type: "Google Meet",
                    hasTranscript: true
                  },
                  {
                    title: "Initial Discovery Call",
                    date: "Sep 5, 10:00 AM",
                    participants: ["You", "Sales Team", "Potential Client"],
                    client: "Internet People",
                    type: "Phone",
                    hasTranscript: false
                  }
                ].map((meeting, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{meeting.title}</CardTitle>
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          {meeting.type}
                        </span>
                      </div>
                      <CardDescription>{meeting.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex flex-col space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Client:</span> {meeting.client}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Participants:</span> {meeting.participants.join(", ")}
                        </div>
                        <div className="pt-2 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            View Summary
                          </Button>
                          {meeting.hasTranscript && (
                            <Button variant="outline" size="sm" className="flex-1">
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              Transcript
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
            
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Load More Meetings
            </Button>
          </div>
        </DashboardCard>
        
        <MeetingAnalysisCard />
      </div>
    </div>
  );
};

export default MarketingMeetings;
