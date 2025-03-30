
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart } from "@/components/ui/charts";
import { CheckCircle2, Clock, CalendarClock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightProps {
  tasks: any[];
  period?: 'week' | 'month' | 'quarter';
}

const TaskProgressInsights = ({ tasks, period = 'week' }: InsightProps) => {
  // Filter completed tasks
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  
  // Calculate completion rate
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;
  
  // Calculate on-time delivery rate
  const onTimeDeliveries = completedTasks.filter(task => 
    new Date(task.end_time) <= new Date(task.dueDate)
  ).length;
  
  const onTimeRate = completedTasks.length > 0 
    ? Math.round((onTimeDeliveries / completedTasks.length) * 100) 
    : 0;
  
  // Calculate average time to complete tasks (in days)
  const avgCompletionTime = completedTasks.length > 0
    ? completedTasks.reduce((sum, task) => {
        const startDate = new Date(task.start_time);
        const endDate = new Date(task.end_time);
        const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / completedTasks.length
    : 0;
  
  // Group tasks by client for chart data
  const tasksByClient = tasks.reduce((acc: any, task) => {
    const clientName = task.client || 'Unassigned';
    if (!acc[clientName]) {
      acc[clientName] = { total: 0, completed: 0 };
    }
    acc[clientName].total += 1;
    if (task.status === 'completed') {
      acc[clientName].completed += 1;
    }
    return acc;
  }, {});
  
  const clientCompletionData = Object.entries(tasksByClient)
    .map(([name, data]: [string, any]) => ({
      name: name.length > 10 ? name.substring(0, 10) + '...' : name,
      Completed: data.completed,
      Total: data.total,
    }));
  
  // Calculate total estimated vs actual hours
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimated_time || 0), 0);
  const totalActualHours = tasks.reduce((sum, task) => sum + (task.actual_time || 0), 0);
  
  // Efficiency rate (estimated vs actual)
  const efficiencyRate = totalEstimatedHours > 0 
    ? Math.round((totalEstimatedHours / (totalActualHours || 1)) * 100) 
    : 100;
  
  // Hours by task type data 
  const hoursByTaskType = tasks.reduce((acc: any, task) => {
    const taskType = task.category || 'Other';
    if (!acc[taskType]) {
      acc[taskType] = 0;
    }
    acc[taskType] += task.actual_time || 0;
    return acc;
  }, {});
  
  const taskTypeHoursData = Object.entries(hoursByTaskType)
    .map(([name, hours]: [string, any]) => ({
      name,
      Hours: hours,
    }));
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {completedTasks.length} of {tasks.length} tasks completed
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On-Time Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{onTimeRate}%</div>
              <Progress 
                value={onTimeRate} 
                className={cn("h-2", onTimeRate < 70 ? "bg-red-200" : "bg-green-200")}
              />
              <div className="text-xs text-muted-foreground">
                {onTimeDeliveries} of {completedTasks.length} tasks delivered on time
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Completion Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {avgCompletionTime.toFixed(1)} days
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                Average time from start to completion
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Time Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {efficiencyRate}%
              </div>
              <div className="flex justify-between text-xs">
                <span>Estimated: {totalEstimatedHours}h</span>
                <span>Actual: {totalActualHours}h</span>
              </div>
              <Progress 
                value={efficiencyRate > 100 ? 100 : efficiencyRate} 
                className={cn("h-2", efficiencyRate < 80 ? "bg-red-200" : "bg-green-200")}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion by Client</CardTitle>
            <CardDescription>Breakdown of completed tasks across clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart 
                data={clientCompletionData}
                xAxisKey="name"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hours by Task Type</CardTitle>
            <CardDescription>Distribution of work hours by task category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart 
                data={taskTypeHoursData}
                xAxisKey="name"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Task Status Overview</CardTitle>
          <CardDescription>Current distribution of tasks by status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Completed</h4>
                <div className="text-2xl font-bold">{completedTasks.length}</div>
                <div className="text-xs text-muted-foreground">
                  {completionRate}% of all tasks
                </div>
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start space-x-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium">In Progress</h4>
                <div className="text-2xl font-bold">{inProgressTasks.length}</div>
                <div className="text-xs text-muted-foreground">
                  {tasks.length > 0 ? Math.round((inProgressTasks.length / tasks.length) * 100) : 0}% of all tasks
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start space-x-4">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium">Pending</h4>
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
                <div className="text-xs text-muted-foreground">
                  {tasks.length > 0 ? Math.round((pendingTasks.length / tasks.length) * 100) : 0}% of all tasks
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskProgressInsights;
