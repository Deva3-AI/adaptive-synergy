
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService, aiService, clientService } from "@/services/api";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ClockIcon, 
  CheckIcon, 
  GanttChartIcon, 
  CircleIcon, 
  UsersIcon, 
  FileIcon, 
  AlertCircleIcon, 
  CheckCircleIcon, 
  BellIcon,
  PencilIcon, 
  PlayIcon, 
  PauseIcon, 
  TimerIcon, 
  UploadCloudIcon, 
  ChevronRightIcon,
  LinkIcon,
  ClipboardIcon,
  SendIcon,
  DatabaseIcon,
  LightbulbIcon,
  CalendarIcon
} from "lucide-react";
import { toast } from "sonner";
import { format, formatDistanceToNow, formatDuration, differenceInSeconds, intervalToDuration } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ClientRequirementsPanel from "@/components/employee/ClientRequirementsPanel";
import VirtualManagerInsights from "@/components/employee/VirtualManagerInsights";
import TaskAttachmentsPanel from "@/components/employee/TaskAttachmentsPanel";

interface DetailedTask extends taskService.Task {
  id: number;
  clientLogo: string;
  dueDate: Date;
  startDate: Date;
  progress: number;
  estimatedHours: number;
  hoursLogged: number;
  assignee: {
    id: number;
    name: string;
    avatar: string;
  };
  timeline: Array<{
    id: number;
    date: Date;
    title: string;
    description: string;
  }>;
  attachments: Array<{
    id: number;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    size: string;
  }>;
  recentActivity: Array<{
    id: number;
    type: string;
    user: {
      name: string;
      avatar: string;
    };
    time: Date;
    message: string;
  }>;
  drive_link?: string;
  progress_description?: string;
}

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);
  const [trackingElapsed, setTrackingElapsed] = useState<number>(0);
  const [updateNote, setUpdateNote] = useState("");
  const [progressDescription, setProgressDescription] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [task, setTask] = useState<DetailedTask | null>(null);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [screenshotDescription, setScreenshotDescription] = useState("");
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  
  // Task details query
  const { data: taskData, isLoading: isLoadingTask } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskService.getTaskDetails(Number(taskId)),
    enabled: !!taskId,
  });
  
  // AI analysis query
  const { data: taskAnalysis, isLoading: isLoadingAnalysis } = useQuery({
    queryKey: ["task-analysis", taskId],
    queryFn: () => aiService.analyzeTaskPerformance(Number(taskId)),
    enabled: !!taskId,
  });
  
  // Client details query for task with client
  const { data: clientDetails, isLoading: isLoadingClient } = useQuery({
    queryKey: ["client", taskData?.client_id],
    queryFn: () => clientService.getClientById(taskData?.client_id || 0),
    enabled: !!taskData?.client_id,
  });
  
  // Get task time entries
  const { data: timeEntries, isLoading: isLoadingTimeEntries } = useQuery({
    queryKey: ["task-time-entries", taskId],
    queryFn: () => taskService.getTaskTimeEntries(Number(taskId)),
    enabled: !!taskId,
  });
  
  // Get active task to check if current task is active
  const { data: activeTask, isLoading: isLoadingActiveTask } = useQuery({
    queryKey: ["active-task"],
    queryFn: () => taskService.getActiveTask(),
    enabled: !!taskId,
    refetchInterval: isTracking ? 30000 : false,
  });
  
  // Get task attachments
  const { data: attachments, isLoading: isLoadingAttachments } = useQuery({
    queryKey: ["task-attachments", taskId],
    queryFn: () => taskService.getTaskAttachments(Number(taskId)),
    enabled: !!taskId,
  });
  
  // Get AI insights
  const { data: insights, isLoading: isLoadingInsights } = useQuery({
    queryKey: ["task-insights", taskId],
    queryFn: () => aiService.getTaskInsights(Number(taskId)),
    enabled: !!taskId,
  });
  
  // Start task work mutation
  const startTaskWorkMutation = useMutation({
    mutationFn: (taskId: number) => taskService.startTaskWork(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-task"] });
      setIsTracking(true);
      setTrackingStartTime(new Date());
      toast.success("Time tracking started");
    },
    onError: (error) => {
      console.error("Error starting task work:", error);
      toast.error("Failed to start time tracking");
    },
  });
  
  // Stop task work mutation
  const stopTaskWorkMutation = useMutation({
    mutationFn: (taskId: number) => taskService.stopTaskWork(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-task"] });
      queryClient.invalidateQueries({ queryKey: ["task-time-entries", taskId] });
      setIsTracking(false);
      setTrackingStartTime(null);
      toast.success("Time tracking stopped");
    },
    onError: (error) => {
      console.error("Error stopping task work:", error);
      toast.error("Failed to stop time tracking");
    },
  });
  
  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: string }) => 
      taskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task status updated");
    },
    onError: (error) => {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status");
    },
  });
  
  // Upload screenshot mutation
  const uploadScreenshotMutation = useMutation({
    mutationFn: ({ taskId, file, description }: { taskId: number; file: File; description?: string }) => 
      taskService.uploadTaskScreenshot(taskId, file, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-attachments", taskId] });
      setSelectedImage(null);
      setScreenshotDescription("");
      toast.success("Screenshot uploaded successfully");
    },
    onError: (error) => {
      console.error("Error uploading screenshot:", error);
      toast.error("Failed to upload screenshot");
    },
  });
  
  // Update task progress mutation
  const updateTaskProgressMutation = useMutation({
    mutationFn: ({ taskId, progressData }: { taskId: number; progressData: { progress_description: string; drive_link?: string } }) => 
      taskService.updateTaskProgress(taskId, progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success("Progress update posted");
      setUpdateNote("");
    },
    onError: (error) => {
      console.error("Error updating task progress:", error);
      toast.error("Failed to update progress");
    },
  });
  
  // Prepare mockup data based on the API response
  useEffect(() => {
    if (taskData) {
      const mockTask: DetailedTask = {
        id: taskData.task_id,
        task_id: taskData.task_id,
        title: taskData.title,
        description: taskData.description || "",
        client: taskData.client_name || "Unknown Client",
        clientLogo: "https://ui-avatars.com/api/?name=" + (taskData.client_name || "UC"),
        dueDate: taskData.end_time ? new Date(taskData.end_time) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startDate: taskData.start_time ? new Date(taskData.start_time) : new Date(),
        priority: taskData.priority || "medium",
        status: taskData.status,
        progress: 30,
        estimatedHours: taskData.estimated_time || 0,
        hoursLogged: taskData.actual_time || 0,
        assignee: {
          id: taskData.assigned_to || 0,
          name: taskData.assignee_name || "Unassigned",
          avatar: "https://ui-avatars.com/api/?name=" + (taskData.assignee_name || "UA"),
        },
        timeline: [
          {
            id: 1,
            date: new Date(taskData.created_at || new Date()),
            title: "Task Created",
            description: "Task was created and assigned",
          },
        ],
        attachments: [],
        recentActivity: [
          {
            id: 1,
            type: "status",
            user: {
              name: "System",
              avatar: "https://ui-avatars.com/api/?name=SYS",
            },
            time: new Date(taskData.created_at || new Date()),
            message: "Task created with status: " + taskData.status,
          },
        ],
        progress_description: taskData.progress_description || "",
        drive_link: taskData.drive_link || ""
      };
      
      setTask(mockTask);
      setProgressDescription(taskData.progress_description || "");
      setDriveLink(taskData.drive_link || "");
    }
  }, [taskData]);
  
  // Set up tracking timer when tracking is active
  useEffect(() => {
    let intervalId: number;
    
    if (isTracking && trackingStartTime) {
      intervalId = window.setInterval(() => {
        const elapsed = differenceInSeconds(new Date(), trackingStartTime);
        setTrackingElapsed(elapsed);
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isTracking, trackingStartTime]);
  
  // Check if the current task is active
  useEffect(() => {
    if (activeTask && activeTask.task_id === Number(taskId)) {
      setIsTracking(true);
      if (activeTask.start_time) {
        setTrackingStartTime(new Date(activeTask.start_time));
      }
    } else {
      setIsTracking(false);
      setTrackingStartTime(null);
    }
  }, [activeTask, taskId]);
  
  const handleSubmitProgress = () => {
    if (!progressDescription.trim()) {
      toast.error("Please enter a progress update");
      return;
    }
    
    updateTaskProgressMutation.mutate({
      taskId: Number(taskId),
      progressData: {
        progress_description: progressDescription,
        drive_link: driveLink || undefined
      }
    });
  };
  
  const handleStartTracking = () => {
    startTaskWorkMutation.mutate(Number(taskId));
  };
  
  const handleStopTracking = () => {
    stopTaskWorkMutation.mutate(Number(taskId));
  };
  
  const handleUpdateStatus = (status: string) => {
    updateTaskStatusMutation.mutate({ taskId: Number(taskId), status });
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };
  
  const handleUploadScreenshot = async () => {
    if (!selectedImage) {
      toast.error("Please select an image to upload");
      return;
    }
    
    setUploadingScreenshot(true);
    try {
      await uploadScreenshotMutation.mutateAsync({
        taskId: Number(taskId),
        file: selectedImage,
        description: screenshotDescription
      });
    } finally {
      setUploadingScreenshot(false);
    }
  };
  
  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatTimeEntryDuration = (entry: any) => {
    if (entry.duration) {
      const hours = Math.floor(entry.duration / 3600);
      const minutes = Math.floor((entry.duration % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    
    if (entry.start_time && entry.end_time) {
      const start = new Date(entry.start_time);
      const end = new Date(entry.end_time);
      const diffInSeconds = differenceInSeconds(end, start);
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    
    return 'In progress';
  };
  
  if (isLoadingTask) {
    return (
      <div className="container py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[400px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[300px] rounded-lg" />
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!taskData || !task) {
    return (
      <div className="container py-6">
        <div className="flex flex-col items-center justify-center h-[400px]">
          <AlertCircleIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Task Not Found</h2>
          <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist or you don't have access to it.</p>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>{task.client}</span>
            <ChevronRightIcon className="h-4 w-4" />
            <span>Task #{task.id}</span>
          </div>
          <h1 className="text-2xl font-bold">{task.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {task.status !== 'completed' && task.status !== 'cancelled' && (
            <>
              {isTracking ? (
                <Button 
                  variant="outline"
                  className="gap-2"
                  onClick={handleStopTracking}
                >
                  <PauseIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Stop Tracking</span>
                  <span className="font-mono">{formatElapsedTime(trackingElapsed)}</span>
                </Button>
              ) : (
                <Button 
                  variant="default"
                  className="gap-2"
                  onClick={handleStartTracking}
                >
                  <PlayIcon className="h-4 w-4" />
                  <span>Start Tracking</span>
                </Button>
              )}
            </>
          )}
          
          <div className="flex gap-2">
            {task.status === 'pending' && (
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => handleUpdateStatus('in_progress')}
              >
                <PlayIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Start Task</span>
              </Button>
            )}
            
            {task.status === 'in_progress' && (
              <Button 
                variant="outline"
                className="gap-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700"
                onClick={() => handleUpdateStatus('completed')}
              >
                <CheckIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Mark Complete</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 flex-wrap">
        <Badge variant={task.status === 'completed' ? 'success' : 
                        task.status === 'in_progress' ? 'default' : 
                        task.status === 'cancelled' ? 'destructive' : 
                        'outline'} 
              className="capitalize">
          {task.status === 'in_progress' ? 'In Progress' : task.status}
        </Badge>
        
        <Badge variant={task.priority === 'high' ? 'destructive' : 
                        task.priority === 'medium' ? 'warning' : 
                        'outline'} 
              className="capitalize">
          {task.priority} Priority
        </Badge>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ClockIcon className="h-4 w-4" />
          <span>Due: {format(task.dueDate, 'MMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <TimerIcon className="h-4 w-4" />
          <span>Estimated: {task.estimatedHours}h</span>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <UsersIcon className="h-4 w-4" />
          <span>Assigned to: {task.assignee.name}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeTracking">Time Tracking</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {task.description ? (
                      <p>{task.description}</p>
                    ) : (
                      <p className="text-muted-foreground italic">No description provided.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GanttChartIcon className="h-5 w-5" />
                    <span>Progress Updates</span>
                  </CardTitle>
                  <CardDescription>Share your progress with the team</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {progressDescription && (
                    <div className="p-4 border rounded-md bg-muted/20 space-y-2">
                      <h4 className="font-medium">Current Progress</h4>
                      <p className="text-sm">{progressDescription}</p>
                      
                      {driveLink && (
                        <div className="flex items-center mt-2">
                          <LinkIcon className="h-4 w-4 mr-2 text-blue-500" />
                          <a 
                            href={driveLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            {driveLink}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Textarea 
                        placeholder="Describe your progress..." 
                        className="min-h-[120px] resize-none"
                        value={progressDescription}
                        onChange={(e) => setProgressDescription(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground mb-1">Google Drive or other relevant link (optional)</div>
                      <Input 
                        placeholder="https://drive.google.com/..." 
                        value={driveLink}
                        onChange={(e) => setDriveLink(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSubmitProgress}>
                    <SendIcon className="h-4 w-4 mr-2" />
                    Post Update
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Task Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {task.recentActivity.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex-none">
                          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            {activity.type === 'status' && <CircleIcon className="h-5 w-5 text-primary" />}
                            {activity.type === 'comment' && <MessageSquareIcon className="h-5 w-5 text-primary" />}
                            {activity.type === 'attachment' && <PaperclipIcon className="h-5 w-5 text-primary" />}
                            
                            {index !== task.recentActivity.length - 1 && (
                              <div className="absolute top-10 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border" />
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-1 pb-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{activity.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(activity.time, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm">{activity.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeTracking" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Time Tracking Summary</CardTitle>
                  <CardDescription>Track hours spent on this task</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="text-sm text-muted-foreground mb-1">Estimated Hours</div>
                      <div className="text-2xl font-bold flex items-center">
                        <ClockIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                        {task.estimatedHours}h
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="text-sm text-muted-foreground mb-1">Logged Hours</div>
                      <div className="text-2xl font-bold flex items-center">
                        <TimerIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                        {task.hoursLogged}h
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="text-sm text-muted-foreground mb-1">Remaining</div>
                      <div className={`text-2xl font-bold flex items-center ${
                        task.hoursLogged > task.estimatedHours ? 'text-red-500' : ''
                      }`}>
                        <AlertCircleIcon className={`h-5 w-5 mr-2 ${
                          task.hoursLogged > task.estimatedHours ? 'text-red-500' : 'text-muted-foreground'
                        }`} />
                        {Math.max(0, task.estimatedHours - task.hoursLogged)}h
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Progress</div>
                    <div className="flex items-center gap-4">
                      <Progress value={(task.hoursLogged / Math.max(1, task.estimatedHours)) * 100} className="h-2 flex-1" />
                      <span className="text-sm font-medium">
                        {Math.min(100, Math.round((task.hoursLogged / Math.max(1, task.estimatedHours)) * 100))}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Recent Time Entries</CardTitle>
                  <CardDescription>History of your time tracking sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingTimeEntries ? (
                    <div className="space-y-2">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ) : timeEntries && timeEntries.length > 0 ? (
                    <div className="space-y-4">
                      {timeEntries.map((entry: any) => (
                        <div key={entry.tracking_id} className="flex items-center justify-between border-b pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <TimerIcon className="h-4 w-4 text-primary" />
                              <span className="font-medium">
                                {format(new Date(entry.start_time), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(entry.start_time), 'h:mm a')} - 
                              {entry.end_time ? format(new Date(entry.end_time), ' h:mm a') : ' In progress'}
                            </div>
                          </div>
                          
                          <div>
                            <Badge variant="outline" className="font-mono">
                              {formatTimeEntryDuration(entry)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <TimerIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No time entries recorded yet.</p>
                      <p className="text-sm mt-1">Start tracking time to see entries here.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-center border-t pt-4">
                  {isTracking ? (
                    <Button 
                      onClick={handleStopTracking}
                      variant="destructive"
                      className="gap-2"
                    >
                      <PauseIcon className="h-4 w-4" />
                      Stop Current Session ({formatElapsedTime(trackingElapsed)})
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleStartTracking}
                      className="gap-2"
                    >
                      <PlayIcon className="h-4 w-4" />
                      Start New Session
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Analysis</CardTitle>
                  <CardDescription>AI-powered insights to help you complete this task efficiently</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoadingAnalysis ? (
                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : taskAnalysis ? (
                    <>
                      <div className="space-y-3">
                        <h3 className="text-md font-medium">Suggested Approach</h3>
                        <div className="p-4 bg-primary/5 rounded-md">
                          <p className="text-sm">{taskAnalysis.suggested_approach}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-md font-medium">Key Points</h3>
                        <ul className="space-y-2">
                          {taskAnalysis.key_points.map((point: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
                              <span className="text-sm">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {taskAnalysis.risks && taskAnalysis.risks.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-md font-medium">Potential Risks</h3>
                          <ul className="space-y-2">
                            {taskAnalysis.risks.map((risk: string, index: number) => (
                              <li key={index} className="flex items-start gap-2">
                                <AlertCircleIcon className="h-5 w-5 text-amber-500 mt-0.5" />
                                <span className="text-sm">{risk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-2">
                          <BellIcon className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">Estimated Complexity</div>
                            <div className="text-sm text-muted-foreground">Based on task description</div>
                          </div>
                        </div>
                        <Badge variant={
                          taskAnalysis.estimated_complexity === 'High' ? 'destructive' :
                          taskAnalysis.estimated_complexity === 'Medium' ? 'warning' : 'success'
                        }>
                          {taskAnalysis.estimated_complexity}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>Analysis not available for this task.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attachments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Screenshot or Attachment</CardTitle>
                  <CardDescription>Share your progress with visual evidence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        {selectedImage ? (
                          <div className="space-y-2 w-full">
                            <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
                              <img 
                                src={URL.createObjectURL(selectedImage)} 
                                alt="Preview" 
                                className="object-contain w-full h-full"
                              />
                            </div>
                            <div className="text-sm">{selectedImage.name}</div>
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => setSelectedImage(null)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <label className="w-full cursor-pointer space-y-2">
                            <div className="p-2 bg-primary/10 rounded-full mx-auto">
                              <UploadCloudIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div className="font-medium">Click to upload</div>
                            <p className="text-xs text-muted-foreground">
                              Drag and drop files or click to browse
                            </p>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description (optional)</label>
                        <Textarea 
                          placeholder="Describe what this screenshot shows..."
                          className="resize-none min-h-[100px]"
                          value={screenshotDescription}
                          onChange={(e) => setScreenshotDescription(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        className="w-full gap-2" 
                        disabled={!selectedImage || uploadingScreenshot}
                        onClick={handleUploadScreenshot}
                      >
                        <UploadCloudIcon className="h-4 w-4" />
                        {uploadingScreenshot ? "Uploading..." : "Upload Screenshot"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <TaskAttachmentsPanel taskId={Number(taskId)} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <ClientRequirementsPanel clientId={taskData.client_id} taskId={taskData.task_id} />
          
          <VirtualManagerInsights 
            taskId={taskData.task_id} 
            clientId={taskData.client_id} 
            insights={insights || []}
            isLoading={isLoadingInsights}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
