
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PaletteIcon, LayoutGrid, MessageCircle, ClipboardList, History } from "lucide-react";
import { clientService } from '@/services/api';

const ClientRequirementsPanel = ({ clientId }: { clientId: number }) => {
  // Fetch client preferences
  const { data: preferences, isLoading: isPreferencesLoading } = useQuery({
    queryKey: ['client-preferences', clientId],
    queryFn: () => clientService.getClientPreferences(clientId),
    enabled: !!clientId,
  });

  if (isPreferencesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Requirements</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Requirements</CardTitle>
          <CardDescription>No client preferences found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">
            No preference data available for this client.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Requirements</CardTitle>
        <CardDescription>Key preferences and past project history</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="design">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="design" className="flex items-center">
              <PaletteIcon className="h-4 w-4 mr-2" />
              <span>Design</span>
            </TabsTrigger>
            <TabsTrigger value="communication">
              <MessageCircle className="h-4 w-4 mr-2" />
              <span>Communication</span>
            </TabsTrigger>
            <TabsTrigger value="project">
              <ClipboardList className="h-4 w-4 mr-2" />
              <span>Project</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="design" className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Color Scheme</h4>
                <p className="text-sm">{preferences.designPreferences.colorScheme}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Typography</h4>
                <p className="text-sm">{preferences.designPreferences.typography}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Layout Style</h4>
                <p className="text-sm">{preferences.designPreferences.layoutStyle}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="communication" className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Preferred Channel</h4>
                <Badge variant="outline">{preferences.communicationPreferences.preferredChannel}</Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Response Time</h4>
                <p className="text-sm">{preferences.communicationPreferences.responseTime}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Meeting Frequency</h4>
                <p className="text-sm">{preferences.communicationPreferences.meetingFrequency}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="project" className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Revision Cycles</h4>
                <p className="text-sm">{preferences.projectPreferences.revisionCycles}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Delivery Format</h4>
                <p className="text-sm">{preferences.projectPreferences.deliveryFormat}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Feedback Style</h4>
                <p className="text-sm">{preferences.projectPreferences.feedbackStyle}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <History className="h-4 w-4 mr-2" />
            <h3 className="font-medium">Project History</h3>
          </div>
          
          <div className="space-y-3">
            {preferences.history.map((item, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{item.project}</h4>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">"{item.feedback}"</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientRequirementsPanel;
