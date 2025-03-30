
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { PieChart, Cell, Pie, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import taskService from '@/services/api/taskService';

const TaskProgressInsights = () => {
  const { data: taskStats, isLoading } = useQuery({
    queryKey: ['task-progress-stats'],
    queryFn: () => taskService.getTaskStatistics(),
    // If the function doesn't exist, mock data will be used
  });

  // Mock data in case the API isn't ready
  const data = taskStats || {
    completion: {
      completed: 12,
      inProgress: 8,
      pending: 5,
      total: 25
    },
    byPriority: [
      { name: 'High', value: 8, color: '#ef4444' },
      { name: 'Medium', value: 12, color: '#f59e0b' },
      { name: 'Low', value: 5, color: '#10b981' }
    ],
    byCategory: [
      { name: 'Design', value: 7, color: '#8b5cf6' },
      { name: 'Development', value: 10, color: '#3b82f6' },
      { name: 'Content', value: 5, color: '#14b8a6' },
      { name: 'Other', value: 3, color: '#64748b' }
    ]
  };

  const completionPercentage = Math.round((data.completion.completed / data.completion.total) * 100);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Task Progress Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="priorities">Priorities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{data.completion.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.completion.inProgress}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{data.completion.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="h-[200px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.byCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="priorities">
            <div className="h-[200px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.byPriority}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.byPriority.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskProgressInsights;
