import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Calendar, Heart, Award, GraduationCap, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import BarChart from '@/components/ui/charts/BarChart';
import LineChart from '@/components/ui/charts/LineChart';
import PieChart from '@/components/ui/charts/PieChart';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { cn } from '@/lib/utils';

interface EmployeeProfile {
  user_id: number;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  avatar_url?: string;
  location?: string;
  phone?: string;
  bio?: string;
  joining_date?: string;
  skills?: string[];
}

interface Task {
  task_id: number;
  title: string;
  status: string;
  client_name: string;
  created_at: string;
  completed_at?: string;
  estimated_time: number;
  actual_time?: number;
}

interface Attendance {
  date: string;
  login_time: string;
  logout_time?: string;
  hours_worked: number;
}

const EmployeeProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date(),
  });

  // Fetch employee profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['employee-profile', userId],
    queryFn: async () => {
      try {
        // Get basic user info
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select(`
            user_id,
            name,
            email,
            roles (role_name)
          `)
          .eq('user_id', userId)
          .single();
          
        if (userError) throw userError;
        
        // Get employee details if available
        const { data: employeeData } = await supabase
          .from('employee_details')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        // Mock data for demo purposes
        return {
          user_id: userData.user_id,
          name: userData.name,
          email: userData.email,
          role: userData.roles?.role_name || 'employee',
          department: 'Design',
          position: 'Senior Designer',
          location: 'San Francisco, CA',
          phone: '+1 (555) 123-4567',
          bio: 'Creative designer with 5+ years of experience in branding and digital design.',
          joining_date: employeeData?.joining_date || '2021-06-15',
          avatar_url: '',
          skills: ['UI/UX Design', 'Adobe Creative Suite', 'Figma', 'Branding', 'Typography']
        } as EmployeeProfile;
      } catch (error) {
        console.error('Error fetching employee profile:', error);
        throw error;
      }
    }
  });

  // Fetch tasks assigned to the employee
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['employee-tasks', userId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            task_id,
            title,
            status,
            created_at,
            estimated_time,
            actual_time,
            clients (client_name)
          `)
          .eq('assigned_to', userId)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        return data.map((task: any) => ({
          task_id: task.task_id,
          title: task.title,
          status: task.status,
          client_name: task.clients?.client_name || 'Unknown Client',
          created_at: task.created_at,
          estimated_time: task.estimated_time || 0,
          actual_time: task.actual_time || 0,
          // Mock completed date for completed tasks
          completed_at: task.status === 'completed' ? 
            new Date(new Date(task.created_at).getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() :
            undefined
        }));
      } catch (error) {
        console.error('Error fetching employee tasks:', error);
        throw error;
      }
    }
  });

  // Fetch attendance records for the employee
  const { data: attendance = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['employee-attendance', userId, dateRange.from, dateRange.to],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', userId)
          .gte('work_date', dateRange.from.toISOString().split('T')[0])
          .lte('work_date', dateRange.to.toISOString().split('T')[0])
          .order('work_date', { ascending: false });
          
        if (error) throw error;
        
        return data.map((record: any) => ({
          date: record.work_date,
          login_time: record.login_time,
          logout_time: record.logout_time,
          hours_worked: record.logout_time ? 
            (new Date(record.logout_time).getTime() - new Date(record.login_time).getTime()) / (1000 * 60 * 60) :
            0
        }));
      } catch (error) {
        console.error('Error fetching attendance records:', error);
        throw error;
      }
    }
  });

  // Calculate task stats
  const taskStats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    
    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
      // Calculate average efficiency (actual time vs estimated time)
      efficiency: tasks.filter(t => t.status === 'completed' && t.actual_time && t.estimated_time)
        .reduce((acc, t) => {
          const ratio = t.estimated_time / (t.actual_time || t.estimated_time);
          return acc + (ratio > 1 ? 1 : ratio); // Cap at 100% efficiency
        }, 0) / (completed || 1)
    };
  }, [tasks]);

  // Attendance stats
  const attendanceStats = React.useMemo(() => {
    const totalHours = attendance.reduce((sum, record) => sum + record.hours_worked, 0);
    const avgHours = attendance.length ? totalHours / attendance.length : 0;
    
    // Group by day of week
    const hoursByDay = attendance.reduce((acc: Record<string, number>, record) => {
      const day = new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' });
      acc[day] = (acc[day] || 0) + record.hours_worked;
      return acc;
    }, {});
    
    // Calculate attendance streak
    let streak = 0;
    const sortedDates = [...attendance]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(a => a.date);
    
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      if (i === sortedDates.length - 1) {
        streak = 1;
        continue;
      }
      
      const curr = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);
      
      // Check if dates are consecutive
      const diffDays = Math.round((next.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return {
      totalHours,
      avgHours,
      hoursByDay,
      daysWorked: attendance.length,
      streak
    };
  }, [attendance]);

  // Prepare chart data for tasks by status
  const taskStatusChartData = [
    { name: 'Completed', value: taskStats.completed },
    { name: 'In Progress', value: taskStats.inProgress },
    { name: 'Pending', value: taskStats.pending },
  ];

  // Prepare chart data for hours by day
  const hoursByDayChartData = Object.entries(attendanceStats.hoursByDay).map(([name, hours]) => ({
    name,
    hours,
  }));

  // Prepare chart data for task completion over time
  const taskCompletionData = tasks
    .filter(t => t.status === 'completed' && t.completed_at)
    .reduce((acc: Record<string, number>, task) => {
      const month = new Date(task.completed_at!).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

  const taskCompletionChartData = Object.entries(taskCompletionData).map(([name, Completed]) => ({
    name,
    Completed,
  }));

  if (profileLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full max-w-lg" />
              <div className="flex flex-wrap gap-2 mt-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
          
          <Skeleton className="h-10 w-96" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p>Employee not found or error loading profile.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profile.avatar_url} alt={profile.name} />
            <AvatarFallback className="text-3xl">{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <Badge className="max-w-fit">{profile.role}</Badge>
            </div>
            
            <div className="text-lg text-muted-foreground">
              {profile.position} {profile.department && `• ${profile.department}`}
            </div>
            
            <p className="text-muted-foreground max-w-3xl">
              {profile.bio}
            </p>
            
            <div className="flex flex-wrap gap-1 pt-2">
              {profile.skills?.map((skill, i) => (
                <Badge key={i} variant="secondary">{skill}</Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{profile.email}</span>
              </div>
              
              {profile.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{profile.phone}</span>
                </div>
              )}
              
              {profile.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{profile.location}</span>
                </div>
              )}
              
              {profile.joining_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Joined on {new Date(profile.joining_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="performance">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="info">Employee Info</TabsTrigger>
          </TabsList>
          
          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Task Statistics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Task Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{taskStats.completionRate}%</p>
                      <p className="text-xs text-muted-foreground">Completion Rate</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{Math.round(taskStats.efficiency * 100)}%</p>
                      <p className="text-xs text-muted-foreground">Efficiency</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{taskStats.completed}</p>
                      <p className="text-xs text-muted-foreground">Tasks Completed</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold">{taskStats.inProgress + taskStats.pending}</p>
                      <p className="text-xs text-muted-foreground">Tasks In Progress</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <PieChart 
                      data={taskStatusChartData}
                      nameKey="name"
                      dataKey="value"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Activity Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Hours Worked</span>
                        <span className="text-sm font-medium">{attendanceStats.totalHours.toFixed(1)}h</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min((attendanceStats.totalHours / 160) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {attendanceStats.avgHours.toFixed(1)} hours/day average
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">Attendance</span>
                        <span className="text-sm font-medium">{attendanceStats.daysWorked} days</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min((attendanceStats.daysWorked / 22) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Current streak: {attendanceStats.streak} days
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <BarChart 
                      data={hoursByDayChartData}
                      xAxisKey="name"
                      series={[
                        { key: 'hours', label: 'Hours', color: 'var(--chart-primary)' }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Task Completion Trend */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completion Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-3xl font-bold">{taskStats.total}</p>
                        <p className="text-xs text-muted-foreground">Total Tasks</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-bold">{(taskStats.completed / (taskStats.total || 1)).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">Tasks / Week</p>
                      </div>
                    </div>
                    
                    <LineChart 
                      data={taskCompletionChartData}
                      xAxisKey="name"
                      series={[
                        { key: 'Completed', color: 'var(--chart-primary)' }
                      ]}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Awards & Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Awards & Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample Achievement */}
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Employee of the Month</h3>
                      <p className="text-sm text-muted-foreground">February 2023</p>
                      <p className="text-sm mt-1">Recognized for outstanding client satisfaction and project delivery.</p>
                    </div>
                  </div>
                  
                  {/* Sample Certification */}
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">UI/UX Design Certification</h3>
                      <p className="text-sm text-muted-foreground">November 2022</p>
                      <p className="text-sm mt-1">Completed advanced certification in UI/UX design principles and methodologies.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No tasks found for this employee</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Est. Time</TableHead>
                        <TableHead>Actual Time</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow key={task.task_id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>{task.client_name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                task.status === 'completed' ? 'default' : 
                                task.status === 'in_progress' ? 'secondary' : 
                                'outline'
                              }
                            >
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{task.estimated_time}h</TableCell>
                          <TableCell>{task.actual_time || '-'}h</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(task.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            
            {/* Task Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={[
                      { name: 'Design', hours: 90 },
                      { name: 'Development', hours: 75 },
                      { name: 'Marketing', hours: 120 },
                      { name: 'Content', hours: 85 },
                    ]}
                    xAxisKey="name"
                    series={[
                      { key: 'hours', label: 'Hours', color: 'var(--chart-primary)' }
                    ]}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Workload Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center h-[300px]">
                  <div className="w-full max-w-xs">
                    <PieChart 
                      data={[
                        { name: 'Brand Design', value: 35 },
                        { name: 'Web Design', value: 40 },
                        { name: 'Logo Design', value: 15 },
                        { name: 'Other', value: 10 },
                      ]}
                      nameKey="name"
                      dataKey="value"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle>Attendance Records</CardTitle>
                <DateRangePicker
                  date={dateRange}
                  setDate={setDateRange}
                />
              </CardHeader>
              <CardContent>
                {attendanceLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : attendance.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No attendance records found for this period</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Clock In</TableHead>
                        <TableHead>Clock Out</TableHead>
                        <TableHead>Hours</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((record, index) => {
                        const isLateIn = new Date(record.login_time).getHours() >= 10; // Assuming work starts at 9
                        const isEarlyOut = record.logout_time && new Date(record.logout_time).getHours() < 17; // Assuming work ends at 5
                        const hoursWorked = record.hours_worked;
                        
                        let status = 'Present';
                        if (isLateIn) status = 'Late In';
                        if (isEarlyOut) status = 'Early Out';
                        if (isLateIn && isEarlyOut) status = 'Late In & Early Out';
                        
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                            <TableCell className={isLateIn ? 'text-red-500' : ''}>
                              {new Date(record.login_time).toLocaleTimeString()}
                            </TableCell>
                            <TableCell className={isEarlyOut ? 'text-amber-500' : ''}>
                              {record.logout_time ? new Date(record.logout_time).toLocaleTimeString() : '-'}
                            </TableCell>
                            <TableCell>{hoursWorked.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={
                                  status === 'Present' ? 'default' : 
                                  status === 'Late In' || status === 'Early Out' ? 'secondary' : 
                                  'destructive'
                                }
                              >
                                {status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            
            {/* Attendance Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hours Per Day */}
              <Card>
                <CardHeader>
                  <CardTitle>Hours Per Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={hoursByDayChartData}
                    xAxisKey="name"
                    series={[
                      { key: 'hours', label: 'Hours', color: 'var(--chart-primary)' }
                    ]}
                  />
                </CardContent>
              </Card>
              
              {/* Attendance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col justify-center h-[300px]">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="space-y-1">
                        <p className="text-3xl font-bold">{attendance.length}</p>
                        <p className="text-xs text-muted-foreground">Days Present</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-3xl font-bold">{attendanceStats.streak}</p>
                        <p className="text-xs text-muted-foreground">Day Streak</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-6xl font-bold">{attendanceStats.avgHours.toFixed(1)}</p>
                        <p className="text-lg text-muted-foreground">Avg. Hours/Day</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Employee Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{profile.phone || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{profile.location || '-'}</p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Employment Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Employment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{profile.position || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{profile.department || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                    <p className="font-medium">EMP-{String(profile.user_id).padStart(4, '0')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Joining Date</p>
                    <p className="font-medium">
                      {profile.joining_date ? new Date(profile.joining_date).toLocaleDateString() : '-'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Skills & Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.skills?.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="relative flex-shrink-0">
                          <Star className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium">{skill}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeProfile;
