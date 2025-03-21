
// Update employee dashboard with proper type handling
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  ListChecks, 
  PlayCircle, 
  StopCircle,
  Calendar,
  MoreHorizontal,
  User as UserIcon,
  BadgeCheck,
  ArrowRight,
  MessageSquare,
  Flame
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks, useEmployees, taskOperations, Task, Employee } from "@/utils/apiUtils";
import { toast } from "sonner";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmployeeWorkTracker from "@/components/dashboard/EmployeeWorkTracker";
import EmployeePerformanceInsights from "@/components/ai/EmployeePerformanceInsights";

const EmployeeDashboard = () => {
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  
  // Fetch tasks and employees
  const { data: tasks = [], refetch: refetchTasks } = useTasks();
  const { data: employees = [] } = useEmployees();
  
  // Get current user from employees list (for demo purposes)
  // In a real app, this would come from auth context
  useEffect(() => {
    if (employees.length > 0) {
      // Use first employee as current user for demo
      setCurrentUser(employees[0]);
    }
  }, [employees]);
  
  // Check if there's an active task
  useEffect(() => {
    if (tasks) {
      const inProgressTask = tasks.find(
        task => task.status === "in_progress" && task.assigned_to === currentUser?.user_id
      );
      if (inProgressTask) {
        setActiveTaskId(inProgressTask.task_id);
      } else {
        setActiveTaskId(null);
      }
    }
  }, [tasks, currentUser]);
  
  // Handle start task
  const handleStartTask = async (taskId: number) => {
    if (activeTaskId) {
      toast.error("You already have an active task. Please finish it first.");
      return;
    }
    
    try {
      await taskOperations.startTask(taskId);
      setActiveTaskId(taskId);
      refetchTasks();
    } catch (error) {
      console.error("Error starting task:", error);
    }
  };
  
  // Handle stop task
  const handleStopTask = async (taskId: number) => {
    try {
      await taskOperations.stopTask(taskId);
      setActiveTaskId(null);
      refetchTasks();
    } catch (error) {
      console.error("Error stopping task:", error);
    }
  };
  
  // Handle complete task
  const handleCompleteTask = async (taskId: number) => {
    try {
      await taskOperations.completeTask(taskId);
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
      }
      refetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };
  
  // Filter assigned tasks for the current user
  const myTasks = tasks && Array.isArray(tasks) ? tasks.filter(task => 
    task.assigned_to === currentUser?.user_id
  ) : [];
  
  // Count tasks by status
  const taskCounts = {
    total: myTasks.length || 0,
    pending: myTasks.filter(task => task.status === "pending").length || 0,
    inProgress: myTasks.filter(task => task.status === "in_progress").length || 0,
    completed: myTasks.filter(task => task.status === "completed").length || 0,
    today: myTasks.filter(task => {
      if (!task.created_at) return false;
      const taskDate = new Date(task.created_at).toDateString();
      const today = new Date().toDateString();
      return taskDate === today;
    }).length || 0
  };
  
  // Calculate completion rate
  const completionRate = taskCounts.total > 0 
    ? Math.round((taskCounts.completed / taskCounts.total) * 100) 
    : 0;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{currentUser ? `, ${currentUser.name}` : ""}! Track your tasks and manage your work time.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.total}</div>
            <div className="flex mt-1 space-x-2">
              <div className="text-xs text-muted-foreground">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                {taskCounts.pending} pending
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="inline-block w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
                {taskCounts.inProgress} in progress
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                {taskCounts.completed} completed
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCounts.today}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {activeTaskId ? "1 task currently active" : "No active tasks"}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Task</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeTaskId ? (
              <div>
                <div className="text-md font-medium truncate">
                  {tasks.find(t => t.task_id === activeTaskId)?.title || "Task"}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Flame className="h-3 w-3 text-amber-500 mr-1 animate-pulse" />
                  <span>Currently in progress</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-md">No active task</div>
                <div className="text-xs text-muted-foreground mt-1">Start a task below</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <DashboardCard
          title="Work Timer"
          icon={<Clock className="h-5 w-5" />}
          badgeText="Daily"
          badgeVariant="outline"
          className="md:col-span-3"
        >
          <EmployeeWorkTracker />
        </DashboardCard>
        
        <DashboardCard
          title={activeTaskId ? "Active Task" : "No Active Task"}
          icon={activeTaskId ? <Flame className="h-5 w-5 text-amber-500" /> : <Clock className="h-5 w-5" />}
          badgeText={activeTaskId ? "In Progress" : "Start Task"}
          badgeVariant={activeTaskId ? "warning" : "outline"}
          className="md:col-span-4"
        >
          {activeTaskId ? (
            <div className="h-full flex flex-col">
              <div className="space-y-4 flex-1">
                {tasks.map(task => {
                  if (task.task_id === activeTaskId) {
                    return (
                      <div key={task.task_id} className="bg-muted/50 p-4 rounded-lg space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <Badge variant="warning" className="ml-2">In Progress</Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        
                        <div className="flex items-center text-sm text-muted-foreground">
                          <UserIcon className="h-4 w-4 mr-1" />
                          <span>Client: {task.client_name}</span>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{task.estimated_time} hrs estimated</span>
                          </div>
                          
                          <div className="space-x-2">
                            <Button variant="destructive" size="sm" onClick={() => handleStopTask(task.task_id)}>
                              <StopCircle className="h-4 w-4 mr-1" />
                              <span>Stop Task</span>
                            </Button>
                            <Button variant="default" size="sm" onClick={() => handleCompleteTask(task.task_id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Complete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Note:</span> Stopping a task will pause your progress. You can resume later.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="text-center py-4 text-muted-foreground mb-4">
                <Clock className="h-12 w-12 mx-auto mb-2 text-muted-foreground/70" />
                <h3 className="text-lg font-medium mb-1">No Active Task</h3>
                <p className="text-sm">Select a task from below to start working</p>
              </div>
              
              <div className="flex-1 space-y-2">
                {myTasks.filter(task => task.status === "pending").length > 0 ? (
                  myTasks
                    .filter(task => task.status === "pending")
                    .slice(0, 3)
                    .map(task => (
                      <div key={task.task_id} className="bg-muted/30 p-3 rounded-md flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="text-xs text-muted-foreground mt-1">
                            Client: {task.client_name} • {task.estimated_time} hrs
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleStartTask(task.task_id)}>
                          <PlayCircle className="h-4 w-4 mr-1" />
                          <span>Start</span>
                        </Button>
                      </div>
                    ))
                ) : (
                  <div className="bg-muted/30 p-3 rounded-md text-center">
                    <p className="text-muted-foreground">No pending tasks available</p>
                  </div>
                )}
              </div>
              
              {myTasks.filter(task => task.status === "pending").length > 3 && (
                <div className="text-center mt-2">
                  <Button variant="ghost" size="sm">
                    <span>View All Tasks</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </DashboardCard>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Tabs defaultValue="pending" className="flex flex-col h-full">
          <TabsList className="mb-4 w-full grid grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <Card className="flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <ListChecks className="h-5 w-5 mr-2" />
                My Tasks
              </CardTitle>
              <CardDescription>
                {myTasks.length} total tasks assigned to you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <TabsContent value="pending" className="m-0">
                {myTasks.filter(task => task.status === "pending").length > 0 ? (
                  myTasks
                    .filter(task => task.status === "pending")
                    .map(task => (
                      <div key={task.task_id} className="border-b pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <UserIcon className="h-3 w-3 mr-1" />
                              <span>{task.client_name}</span>
                              <span className="mx-2">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{task.estimated_time} hrs</span>
                              {task.priority && (
                                <>
                                  <span className="mx-2">•</span>
                                  <Badge variant={
                                    task.priority === "high" ? "destructive" :
                                    task.priority === "medium" ? "warning" : "secondary"
                                  } size="sm">
                                    {task.priority}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                          <Button size="sm" onClick={() => handleStartTask(task.task_id)}>
                            <PlayCircle className="h-4 w-4 mr-1" />
                            <span>Start</span>
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-10 w-10 mx-auto mb-3" />
                    <p>No pending tasks available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="in-progress" className="m-0">
                {myTasks.filter(task => task.status === "in_progress").length > 0 ? (
                  myTasks
                    .filter(task => task.status === "in_progress")
                    .map(task => (
                      <div key={task.task_id} className="border-b pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <UserIcon className="h-3 w-3 mr-1" />
                              <span>{task.client_name}</span>
                              <span className="mx-2">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{task.estimated_time} hrs</span>
                              <span className="mx-2">•</span>
                              <Badge variant="warning" size="sm">In Progress</Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" onClick={() => handleStopTask(task.task_id)}>
                              <StopCircle className="h-4 w-4 mr-1" />
                              <span>Stop</span>
                            </Button>
                            <Button size="sm" onClick={() => handleCompleteTask(task.task_id)}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span>Complete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-10 w-10 mx-auto mb-3" />
                    <p>No tasks in progress</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="m-0">
                {myTasks.filter(task => task.status === "completed").length > 0 ? (
                  myTasks
                    .filter(task => task.status === "completed")
                    .map(task => (
                      <div key={task.task_id} className="border-b pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <UserIcon className="h-3 w-3 mr-1" />
                              <span>{task.client_name}</span>
                              <span className="mx-2">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{task.estimated_time} hrs</span>
                              <span className="mx-2">•</span>
                              <Badge variant="success" size="sm">Completed</Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BadgeCheck className="h-10 w-10 mx-auto mb-3" />
                    <p>No completed tasks yet</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
        
        {currentUser && (
          <EmployeePerformanceInsights
            employeeId={currentUser.user_id}
            employeeName={currentUser.name}
            attendanceData={[]}
            taskData={myTasks}
          />
        )}
      </div>
      
      <DashboardCard
        title="Communications"
        icon={<MessageSquare className="h-5 w-5" />}
        badgeText="Recent"
        badgeVariant="outline"
      >
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="internal">Internal</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>
          
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mx-auto mb-3" />
            <p>No recent communications</p>
            <p className="text-sm mt-1">Messages from clients and team members will appear here</p>
          </div>
        </Tabs>
      </DashboardCard>
    </div>
  );
};

export default EmployeeDashboard;
