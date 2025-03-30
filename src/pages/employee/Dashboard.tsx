
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart4, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  Lightbulb,
  MoreHorizontal, 
  PlusCircle, 
  Timer, 
  TrendingUp, 
  User 
} from "lucide-react";
import { userService, taskService, aiService } from '@/services/api';
import { format } from 'date-fns';

const EmployeeDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Fetch user profile
  const { data: userProfile, isLoading: loadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => {
      const currentUser = userService.getCurrentUser();
      return currentUser ? userService.getUserProfile(currentUser.id) : Promise.resolve(null);
    }
  });
  
  // Fetch user tasks
  const { data: userTasks, isLoading: loadingTasks } = useQuery({
    queryKey: ['userTasks'],
    queryFn: () => {
      const currentUser = userService.getCurrentUser();
      return currentUser ? taskService.getTasksByEmployee(currentUser.id) : Promise.resolve(null);
    }
  });
  
  // Fetch productivity insights
  const { data: productivityInsights, isLoading: loadingInsights } = useQuery({
    queryKey: ['productivityInsights'],
    queryFn: () => {
      const currentUser = userService.getCurrentUser();
      return currentUser ? aiService.getProductivityInsights(currentUser.id) : Promise.resolve(null);
    },
    enabled: selectedTab === 'productivity'
  });
  
  // Fetch AI suggested tasks
  const { data: suggestedTasks, isLoading: loadingSuggestions } = useQuery({
    queryKey: ['suggestedTasks'],
    queryFn: () => {
      const currentUser = userService.getCurrentUser();
      return currentUser ? aiService.getSuggestedTasks(currentUser.id) : Promise.resolve(null);
    },
    enabled: selectedTab === 'suggestions'
  });
  
  // Toggle work status (start/stop)
  const [isWorking, setIsWorking] = useState(false);
  const [workStartTime, setWorkStartTime] = useState<Date | null>(null);
  
  const handleToggleWork = () => {
    if (!isWorking) {
      setIsWorking(true);
      setWorkStartTime(new Date());
      // Would call a service to log start time
    } else {
      setIsWorking(false);
      // Would call a service to log end time
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {loadingProfile ? (
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
            </div>
          ) : userProfile ? (
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">{userProfile.name}</p>
                <p className="text-xs text-muted-foreground">{userProfile.role}</p>
              </div>
            </div>
          ) : null}
          
          <Button 
            variant={isWorking ? "destructive" : "default"} 
            onClick={handleToggleWork}
          >
            {isWorking ? (
              <>
                <Timer className="mr-2 h-4 w-4" /> Stop Work
              </>
            ) : (
              <>
                <Timer className="mr-2 h-4 w-4" /> Start Work
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isWorking && workStartTime && (
        <Card className="bg-muted">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">Working since {format(workStartTime, 'h:mm a')}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Time tracked today: {workStartTime ? '0h 30m' : '0h 0m'}
            </p>
          </CardContent>
        </Card>
      )}
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTasks ? (
                  <Skeleton className="h-4 w-full" />
                ) : (
                  <div>
                    <div className="text-2xl font-bold">
                      {userTasks?.active?.length || 0} Active Tasks
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <BarChart4 className="mr-1 h-3 w-3" />
                      {userTasks?.completed?.length || 0} completed this week
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingInsights ? (
                  <Skeleton className="h-4 w-full" />
                ) : (
                  <div>
                    <div className="text-2xl font-bold">
                      85% <span className="text-xs text-green-500 font-normal">↑ 4%</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Better than last week
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingTasks ? (
                  <Skeleton className="h-4 w-full" />
                ) : (
                  <div>
                    <div className="text-2xl font-bold">
                      3 <span className="text-xs text-amber-500 font-normal">Due this week</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="mr-1 h-3 w-3" />
                      Next: Website Design (Tomorrow)
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Tasks</CardTitle>
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </div>
              <CardDescription>Your current active tasks and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingTasks ? (
                <Skeleton className="h-[200px] w-full" />
              ) : userTasks?.active && userTasks.active.length > 0 ? (
                <div className="space-y-5">
                  {userTasks.active.map((task: any) => (
                    <div key={task.id} className="border-b pb-5 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-1">
                        <h3 className="font-medium">{task.title}</h3>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Client: {task.client}</span>
                          <span className={`${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-amber-500' : 'text-green-500'}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                        </div>
                        <Progress value={45} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            Due: {task.due_date ? format(new Date(task.due_date), 'MMM d, yyyy') : 'Not set'}
                          </span>
                          <span>45% complete</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No active tasks found.</p>
                  <p className="text-sm">Start working on a new task by clicking "Add Task" above.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Tasks scheduled to start soon</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTasks ? (
                  <Skeleton className="h-32 w-full" />
                ) : userTasks?.upcoming && userTasks.upcoming.length > 0 ? (
                  <ul className="space-y-2">
                    {userTasks.upcoming.map((task: any) => (
                      <li key={task.id} className="flex justify-between p-2 border rounded-md">
                        <div className="flex flex-col">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-xs text-muted-foreground">{task.client}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {task.due_date ? format(new Date(task.due_date), 'MMM d') : 'No date'}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-5">No upcoming tasks</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recently Completed</CardTitle>
                <CardDescription>Tasks you've finished</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTasks ? (
                  <Skeleton className="h-32 w-full" />
                ) : userTasks?.completed && userTasks.completed.length > 0 ? (
                  <ul className="space-y-2">
                    {userTasks.completed.map((task: any) => (
                      <li key={task.id} className="flex justify-between p-2 border rounded-md">
                        <div className="flex flex-col">
                          <span className="font-medium">{task.title}</span>
                          <span className="text-xs text-muted-foreground">{task.client}</span>
                        </div>
                        <div className="flex items-center text-green-500 text-sm">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Done
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground text-center py-5">No completed tasks yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="productivity" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Insights</CardTitle>
              <CardDescription>AI-powered analysis of your work patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingInsights ? (
                <Skeleton className="h-[300px] w-full" />
              ) : productivityInsights ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-2">Productivity Score</h3>
                      <div className="text-3xl font-bold mb-1">{productivityInsights.productivity_score}%</div>
                      <Progress value={productivityInsights.productivity_score} className="h-2 mb-2" />
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-2">Task Completion</h3>
                      <div className="text-3xl font-bold mb-1">
                        {productivityInsights.time_management.average_task_completion_time}
                      </div>
                      <p className="text-xs text-muted-foreground">Average completion time</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="text-sm font-medium mb-2">Focus Areas</h3>
                      <div className="space-y-1">
                        {productivityInsights.focus_areas.map((area: any) => (
                          <div key={area.area} className="flex justify-between items-center">
                            <span className="text-sm">{area.area}</span>
                            <span className="text-sm font-medium">{area.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Improvement Highlights</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {productivityInsights.improvements.map((improvement: string, index: number) => (
                        <div key={index} className="flex items-start border rounded-md p-3">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                          <span className="text-sm">{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">AI Recommendations</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      {productivityInsights.suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="flex items-start border rounded-md p-3">
                          <Lightbulb className="h-4 w-4 mr-2 text-amber-500 mt-0.5" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Productivity data not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suggestions" className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>AI Suggested Tasks</CardTitle>
              <CardDescription>Smart recommendations based on your current workload and priorities</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSuggestions ? (
                <Skeleton className="h-[300px] w-full" />
              ) : suggestedTasks?.tasks && suggestedTasks.tasks.length > 0 ? (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {suggestedTasks.tasks.map((task: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium">{task.title}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          Estimated: {task.estimated_time} hours
                          
                          <span className="mx-2">•</span>
                          
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          Due: {task.deadline}
                        </div>
                        
                        <p className="text-sm mb-3">{task.benefit}</p>
                        
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="mr-2">Remind Later</Button>
                          <Button size="sm">Add to Tasks</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-muted-foreground">No task suggestions available.</p>
                  <p className="text-sm text-muted-foreground">
                    Work on more tasks to help the AI learn your preferences.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeDashboard;
