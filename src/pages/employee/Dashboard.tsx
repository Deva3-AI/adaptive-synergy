
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart3, BarChart4, Clock, Lightbulb, AlertCircle, CheckCircle } from "lucide-react";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Separator } from "@/components/ui/separator";
import { userService, taskService, aiService } from '@/services/api';
import { toast } from 'sonner';

const EmployeeDashboard = () => {
  // Fetch user profile 
  const { data: userProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => {
      const currentUser = userService.getCurrentUser();
      return userService.getUserProfile(currentUser?.id);
    },
  });
  
  // Fetch user tasks
  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ['userTasks'],
    queryFn: () => {
      const currentUser = userService.getCurrentUser();
      return taskService.getTasksByEmployee(currentUser?.id);
    },
  });
  
  // Fetch productivity insights
  const { data: productivityInsights, isLoading: isInsightsLoading } = useQuery({
    queryKey: ['productivityInsights'],
    queryFn: () => {
      const currentUser = userService.getCurrentUser();
      return aiService.getProductivityInsights(currentUser?.id);
    },
  });
  
  // Fetch AI task suggestions
  const { data: suggestedTasks = [], isLoading: isSuggestionsLoading } = useQuery({
    queryKey: ['suggestedTasks'],
    queryFn: () => {
      const currentUser = userService.getCurrentUser();
      return aiService.getSuggestedTasks(currentUser?.id);
    },
  });
  
  const handleStartWork = () => {
    toast.success('Work session started');
  };
  
  const handleStopWork = () => {
    toast.success('Work session ended');
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          {isProfileLoading ? (
            <Skeleton className="h-16 w-16 rounded-full" />
          ) : (
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile?.avatar} alt={userProfile?.name} />
              <AvatarFallback>{userProfile?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <div>
            {isProfileLoading ? (
              <Skeleton className="h-8 w-48 mb-1" />
            ) : (
              <h1 className="text-2xl font-bold">Welcome, {userProfile?.name}</h1>
            )}
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleStartWork}>
            <Clock className="mr-2 h-4 w-4" />
            Start Work
          </Button>
          <Button variant="outline" onClick={handleStopWork}>
            <Clock className="mr-2 h-4 w-4" />
            Stop Work
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center pt-2">
            {isInsightsLoading ? (
              <Skeleton className="h-24 w-24 rounded-full" />
            ) : (
              <ProgressCircle 
                value={productivityInsights?.productivityScore || 0} 
                size="large"
                strokeWidth={8}
              />
            )}
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Completed: {tasks?.filter(t => t.status === 'completed').length || 0}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm">In Progress: {tasks?.filter(t => t.status === 'in_progress').length || 0}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                <span className="text-sm">Pending: {tasks?.filter(t => t.status === 'pending').length || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Time Tracked Today</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {isProfileLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div>
                <div className="text-3xl font-bold">{userProfile?.hoursToday || '0.0'} hrs</div>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  <span>vs. {userProfile?.averageHours || '0.0'} hrs daily average</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {isInsightsLoading ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="space-y-2">
                {productivityInsights?.insights?.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start">
                    <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Current Tasks</TabsTrigger>
          <TabsTrigger value="suggested">Suggested Tasks</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Tasks</CardTitle>
              <CardDescription>Tasks assigned to you or created by you</CardDescription>
            </CardHeader>
            <CardContent>
              {isTasksLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">You don't have any active tasks</p>
                  <Button className="mt-4">Create New Task</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {task.status === 'completed' && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </span>
                          )}
                          {task.status === 'in_progress' && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              In Progress
                            </span>
                          )}
                          {task.status === 'pending' && (
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-sm mt-2">{task.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>{task.client?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{task.client?.name}</span>
                        </div>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                  
                  {tasks.length > 5 && (
                    <div className="text-center mt-4">
                      <Button variant="outline">View All Tasks</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suggested" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Tasks</CardTitle>
              <CardDescription>AI-generated task suggestions based on your work patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {isSuggestionsLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : suggestedTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No task suggestions available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestedTasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <Lightbulb className="h-4 w-4 text-amber-500 mr-2" />
                            <h3 className="font-medium">{task.title}</h3>
                          </div>
                          <p className="text-sm mt-1">{task.description}</p>
                          <div className="flex items-center mt-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">
                              Estimated: {task.estimated_hours} hours
                            </span>
                          </div>
                        </div>
                        <div>
                          <Button size="sm">Add Task</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Your productivity patterns and improvement areas</CardDescription>
            </CardHeader>
            <ScrollArea className="h-[400px]">
              <CardContent>
                {isInsightsLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Productivity by Time of Day</h3>
                      <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">Productivity chart will appear here</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-3">Strengths</h3>
                      <div className="space-y-2">
                        {productivityInsights?.strengths?.map((strength: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm">{strength}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-medium mb-3">Improvement Areas</h3>
                      <div className="space-y-2">
                        {productivityInsights?.improvementAreas?.map((area: string, index: number) => (
                          <div key={index} className="flex items-start">
                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm">{area}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
