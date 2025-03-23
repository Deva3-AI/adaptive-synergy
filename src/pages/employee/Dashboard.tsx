
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  PanelLeft, 
  BarChart3, 
  Calendar, 
  BellRing, 
  Briefcase,
  Play,
  Pause
} from "lucide-react";
import { toast } from "sonner";

import AttendanceTracker from '@/components/employee/AttendanceTracker';
import EmployeeWorkTracker from '@/components/dashboard/EmployeeWorkTracker';
import TaskSuggestionCard from '@/components/ai/TaskSuggestionCard';
import ClientRequirementsPanel from '@/components/employee/ClientRequirementsPanel';
import VirtualManagerInsights from '@/components/employee/VirtualManagerInsights';
import { employeeService, taskService } from '@/services/api';
import { useAuth } from '@/hooks/use-auth';
import { aiUtils } from '@/utils/aiUtils';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [clientRequirementText, setClientRequirementText] = useState('');
  const [isAnalyzingRequirements, setIsAnalyzingRequirements] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [taskSuggestions, setTaskSuggestions] = useState<any[]>([]);

  // Get today's attendance
  const { data: attendance, refetch: refetchAttendance } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: employeeService.getTodayAttendance,
  });

  // Get pending tasks
  const { data: pendingTasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', 'pending'],
    queryFn: () => taskService.getTasks('pending'),
  });

  // Get in-progress tasks
  const { data: inProgressTasks = [], isLoading: isLoadingInProgressTasks } = useQuery({
    queryKey: ['tasks', 'in_progress'],
    queryFn: () => taskService.getTasks('in_progress'),
  });

  // Get active task
  const { data: activeTask, isLoading: isLoadingActiveTask, refetch: refetchActiveTask } = useQuery({
    queryKey: ['activeTask'],
    queryFn: taskService.getActiveTask,
  });

  // Get clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/clients');
        return await response.json();
      } catch (error) {
        console.error('Error fetching clients:', error);
        return [];
      }
    }
  });

  const handleAnalyzeRequirements = async () => {
    if (!clientRequirementText.trim() || !selectedClientId) {
      toast.error('Please select a client and enter requirements');
      return;
    }

    setIsAnalyzingRequirements(true);
    try {
      const analysis = await aiUtils.analyzeClientRequirements(selectedClientId, clientRequirementText);
      setTaskSuggestions(analysis.suggestedTasks || []);
      toast.success('Requirements analyzed successfully');
    } catch (error) {
      console.error('Error analyzing requirements:', error);
      toast.error('Failed to analyze requirements');
    } finally {
      setIsAnalyzingRequirements(false);
    }
  };

  const handleTaskCreated = () => {
    toast.success('Task created successfully');
    // Refresh tasks list
    const queryClient = require('@tanstack/react-query').useQueryClient();
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  const handleStartTask = async (taskId: number) => {
    try {
      await taskService.startTaskWork(taskId);
      toast.success('Task work started');
      refetchActiveTask();
    } catch (error) {
      console.error('Error starting task work:', error);
      toast.error('Failed to start task work');
    }
  };

  const handleStopTask = async (taskId: number) => {
    try {
      await taskService.stopTaskWork(taskId);
      toast.success('Task work stopped');
      refetchActiveTask();
    } catch (error) {
      console.error('Error stopping task work:', error);
      toast.error('Failed to stop task work');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'Employee'}! Here's your personalized workspace.
          </p>
        </div>
        
        <AttendanceTracker 
          attendance={attendance} 
          onAttendanceUpdate={refetchAttendance} 
        />
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <Briefcase className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="client-insights">
            <PanelLeft className="h-4 w-4 mr-2" />
            Client Insights
          </TabsTrigger>
          <TabsTrigger value="work-tracking">
            <Clock className="h-4 w-4 mr-2" />
            Work Tracking
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Active Task Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Current Task</CardTitle>
                <CardDescription>
                  {activeTask ? 'You are currently working on:' : 'No active task'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingActiveTask ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-10 bg-muted rounded w-1/4 mt-2"></div>
                  </div>
                ) : activeTask ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{activeTask.title}</h3>
                      <p className="text-sm text-muted-foreground">{activeTask.description}</p>
                      {activeTask.client_name && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-muted-foreground">Client: {activeTask.client_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleStopTask(activeTask.task_id)}
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Working
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/employee/tasks/${activeTask.task_id}`}
                      >
                        View Details
                        <ArrowUpRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">You're not working on any task currently.</p>
                    {inProgressTasks.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Resume work on:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {inProgressTasks.slice(0, 3).map(task => (
                            <Button
                              key={task.task_id}
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => handleStartTask(task.task_id)}
                            >
                              <Play className="h-3 w-3 mr-1" />
                              {task.title}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Work Summary Card */}
            <EmployeeWorkTracker />
          </div>

          {/* Tasks and Virtual Manager */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pending Tasks */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Tasks</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <a href="/employee/tasks">View All</a>
                  </Button>
                </div>
                <CardDescription>Tasks awaiting your attention</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTasks ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse flex gap-2 py-2 border-b last:border-0">
                        <div className="h-4 w-4 bg-muted rounded-full mt-1"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2 mt-1"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : pendingTasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <CheckCircle2 className="h-10 w-10 mx-auto mb-2 text-green-500" />
                    <p>No pending tasks</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {pendingTasks.slice(0, 5).map(task => (
                      <div key={task.task_id} className="flex items-start gap-2 py-2 border-b last:border-0">
                        <div className="rounded-full h-2 w-2 bg-yellow-500 mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Est: {task.estimated_time || '?'} hrs
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2"
                          onClick={() => handleStartTask(task.task_id)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* In Progress Tasks */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>In Progress</CardTitle>
                <CardDescription>Tasks you're currently working on</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInProgressTasks ? (
                  <div className="space-y-2">
                    {[1, 2].map(i => (
                      <div key={i} className="animate-pulse flex gap-2 py-2 border-b last:border-0">
                        <div className="h-4 w-4 bg-muted rounded-full mt-1"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2 mt-1"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : inProgressTasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No tasks in progress</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {inProgressTasks.slice(0, 4).map(task => (
                      <div key={task.task_id} className="flex items-start gap-2 py-2 border-b last:border-0">
                        <div className="rounded-full h-2 w-2 bg-blue-500 mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {activeTask?.task_id === task.task_id ? (
                              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                                Active
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Paused</span>
                            )}
                          </div>
                        </div>
                        {activeTask?.task_id === task.task_id ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => handleStopTask(task.task_id)}
                          >
                            <Pause className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2"
                            onClick={() => handleStartTask(task.task_id)}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Virtual Manager Insights */}
            <VirtualManagerInsights 
              clientId={activeTask?.client_id} 
              taskId={activeTask?.task_id} 
            />
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          {/* Tasks content here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>Manage and track your assigned tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Pending Tasks ({pendingTasks.length})</h3>
                        {pendingTasks.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No pending tasks</p>
                        ) : (
                          <div className="space-y-2">
                            {pendingTasks.slice(0, 4).map(task => (
                              <div key={task.task_id} className="p-3 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">{task.title}</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0"
                                    onClick={() => handleStartTask(task.task_id)}
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {task.description || 'No description'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    Est: {task.estimated_time || '?'} hrs
                                  </span>
                                </div>
                              </div>
                            ))}
                            {pendingTasks.length > 4 && (
                              <Button variant="link" size="sm" asChild className="mt-1">
                                <a href="/employee/tasks">View all {pendingTasks.length} pending tasks</a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">In Progress Tasks ({inProgressTasks.length})</h3>
                        {inProgressTasks.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No tasks in progress</p>
                        ) : (
                          <div className="space-y-2">
                            {inProgressTasks.slice(0, 4).map(task => (
                              <div key={task.task_id} className="p-3 border rounded-md">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">{task.title}</h4>
                                  {activeTask?.task_id === task.task_id ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={() => handleStopTask(task.task_id)}
                                    >
                                      <Pause className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0"
                                      onClick={() => handleStartTask(task.task_id)}
                                    >
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {task.description || 'No description'}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {activeTask?.task_id === task.task_id ? (
                                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Paused</span>
                                  )}
                                </div>
                              </div>
                            ))}
                            {inProgressTasks.length > 4 && (
                              <Button variant="link" size="sm" asChild className="mt-1">
                                <a href="/employee/tasks">View all {inProgressTasks.length} in-progress tasks</a>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-center">
                      <Button asChild>
                        <a href="/employee/tasks">
                          View All Tasks
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <VirtualManagerInsights 
                clientId={activeTask?.client_id} 
                taskId={activeTask?.task_id} 
              />
            </div>
          </div>
        </TabsContent>

        {/* Client Insights Tab */}
        <TabsContent value="client-insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Client Requirements Analysis</CardTitle>
                  <CardDescription>
                    Analyze client requirements to generate task suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Select Client</label>
                      <select 
                        className="w-full px-3 py-2 border rounded-md mt-1"
                        value={selectedClientId || ''}
                        onChange={(e) => setSelectedClientId(Number(e.target.value) || null)}
                      >
                        <option value="">-- Select a client --</option>
                        {clients.map((client: any) => (
                          <option key={client.client_id} value={client.client_id}>
                            {client.client_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Client Requirements</label>
                      <textarea
                        className="w-full px-3 py-2 border rounded-md mt-1 min-h-[100px]"
                        placeholder="Paste client requirements or brief here..."
                        value={clientRequirementText}
                        onChange={(e) => setClientRequirementText(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleAnalyzeRequirements}
                      disabled={isAnalyzingRequirements || !selectedClientId || !clientRequirementText.trim()}
                    >
                      {isAnalyzingRequirements ? 'Analyzing...' : 'Analyze Requirements'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4">
                <TaskSuggestionCard
                  clientId={selectedClientId || undefined}
                  clientName={clients.find((c: any) => c.client_id === selectedClientId)?.client_name}
                  suggestions={taskSuggestions}
                  onTaskCreated={handleTaskCreated}
                  isLoading={isAnalyzingRequirements}
                />
              </div>
            </div>
            <div>
              <ClientRequirementsPanel clientId={selectedClientId || undefined} />
            </div>
          </div>
        </TabsContent>

        {/* Work Tracking Tab */}
        <TabsContent value="work-tracking">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Work Session</CardTitle>
                <CardDescription>
                  Track your current work session and task progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">Session Status</p>
                      {attendance ? (
                        <p className="text-lg font-bold text-green-600">Active</p>
                      ) : (
                        <p className="text-lg font-bold text-red-600">Inactive</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Current Task</p>
                      {activeTask ? (
                        <p className="text-lg font-bold">{activeTask.title}</p>
                      ) : (
                        <p className="text-muted-foreground">No active task</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Session Started</p>
                        <p className="font-medium">
                          {attendance?.login_time 
                            ? new Date(attendance.login_time).toLocaleTimeString() 
                            : 'Not started'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Duration</p>
                        <p className="font-medium">
                          {attendance?.login_time
                            ? (() => {
                                const start = new Date(attendance.login_time);
                                const now = new Date();
                                const diffMs = now.getTime() - start.getTime();
                                const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                return `${diffHrs}h ${diffMins}m`;
                              })()
                            : '0h 0m'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                      {attendance ? (
                        <Button 
                          variant="destructive" 
                          onClick={() => employeeService.stopWork(attendance.attendance_id)
                            .then(() => {
                              refetchAttendance();
                              toast.success('Work session ended');
                            })
                            .catch(err => {
                              console.error('Error stopping work:', err);
                              toast.error('Failed to end work session');
                            })
                          }
                        >
                          End Work Session
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          onClick={() => employeeService.startWork()
                            .then(() => {
                              refetchAttendance();
                              toast.success('Work session started');
                            })
                            .catch(err => {
                              console.error('Error starting work:', err);
                              toast.error('Failed to start work session');
                            })
                          }
                        >
                          Start Work Session
                        </Button>
                      )}
                      
                      {activeTask ? (
                        <Button 
                          variant="outline" 
                          onClick={() => handleStopTask(activeTask.task_id)}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Stop Current Task
                        </Button>
                      ) : (
                        pendingTasks.length > 0 && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleStartTask(pendingTasks[0].task_id)}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Next Task
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task Time Analysis</CardTitle>
                <CardDescription>
                  Historical data on your task performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">Average Time per Task</div>
                    <div className="text-2xl font-bold">4.3 hours</div>
                    <div className="text-xs text-muted-foreground">Based on last 30 completed tasks</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="border rounded-md p-3">
                      <div className="text-sm font-medium">Accuracy Rate</div>
                      <div className="flex items-end gap-1 mt-1">
                        <span className="text-2xl font-bold">94%</span>
                        <span className="text-xs text-green-600 mb-1">+2.5%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">vs estimated time</div>
                    </div>
                    <div className="border rounded-md p-3">
                      <div className="text-sm font-medium">Efficiency Score</div>
                      <div className="flex items-end gap-1 mt-1">
                        <span className="text-2xl font-bold">8.7</span>
                        <span className="text-xs text-green-600 mb-1">+0.3</span>
                      </div>
                      <div className="text-xs text-muted-foreground">out of 10</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-2">
                    <h4 className="text-sm font-medium mb-2">Top Performing Task Types</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Design Tasks</span>
                        <span className="text-sm font-medium">105% efficiency</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Content Creation</span>
                        <span className="text-sm font-medium">98% efficiency</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Development</span>
                        <span className="text-sm font-medium">92% efficiency</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
