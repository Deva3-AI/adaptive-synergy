
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, RotateCw, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { aiService } from "@/services/api/aiService";
import { toast } from "sonner";

interface TaskRecommendationsProps {
  clientId?: number;
  projectDescription?: string;
  onTaskSelect?: (task: any) => void;
}

const TaskRecommendations = ({ clientId, projectDescription, onTaskSelect }: TaskRecommendationsProps) => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [acceptedTasks, setAcceptedTasks] = useState<string[]>([]);
  const [rejectedTasks, setRejectedTasks] = useState<string[]>([]);

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['task-recommendations', clientId, projectDescription, refreshKey],
    queryFn: async () => {
      if (!clientId && !projectDescription) {
        return { suggested_tasks: [] };
      }
      
      return aiService.generateSuggestedTasks(
        projectDescription || '', 
        clientId
      );
    },
    enabled: !!(clientId || projectDescription),
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    toast.info("Generating new task recommendations...");
  };

  const handleAcceptTask = (task: any) => {
    setAcceptedTasks(prev => [...prev, task.title]);
    if (onTaskSelect) {
      onTaskSelect(task);
    }
    toast.success(`Task "${task.title}" has been added`);
  };

  const handleRejectTask = (task: any) => {
    setRejectedTasks(prev => [...prev, task.title]);
    toast.info(`Task "${task.title}" has been rejected`);
  };

  const isTaskAccepted = (taskTitle: string) => acceptedTasks.includes(taskTitle);
  const isTaskRejected = (taskTitle: string) => rejectedTasks.includes(taskTitle);

  const getPriorityColor = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-700';
      case 'medium':
        return 'bg-yellow-50 text-yellow-700';
      case 'low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-blue-50 text-blue-700';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border rounded-md">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex justify-between mt-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" /> 
              AI-Generated Task Recommendations
            </CardTitle>
            <CardDescription>
              Smart task suggestions based on project requirements
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center h-8"
          >
            <RotateCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!recommendations || recommendations.suggested_tasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No task recommendations available.</p>
            <p className="text-xs mt-1">Add project description or select a client to generate recommendations.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.suggested_tasks.map((task: any, index: number) => (
              <div 
                key={index} 
                className={`p-4 border rounded-md transition-all ${
                  isTaskAccepted(task.title) 
                    ? 'border-green-300 bg-green-50' 
                    : isTaskRejected(task.title)
                    ? 'border-red-300 bg-red-50 opacity-60'
                    : 'hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{task.title}</h4>
                  <Badge className={`ml-2 ${getPriorityColor(task.priority_level || task.priority || 'medium')}`}>
                    {task.priority_level || task.priority || 'Medium'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    Est. {task.estimated_time} hours
                  </div>
                  
                  {isTaskAccepted(task.title) ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Added</span>
                    </div>
                  ) : isTaskRejected(task.title) ? (
                    <span className="text-sm text-muted-foreground">Rejected</span>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRejectTask(task)}
                      >
                        <ThumbsDown className="h-3.5 w-3.5 mr-1.5" />
                        Skip
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleAcceptTask(task)}
                      >
                        <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskRecommendations;
