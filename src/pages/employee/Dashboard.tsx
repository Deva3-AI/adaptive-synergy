import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import AttendanceTracker from '@/components/employee/AttendanceTracker';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  FileText, 
  MessageSquare, 
  MoreHorizontal, 
  Plus, 
  Users 
} from "lucide-react";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch today's attendance record
  const { data: todayAttendance, isLoading: attendanceLoading, refetch: refetchAttendance } = useQuery({
    queryKey: ['employee-attendance', user?.id, today],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', user?.id)
          .eq('work_date', today)
          .order('login_time', { ascending: false })
          .limit(1)
          .single();
        
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        
        return data || null;
      } catch (error) {
        console.error('Error fetching attendance:', error);
        return null;
      }
    }
  });

  // Fetch assigned tasks
  const { data: assignedTasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['employee-tasks', user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            clients (client_name)
          `)
          .eq('assigned_to', user?.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return data || [];
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  });

  // Handle attendance update
  const handleAttendanceUpdate = () => {
    refetchAttendance();
  };

  // Calculate task statistics
  const taskStats = {
    total: assignedTasks?.length || 0,
    completed: assignedTasks?.filter(task => task.status === 'completed')?.length || 0,
    inProgress: assignedTasks?.filter(task => task.status === 'in_progress')?.length || 0,
    pending: assignedTasks?.filter(task => task.status === 'pending')?.length || 0,
  };

  // Calculate completion percentage
  const completionPercentage = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your tasks and productivity.
        </p>
      </div>
      
      <AttendanceTracker 
        attendance={todayAttendance} 
        onAttendanceUpdate={handleAttendanceUpdate} 
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tasks
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {taskStats.inProgress} in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress className="mt-2" value={completionPercentage} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Meetings
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Next: Team standup at 10:00 AM
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Work Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5h</div>
            <p className="text-xs text-muted-foreground mt-1">
              This week (target: 40h)
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Current Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Your Tasks</h2>
            <Button size="sm" asChild>
              <Link to="/employee/tasks">
                View All Tasks
              </Link>
            </Button>
          </div>
          
          {tasksLoading ? (
            <div className="space-y-2">
              {Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : assignedTasks && assignedTasks.length > 0 ? (
            <div className="grid gap-4">
              {assignedTasks.slice(0, 3).map((task) => (
                <Card key={task.task_id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link to={`/employee/tasks/${task.task_id}`} className="font-medium hover:underline">
                          {task.title}
                        </Link>
                        <div className="text-sm text-muted-foreground mt-1">
                          Client: {task.clients?.client_name || 'Unknown'}
                        </div>
                      </div>
                      <Badge variant={
                        task.status === 'completed' ? 'success' : 
                        task.status === 'in_progress' ? 'default' : 
                        'secondary'
                      }>
                        {task.status === 'in_progress' ? 'In Progress' : 
                         task.status === 'completed' ? 'Completed' : 
                         'Pending'}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="text-sm flex justify-between">
                        <span>Progress</span>
                        <span>{task.progress || 0}%</span>
                      </div>
                      <Progress value={task.progress || 0} className="h-2" />
                    </div>
                    
                    <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {task.end_time ? format(new Date(task.end_time), 'MMM d, yyyy') : 'No deadline'}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {task.estimated_time || 0} hours
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {assignedTasks.length > 3 && (
                <Button variant="outline" asChild>
                  <Link to="/employee/tasks">
                    View {assignedTasks.length - 3} more tasks
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h3 className="font-medium text-lg">No tasks assigned</h3>
                  <p className="text-sm text-muted-foreground">
                    You don't have any tasks assigned to you at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Your schedule for the next few days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Team Standup</h4>
                    <p className="text-sm text-muted-foreground">
                      Today at 10:00 AM • 30 minutes
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Join</Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Project Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Tomorrow at 2:00 PM • 1 hour
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Details</Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Client Meeting</h4>
                    <p className="text-sm text-muted-foreground">
                      Sep 15 at 11:00 AM • 45 minutes
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>
                Stay in touch with your team and clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/01.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Jane Doe</h4>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Can you review the latest design files I sent?
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/02.png" />
                    <AvatarFallback>MS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Mike Smith</h4>
                      <span className="text-xs text-muted-foreground">Yesterday</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Team meeting has been rescheduled to 10 AM tomorrow.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="/avatars/03.png" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Sarah Chen</h4>
                      <span className="text-xs text-muted-foreground">2d ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The client approved our proposal! We can start next week.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Open Messages
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
