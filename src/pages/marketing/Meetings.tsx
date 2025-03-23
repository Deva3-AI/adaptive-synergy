
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MarketingMeetings from "@/components/marketing/MarketingMeetings";
import MeetingAnalysis from "@/components/marketing/MeetingAnalysis";

const Meetings = () => {
  return (
    <div className="space-y-8 animate-blur-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Marketing Meetings</h1>
        <p className="text-muted-foreground">
          Schedule, manage, and analyze client meetings
        </p>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Meetings</TabsTrigger>
          <TabsTrigger value="analysis">Meeting Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <MarketingMeetings />
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-6">
          <MeetingAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Meetings;
