
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { BarChart, LineChart } from "@/components/ui/charts";
import { DonutChart } from "@/components/ui/charts/DonutChart";
import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/api';
import type { TaskStatistics } from '@/services/api/taskService';

interface TaskProgressInsightsProps {
  userId?: number;
  className?: string;
}

const TaskProgressInsights: React.FC<TaskProgressInsightsProps> = ({ userId, className }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['taskStatistics', userId],
    queryFn: () => taskService.getTaskStatistics(userId),
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>Your task progress and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>No task statistics available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10 text-muted-foreground">
            <p>No task data available. Start working on tasks to see insights.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusData = [
    { name: 'Completed', value: stats.completed },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Pending', value: stats.pending },
    { name: 'Cancelled', value: stats.cancelled },
  ];

  const priorityData = stats.tasksByPriority.map(item => ({
    name: item.priority,
    value: item.count
  }));

  const progressData = stats.tasksByDay.map(item => ({
    name: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    Completed: item.count
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Task Progress</CardTitle>
        <CardDescription>Your task progress and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="priority">Priority</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold">{stats.completed}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  Completed
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold">{stats.inProgress}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-blue-500" />
                  In Progress
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold">{stats.pending}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1 text-yellow-500" />
                  Pending
                </div>
              </div>
              
              <div className="bg-card border rounded-lg p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-semibold">{stats.cancelled}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <XCircle className="h-3 w-3 mr-1 text-red-500" />
                  Cancelled
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Completion Rate</h3>
              <Progress value={stats.completionRate} className="h-2" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{stats.completionRate}% Completed</span>
                <span className="text-xs text-muted-foreground">Target: 80%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium mb-4">Task Status Distribution</h3>
                <div className="h-[200px]">
                  <DonutChart 
                    data={statusData}
                    colors={['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-4">Recent Task Activity</h3>
                <div className="h-[200px]">
                  <LineChart 
                    data={progressData}
                    xAxisKey="name"
                    yAxisKey="Completed"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Task Completion Trend</h3>
              <div className="h-[300px]">
                <BarChart 
                  data={progressData}
                  xAxisKey="name"
                  yAxisKey="Completed"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="priority" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Tasks by Priority</h3>
              <div className="h-[300px]">
                <DonutChart 
                  data={priorityData}
                  colors={['#ef4444', '#f59e0b', '#22c55e']}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskProgressInsights;
