
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, MessageSquare } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import clientService from '@/services/api/clientService';
import { Skeleton } from "@/components/ui/skeleton";

const ClientRequirementsPanel = ({ clientId }: { clientId: number }) => {
  const { data: preferences, isLoading } = useQuery({
    queryKey: ['client-preferences', clientId],
    queryFn: () => clientService.getClientPreferences(clientId),
    enabled: !!clientId
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No client preferences found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Requirements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Communication Preferences</h3>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{preferences.communication_channel || preferences.preferred_contact_method || 'Email'}</span>
              <span className="text-xs text-muted-foreground">
                ({preferences.feedback_frequency || preferences.communication_frequency || 'As needed'} feedback)
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Design Preferences</h3>
            <p className="text-sm">{preferences.design_preferences ? 
              (typeof preferences.design_preferences === 'string' ?
                preferences.design_preferences :
                JSON.stringify(preferences.design_preferences)) :
              'No specific preferences recorded'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Dos</h3>
            <ul className="space-y-1">
              {(preferences.dos && preferences.dos.length > 0) ? (
                preferences.dos.map((item: string, index: number) => (
                  <li key={index} className="text-sm flex items-start">
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No specific guidelines provided</li>
              )}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-1">Don'ts</h3>
            <ul className="space-y-1">
              {(preferences.donts && preferences.donts.length > 0) ? (
                preferences.donts.map((item: string, index: number) => (
                  <li key={index} className="text-sm flex items-start">
                    <X className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No specific restrictions provided</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientRequirementsPanel;
