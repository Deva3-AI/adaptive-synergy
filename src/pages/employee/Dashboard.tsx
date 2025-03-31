
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Timer,
  BellRing,
  BarChart3,
  Briefcase,
  PieChart,
  Users,
  Activity,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import TaskList from '@/components/employee/TaskList';
import WorkTracker from '@/components/employee/WorkTracker';
import AIAssistant from '@/components/ai/AIAssistant';
import VirtualManagerInsights from '@/components/employee/VirtualManagerInsights';
import EmployeeLeaveRequests from '@/components/employee/EmployeeLeaveRequests';
import { hrService, financeService } from '@/services/api';
import userService from '@/services/api/userService';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [taskFilter, setTaskFilter] = useState<any>({});
  
  // Fetch tasks for the current user
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ['employee-tasks', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return [];
        return await userService.getUserTasks(user.id);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });
  
  // Fetch today's attendance record
  const { data: todayAttendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ['today-attendance', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) return null;
        
        const today = new Date().toISOString().split('T')[0];
        const attendanceData = await userService.getUserAttendance(user.id);
        
        return attendanceData.find((record: any) => 
          record.work_date === today || 
          (record.work_date && new Date(record.work_date).toISOString().split('T')[0] === today)
        );
      } catch (error) {
        console.error('Error fetching today attendance:', error);
        return null;
      }
    },
    enabled: !!user?.id,
  });
  
  // Calculate dashboard metrics
  const pendingTasksCount = tasks?.filter((task: any) => task.status === 'pending').length || 0;
  const inProgressTasksCount = tasks?.filter((task: any) => task.status === 'in_progress').length || 0;
  const completedTasksCount = tasks?.filter((task: any) => task.status === 'completed').length || 0;
  
  const isWorking = !!todayAttendance?.login_time && !todayAttendance?.logout_time;
  const todayHours = calculateWorkedHours(todayAttendance);
  
  const handleStartWork = async () => {
    try {
      if (!user?.id) return;
      
      const result = await hrService.startWork(user.id);
      if (result) {
        toast.success('You have started your workday');
      }
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work. Please try again.');
    }
  };
  
  const handleEndWork = async () => {
    try {
      if (!todayAttendance?.attendance_id) return;
      
      const result = await hrService.stopWork(todayAttendance.attendance_id);
      if (result) {
        toast.success('You have ended your workday');
      }
    } catch (error) {
      console.error('Error ending work:', error);
      toast.error('Failed to end work. Please try again.');
    }
  };
  
  function calculateWorkedHours(attendance: any): number {
    if (!attendance) return 0;
    
    const loginTime = attendance.login_time ? new Date(attendance.login_time) : null;
    const logoutTime = attendance.logout_time ? new Date(attendance.logout_time) : null;
    
    if (!loginTime) return 0;
    
    const endTime = logoutTime || new Date();
    const diffMs = endTime.getTime() - loginTime.getTime();
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    return Math.round(diffHrs * 10) / 10; // Round to 1 decimal place
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's your overview for today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(), 'EEEE, MMMM d')}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Working Status</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceLoading ? (
                "Loading..."
              ) : isWorking ? (
                "Currently Working"
              ) : todayAttendance?.login_time ? (
                "Workday Ended"
              ) : (
                "Not Started"
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {todayAttendance?.login_time ? (
                <>
                  Today: {todayHours} hours 
                  {isWorking ? " (ongoing)" : " (completed)"}
                </>
              ) : (
                "You haven't started work today"
              )}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant={isWorking ? "outline" : "default"} 
              className="w-full"
              onClick={isWorking ? handleEndWork : handleStartWork}
              disabled={attendanceLoading}
            >
              {isWorking ? (
                <>
                  <Timer className="mr-2 h-4 w-4" />
                  End Work Day
                </>
              ) : todayAttendance?.login_time ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Work Day Completed
                </>
              ) : (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  Start Work Day
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasksLoading ? "Loading..." : tasks?.length || 0}
            </div>
            <div className="mt-2 pt-2 border-t">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Pending</span>
                  <div className="font-medium">{pendingTasksCount}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">In Progress</span>
                  <div className="font-medium">{inProgressTasksCount}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Completed</span>
                  <div className="font-medium">{completedTasksCount}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/employee/tasks')}>
              <ClipboardList className="mr-2 h-4 w-4" />
              View All Tasks
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <div className="mt-2">
              <div className="space-y-1.5">
                <div className="flex text-xs justify-between">
                  <span className="text-muted-foreground">Task Completion</span>
                  <span>98%</span>
                </div>
                <Progress value={98} className="h-1.5" />
              </div>
              <div className="space-y-1.5 mt-2">
                <div className="flex text-xs justify-between">
                  <span className="text-muted-foreground">Quality Score</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-1.5" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/employee/profile')}>
              <Activity className="mr-2 h-4 w-4" />
              View Performance
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <BellRing className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Task</Badge>
                <span className="text-xs text-muted-foreground truncate">New task assigned</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">HR</Badge>
                <span className="text-xs text-muted-foreground truncate">Leave approved</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">System</Badge>
                <span className="text-xs text-muted-foreground truncate">Update your profile</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <BellRing className="mr-2 h-4 w-4" />
              View All Notifications
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="tasks" className="space-y-4">
            <TabsList>
              <TabsTrigger value="tasks">My Tasks</TabsTrigger>
              <TabsTrigger value="time">Time Tracking</TabsTrigger>
              <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Tasks</h2>
                <Button variant="outline" size="sm" onClick={() => navigate('/employee/tasks')}>View All</Button>
              </div>
              {tasks && tasks.length > 0 ? (
                <TaskList 
                  tasks={tasks.slice(0, 6)} 
                  isLoading={tasksLoading} 
                  error={tasksError} 
                  filter={taskFilter}
                  setFilter={setTaskFilter}
                  showClient={true}
                />
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have any tasks assigned yet.
                    </p>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Request New Task
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="time">
              <WorkTracker 
                isWorking={isWorking}
                onStartWork={handleStartWork}
                onEndWork={handleEndWork}
                startTime={todayAttendance?.login_time ? new Date(todayAttendance.login_time) : new Date()}
                todayHours={todayHours}
              />
            </TabsContent>
            <TabsContent value="leaves">
              <EmployeeLeaveRequests />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-4">
          <Tabs defaultValue="ai-assistant" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
              <TabsTrigger value="manager-insights">Manager Insights</TabsTrigger>
            </TabsList>
            <TabsContent value="ai-assistant" className="space-y-4">
              <AIAssistant />
            </TabsContent>
            <TabsContent value="manager-insights" className="space-y-4">
              <VirtualManagerInsights />
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">Team Meeting</p>
                    <p className="text-xs text-muted-foreground">Today, 3:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">Project Deadline</p>
                    <p className="text-xs text-muted-foreground">Tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">Monthly Report</p>
                    <p className="text-xs text-muted-foreground">Jun 30, 2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" />
                View All Events
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
