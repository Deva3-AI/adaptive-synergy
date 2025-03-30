import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, BarChart, PieChart } from "@/components/ui/charts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Calendar, 
  Clock, 
  BarChart as BarChartIcon, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare,
  User
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useUser } from '@/hooks/useUser';

const taskCompletionData = [
  { name: 'Jan', value: 10 },
  { name: 'Feb', value: 25 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 30 },
  { name: 'May', value: 22 },
  { name: 'Jun', value: 28 }
];

const workHoursData = [
  { name: 'Mon', value: 7.5 },
  { name: 'Tue', value: 8.2 },
  { name: 'Wed', value: 7.8 },
  { name: 'Thu', value: 8.5 },
  { name: 'Fri', value: 6.5 },
  { name: 'Sat', value: 0 },
  { name: 'Sun', value: 0 }
];

const taskCategoriesData = [
  { name: 'Design', value: 35 },
  { name: 'Development', value: 25 },
  { name: 'Research', value: 15 },
  { name: 'Planning', value: 10 },
  { name: 'Testing', value: 15 }
];

const EmployeeDashboard = () => {
  const { user } = useUser();
  const [workSessionActive, setWorkSessionActive] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionTimer, setSessionTimer] = useState<string>("00:00:00");
  
  const { data: todayAttendance, isLoading: isLoadingAttendance, refetch: refetchAttendance } = useQuery({
    queryKey: ['today-attendance', user?.id],
    enabled: !!user?.id,
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
        
        if (data) {
          if (data.login_time && !data.logout_time) {
            setWorkSessionActive(true);
            setCurrentSessionId(data.attendance_id);
            setSessionStartTime(new Date(data.login_time));
          }
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching today\'s attendance:', error);
        return null;
      }
    }
  });
  
  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['employee-tasks', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('assigned_to', user?.id)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        return data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  });
  
  const { data: performanceData } = useQuery({
    queryKey: ['employee-performance', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      try {
        return {
          completedTasks: 15,
          tasksInProgress: 5,
          averageRating: 4.8,
          onTimeCompletion: 92,
        };
      } catch (error) {
        console.error('Error fetching performance data:', error);
        return {
          completedTasks: 0,
          tasksInProgress: 0,
          averageRating: 0,
          onTimeCompletion: 0,
        };
      }
    }
  });
  
  useEffect(() => {
    let intervalId: number;
    
    if (workSessionActive && sessionStartTime) {
      intervalId = window.setInterval(() => {
        const now = new Date();
        const timeDiff = now.getTime() - sessionStartTime.getTime();
        
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setSessionTimer(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [workSessionActive, sessionStartTime]);
  
  const handleStartWork = async () => {
    if (!user) {
      toast.error('You must be logged in to use the time tracker');
      return;
    }
    
    try {
      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existingRecord, error: checkError } = await supabase
        .from('employee_attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('work_date', today)
        .maybeSingle();
      
      let attendanceRecord;
      
      if (existingRecord) {
        if (!existingRecord.login_time) {
          const { data, error } = await supabase
            .from('employee_attendance')
            .update({ login_time: now })
            .eq('attendance_id', existingRecord.attendance_id)
            .select()
            .single();
          
          if (error) throw error;
          attendanceRecord = data;
        } else {
          attendanceRecord = existingRecord;
        }
      } else {
        const { data, error } = await supabase
          .from('employee_attendance')
          .insert({
            user_id: user.id,
            login_time: now,
            work_date: today
          })
          .select()
          .single();
        
        if (error) throw error;
        attendanceRecord = data;
      }
      
      setWorkSessionActive(true);
      setCurrentSessionId(attendanceRecord.attendance_id);
      setSessionStartTime(new Date(attendanceRecord.login_time));
      
      toast.success('Work session started successfully');
      refetchAttendance();
    } catch (error) {
      console.error('Error starting work session:', error);
      toast.error('Failed to start work session');
    }
  };
  
  const handleStopWork = async () => {
    if (!user || !currentSessionId) {
      toast.error('No active work session found');
      return;
    }
    
    try {
      const now = new Date().toISOString();
      
      const { error } = await supabase
        .from('employee_attendance')
        .update({ logout_time: now })
        .eq('attendance_id', currentSessionId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setWorkSessionActive(false);
      setCurrentSessionId(null);
      setSessionStartTime(null);
      
      toast.success('Work session ended successfully');
      refetchAttendance();
    } catch (error) {
      console.error('Error ending work session:', error);
      toast.error('Failed to end work session');
    }
  };
  
  const formattedTasks = tasks?.map(task => ({
    ...task,
    status: task.status || 'pending',
    progress: 0,
    priority: 'Medium'
  })) || [];
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.name || 'Employee'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {workSessionActive ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-green-500 mr-1" />
                <span className="font-mono text-lg">{sessionTimer}</span>
              </div>
              <Button variant="destructive" onClick={handleStopWork}>
                Stop Work
              </Button>
            </div>
          ) : (
            <Button onClick={handleStartWork}>
              Start Work
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Work Status</div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workSessionActive ? (
                <Badge variant="success">Working</Badge>
              ) : (
                <Badge variant="outline">Not Clocked In</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {workSessionActive
                ? `Started at ${sessionStartTime ? format(sessionStartTime, 'h:mm a') : '--'}`
                : 'Click "Start Work" to begin your workday'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Pending Tasks</div>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingTasks ? '--' : formattedTasks.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks awaiting completion
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Completed Tasks</div>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData?.completedTasks || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">On-Time Completion</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData?.onTimeCompletion || 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks completed on time
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Current Tasks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4">
          <h3 className="text-lg font-medium mt-6">Recent Tasks</h3>
          
          {isLoadingTasks ? (
            <div className="text-center text-muted-foreground py-10">
              Loading tasks...
            </div>
          ) : formattedTasks.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              No tasks assigned to you yet
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {formattedTasks.map((task) => (
                <Card key={task.task_id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">
                        <Link to={`/tasks/${task.task_id}`} className="hover:underline">
                          {task.title}
                        </Link>
                      </CardTitle>
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-1">
                      <div className="text-sm flex justify-between">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-2">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center">
                        <Badge variant="outline" className="capitalize">
                          {task.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        <span>3</span>
                        <User className="h-3.5 w-3.5 ml-3 mr-1" />
                        <span>You</span>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="flex justify-end">
            <Button asChild variant="outline">
              <Link to="/employee/tasks">View All Tasks</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Task Completion</CardTitle>
                <CardDescription>
                  Your task completion rate over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={taskCompletionData}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-2 md:col-span-1">
              <CardHeader>
                <CardTitle>Work Hours</CardTitle>
                <CardDescription>
                  Your working hours for the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={workHoursData}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Task Categories</CardTitle>
                <CardDescription>
                  Distribution of your tasks by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-[300px]">
                  <PieChart 
                    data={taskCategoriesData}
                    nameKey="name"
                    dataKey="value"
                    height={300}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>
                Your attendance record for the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Login Time</TableHead>
                      <TableHead>Logout Time</TableHead>
                      <TableHead>Work Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{format(new Date(), 'EEEE, MMM d')}</TableCell>
                      <TableCell>
                        {todayAttendance?.login_time
                          ? format(new Date(todayAttendance.login_time), 'h:mm a')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {todayAttendance?.logout_time
                          ? format(new Date(todayAttendance.logout_time), 'h:mm a')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {todayAttendance?.login_time && todayAttendance?.logout_time
                          ? ((new Date(todayAttendance.logout_time).getTime() - new Date(todayAttendance.login_time).getTime()) / (1000 * 60 * 60)).toFixed(2) + 'h'
                          : workSessionActive
                            ? sessionTimer
                            : '-'}
                      </TableCell>
                      <TableCell>
                        {workSessionActive
                          ? <Badge variant="success">Working</Badge>
                          : todayAttendance?.logout_time
                            ? <Badge variant="default">Complete</Badge>
                            : todayAttendance?.login_time
                              ? <Badge variant="warning">Incomplete</Badge>
                              : <Badge variant="outline">Not Started</Badge>}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
