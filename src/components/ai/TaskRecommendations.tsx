
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Check, Clock, CalendarClock, Brain, Sparkles, User, RotateCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from '@tanstack/react-query';
import aiService from "@/services/api/aiService";
import taskService from "@/services/api/taskService";
import { toast } from 'sonner';
import { Task } from '@/services/api';

interface TaskRecommendationsProps {
  userId: number;
  clientId?: number;
  className?: string;
}

const TaskRecommendations: React.FC<TaskRecommendationsProps> = ({ 
  userId, 
  clientId,
  className 
}) => {
  const [creatingTaskId, setCreatingTaskId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch recommendations from AI service
  const { data: recommendedTasks = [], isLoading, refetch } = useQuery({
    queryKey: ['recommendedTasks', userId, clientId, refreshKey],
    queryFn: async () => {
      try {
        return await aiService.getAITaskRecommendations(userId);
      } catch (error) {
        console.error('Error fetching task recommendations:', error);
        return [];
      }
    },
  });

  // Fetch user's current tasks for context
  const { data: userTasks = [] } = useQuery({
    queryKey: ['userTasks', userId],
    queryFn: async () => {
      try {
        return await taskService.getTasks({ assignedTo: userId });
      } catch (error) {
        console.error('Error fetching user tasks:', error);
        return [];
      }
    },
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
    toast.info("Refreshing AI task recommendations...");
  };

  const handleCreateTask = async (task: any) => {
    if (!task) return;
    
    setCreatingTaskId(task.task_id);
    
    try {
      // Prepare task data with client ID if available
      const taskData = {
        title: task.title,
        description: task.description,
        assigned_to: userId,
        status: "pending" as "pending" | "in_progress" | "completed" | "cancelled",
        estimated_time: task.estimated_time || 1,
        ...(clientId ? { client_id: clientId } : {})
      };
      
      await taskService.createTask(taskData);
      toast.success("Task added to your list");
      
      // Refresh recommendations after creating a task
      refetch();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    } finally {
      setCreatingTaskId(null);
    }
  };

  const calculateTaskCompletion = (taskId: number) => {
    const task = userTasks.find(task => task.task_id === taskId);
    if (!task) return 0;
    return task.progress || 0;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>AI Task Recommendations</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Brain className="h-3.5 w-3.5" />
              <span>AI Powered</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border rounded-md p-4 animate-pulse">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-1"></div>
                <div className="h-4 bg-muted rounded w-5/6 mb-3"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-8 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>AI Task Recommendations</CardTitle>
            <CardDescription>
              Personalized tasks based on your work patterns
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            title="Refresh recommendations"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recommendedTasks.length > 0 ? (
          <ul className="space-y-4">
            {recommendedTasks.map((task, index) => (
              <li key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{task.title}</h3>
                  <Badge variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 
                    'secondary'
                  }>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      <span>{task.estimated_time} hrs</span>
                    </div>
                    
                    {calculateTaskCompletion(task.task_id) > 0 && (
                      <div className="flex items-center">
                        <Check className="mr-1 h-3.5 w-3.5 text-green-500" />
                        <span>{calculateTaskCompletion(task.task_id)}% done</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateTask(task)}
                    disabled={creatingTaskId === task.task_id}
                  >
                    {creatingTaskId === task.task_id ? (
                      <>
                        <RotateCw className="mr-1 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="mr-1 h-4 w-4" />
                        Add Task
                      </>
                    )}
                  </Button>
                </div>
                
                {calculateTaskCompletion(task.task_id) > 0 && (
                  <Progress 
                    value={calculateTaskCompletion(task.task_id)} 
                    className="h-1 mt-3" 
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-3" />
            <p className="text-muted-foreground">No task recommendations available</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={handleRefresh}>
              <RotateCw className="mr-1 h-4 w-4" />
              Generate Recommendations
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-center">
          <Brain className="h-3 w-3 mr-1 opacity-70" />
          <span>Recommendations based on your work patterns and client requirements</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskRecommendations;
