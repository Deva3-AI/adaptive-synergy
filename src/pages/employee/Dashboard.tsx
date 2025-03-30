import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService, aiService, userService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarRange, CheckCircle2, MessageSquare, User2, BarChart4, Lightbulb } from "lucide-react";

const EmployeeDashboard = () => {
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch user ID from local storage or context
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.user_id);
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
      }
    }
  }, []);

  // Fix useQuery calls by using the object syntax and meta for error handling
  const { data: userData } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => userService.getUserProfile(userId),
    enabled: !!userId,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching user profile:", error);
      }
    }
  });

  const { data: assignedTasks, isLoading: loadingTasks } = useQuery({
    queryKey: ['assigned-tasks', userId],
    queryFn: () => taskService.getTasksByEmployee(userId),
    enabled: !!userId,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching assigned tasks:", error);
      }
    }
  });

  const { data: productivityInsights, isLoading: loadingInsights } = useQuery({
    queryKey: ['productivity-insights', userId],
    queryFn: () => aiService.getProductivityInsights(userId),
    enabled: !!userId,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching productivity insights:", error);
      }
    }
  });

  const { data: suggestedTasks, isLoading: loadingSuggestions } = useQuery({
    queryKey: ['suggested-tasks', userId],
    queryFn: () => aiService.getSuggestedTasks(userId),
    enabled: !!userId,
    meta: {
      onError: (error: any) => {
        console.error("Error fetching suggested tasks:", error);
      }
    }
  });

  // Type guard helper to make TypeScript happy
  const isTaskArray = (data: unknown): data is any[] => {
    return Array.isArray(data);
  };

  // Pass data safely to components with type checking
  const pendingTasks = isTaskArray(assignedTasks) 
    ? assignedTasks.filter(task => task.status === 'pending' || task.status === 'in_progress')
    : [];
    
  const completedTasksCount = isTaskArray(assignedTasks)
    ? assignedTasks.filter(task => task.status === 'completed').length
    : 0;

  const totalTasksCount = isTaskArray(assignedTasks) ? assignedTasks.length : 0;

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {userData ? (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                  <Badge variant="secondary">{userData.role_name}</Badge>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Productivity Insights Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <BarChart4 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingInsights ? (
              <Skeleton className="h-8 w-full" />
            ) : productivityInsights ? (
              <>
                <div className="text-2xl font-bold">{productivityInsights.productivity_score}</div>
                <p className="text-sm text-muted-foreground">
                  {productivityInsights.trends.length} trends identified
                </p>
              </>
            ) : (
              <div className="text-center text-muted-foreground">No insights available</div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Tasks Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suggested Tasks</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingSuggestions ? (
              <Skeleton className="h-8 w-full" />
            ) : suggestedTasks && suggestedTasks.length > 0 ? (
              <ul className="list-none space-y-2">
                {suggestedTasks.map((task: any) => (
                  <li key={task.id} className="text-sm">
                    {task.title}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-muted-foreground">No suggestions available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Overview Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Task Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Tasks in progress or not started</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTasks ? (
                <Skeleton className="h-4 w-full" />
              ) : (
                <div className="text-2xl font-bold">{pendingTasks.length}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
              <CardDescription>Tasks that are marked as done</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTasks ? (
                <Skeleton className="h-4 w-full" />
              ) : (
                <div className="text-2xl font-bold">{completedTasksCount}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Tasks</CardTitle>
              <CardDescription>All tasks assigned to you</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTasks ? (
                <Skeleton className="h-4 w-full" />
              ) : (
                <div className="text-2xl font-bold">{totalTasksCount}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
            <CardDescription>Your recently assigned tasks</CardDescription>
          </CardHeader>
          <CardContent className="pl-4 pt-0">
            <ScrollArea className="h-[300px] w-full pr-4">
              {loadingTasks ? (
                <div>Loading tasks...</div>
              ) : assignedTasks && assignedTasks.length > 0 ? (
                <div className="space-y-3">
                  {assignedTasks.map((task: any) => (
                    <div key={task.task_id} className="border rounded-md p-4">
                      <h3 className="text-sm font-semibold">{task.title}</h3>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">No tasks assigned</div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
