
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, PlusCircle, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskService } from '@/services/api/taskService';

interface TaskSuggestionCardProps {
  clientId: number;
  clientName: string;
  suggestions: Array<{
    title: string;
    description: string;
    priority_level: string;
    estimated_time: number;
  }>;
  onTaskCreated?: () => void;
  isLoading?: boolean;
}

const TaskSuggestionCard: React.FC<TaskSuggestionCardProps> = ({
  clientId,
  clientName,
  suggestions,
  onTaskCreated,
  isLoading = false
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge variant="default">Medium Priority</Badge>;
      default:
        return <Badge variant="secondary">Low Priority</Badge>;
    }
  };
  
  const handleCreateTask = async (suggestion: any) => {
    try {
      await taskService.createTask({
        title: suggestion.title,
        description: suggestion.description,
        client_id: clientId,
        client_name: clientName,
        priority: suggestion.priority_level,
        estimated_hours: suggestion.estimated_time,
        status: 'pending',
        progress: 0
      });
      
      toast.success('Task created successfully');
      
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Suggested Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        ) : suggestions && suggestions.length > 0 ? (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                    <div className="flex-1">
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-sm text-muted-foreground">{suggestion.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(suggestion.priority_level)}
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {suggestion.estimated_time} hrs
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => handleCreateTask(suggestion)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No task suggestions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskSuggestionCard;
