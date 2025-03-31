
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Calendar, CheckCircle, PlusCircle, Sparkles, ChevronRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import aiService from "@/services/api/aiService";
import taskService from "@/services/api/taskService";
import { Task } from '@/interfaces/tasks';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskRecommendationsProps {
  userId: number;
  className?: string;
}

const TaskRecommendations: React.FC<TaskRecommendationsProps> = ({ userId, className }) => {
  const [creatingTask, setCreatingTask] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch AI task recommendations
  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ['ai-task-recommendations', userId],
    queryFn: () => aiService.generateAITaskRecommendations(userId),
  });

  // Add task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: Partial<Task>) => {
      const result = await taskService.createTask(taskData);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create task');
      console.error('Error creating task:', error);
    },
    onSettled: () => {
      setCreatingTask(null);
    },
  });

  const handleCreateTask = (task: any) => {
    setCreatingTask(task.task_id);
    
    const taskData = {
      client_id: task.client_id,
      title: task.title,
      description: task.description,
      assigned_to: userId,
      status: "pending" as const,
      estimated_time: task.estimated_time
    };
    
    createTaskMutation.mutate(taskData);
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-muted/40 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Task Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-center text-muted-foreground">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2 align-middle" />
            Analyzing your work patterns and generating recommendations...
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            Failed to generate recommendations
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No recommendations available at this time
          </div>
        ) : (
          <div className="divide-y">
            {recommendations.map((task: any) => (
              <div key={task.task_id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.estimated_time} hours
                      </div>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' : 
                        task.priority === 'medium' ? 'default' : 
                        'secondary'
                      } className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1"
                    onClick={() => handleCreateTask(task)}
                    disabled={createTaskMutation.isPending && creatingTask === task.task_id}
                  >
                    {createTaskMutation.isPending && creatingTask === task.task_id ? (
                      <>
                        <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-3 w-3" />
                        Add Task
                      </>
                    )}
                  </Button>
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
