
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Clock,
  Briefcase,
  CalendarCheck,
  Users,
  CheckCircle,
  Clock8,
  Calendar,
  User,
  LineChart,
  ArrowUpRight,
  AlertCircle,
  PlayCircle,
  StopCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmployeeWorkTracker from "@/components/dashboard/EmployeeWorkTracker";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchData, postData } from "@/utils/apiUtils";
import { useEmployees } from "@/utils/apiUtils";

// Types for the data
interface Task {
  task_id: number;
  title: string;
  client_name: string;
  description: string;
  status: string;
  estimated_time: number;
  actual_time: number;
  due_date?: string;
  progress: number;
  priority: string;
}

interface Employee {
  user_id: number;
  name: string;
  email: string;
  role: {
    role_name: string;
  };
}

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "High":
      return "danger";
    case "Medium":
      return "warning";
    case "Low":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "in_progress":
      return "accent";
    case "pending":
      return "outline";
    case "cancelled":
      return "warning";
    default:
      return "outline";
  }
};

const EmployeeDashboard = () => {
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const { data: employees } = useEmployees();
  
  // Get current user info from local storage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };
  
  const currentUser = getCurrentUser();
  
  // Fetch tasks assigned to the current user
  const { data: tasks, isLoading: tasksLoading, refetch: refetchTasks } = useQuery({
    queryKey: ['employeeTasks'],
    queryFn: async () => {
      try {
        if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
          // In development, if backend is not available, use mock data
          return [
            {
              task_id: 1,
              title: "Website redesign for TechCorp",
              client_name: "TechCorp",
              description: "Redesign the homepage and product pages",
              status: "in_progress",
              estimated_time: 8.0,
              actual_time: 4.5,
              due_date: "Today at 4:00 PM",
              progress: 65,
              priority: "High"
            },
            {
              task_id: 2,
              title: "Mobile app wireframes",
              client_name: "Acme Inc.",
              description: "Create wireframes for the mobile app",
              status: "pending",
              estimated_time: 6.0,
              actual_time: 0,
              due_date: "Tomorrow at 12:00 PM",
              progress: 0,
              priority: "Medium"
            },
            {
              task_id: 3,
              title: "Marketing banner designs",
              client_name: "Growth Hackers",
              description: "Create marketing banners for social media",
              status: "in_progress",
              estimated_time: 3.0,
              actual_time: 1.0,
              due_date: "Sep 22, 2023",
              progress: 30,
              priority: "Medium"
            },
            {
              task_id: 4,
              title: "Client presentation slides",
              client_name: "NewStart LLC",
              description: "Create presentation slides for the client meeting",
              status: "pending",
              estimated_time: 4.0,
              actual_time: 0,
              due_date: "Sep 23, 2023",
              progress: 0,
              priority: "High"
            }
          ];
        }
        
        // Regular API call
        const response = await fetchData('/employee/tasks');
        return response;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        
        // Fallback data
        return [
          {
            task_id: 1,
            title: "Website redesign for Social Land",
            client_name: "Social Land",
            description: "Redesign the homepage and product pages",
            status: "in_progress",
            estimated_time: 8.0,
            actual_time: 4.5,
            due_date: "Today at 4:00 PM",
            progress: 65,
            priority: "High"
          },
          {
            task_id: 2,
            title: "Mobile app wireframes",
            client_name: "Koala Digital",
            description: "Create wireframes for the mobile app",
            status: "pending",
            estimated_time: 6.0,
            actual_time: 0,
            due_date: "Tomorrow at 12:00 PM",
            progress: 0,
            priority: "Medium"
          }
        ];
      }
    }
  });

  // Fetch active task status
  const { data: activeTask, isLoading: activeTaskLoading, refetch: refetchActiveTask } = useQuery({
    queryKey: ['activeTask'],
    queryFn: async () => {
      try {
        if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
          return null;
        }
        
        const response = await fetchData('/employee/tasks/active');
        return response;
      } catch (error) {
        console.error('Error fetching active task:', error);
        return null;
      }
    }
  });

  // Set active task from API response
  useEffect(() => {
    if (activeTask && activeTask.task_id) {
      setActiveTaskId(activeTask.task_id);
    }
  }, [activeTask]);

  // Start a task
  const startTask = async (taskId: number) => {
    try {
      // If another task is active, stop it first
      if (activeTaskId && activeTaskId !== taskId) {
        await stopTask(activeTaskId);
      }
      
      if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
        setActiveTaskId(taskId);
        toast.success(`Started work on task #${taskId}`);
        return;
      }
      
      await postData('/employee/tasks/start', { task_id: taskId });
      setActiveTaskId(taskId);
      toast.success(`Started work on task #${taskId}`);
      refetchTasks();
      refetchActiveTask();
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error('Failed to start task. Please try again.');
    }
  };

  // Stop a task
  const stopTask = async (taskId: number) => {
    try {
      if (import.meta.env.DEV && !import.meta.env.VITE_USE_REAL_API) {
        setActiveTaskId(null);
        toast.success(`Stopped work on task #${taskId}`);
        return;
      }
      
      await postData('/employee/tasks/stop', { task_id: taskId });
      setActiveTaskId(null);
      toast.success(`Stopped work on task #${taskId}`);
      refetchTasks();
      refetchActiveTask();
    } catch (error) {
      console.error('Error stopping task:', error);
      toast.error('Failed to stop task. Please try again.');
    }
  };

  // Calculate task statistics
  const completedTasks = tasks?.filter(task => task.status === "completed")?.length || 0;
  const totalTasks = tasks?.length || 0;
  const tasksProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Get current user's role
  const currentUserRole = employees?.find(emp => emp.email === currentUser?.email)?.role?.role_name || 'Employee';

  // Convert tasks to chart data
  const weeklyActivityData = [
    { name: "Mon", hours: 7.5, tasks: 5, completed: 4 },
    { name: "Tue", hours: 8.2, tasks: 7, completed: 6 },
    { name: "Wed", hours: 7.8, tasks: 6, completed: 5 },
    { name: "Thu", hours: 8.5, tasks: 8, completed: 7 },
    { name: "Fri", hours: 6.5, tasks: 4, completed: 4 },
    { name: "Sat", hours: 2.0, tasks: 2, completed: 2 },
    { name: "Sun", hours: 0, tasks: 0, completed: 0 },
  ];

  const taskPriorityData = [
    { name: "High", value: tasks?.filter(task => task.priority === "High").length || 4 },
    { name: "Medium", value: tasks?.filter(task => task.priority === "Medium").length || 8 },
    { name: "Low", value: tasks?.filter(task => task.priority === "Low").length || 3 },
  ];

  const taskStatusData = [
    { name: "Not Started", value: tasks?.filter(task => task.status === "pending").length || 2 },
    { name: "In Progress", value: tasks?.filter(task => task.status === "in_progress").length || 8 },
    { name: "Completed", value: tasks?.filter(task => task.status === "completed").length || 12 },
    { name: "On Hold", value: tasks?.filter(task => task.status === "cancelled").length || 1 },
  ];

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.name || 'Employee'}! ({currentUserRole}) Monitor your tasks, track your time, and enhance your productivity
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground">{completedTasks} completed, {totalTasks - completedTasks} remaining</p>
            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${tasksProgress}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeTaskId ? 
                <span className="text-green-500 flex items-center gap-1">
                  <Clock8 className="h-4 w-4" /> Active
                </span> : '0h 0m'
              }
            </div>
            <p className="text-xs text-muted-foreground">Target: 8 hours</p>
            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: activeTaskId ? "55%" : "0%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Performance</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">4%</span> from last week
            </p>
            <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: "92%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: Client check-in at 2:00 PM</p>
            <div className="flex items-center mt-2">
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-background -ml-2">
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground ml-2">with TechCorp Team</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Work Session"
          icon={<Clock className="h-5 w-5" />}
          badgeText="Daily"
          badgeVariant="outline"
        >
          <EmployeeWorkTracker />
        </DashboardCard>

        <DashboardCard
          title="Weekly Activity"
          icon={<BarChart className="h-5 w-5" />}
          badgeText="This Week"
          badgeVariant="outline"
        >
          <AnalyticsChart 
            data={weeklyActivityData} 
            height={250}
            defaultType="bar"
          />
        </DashboardCard>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <DashboardCard
          title="Task Priority"
          icon={<AlertCircle className="h-5 w-5" />}
          badgeText="Current"
          badgeVariant="outline"
          className="md:col-span-2"
        >
          <AnalyticsChart 
            data={taskPriorityData} 
            height={200}
            defaultType="pie"
          />
        </DashboardCard>

        <DashboardCard
          title="Task Status"
          icon={<CheckCircle className="h-5 w-5" />}
          badgeText="Overall"
          badgeVariant="outline"
          className="md:col-span-3"
        >
          <AnalyticsChart 
            data={taskStatusData} 
            height={200}
            defaultType="bar"
          />
        </DashboardCard>
      </div>

      <DashboardCard
        title="My Tasks"
        icon={<Briefcase className="h-5 w-5" />}
        badgeText="Priority"
        badgeVariant="outline"
      >
        <div className="space-y-4">
          {tasksLoading ? (
            <div>Loading tasks...</div>
          ) : tasks && tasks.length > 0 ? (
            tasks.map((task: Task) => (
              <div 
                key={task.task_id} 
                className="p-4 rounded-md border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {task.client_name} • Due {task.due_date || 'Not set'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityBadgeVariant(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-1.5" />
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  {activeTaskId === task.task_id ? (
                    <Button variant="destructive" size="sm" onClick={() => stopTask(task.task_id)}>
                      <StopCircle className="h-4 w-4 mr-1" /> Stop Work
                    </Button>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => startTask(task.task_id)}
                      disabled={activeTaskId !== null && activeTaskId !== task.task_id}
                    >
                      <PlayCircle className="h-4 w-4 mr-1" /> Start Work
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No tasks assigned to you at the moment.
            </div>
          )}
        </div>
      </DashboardCard>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          title="Today's Schedule"
          icon={<Calendar className="h-5 w-5" />}
          badgeText="Today"
          badgeVariant="outline"
        >
          <div className="space-y-4">
            <div className="relative pl-5 border-l-2 border-accent">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-accent"></div>
              <p className="text-xs text-muted-foreground">9:00 AM - 10:30 AM</p>
              <h4 className="font-medium">Team Standup Meeting</h4>
              <p className="text-sm text-muted-foreground">
                Weekly sprint planning with the design team
              </p>
            </div>
            <div className="relative pl-5 border-l-2 border-green-500">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-green-500"></div>
              <p className="text-xs text-muted-foreground">11:00 AM - 12:00 PM</p>
              <h4 className="font-medium">Website Redesign Work</h4>
              <p className="text-sm text-muted-foreground">
                Work on TechCorp homepage mockups
              </p>
            </div>
            <div className="relative pl-5 border-l-2 border-yellow-500">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-yellow-500"></div>
              <p className="text-xs text-muted-foreground">2:00 PM - 3:00 PM</p>
              <h4 className="font-medium">Client Check-in</h4>
              <p className="text-sm text-muted-foreground">
                Progress review with TechCorp team
              </p>
            </div>
            <div className="relative pl-5 border-l-2 border-muted-foreground">
              <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-muted-foreground"></div>
              <p className="text-xs text-muted-foreground">4:00 PM - 5:30 PM</p>
              <h4 className="font-medium">Mobile App Wireframes</h4>
              <p className="text-sm text-muted-foreground">
                Start work on Acme Inc. mobile app concepts
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Team Members"
          icon={<Users className="h-5 w-5" />}
          badgeText="Online"
          badgeVariant="success"
        >
          <div className="space-y-4">
            {employees ? (
              employees.slice(0, 4).map((employee: Employee) => (
                <div key={employee.user_id} className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-green-500">
                    <AvatarFallback>{employee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{employee.name}</h4>
                      <Badge variant="outline" size="sm">{employee.role.role_name}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Online • {employee.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Loading team members...
              </div>
            )}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
