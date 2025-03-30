
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { BarChart, PieChart, LineChart } from '@/components/ui/charts';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, Clock, Timer, AlarmClock, Calendar, BellDot, ClipboardList, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import EmployeeWorkTracker from '@/components/dashboard/EmployeeWorkTracker';
import { DetailedTask } from '../employee/types';
import { cn } from '@/lib/utils';

// Mock data for development
const mockTasks = [
  {
    id: 1,
    title: "Design homepage mockup",
    description: "Create a wireframe and mockup for the client homepage redesign",
    client: "Acme Inc",
    clientLogo: "/placeholder.svg",
    dueDate: new Date("2023-06-15"),
    startDate: new Date("2023-06-01"),
    priority: "high",
    status: "in_progress",
    progress: 60,
    estimatedHours: 8,
    actualHours: 5,
    assignedTo: "John Doe",
    attachments: [
      { id: 1, name: "homepage-wireframe.fig", type: "application/fig", size: 2048 }
    ],
    comments: [
      { id: 1, user: "Alex Smith", content: "Looking good! Can we adjust the header spacing?", date: "2023-06-03" }
    ],
    tags: ["design", "homepage", "ui"],
    recentActivity: [
      { id: 1, type: "comment", user: "Alex Smith", timestamp: new Date("2023-06-03"), description: "Added a comment" },
      { id: 2, type: "update", user: "John Doe", timestamp: new Date("2023-06-02"), description: "Updated progress to 60%" }
    ]
  },
  {
    id: 2,
    title: "Implement payment integration",
    description: "Connect the Stripe API and implement the payment flow",
    client: "XYZ Corp",
    clientLogo: "/placeholder.svg",
    dueDate: new Date("2023-06-18"),
    startDate: new Date("2023-06-04"),
    priority: "medium",
    status: "pending",
    progress: 0,
    estimatedHours: 12,
    actualHours: 0,
    assignedTo: "John Doe",
    attachments: [],
    comments: [],
    tags: ["development", "payment", "api"],
    recentActivity: [
      { id: 1, type: "assigned", user: "Project Manager", timestamp: new Date("2023-06-04"), description: "Assigned to John Doe" }
    ]
  },
  {
    id: 3,
    title: "Content writing for blog",
    description: "Write 5 blog posts about digital marketing",
    client: "Marketing Pros",
    clientLogo: "/placeholder.svg",
    dueDate: new Date("2023-06-10"),
    startDate: new Date("2023-06-02"),
    priority: "medium",
    status: "completed",
    progress: 100,
    estimatedHours: 10,
    actualHours: 8,
    assignedTo: "John Doe",
    attachments: [
      { id: 1, name: "blog-post-1.docx", type: "application/docx", size: 512 },
      { id: 2, name: "blog-post-2.docx", type: "application/docx", size: 498 }
    ],
    comments: [
      { id: 1, user: "Marketing Manager", content: "Great work! Approved all posts.", date: "2023-06-09" }
    ],
    tags: ["content", "writing", "marketing"],
    recentActivity: [
      { id: 1, type: "completed", user: "John Doe", timestamp: new Date("2023-06-09"), description: "Marked task as completed" },
      { id: 2, type: "comment", user: "Marketing Manager", timestamp: new Date("2023-06-09"), description: "Added a comment" }
    ]
  },
  {
    id: 4,
    title: "SEO optimization",
    description: "Optimize website metadata and content for search engines",
    client: "Acme Inc",
    clientLogo: "/placeholder.svg",
    dueDate: new Date("2023-06-20"),
    startDate: new Date("2023-06-05"),
    priority: "low",
    status: "in_progress",
    progress: 30,
    estimatedHours: 6,
    actualHours: 2,
    assignedTo: "John Doe",
    attachments: [],
    comments: [],
    tags: ["seo", "optimization", "marketing"],
    recentActivity: [
      { id: 1, type: "update", user: "John Doe", timestamp: new Date("2023-06-07"), description: "Updated progress to 30%" }
    ]
  },
  {
    id: 5,
    title: "Mobile app bug fixes",
    description: "Fix reported bugs in the iOS and Android apps",
    client: "TechApp",
    clientLogo: "/placeholder.svg",
    dueDate: new Date("2023-06-12"),
    startDate: new Date("2023-06-06"),
    priority: "high",
    status: "in_progress",
    progress: 45,
    estimatedHours: 8,
    actualHours: 4,
    assignedTo: "John Doe",
    attachments: [
      { id: 1, name: "bug-report.pdf", type: "application/pdf", size: 1024 }
    ],
    comments: [
      { id: 1, user: "QA Tester", content: "Found 3 more edge cases to handle", date: "2023-06-08" }
    ],
    tags: ["development", "mobile", "bugfix"],
    recentActivity: [
      { id: 1, type: "comment", user: "QA Tester", timestamp: new Date("2023-06-08"), description: "Added a comment" },
      { id: 2, type: "update", user: "John Doe", timestamp: new Date("2023-06-08"), description: "Updated progress to 45%" }
    ]
  }
];

