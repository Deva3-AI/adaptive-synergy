import { useState, useEffect } from 'react';
import hrService from '@/services/api/hrService';
import taskService from '@/services/api/taskService';
import aiService from '@/services/api/aiService';
import userService from '@/services/api/userService';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarClock, CheckCircle2, MessageSquare, User2, Activity, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [taskData, setTaskData] = useState<any[]>([]);
  const [productivityInsights, setProductivityInsights] = useState<any>(null);
  const [suggestedTasks, setSuggestedTasks] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<"week" | "month">("week");

  // Fetch user profile
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => userService.getUserProfile(),
  });

  useEffect(() => {
    if (user) {
      setUserId(user.user_id);
    }
  }, [user]);

  // Fetch attendance data
  const { isLoading: isAttendanceLoading } = useQuery({
    queryKey: ['attendance', userId, dateRange],
    queryFn: () => {
      const today = new Date();
      let startDate: string | undefined;

      if (dateRange === "week") {
        startDate = format(subDays(today, 7), 'yyyy-MM-dd');
      } else if (dateRange === "month") {
        startDate = format(subDays(today, 30), 'yyyy-MM-dd');
      }

      return userId ? hrService.getEmployeeAttendance(userId, startDate, format(today, 'yyyy-MM-dd')) : Promise.resolve([]);
    },
    enabled: !!userId,
    onSuccess: (data) => {
      setAttendanceData(data);
    },
  });

  // Fetch tasks data
  const { isLoading: isTasksLoading } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: () => userId ? taskService.getTasksByEmployee(userId) : Promise.resolve([]),
    enabled: !!userId,
    onSuccess: (data) => {
      setTaskData(data);
    },
  });

  // Fetch productivity insights
  const { isLoading: isInsightsLoading } = useQuery({
    queryKey: ['productivity-insights', userId],
    queryFn: () => userId ? aiService.getProductivityInsights(userId) : Promise.resolve(null),
    enabled: !!userId,
    onSuccess: (data) => {
      setProductivityInsights(data);
    },
  });

  // Fetch suggested tasks
  const { isLoading: isSuggestedTasksLoading } = useQuery({
    queryKey: ['suggested-tasks', userId],
    queryFn: () => userId ? aiService.getSuggestedTasks(userId) : Promise.resolve([]),
    enabled: !!userId,
    onSuccess: (data) => {
      setSuggestedTasks(data);
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Profile</CardTitle>
            <CardDescription>Your profile information</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            {isUserLoading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : (
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://avatar.vercel.sh/${user?.name}.png`} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="text-sm font-medium">{user?.name}</h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Attendance Overview</CardTitle>
            <CardDescription>Your attendance record</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-2">
              <Button
                variant={dateRange === "week" ? "default" : "outline"}
                onClick={() => setDateRange("week")}
                size="sm"
              >
                Weekly
              </Button>
              <Button
                variant={dateRange === "month" ? "default" : "outline"}
                onClick={() => setDateRange("month")}
                size="sm"
              >
                Monthly
              </Button>
            </div>
            {isAttendanceLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <div className="space-y-1">
                {attendanceData.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-center space-x-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">{formatDate(record.date)}</span>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </div>
                ))}
                {attendanceData.length === 0 && (
                  <p className="text-sm text-muted-foreground">No attendance records found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Task Summary</CardTitle>
            <CardDescription>Your assigned tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {isTasksLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <div className="space-y-2">
                {taskData.slice(0, 3).map((task) => (
                  <div key={task.task_id} className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">{task.title}</span>
                  </div>
                ))}
                {taskData.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tasks assigned.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Productivity Insights Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Productivity Insights</CardTitle>
            <CardDescription>AI-driven insights</CardDescription>
          </CardHeader>
          <CardContent>
            {isInsightsLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">Score: {productivityInsights?.productivity_score}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">Trends: {productivityInsights?.trends.length}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Suggested Tasks Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Suggested Tasks</CardTitle>
            <CardDescription>AI-generated task suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full">
              {isSuggestedTasksLoading ? (
                <div className="p-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestedTasks.map((task) => (
                    <div key={task.id} className="p-3 border rounded-md">
                      <h4 className="text-sm font-medium">{task.title}</h4>
                      <p className="text-xs text-muted-foreground">{task.description}</p>
                    </div>
                  ))}
                  {suggestedTasks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tasks suggested.</p>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>Manage your tasks and profile</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild>
              <Link to="/app/tasks" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>View All Tasks</span>
              </Link>
            </Button>
            <Button asChild>
              <Link to="/app/profile" className="flex items-center space-x-2">
                <User2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
