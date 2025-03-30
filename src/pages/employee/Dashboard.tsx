
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatBubbleIcon, BarChartIcon, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatDistanceToNow } from "date-fns";
import AttendanceTracker from "@/components/employee/AttendanceTracker";
import { Link } from "react-router-dom";

// Define the interface for attendance records
interface Attendance {
  attendance_id: number;
  login_time: string;
  logout_time: string | null;
  work_date: string;
}

// Define the interface for tasks
interface Task {
  task_id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_time: number;
  actual_time: number;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  client_id: number;
  assigned_to: number;
  clients: {
    client_id: number;
    client_name: string;
  };
}

const EmployeeDashboard = () => {
  const { user } = useAuth();

  // Fetch today's attendance record
  const { 
    data: attendance, 
    isLoading: isLoadingAttendance,
    refetch: refetchAttendance 
  } = useQuery({
    queryKey: ['today-attendance', user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', user?.id)
          .eq('work_date', today)
          .maybeSingle();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching attendance:', error);
        return null;
      }
    }
  });

  // Fetch tasks
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['employee-tasks', user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            clients (
              client_id,
              client_name
            )
          `)
          .eq('assigned_to', user?.id)
          .in('status', ['pending', 'in_progress'])
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Task[];
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  });

  // Fetch completed tasks count
  const { data: completedTasksCount, isLoading: isLoadingCompletedCount } = useQuery({
    queryKey: ['completed-tasks-count', user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('assigned_to', user?.id)
          .eq('status', 'completed');
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error('Error fetching completed tasks count:', error);
        return 0;
      }
    }
  });

  // Handler for attendance updates
  const handleAttendanceUpdate = () => {
    refetchAttendance();
  };

  // Calculate task metrics
  const pendingTasks = tasks?.filter(task => task.status === 'pending').length || 0;
  const inProgressTasks = tasks?.filter(task => task.status === 'in_progress').length || 0;
  const totalWorkHours = tasks?.reduce((total, task) => total + (task.actual_time || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.name || user?.email || 'Employee'}!
          </p>
        </div>
        <AttendanceTracker 
          attendance={attendance} 
          onAttendanceUpdate={handleAttendanceUpdate} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CardDescription>Assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTasks || isLoadingCompletedCount ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="text-2xl font-bold">
                {(tasks?.length || 0) + (completedTasksCount || 0)}
              </div>
            )}
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium">{pendingTasks}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium">{inProgressTasks}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">{completedTasksCount || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Work Hours</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">
                {totalWorkHours.toFixed(1)} hrs
              </div>
            )}
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Tracked from completed tasks</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingAttendance ? (
              <Skeleton className="h-8 w-full" />
            ) : attendance?.login_time ? (
              <div className="text-sm">
                <div className="mb-1">
                  <span className="font-medium">Login:</span>{" "}
                  {new Date(attendance.login_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                {attendance.logout_time && (
                  <div>
                    <span className="font-medium">Logout:</span>{" "}
                    {new Date(attendance.logout_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No attendance recorded for today
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Tasks</CardTitle>
          <CardDescription>
            Your current workload and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTasks ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : tasks && tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.task_id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">
                        <Link to={`/employee/tasks/${task.task_id}`} className="hover:underline">
                          {task.title}
                        </Link>
                      </h3>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <span>Client: {task.clients?.client_name || 'Unknown'}</span>
                        <span>•</span>
                        <span>Est: {task.estimated_time || 0}h</span>
                      </div>
                    </div>
                    <Badge variant={task.status === 'in_progress' ? 'default' : 'secondary'}>
                      {task.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-1" />
                  </div>
                </div>
              ))}
              {tasks.length > 5 && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/employee/tasks">View all tasks</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active tasks assigned to you</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link to="/employee/tasks">View all tasks</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "New task assigned",
                  description: "You have been assigned a new design task",
                  time: "2 hours ago",
                  icon: <ChatBubbleIcon className="h-5 w-5 text-blue-500" />
                },
                {
                  id: 2,
                  title: "Task deadline approaching",
                  description: "API Integration task is due in 2 days",
                  time: "5 hours ago",
                  icon: <Clock className="h-5 w-5 text-amber-500" />
                }
              ].map(notification => (
                <div key={notification.id} className="flex gap-3 border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                    {notification.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Task Completion Rate</div>
                  <div className="text-sm text-muted-foreground">
                    {isLoadingCompletedCount ? 
                      <Skeleton className="h-4 w-8 inline-block" /> : 
                      `${completedTasksCount || 0}/${(tasks?.length || 0) + (completedTasksCount || 0)}`
                    }
                  </div>
                </div>
                <Progress 
                  value={isLoadingCompletedCount ? 0 : 
                    ((completedTasksCount || 0) / ((tasks?.length || 0) + (completedTasksCount || 0))) * 100 || 0
                  } 
                  className="h-2"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Work Hour Utilization</div>
                  <div className="text-sm text-muted-foreground">85%</div>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Client Satisfaction</div>
                  <div className="text-sm text-muted-foreground">92%</div>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
