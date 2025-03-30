
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, PieChart, LineChart } from '@/components/ui/charts';
import { Progress } from '@/components/ui/progress';
import taskService from '@/services/api/taskService';
import type { TaskStatistics } from '@/services/api/taskService';

interface TaskProgressInsightsProps {
  userId?: number;
  timeRange?: string;
  className?: string;
}

const TaskProgressInsights: React.FC<TaskProgressInsightsProps> = ({ 
  userId, 
  timeRange,
  className
}) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['taskStatistics', userId, timeRange],
    queryFn: () => taskService.getTaskStatistics(userId, timeRange),
  });

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Task Progress Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading task insights...</p>
          </div>
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
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No task data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate on-time completion rate if not provided
  const onTimeCompletionRate = stats.on_time_completion || 
    Math.round((stats.completed_tasks - stats.overdue_tasks) / Math.max(stats.completed_tasks, 1) * 100);

  // Calculate average duration if not provided
  const averageDuration = stats.average_task_duration || stats.avg_completion_time || 0;

  // Get recent completions or create empty array if not available
  const recentCompletions = stats.recent_completions || [];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Task Progress Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Task Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-700">Completed</h3>
            <p className="text-2xl font-bold text-blue-800">{stats.completed_tasks}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-amber-700">In Progress</h3>
            <p className="text-2xl font-bold text-amber-800">{stats.in_progress_tasks}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-700">Pending</h3>
            <p className="text-2xl font-bold text-purple-800">{stats.pending_tasks}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-700">Overdue</h3>
            <p className="text-2xl font-bold text-red-800">{stats.overdue_tasks}</p>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">On-Time Completion Rate</h3>
            <Progress value={onTimeCompletionRate} className="h-2" />
            <p className="text-sm text-muted-foreground">{onTimeCompletionRate}% of tasks completed on time</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Average Task Duration</h3>
            <Progress value={(averageDuration / 24) * 100} className="h-2" />
            <p className="text-sm text-muted-foreground">{averageDuration.toFixed(1)} hours per task</p>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Monthly Trends</h3>
            <div className="h-64">
              <LineChart 
                data={stats.monthly_trends.map(item => ({
                  name: item.month,
                  Completed: item.completed,
                  Assigned: item.assigned
                }))}
                xAxisKey="name"
                series={[
                  { key: 'Completed', color: '#3b82f6' },
                  { key: 'Assigned', color: '#8b5cf6' }
                ]}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Task Distribution</h3>
            <div className="h-64">
              <PieChart 
                data={stats.task_distribution.map(item => ({
                  name: item.category,
                  value: item.count
                }))}
                nameKey="name"
                dataKey="value"
              />
            </div>
          </div>
        </div>
        
        {/* Recent Completions */}
        {recentCompletions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-4">Recently Completed Tasks</h3>
            <div className="space-y-2">
              {recentCompletions.map((task) => (
                <div key={task.task_id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(task.completed_on).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm">
                    {task.duration}h
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskProgressInsights;
