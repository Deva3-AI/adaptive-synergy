
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/api";
import type { TaskStatistics } from "@/services/api/taskService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle, AlertTriangle, BarChart as BarChartIcon } from "lucide-react";

// Custom chart components (simplified for our use case)
const LineChart = ({ data, categories, colors, height }: { data: any[], categories: string[], colors: string[], height: number }) => {
  return (
    <div style={{ height }}>
      {/* Simplified chart display */}
      <div className="flex flex-col h-full justify-center items-center">
        <BarChartIcon className="h-16 w-16 text-muted-foreground mb-2" />
        <div className="text-sm text-muted-foreground text-center">
          Line chart showing trends for {categories.join(' and ')}
        </div>
      </div>
    </div>
  );
};

const PieChart = ({ data, height }: { data: any[], height: number }) => {
  return (
    <div style={{ height }}>
      {/* Simplified chart display */}
      <div className="flex flex-col h-full justify-center items-center">
        <BarChartIcon className="h-16 w-16 text-muted-foreground mb-2" />
        <div className="text-sm text-muted-foreground text-center">
          Pie chart showing distribution across {data.length} categories
        </div>
      </div>
    </div>
  );
};

const TaskProgressInsights = ({ userId }: { userId?: number }) => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ["task-statistics", userId],
    queryFn: () => taskService.getTaskStatistics(userId),
  });

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Task Progress & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Cast the data to the TaskStatistics type
  const stats = statistics as TaskStatistics;

  // Handle case where stats is undefined
  if (!stats) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Task Progress & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No task statistics available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format the monthly trends data for the charts
  const monthlyTrendsData = stats.monthly_trends.map(item => ({
    name: item.month,
    Completed: item.completed,
    Assigned: item.assigned
  }));

  // Calculate percentage of on-time completions
  const onTimePercentage = Math.round(stats.on_time_completion);
  
  // Calculate average task duration in days
  const avgDuration = Math.round(stats.average_task_duration * 10) / 10;

  // Format recent completions for display
  const recentCompletions = stats.recent_completions || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{stats.completion_rate}%</div>
          <Progress value={stats.completion_rate} className="h-2 mb-4" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Completed</div>
              <div className="font-medium">{stats.completed_tasks}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">In Progress</div>
              <div className="font-medium">{stats.in_progress_tasks}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Pending</div>
              <div className="font-medium">{stats.pending_tasks}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Overdue</div>
              <div className="font-medium text-red-500">{stats.overdue_tasks}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">On-Time Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{onTimePercentage}%</div>
            <div className="p-2 bg-green-500/10 rounded-full">
              <CheckCircle className="text-green-500 h-5 w-5" />
            </div>
          </div>
          <Progress value={onTimePercentage} className="h-2 mt-2 mb-4" />
          <div className="text-sm text-muted-foreground">
            {onTimePercentage >= 80 ? (
              <span>Great job keeping tasks on schedule!</span>
            ) : onTimePercentage >= 50 ? (
              <span>Make sure to prioritize timely deliveries.</span>
            ) : (
              <span className="text-red-500">Task timeliness needs improvement.</span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Avg. Completion Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">{avgDuration} days</div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Clock className="text-blue-500 h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 text-sm">
            <div className="mb-2">Average time to complete tasks</div>
            <div className="flex items-center">
              <div className="text-muted-foreground">Compared to target: </div>
              <div className={`ml-2 ${avgDuration <= 5 ? 'text-green-500' : 'text-amber-500'}`}>
                {avgDuration <= 5 ? 'On target' : 'Above target'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base font-medium">Task Completion Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart 
            data={monthlyTrendsData}
            categories={["Completed", "Assigned"]}
            colors={["green", "blue"]}
            height={240}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Task Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart 
            data={stats.task_distribution}
            height={240}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle className="text-base font-medium">Recently Completed Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {recentCompletions.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No recently completed tasks
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCompletions.map((task) => (
                <div key={task.task_id} className="border rounded-lg p-3 space-y-2">
                  <div className="font-medium">{task.title}</div>
                  <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">Completed on: </div>
                    <div>{new Date(task.completed_on).toLocaleDateString()}</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-muted-foreground">Duration: </div>
                    <div>{task.duration} days</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskProgressInsights;
