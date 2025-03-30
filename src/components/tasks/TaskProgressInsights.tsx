import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, CalendarClock, BarChart3, TrendingUp } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { LineChart, BarChart } from "@/components/ui/charts";
import DonutChart from "@/components/ui/charts/DonutChart";
import { Skeleton } from "@/components/ui/skeleton";
import taskService, { TaskStatistics } from '@/services/api/taskService';

interface TaskProgressInsightsProps {
  userId: number;
  className?: string;
}

const TaskProgressInsights: React.FC<TaskProgressInsightsProps> = ({ userId, className }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['task-statistics', userId],
    queryFn: () => taskService.getTaskStatistics(userId),
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Task Progress Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Tasks</CardTitle>
                  <CardDescription>Total tasks completed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.completed_tasks || 0}</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4" />
                    <span>Since last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Tasks yet to be started</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats?.pending_tasks || 0}</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Awaiting assignment</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Rate</CardTitle>
                <CardDescription>Percentage of tasks completed on time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.completion_rate || 0}%</div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CalendarClock className="h-4 w-4" />
                  <span>Compared to the previous period</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Task Trends</CardTitle>
                <CardDescription>Tasks completed and assigned over time</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Update LineChart usage */}
                <LineChart
                  data={stats?.monthly_trends || []}
                  xAxisKey="month"
                  yAxisKey="completed"
                  series={[
                    { key: "completed", label: "Completed", color: "hsl(var(--primary))" },
                    { key: "assigned", label: "Assigned", color: "hsl(var(--muted-foreground))" }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="distribution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution by Category</CardTitle>
                <CardDescription>Tasks divided by category</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Update the DonutChart usage */}
                <DonutChart
                  data={stats?.task_distribution || []}
                  innerRadius={50}
                  outerRadius={70}
                  showLegend={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskProgressInsights;
