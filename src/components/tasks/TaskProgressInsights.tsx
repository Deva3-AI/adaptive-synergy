import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, LineChart, PieChart, DonutChart } from "@/components/ui/charts";
import { useQuery } from '@tanstack/react-query';
import taskService from '@/services/api/taskService';
import { TaskStatistics } from '@/services/api';
import { ChartPieIcon, BarChartIcon, ArrowUpRightIcon, ArrowDownRightIcon, ClockIcon, CheckIcon } from "lucide-react";

interface TaskProgressInsightsProps {
  userId?: number;
  className?: string;
}

const TaskProgressInsights: React.FC<TaskProgressInsightsProps> = ({ userId, className }) => {
  const [timeFrame, setTimeFrame] = useState('last_30_days');
  const [selectedChart, setSelectedChart] = useState('task_type');

  const { data: taskStats, isLoading, error } = useQuery({
    queryKey: ['task-statistics', userId, timeFrame],
    queryFn: async () => {
      try {
        // Mock API call to fetch task statistics
        // In a real application, replace this with an actual API call
        const mockStats: TaskStatistics = {
          total: 150,
          completed: 90,
          in_progress: 30,
          pending: 20,
          cancelled: 10,
          avg_completion_time: 72,
          completion_rate: 60
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockStats;
      } catch (error) {
        console.error('Error fetching task statistics:', error);
        return null;
      }
    }
  });

  const taskTypeData = [
    { name: 'Design', value: 35 },
    { name: 'Development', value: 40 },
    { name: 'Testing', value: 15 },
    { name: 'Documentation', value: 10 }
  ];

  const completionTrendData = [
    { name: 'Week 1', value: 15 },
    { name: 'Week 2', value: 22 },
    { name: 'Week 3', value: 28 },
    { name: 'Week 4', value: 25 }
  ];

  const timeByTaskTypeData = [
    { name: 'Design', value: 80 },
    { name: 'Development', value: 120 },
    { name: 'Testing', value: 40 },
    { name: 'Documentation', value: 30 }
  ];

  const statusDistributionData = [
    { name: 'Completed', value: 60 },
    { name: 'In Progress', value: 20 },
    { name: 'Pending', value: 13 },
    { name: 'Cancelled', value: 7 }
  ];

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress Insights</CardTitle>
          <CardDescription>Loading performance metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !taskStats) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress Insights</CardTitle>
          <CardDescription>Error loading performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load task statistics. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Task Progress Insights</CardTitle>
        <CardDescription>
          Performance metrics and completion trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="task_type" className="space-y-4">
          <TabsList>
            <TabsTrigger value="task_type">
              <ChartPieIcon className="mr-2 h-4 w-4" />
              Task Types
            </TabsTrigger>
            <TabsTrigger value="completion_trend">
              <ArrowUpRightIcon className="mr-2 h-4 w-4" />
              Completion Trend
            </TabsTrigger>
            <TabsTrigger value="time_by_type">
              <BarChartIcon className="mr-2 h-4 w-4" />
              Time by Type
            </TabsTrigger>
            <TabsTrigger value="status_distribution">
              <ClockIcon className="mr-2 h-4 w-4" />
              Status Distribution
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="task_type" className="space-y-2">
            <div className="text-sm font-medium">Task Types</div>
            <DonutChart
              data={taskTypeData}
              nameKey="name"
              dataKey="value"
              colors={["#8884d8", "#82ca9d", "#ffc658", "#ff8042"]}
            />
          </TabsContent>
          
          <TabsContent value="completion_trend" className="space-y-2">
            <div className="text-sm font-medium">Completion Trend</div>
            <LineChart
              data={completionTrendData}
              xAxisKey="name"
              series={[
                { key: "value", label: "Tasks Completed", color: "#8884d8" }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="time_by_type" className="space-y-2">
            <div className="text-sm font-medium">Time by Task Type</div>
            <BarChart
              data={timeByTaskTypeData}
              xAxisKey="name"
              series={[
                { key: "value", label: "Hours Spent", color: "#82ca9d" }
              ]}
            />
          </TabsContent>
          
          <TabsContent value="status_distribution" className="space-y-2">
            <div className="text-sm font-medium">Status Distribution</div>
            <DonutChart
              data={statusDistributionData}
              nameKey="name"
              dataKey="value"
              colors={["#8884d8", "#82ca9d", "#ffc658", "#ff8042"]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskProgressInsights;
