
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, LineChart, PieChart, DonutChart } from "@/components/ui/charts";
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { taskService, TaskStatistics } from '@/services/api';
import { formatPercentage, formatDuration } from '@/utils/formatters';

interface TaskProgressInsightsProps {
  userId?: number;
}

export const TaskProgressInsights: React.FC<TaskProgressInsightsProps> = ({ userId }) => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['task-statistics', userId],
    queryFn: () => taskService.getTaskStatistics(userId)
  });

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg animate-pulse">Loading insights...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-muted rounded-lg p-4 animate-pulse">
                <div className="h-4 w-1/2 bg-muted-foreground/20 rounded mb-2"></div>
                <div className="h-6 w-3/4 bg-muted-foreground/20 rounded"></div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  // Handle no data state
  if (!statistics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">No task insights available</CardTitle>
          <CardDescription>Complete some tasks to see performance insights</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Prepare data for charts
  const taskStatusData = [
    { name: 'Completed', value: statistics.completed_tasks },
    { name: 'In Progress', value: statistics.in_progress_tasks },
    { name: 'Pending', value: statistics.pending_tasks },
    { name: 'Overdue', value: statistics.overdue_tasks }
  ];

  const taskDistributionData = statistics.task_distribution.map(item => ({
    name: item.name,
    value: item.value
  }));

  const monthlyTrendsForChart = statistics.monthly_trends.map(item => ({
    name: item.month,
    Completed: item.completed,
    Assigned: item.assigned
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Task Performance Insights</CardTitle>
        <CardDescription>Analytics on task completion and efficiency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-background rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Completion Rate</div>
            <div className="text-2xl font-bold">{formatPercentage(statistics.completion_rate)}</div>
            <Progress value={statistics.completion_rate} className="mt-2" />
          </div>
          
          <div className="bg-background rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">On-Time Completion</div>
            <div className="text-2xl font-bold">{formatPercentage(statistics.on_time_completion)}</div>
            <Progress value={statistics.on_time_completion} className="mt-2" />
          </div>
          
          <div className="bg-background rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Avg. Completion Time</div>
            <div className="text-2xl font-bold">{formatDuration(statistics.average_task_duration)}</div>
            <div className="text-xs text-muted-foreground mt-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Per completed task
            </div>
          </div>
          
          <div className="bg-background rounded-lg border p-4">
            <div className="text-sm text-muted-foreground mb-1">Recent Completions</div>
            <div className="text-2xl font-bold">{statistics.recent_completions?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-2 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              In the last 30 days
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="distribution" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Task Distribution</span>
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <DonutChart className="h-4 w-4" />
              <span className="hidden sm:inline">Task Status</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Monthly Trends</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="mt-0">
            <div className="h-80">
              <PieChart data={taskDistributionData} />
            </div>
          </TabsContent>
          
          <TabsContent value="status" className="mt-0">
            <div className="h-80">
              <DonutChart data={taskStatusData} />
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="mt-0">
            <div className="h-80">
              <LineChart 
                data={monthlyTrendsForChart} 
                xAxisKey="name"
                series={[
                  { key: "Completed", color: "hsl(var(--primary))" },
                  { key: "Assigned", color: "hsl(var(--muted-foreground))" }
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {statistics.overdue_tasks > 0 && (
          <div className="mt-6 bg-destructive/10 rounded-lg p-4 border border-destructive/20">
            <div className="flex items-center gap-2 text-destructive font-medium mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Attention Required</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You have {statistics.overdue_tasks} overdue {statistics.overdue_tasks === 1 ? 'task' : 'tasks'} that require immediate attention.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskProgressInsights;
