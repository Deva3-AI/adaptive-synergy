
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, BarChart } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import taskService from '@/services/api/taskService';
import { Progress } from '@/components/ui/progress';

const TaskProgressInsights = () => {
  // Get task statistics
  const { data, isLoading } = useQuery({
    queryKey: ['task-statistics'],
    queryFn: () => taskService.getTaskStatistics(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading task statistics...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Progress Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Completion Rate
              </div>
              <div className="text-2xl font-bold">{data?.completion_rate || 0}%</div>
              <Progress value={data?.completion_rate || 0} className="h-1.5" />
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                On-Time Completion
              </div>
              <div className="text-2xl font-bold">{data?.on_time_completion || 0}%</div>
              <Progress value={data?.on_time_completion || 0} className="h-1.5" />
            </div>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <BarChart className="mr-2 h-4 w-4 text-purple-500" />
                Avg. Duration
              </div>
              <div className="text-2xl font-bold">{data?.average_task_duration || 0} days</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">Recent Completions</h3>
            <div className="space-y-3">
              {data?.recent_completions?.map((task: any, index: number) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-medium text-sm">{task.title}</div>
                    <div className="text-xs text-muted-foreground">{task.client}</div>
                  </div>
                  <div className="text-xs">{task.completed_date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskProgressInsights;
