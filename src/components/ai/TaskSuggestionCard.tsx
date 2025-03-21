
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Plus, User } from "lucide-react";
import { toast } from 'sonner';
import { clientService } from '@/services/api';

interface TaskSuggestion {
  title: string;
  description: string;
  estimated_time: number;
  priority_level?: 'low' | 'medium' | 'high';
}

interface TaskSuggestionCardProps {
  clientId?: number;
  clientName?: string;
  suggestions: TaskSuggestion[];
  onTaskCreated?: () => void;
  isLoading?: boolean;
}

const TaskSuggestionCard = ({
  clientId,
  clientName,
  suggestions,
  onTaskCreated,
  isLoading = false
}: TaskSuggestionCardProps) => {
  const [creatingTaskId, setCreatingTaskId] = useState<number | null>(null);

  const handleCreateTask = async (suggestion: TaskSuggestion, index: number) => {
    if (!clientId) {
      toast.error('Client ID is required to create a task');
      return;
    }

    try {
      setCreatingTaskId(index);
      
      const taskData = {
        title: suggestion.title,
        description: suggestion.description,
        client_id: clientId,
        estimated_time: suggestion.estimated_time,
        priority: suggestion.priority_level || 'medium',
        status: 'pending'
      };
      
      await clientService.createTask(taskData);
      
      toast.success('Task created successfully');
      if (onTaskCreated) onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setCreatingTaskId(null);
    }
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">AI Task Suggestions</CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
              <Brain className="h-4 w-4" />
              <span>AI Generated</span>
            </Badge>
          </div>
          <CardDescription className="h-4 bg-muted rounded w-3/4"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-md p-4">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-1"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">AI Task Suggestions</CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
            <Brain className="h-4 w-4" />
            <span>AI Generated</span>
          </Badge>
        </div>
        {clientName && (
          <CardDescription className="text-sm text-muted-foreground">
            For client: {clientName}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No task suggestions available
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, idx) => (
              <div key={idx} className="border rounded-md p-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{suggestion.title}</h4>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{suggestion.estimated_time} hrs</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  {clientId && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="self-end mt-2"
                      onClick={() => handleCreateTask(suggestion, idx)}
                      disabled={creatingTaskId === idx}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {creatingTaskId === idx ? 'Creating...' : 'Create Task'}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground italic">
        AI-generated suggestions based on client requirements and historical data
      </CardFooter>
    </Card>
  );
};

export default TaskSuggestionCard;
