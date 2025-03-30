
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, sub, subDays } from 'date-fns';
import { Activity, BarChart2, Clock, LineChart as LineChartIcon, Target, TrendingUp, Users } from "lucide-react";
import BarChart from '@/components/ui/charts/BarChart';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartDataPoint {
  name: string;
  [key: string]: any;
}

// Mock data for charts
const MOCK_COMPLETED_BY_DAY: ChartDataPoint[] = [
  { name: 'Mon', Completed: 4, Total: 5 },
  { name: 'Tue', Completed: 3, Total: 6 },
  { name: 'Wed', Completed: 5, Total: 7 },
  { name: 'Thu', Completed: 7, Total: 8 },
  { name: 'Fri', Completed: 6, Total: 10 },
  { name: 'Sat', Completed: 2, Total: 3 },
  { name: 'Sun', Completed: 1, Total: 2 },
];

const MOCK_HOURS_BY_DAY: ChartDataPoint[] = [
  { name: 'Mon', Hours: 6.5 },
  { name: 'Tue', Hours: 7.2 },
  { name: 'Wed', Hours: 8.1 },
  { name: 'Thu', Hours: 7.5 },
  { name: 'Fri', Hours: 8.3 },
  { name: 'Sat', Hours: 4.2 },
  { name: 'Sun', Hours: 2.1 },
];

const MOCK_TASKS_BY_PRIORITY = [
  { name: 'High', count: 8 },
  { name: 'Medium', count: 15 },
  { name: 'Low', count: 7 },
];

const MOCK_TASKS_BY_CLIENT = [
  { name: 'Acme Corp', count: 12 },
  { name: 'Beta Inc', count: 8 },
  { name: 'Gamma LLC', count: 5 },
  { name: 'Delta Co', count: 3 },
  { name: 'Others', count: 2 },
];

const MOCK_EFFICIENCY_TREND = [
  { date: sub(new Date(), { days: 30 }).toISOString(), efficiency: 72 },
  { date: sub(new Date(), { days: 25 }).toISOString(), efficiency: 75 },
  { date: sub(new Date(), { days: 20 }).toISOString(), efficiency: 74 },
  { date: sub(new Date(), { days: 15 }).toISOString(), efficiency: 78 },
  { date: sub(new Date(), { days: 10 }).toISOString(), efficiency: 82 },
  { date: sub(new Date(), { days: 5 }).toISOString(), efficiency: 85 },
  { date: new Date().toISOString(), efficiency: 88 },
];

const TaskProgressInsights = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [viewMode, setViewMode] = useState('personal');
  
  // Fetch insights data
  const { data: insightsData, isLoading } = useQuery({
    queryKey: ['tasks-insights', timeRange, viewMode],
    queryFn: () => {
      // This would normally be an API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            stats: {
              tasksCompleted: 28,
              tasksAssigned: 35,
              completionRate: 80,
              averageCompletionTime: 1.8, // in days
              totalHoursLogged: 43.9,
              efficiencyScore: 88,
            },
            completedByDay: MOCK_COMPLETED_BY_DAY,
            hoursByDay: MOCK_HOURS_BY_DAY,
            tasksByPriority: MOCK_TASKS_BY_PRIORITY,
            tasksByClient: MOCK_TASKS_BY_CLIENT,
            efficiencyTrend: MOCK_EFFICIENCY_TREND,
          });
        }, 1000);
      });
    },
  });
  
  const formatHours = (hours: number) => {
    return `${hours.toFixed(1)}h`;
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-8 w-[120px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
          <Skeleton className="h-[120px]" />
        </div>
        <Skeleton className="h-[350px]" />
      </div>
    );
  }
  
  if (!insightsData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No insights data available.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold tracking-tight">Task Progress Insights</h2>
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={viewMode}
            onValueChange={setViewMode}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <h3 className="text-2xl font-bold mt-1">
                  {insightsData.stats.tasksCompleted}/{insightsData.stats.tasksAssigned}
                </h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Check className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">{insightsData.stats.completionRate}%</span>
              </div>
              <Progress value={insightsData.stats.completionRate} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hours Logged</p>
                <h3 className="text-2xl font-bold mt-1">
                  {insightsData.stats.totalHoursLogged.toFixed(1)}h
                </h3>
              </div>
              <div className="p-2 bg-secondary rounded-full text-secondary-foreground">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg. completion time</span>
                <span className="font-medium">{insightsData.stats.averageCompletionTime} days</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                15% faster than team average
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency Score</p>
                <h3 className="text-2xl font-bold mt-1">
                  {insightsData.stats.efficiencyScore}/100
                </h3>
              </div>
              <div className="p-2 bg-green-100 rounded-full text-green-700">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Current performance</span>
                <span className="font-medium text-green-600">+8% this month</span>
              </div>
              <Progress value={insightsData.stats.efficiencyScore} className="bg-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={insightsData.completedByDay}
              xAxisKey="name"
              series={[
                { name: 'Completed', color: '#10b981' },
                { name: 'Total', color: '#d1d5db' }
              ]}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hours Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={insightsData.hoursByDay}
              xAxisKey="name"
              series={[
                { name: 'Hours', color: '#6366f1' }
              ]}
              valueFormatter={formatHours}
            />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="efficiency">
        <TabsList>
          <TabsTrigger value="efficiency">Efficiency Trend</TabsTrigger>
          <TabsTrigger value="breakdown">Task Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="efficiency" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Efficiency Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {/* We'd implement a line chart here from recharts or other library */}
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Efficiency has improved by 16% over the selected period
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tasks by Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insightsData.tasksByPriority.map((item: any) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name} Priority</span>
                        <span className="font-medium">{item.count} tasks</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            item.name === 'High' 
                              ? 'bg-red-500' 
                              : item.name === 'Medium' 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${(item.count / insightsData.tasksByPriority.reduce((acc: number, curr: any) => acc + curr.count, 0)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tasks by Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insightsData.tasksByClient.map((item: any) => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.count} tasks</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full"
                          style={{ 
                            width: `${(item.count / insightsData.tasksByClient.reduce((acc: number, curr: any) => acc + curr.count, 0)) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI-Generated Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-primary" />
                Productivity Insights
              </h4>
              <p className="text-sm text-muted-foreground">
                Your task completion rate is 15% higher than last month. You're most productive on Wednesdays and Thursdays, completing 43% of your weekly tasks on these days. Consider scheduling complex tasks during these peak productivity periods.
              </p>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                Time Management
              </h4>
              <p className="text-sm text-muted-foreground">
                You spend an average of 1.8 days on tasks, which is 12% faster than the team average. However, high-priority tasks take you 2.3 days on average - consider allocating more focused time blocks for these tasks.
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                Suggested Goals
              </h4>
              <p className="text-sm text-muted-foreground">
                Based on your current performance, aim to improve task estimation accuracy by 10% next month. Your estimates have been about 15% lower than actual time spent on complex tasks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskProgressInsights;
