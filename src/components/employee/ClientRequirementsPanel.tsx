
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, ThumbsDown, AlertCircle, History, User, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { clientService } from '@/services/api';

interface ClientPreference {
  id: number;
  description: string;
  type: 'like' | 'dislike' | 'requirement';
  source: string;
  date: string;
}

interface ClientRequirementsPanelProps {
  clientId?: number;
  taskId?: number;
}

const ClientRequirementsPanel = ({ clientId, taskId }: ClientRequirementsPanelProps) => {
  const { data: clientDetails, isLoading: isLoadingClient } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => clientId ? clientService.getClientById(clientId) : Promise.resolve(null),
    enabled: !!clientId,
  });

  const { data: clientPreferences = [], isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['clientPreferences', clientId],
    queryFn: () => clientId 
      ? clientService.getClientPreferences(clientId)
      : Promise.resolve([]),
    enabled: !!clientId,
  });

  // Organize preferences by type
  const requirements = clientPreferences.filter(pref => pref.type === 'requirement');
  const likes = clientPreferences.filter(pref => pref.type === 'like');
  const dislikes = clientPreferences.filter(pref => pref.type === 'dislike');

  const renderPreferenceItem = (preference: ClientPreference) => (
    <div key={preference.id} className="flex items-start gap-2 py-2 border-b last:border-0">
      {preference.type === 'like' && <ThumbsUp className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />}
      {preference.type === 'dislike' && <ThumbsDown className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />}
      {preference.type === 'requirement' && <AlertCircle className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />}
      <div className="flex-1">
        <p className="text-sm">{preference.description}</p>
        <div className="flex items-center gap-1 mt-1">
          <Badge variant="outline" className="text-xs px-1 py-0 h-5">
            {preference.source === 'email' && <MessageSquare className="h-3 w-3 mr-1" />}
            {preference.source === 'meeting' && <User className="h-3 w-3 mr-1" />}
            {preference.source === 'feedback' && <History className="h-3 w-3 mr-1" />}
            {preference.source}
          </Badge>
          <span className="text-xs text-muted-foreground">{new Date(preference.date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  if (isLoadingClient || isLoadingPreferences) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientId || !clientDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Requirements</CardTitle>
          <CardDescription>No client selected</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span>Client Requirements</span>
          {clientDetails.logo && (
            <img 
              src={clientDetails.logo} 
              alt={clientDetails.client_name} 
              className="h-6 w-6 rounded-full object-cover" 
            />
          )}
        </CardTitle>
        <CardDescription>{clientDetails.client_name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ScrollArea className="h-[300px]">
          {requirements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Requirements</h4>
              <div className="space-y-1">
                {requirements.map(renderPreferenceItem)}
              </div>
            </div>
          )}

          {likes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <ThumbsUp className="h-3.5 w-3.5 text-green-500 mr-1" />
                <span>Preferences</span>
              </h4>
              <div className="space-y-1">
                {likes.map(renderPreferenceItem)}
              </div>
            </div>
          )}

          {dislikes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <ThumbsDown className="h-3.5 w-3.5 text-red-500 mr-1" />
                <span>Avoid</span>
              </h4>
              <div className="space-y-1">
                {dislikes.map(renderPreferenceItem)}
              </div>
            </div>
          )}

          {clientPreferences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No specific requirements found for this client.</p>
              <p className="text-xs mt-1">Requirements are gathered from previous interactions and feedback.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ClientRequirementsPanel;
