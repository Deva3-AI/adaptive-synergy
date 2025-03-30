
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Check, Clock, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';
import aiService from '@/services/api/aiService';
import taskService from '@/services/api/taskService';

interface TaskRecommendationsProps {
  userId: number;
  className?: string;
}

const TaskRecommendations: React.FC<TaskRecommendationsProps> = ({ userId, className }) => {
  // Fetch AI-recommended tasks for the user
  const { data: recommendedTasks = [], isLoading } = useQuery({
    queryKey: ['recommendedTasks', userId],
    queryFn: () => aiService.getTaskRecommendations(userId),
  });

  // Fetch user's current tasks for context
  const { data: userTasks = [] } = useQuery({
    queryKey: ['userTasks', userId],
    queryFn: () => taskService.getTasks({ assigned_to: Number(userId) }),
  });

  const calculateTaskCompletion = (taskId: number) => {
    const task = userTasks.find(task => task.task_id === taskId);
    if (!task) return 0;
    // Example: Assuming description length indicates progress
    return Math.min(100, (task.description?.length || 0) * (100 / 200));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI Task Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading task recommendations...</p>
        ) : recommendedTasks.length > 0 ? (
          <ul className="space-y-4">
            {recommendedTasks.map((task, index) => (
              <li key={index} className="border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <Button size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </div>
                <p className="text-sm mt-2">{task.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      Due: <CalendarClock className="ml-1 h-3 w-3" />
                    </Badge>
                    <Badge variant="outline">
                      Priority: High
                    </Badge>
                  </div>
                  <div className="w-1/2">
                    <Progress value={calculateTaskCompletion(task.task_id)} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No task recommendations found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskRecommendations;
