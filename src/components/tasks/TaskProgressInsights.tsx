
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/ui/charts";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart } from "recharts";
import { ArrowUp, ArrowDown, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import DonutChart from "@/components/ui/charts/DonutChart";
import taskService from "@/services/api/taskService";

interface TaskStatistics {
  total: number;
  completed: number;
  in_progress: number;
  pending: number;
  cancelled: number;
  avg_completion_time: number;
  completion_rate: number;
}

interface TaskProgressInsightsProps {
  userId?: number;
  clientId?: number;
  dateRange?: { start: string; end: string };
  className?: string;
}

const TaskProgressInsights: React.FC<TaskProgressInsightsProps> = ({
  userId,
  clientId,
  dateRange,
  className
}) => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['taskStatistics', userId, clientId, dateRange],
    queryFn: async () => {
      return await taskService.getTaskStatistics(userId, clientId, dateRange);
    },
    enabled: !!(userId || clientId)
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress Insights</CardTitle>
          <CardDescription>Analysis of task completion and efficiency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              There was a problem loading the task statistics. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No task data available for analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create chart data
  const statusData = [
    { name: 'Completed', value: stats.completed },
    { name: 'In Progress', value: stats.in_progress },
    { name: 'Pending', value: stats.pending },
    { name: 'Cancelled', value: stats.cancelled }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Task Progress Insights</CardTitle>
        <CardDescription>Analysis of task completion and efficiency</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Status Distribution */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Task Status Distribution</h3>
                <DonutChart 
                  data={statusData} 
                  colors={['#10b981', '#3b82f6', '#f97316', '#ef4444']}
                  nameKey="name"
                  dataKey="value"
                />
              </div>
              
              {/* Completion Rate */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Task Efficiency Metrics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm font-medium">
                        {stats.completion_rate.toFixed(1)}%
                        <Badge className="ml-2" variant={stats.completion_rate > 75 ? "success" : stats.completion_rate > 50 ? "default" : "destructive"}>
                          {stats.completion_rate > 75 ? "Good" : stats.completion_rate > 50 ? "Average" : "Needs Improvement"}
                        </Badge>
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${stats.completion_rate}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Average Completion Time</span>
                      <span className="text-sm font-medium">{stats.avg_completion_time.toFixed(1)} hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Completion Trend */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Task Completion Trend</h3>
                <BarChart 
                  data={[
                    { name: 'Week 1', Completed: 12 },
                    { name: 'Week 2', Completed: 15 },
                    { name: 'Week 3', Completed: 18 },
                    { name: 'Week 4', Completed: 14 }
                  ]} 
                  xAxisKey="name"
                  categories={['Completed']}
                />
              </div>
              
              {/* Efficiency Over Time */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Completion Time Trend</h3>
                <BarChart 
                  data={[
                    { name: 'Week 1', Hours: 5.2 },
                    { name: 'Week 2', Hours: 4.8 },
                    { name: 'Week 3', Hours: 4.5 },
                    { name: 'Week 4', Hours: 4.2 }
                  ]} 
                  xAxisKey="name"
                  categories={['Hours']}
                />
              </div>
              
              {/* Task Type Distribution */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Task Priority Analysis</h3>
                <DonutChart 
                  data={[
                    { name: 'High', value: 12 },
                    { name: 'Medium', value: 18 },
                    { name: 'Low', value: 8 }
                  ]}
                  nameKey="name"
                  dataKey="value"
                  colors={['#ef4444', '#f97316', '#10b981']}
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
