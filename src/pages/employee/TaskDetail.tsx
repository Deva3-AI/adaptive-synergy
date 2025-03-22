import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Briefcase, 
  MessageSquare,
  Paperclip,
  Send,
  Play,
  Pause,
  ChevronDown,
  CheckCircle,
  BarChart,
  AlarmClock,
  Flag,
  Clock8,
  PlusCircle,
  Pencil,
  CheckSquare,
  Circle
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import taskService from "@/services/api/taskService";
import employeeService from "@/services/api/employeeService";

const sampleTask = {
  id: 1,
  title: "Website redesign for TechCorp",
  description: "Redesign the TechCorp website homepage and product pages with a modern, clean aesthetic. Focus on improving user experience and conversion rates.",
  client: "TechCorp",
  clientLogo: "",
  dueDate: new Date("2023-09-21T16:00:00"),
  startDate: new Date("2023-09-15T09:00:00"),
  priority: "High",
  status: "In Progress",
  progress: 65,
  estimatedHours: 24,
  hoursLogged: 16,
  assignedBy: "Jane Doe",
  assignedTo: "You",
  category: "Design",
  comments: [
    {
      id: 1,
      author: "Jane Doe",
      avatar: "",
      content: "Please make sure to follow the brand guidelines we discussed in the kickoff meeting.",
      timestamp: new Date("2023-09-15T10:30:00"),
    },
    {
      id: 2,
      author: "You",
      avatar: "",
      content: "I've completed the wireframes and started on the high-fidelity mockups. Should have something to share by tomorrow.",
      timestamp: new Date("2023-09-18T15:45:00"),
    },
    {
      id: 3,
      author: "TechCorp Client",
      avatar: "",
      content: "Looking forward to seeing the progress. Please remember we need an emphasis on mobile responsiveness.",
      timestamp: new Date("2023-09-18T16:20:00"),
    }
  ],
  checklistItems: [
    { id: 1, text: "Create wireframes", completed: true },
    { id: 2, text: "Design homepage mockup", completed: true },
    { id: 3, text: "Design product page templates", completed: false },
    { id: 4, text: "Create responsive mobile designs", completed: false },
    { id: 5, text: "Prepare design handoff to developers", completed: false },
  ],
  attachments: [
    { id: 1, name: "TechCorp_Brand_Guidelines.pdf", size: "2.4 MB", type: "pdf" },
    { id: 2, name: "Wireframes_v1.sketch", size: "4.8 MB", type: "sketch" },
    { id: 3, name: "Homepage_Mockup.png", size: "1.2 MB", type: "image" },
  ],
  recentActivity: [
    { 
      id: 1, 
      type: "comment", 
      description: "TechCorp Client commented on this task", 
      timestamp: new Date("2023-09-18T16:20:00") 
    },
    { 
      id: 2, 
      type: "progress", 
      description: "You updated the progress to 65%", 
      timestamp: new Date("2023-09-18T15:50:00") 
    },
    { 
      id: 3, 
      type: "checklist", 
      description: "You completed 'Design homepage mockup'", 
      timestamp: new Date("2023-09-18T15:45:00") 
    },
    { 
      id: 4, 
      type: "attachment", 
      description: "You uploaded 'Homepage_Mockup.png'", 
      timestamp: new Date("2023-09-18T14:30:00") 
    },
  ]
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

const formatDateTime = (date: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return `Today at ${formatTime(date)}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${formatTime(date)}`;
  } else {
    return `${formatDate(date)} at ${formatTime(date)}`;
  }
};

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case "High":
      return "destructive";
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
    case "Completed":
      return "success";
    case "In Progress":
      return "accent";
    case "Not Started":
      return "outline";
    case "On Hold":
      return "warning";
    default:
      return "outline";
  }
};

const EmployeeTaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [task, setTask] = useState(sampleTask);
  const [isWorkingOnTask, setIsWorkingOnTask] = useState(false);
  const [isOverallWorkStarted, setIsOverallWorkStarted] = useState(false);
  const [attendanceId, setAttendanceId] = useState<number | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTaskAndWorkStatus = async () => {
      if (!taskId) return;
      
      try {
        setIsLoading(true);
        
        const attendance = await employeeService.getTodayAttendance();
        if (attendance) {
          setIsOverallWorkStarted(true);
          setAttendanceId(attendance.attendance_id);
          
          if (!attendance.logout_time) {
            const activeTask = await taskService.getActiveTask();
            if (activeTask) {
              setActiveTaskId(activeTask.task_id);
              setIsWorkingOnTask(Number(taskId) === activeTask.task_id);
            }
          }
        }
        
        setTask(sampleTask);
      } catch (error) {
        console.error("Error fetching task or work status:", error);
        toast.error("Failed to load task details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTaskAndWorkStatus();
  }, [taskId]);
  
  const handleStartDayWork = async () => {
    try {
      const response = await employeeService.startWork();
      setAttendanceId(response.attendance_id);
      setIsOverallWorkStarted(true);
      toast.success("Work day started successfully");
    } catch (error) {
      console.error("Error starting work:", error);
      toast.error("Failed to start work day");
    }
  };
  
  const handleStopDayWork = async () => {
    if (!attendanceId) return;
    
    try {
      if (isWorkingOnTask && taskId) {
        await handleStopTaskWork();
      }
      
      await employeeService.stopWork(attendanceId);
      setIsOverallWorkStarted(false);
      setAttendanceId(null);
      toast.success("Work day ended successfully");
    } catch (error) {
      console.error("Error stopping work:", error);
      toast.error("Failed to end work day");
    }
  };
  
  const handleStartTaskWork = async () => {
    if (!taskId) return;
    
    try {
      if (!isOverallWorkStarted) {
        await handleStartDayWork();
      }
      
      if (activeTaskId && activeTaskId !== Number(taskId)) {
        const switchTask = window.confirm(`You are currently working on another task. Switch to this task?`);
        if (!switchTask) return;
        
        await taskService.stopTaskWork(activeTaskId);
      }
      
      await taskService.startTaskWork(Number(taskId));
      setIsWorkingOnTask(true);
      setActiveTaskId(Number(taskId));
      toast.success("Started working on this task");
    } catch (error) {
      console.error("Error starting task work:", error);
      toast.error("Failed to start working on task");
    }
  };
  
  const handleStopTaskWork = async () => {
    if (!taskId) return;
    
    try {
      await taskService.stopTaskWork(Number(taskId));
      setIsWorkingOnTask(false);
      setActiveTaskId(null);
      toast.success("Stopped working on this task");
    } catch (error) {
      console.error("Error stopping task work:", error);
      toast.error("Failed to stop working on task");
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setComment("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-blur-in">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="flex items-center" asChild>
          <Link to="/employee/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        
        <div className="flex items-center space-x-2">
          {isOverallWorkStarted ? (
            <>
              {!isWorkingOnTask ? (
                <Button 
                  onClick={handleStartTaskWork} 
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Working on Task
                </Button>
              ) : (
                <Button 
                  onClick={handleStopTaskWork} 
                  variant="destructive"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Stop Working on Task
                </Button>
              )}
              
              <Button 
                onClick={handleStopDayWork} 
                variant="outline"
                className="bg-red-100 hover:bg-red-200 text-red-700 border-red-300"
              >
                <Pause className="h-4 w-4 mr-2" />
                End Work Day
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleStartDayWork} 
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Work Day
            </Button>
          )}
          
          <Button variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-2xl">{task.title}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {task.client} • {task.category}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge variant={getPriorityBadgeVariant(task.priority)}>
                    {task.priority} Priority
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(task.status)}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground">
                  {task.description}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Progress</h3>
                  <span className="text-sm font-medium">{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock8 className="h-4 w-4 mr-1" />
                    <span>{task.hoursLogged} hours logged</span>
                  </div>
                  <div className="flex items-center">
                    <AlarmClock className="h-4 w-4 mr-1" />
                    <span>{task.estimatedHours} hours estimated</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Checklist</h3>
                  <span className="text-sm text-muted-foreground">
                    {task.checklistItems.filter(item => item.completed).length} of {task.checklistItems.length} completed
                  </span>
                </div>
                <div className="space-y-2">
                  {task.checklistItems.map(item => (
                    <div key={item.id} className="flex items-start space-x-2">
                      <div className="flex-shrink-0 mt-0.5">
                        {item.completed ? (
                          <CheckSquare className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {item.text}
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add item
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Attachments</h3>
                <div className="space-y-2">
                  {task.attachments.map(attachment => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                          <Paperclip className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-xs text-muted-foreground">{attachment.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add attachment
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Comments</h3>
                <div className="space-y-4">
                  {task.comments.map(comment => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{comment.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(comment.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  <form onSubmit={handleSubmitComment} className="flex space-x-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex justify-end">
                        <Button type="submit" disabled={!comment.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Client</h4>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{task.client}</p>
                    <p className="text-xs text-muted-foreground">Client since Jan 2023</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Assigned By</h4>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{task.assignedBy}</p>
                    <p className="text-xs text-muted-foreground">Team Lead</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Dates</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-medium">{formatDate(task.startDate)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="font-medium">{formatDate(task.dueDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Time Tracking</h4>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Hours Logged</p>
                    <p className="text-xs font-medium">{task.hoursLogged}h</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Estimated Hours</p>
                    <p className="text-xs font-medium">{task.estimatedHours}h</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="text-xs font-medium">{task.estimatedHours - task.hoursLogged}h</p>
                  </div>
                </div>
                <Progress value={(task.hoursLogged / task.estimatedHours) * 100} className="h-1.5 mt-2" />
                
                <div className="mt-3 pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Work Status</p>
                  {isWorkingOnTask ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <p className="text-sm font-medium">Currently working on this task</p>
                    </div>
                  ) : activeTaskId ? (
                    <div className="flex items-center space-x-2 text-amber-600">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <p className="text-sm font-medium">Working on another task</p>
                    </div>
                  ) : isOverallWorkStarted ? (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <p className="text-sm font-medium">Work day active (no task selected)</p>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <p className="text-sm font-medium">Not working</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {task.recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                      {activity.type === 'comment' && <MessageSquare className="h-4 w-4 text-blue-500" />}
                      {activity.type === 'progress' && <BarChart className="h-4 w-4 text-green-500" />}
                      {activity.type === 'checklist' && <CheckCircle className="h-4 w-4 text-purple-500" />}
                      {activity.type === 'attachment' && <Paperclip className="h-4 w-4 text-orange-500" />}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-md border border-border">
                  <h4 className="text-sm font-medium mb-2">Time Forecast</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on your current pace, this task is likely to be completed in 3 more days, which is within the deadline.
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-md border border-border">
                  <h4 className="text-sm font-medium mb-2">Similar Past Tasks</h4>
                  <p className="text-sm text-muted-foreground">
                    You've completed 5 similar design tasks for TechCorp. Your average completion time was 22 hours.
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-md border border-border">
                  <h4 className="text-sm font-medium mb-2">Client Preferences</h4>
                  <p className="text-sm text-muted-foreground">
                    TechCorp typically prefers minimalist designs with blue color schemes and emphasized call-to-action buttons.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskDetail;