const mockStats = {
  todayHours: 3.5,
  weekHours: 22.5,
  monthHours: 160,
  tasks: {
    completed: 42,
    inProgress: 7,
    upcoming: 5
  },
  efficiency: 92,
  deadlineMet: 95,
  averageRating: 4.8,
  recentClients: [
    { name: "Acme Inc", logo: "/placeholder.svg", tasks: 8 },
    { name: "XYZ Corp", logo: "/placeholder.svg", tasks: 5 },
    { name: "TechApp", logo: "/placeholder.svg", tasks: 3 },
    { name: "Marketing Pros", logo: "/placeholder.svg", tasks: 2 }
  ],
  hoursBreakdown: [
    { name: "Design", value: 35 },
    { name: "Development", value: 45 },
    { name: "Meeting", value: 10 },
    { name: "Admin", value: 10 }
  ],
  monthlyHours: [
    { name: "Jan", value: 145 },
    { name: "Feb", value: 155 },
    { name: "Mar", value: 160 },
    { name: "Apr", value: 150 },
    { name: "May", value: 165 },
    { name: "Jun", value: 160 }
  ]
};

const EmployeeDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const queryClient = useQueryClient();
  const [isWorkStarted, setIsWorkStarted] = useState(false);
  const [currentSessionStart, setCurrentSessionStart] = useState<Date | null>(null);
  const [isWorkingModalOpen, setIsWorkingModalOpen] = useState(false);
  const [todayWorkHours, setTodayWorkHours] = useState<number | null>(null);
  
  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not found');
      
      // Fetch additional user details
      const { data: userDetails, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();
        
      if (error) throw error;
      
      return {
        ...user,
        ...userDetails
      };
    }
  });
  
  // Fetch tasks for the current user
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['employee-tasks'],
    queryFn: async () => {
      try {
        // In a real implementation, fetch actual tasks from the API
        return mockTasks;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  });
  
  // Fetch attendance records for today
  const { data: todayAttendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['today-attendance'],
    queryFn: async () => {
      // const user = await supabase.auth.getUser();
      // const userId = user.data.user?.id;
      const today = new Date().toISOString().split('T')[0];
      
      try {
        // Fetch attendance record for today
        const { data, error } = await supabase
          .from('employee_attendance')
          .select('*')
          .eq('user_id', userData?.id)
          .eq('work_date', today)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        return data?.[0] || null;
      } catch (error) {
        console.error('Error fetching attendance:', error);
        return null;
      }
    },
    enabled: !!userData?.id
  });
  
  // Fetch user stats
  const { data: stats = mockStats, isLoading: statsLoading } = useQuery({
    queryKey: ['employee-stats'],
    queryFn: async () => {
      try {
        // In a real implementation, fetch actual stats from the API
        return mockStats;
      } catch (error) {
        console.error('Error fetching stats:', error);
        return mockStats;
      }
    }
  });
  
  // Create attendance record mutation
  const createAttendanceMutation = useMutation({
    mutationFn: async (data: { user_id: string, login_time: string, work_date: string }) => {
      const { data: result, error } = await supabase
        .from('employee_attendance')
        .insert(data);
        
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-attendance'] });
      toast({
        title: "Work started",
        description: "Your work session has been started successfully."
      });
    }
  });
  
  // Update attendance record mutation
  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ id, logout_time }: { id: number, logout_time: string }) => {
      const { data: result, error } = await supabase
        .from('employee_attendance')
        .update({ logout_time })
        .eq('attendance_id', id);
        
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-attendance'] });
      toast({
        title: "Work ended",
        description: "Your work session has been ended successfully."
      });
    }
  });
  
  // Check if there's an active work session
  useEffect(() => {
    if (todayAttendance && todayAttendance.login_time && !todayAttendance.logout_time) {
      setIsWorkStarted(true);
      setCurrentSessionStart(new Date(todayAttendance.login_time));
    } else {
      setIsWorkStarted(false);
      setCurrentSessionStart(null);
    }
  }, [todayAttendance]);
  
  // Calculate today's work hours
  useEffect(() => {
    if (!todayAttendance) {
      setTodayWorkHours(0);
      return;
    }
    
    if (todayAttendance.login_time && !todayAttendance.logout_time) {
      // Currently working - calculate time from login until now
      const loginTime = new Date(todayAttendance.login_time);
      const now = new Date();
      const hoursWorked = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      setTodayWorkHours(parseFloat(hoursWorked.toFixed(2)));
    } else if (todayAttendance.login_time && todayAttendance.logout_time) {
      // Completed work - calculate time between login and logout
      const loginTime = new Date(todayAttendance.login_time);
      const logoutTime = new Date(todayAttendance.logout_time);
      const hoursWorked = (logoutTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      setTodayWorkHours(parseFloat(hoursWorked.toFixed(2)));
    } else {
      setTodayWorkHours(0);
    }
  }, [todayAttendance]);
  
  // Start work session
  const handleStartWork = () => {
    if (!userData?.id) {
      toast({
        title: "Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    createAttendanceMutation.mutate({
      user_id: userData.id,
      login_time: now.toISOString(),
      work_date: today
    });
    
    setIsWorkStarted(true);
    setCurrentSessionStart(now);
  };
  
  // End work session
  const handleEndWork = () => {
    if (!todayAttendance?.attendance_id) {
      toast({
        title: "Error",
        description: "No active work session found.",
        variant: "destructive"
      });
      return;
    }
    
    const now = new Date();
    
    updateAttendanceMutation.mutate({
      id: todayAttendance.attendance_id,
      logout_time: now.toISOString()
    });
    
    setIsWorkStarted(false);
    setCurrentSessionStart(null);
  };
  
  // Calculate priority badge variant
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  if (userLoading) {
    return <div>Loading user data...</div>;
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {userData?.user_metadata?.name || userData?.name || 'Employee'}!
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <EmployeeWorkTracker 
            isWorking={isWorkStarted}
            onStartWork={handleStartWork}
            onEndWork={handleEndWork}
            startTime={currentSessionStart}
            todayHours={todayWorkHours || 0}
          />
        </div>
      </div>
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
            <AlarmClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayWorkHours !== null ? todayWorkHours : statsLoading ? <Skeleton className="h-8 w-16" /> : stats.todayHours} hours
            </div>
            <p className="text-xs text-muted-foreground">
              {isWorkStarted ? (
                <span className="text-green-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Currently working
                </span>
              ) : (
                "Hours tracked today"
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasksLoading ? <Skeleton className="h-8 w-16" /> : (
                `${tasks.filter((t: DetailedTask) => t.status === 'completed').length}/${tasks.length}`
              )}
            </div>
            <div className="mt-2 h-2 w-full bg-secondary">
              <div 
                className="h-full bg-primary"
                style={{ 
                  width: `${tasksLoading ? 0 : (tasks.filter((t: DetailedTask) => t.status === 'completed').length / tasks.length) * 100}%` 
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasksLoading ? <Skeleton className="h-8 w-16" /> : (
                tasks.filter((t: DetailedTask) => {
                  const today = new Date();
                  const dueDate = new Date(t.dueDate!);
                  const diffTime = dueDate.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7 && t.status !== 'completed';
                }).length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks due in the next 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? <Skeleton className="h-8 w-16" /> : `${stats.efficiency}%`}
            </div>
            <Progress 
              value={statsLoading ? 0 : stats.efficiency} 
              className="h-2 mt-2" 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Based on estimated vs actual hours
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your most recent assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                {tasksLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No tasks assigned yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.slice(0, 3).map((task: DetailedTask) => (
                      <div 
                        key={task.id} 
                        className="flex items-start p-3 rounded-lg border"
                      >
                        <div className="mr-4 mt-1">
                          {task.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2",
                              task.priority === 'high' ? "border-red-500" :
                              task.priority === 'medium' ? "border-yellow-500" :
                              "border-blue-500"
                            )}/>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-base">{task.title}</h4>
                            <div className="flex space-x-2">
                              {getPriorityBadge(task.priority)}
                              {getStatusBadge(task.status)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description.substring(0, 100)}{task.description.length > 100 ? '...' : ''}
                          </p>
                          <div className="flex justify-between mt-2">
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}
                            </span>
                            <span className="text-xs flex items-center">
                              Client: {task.client}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Working Hours</CardTitle>
                <CardDescription>Your tracked hours this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Today</span>
                      <span className="font-medium">{todayWorkHours || 0} hours</span>
                    </div>
                    <Progress value={(todayWorkHours || 0) * 12.5} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Week</span>
                      <span className="font-medium">{stats.weekHours} hours</span>
                    </div>
                    <Progress value={stats.weekHours / 40 * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This Month</span>
                      <span className="font-medium">{stats.monthHours} hours</span>
                    </div>
                    <Progress value={stats.monthHours / 160 * 100} className="h-2" />
                  </div>
                  
                  <div className="py-2">
                    <LineChart 
                      data={stats.monthlyHours}
                      xAxisKey="name"
                      height={150}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Types</CardTitle>
                <CardDescription>Hours by task category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <PieChart 
                    data={stats.hoursBreakdown}
                    nameKey="name"
                    dataKey="value"
                  />
                </div>
                <div className="space-y-2 mt-2">
                  {stats.hoursBreakdown.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: [
                              "#4f46e5", "#10b981", "#f59e0b", "#ef4444"
                            ][i % 4]
                          }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span>{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your performance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <h4 className="text-sm font-medium">Tasks Completed</h4>
                    <p className="text-2xl font-bold">{stats.tasks.completed}</p>
                    <div className="text-xs text-muted-foreground flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      {stats.tasks.inProgress} in progress
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <h4 className="text-sm font-medium">Deadlines Met</h4>
                    <p className="text-2xl font-bold">{stats.deadlineMet}%</p>
                    <div className="text-xs text-muted-foreground">
                      Based on completed tasks
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <h4 className="text-sm font-medium">Client Rating</h4>
                    <p className="text-2xl font-bold">{stats.averageRating}/5</p>
                    <div className="text-xs text-muted-foreground">
                      Average from all clients
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <BarChart 
                    data={stats.monthlyHours}
                    xAxisKey="name"
                    height={200}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Manage and track your assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="in-progress" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="in-progress">
                  {tasksLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tasks
                        .filter((task: DetailedTask) => task.status === 'in_progress')
                        .map((task: DetailedTask) => (
                          <Card key={task.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between">
                                <h3 className="font-semibold">{task.title}</h3>
                                <div>
                                  {getPriorityBadge(task.priority)}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>{task.progress}%</span>
                                </div>
                                <Progress value={task.progress} className="h-2" />
                              </div>
                              <div className="flex justify-between mt-3 text-sm">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Due: {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}
                                </span>
                                <span>
                                  Client: {task.client}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pending">
                  {/* Similar content for pending tasks */}
                  <div className="space-y-4">
                    {tasks
                      .filter((task: DetailedTask) => task.status === 'pending')
                      .map((task: DetailedTask) => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <h3 className="font-semibold">{task.title}</h3>
                              <div>
                                {getPriorityBadge(task.priority)}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex justify-between mt-3 text-sm">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {task.dueDate ? formatDate(task.dueDate) : 'No deadline'}
                              </span>
                              <span>
                                Client: {task.client}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="completed">
                  {/* Similar content for completed tasks */}
                  <div className="space-y-4">
                    {tasks
                      .filter((task: DetailedTask) => task.status === 'completed')
                      .map((task: DetailedTask) => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <h3 className="font-semibold">{task.title}</h3>
                              <div>
                                <Badge variant="success">Completed</Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex justify-between mt-3 text-sm">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Completed: {formatDate(new Date())}
                              </span>
                              <span>
                                Client: {task.client}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Hours</CardTitle>
                <CardDescription>Your tracked hours over time</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={stats.monthlyHours}
                  xAxisKey="name"
                  height={300}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Distribution</CardTitle>
                <CardDescription>Hours spent by task category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart 
                    data={stats.hoursBreakdown}
                    nameKey="name"
                    dataKey="value"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Updates and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-3 rounded-lg border">
                    <BellDot className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">New task assigned</p>
                      <p className="text-sm text-muted-foreground">
                        You have been assigned a new task "Design homepage mockup" for Acme Inc.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 rounded-lg border">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Task completed</p>
                      <p className="text-sm text-muted-foreground">
                        You marked "Content writing for blog" as completed.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 rounded-lg border">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Upcoming deadline</p>
                      <p className="text-sm text-muted-foreground">
                        Task "SEO optimization" is due in 2 days.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 rounded-lg border">
                    <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">New comment</p>
                      <p className="text-sm text-muted-foreground">
                        Alex Smith commented on task "Design homepage mockup".
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 rounded-lg border">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Task priority changed</p>
                      <p className="text-sm text-muted-foreground">
                        Task "Mobile app bug fixes" priority changed to High.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Missing components
const AlertTriangle = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
};

const MessageCircle = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
};

export default EmployeeDashboard;
