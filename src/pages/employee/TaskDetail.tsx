import React, { useState, useEffect, useRef } from "react";
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
  Circle,
  Upload,
  Link as LinkIcon,
  X,
  FileText,
  Image as ImageIcon,
  File
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import taskService, { TaskAttachment } from "@/services/api/taskService";
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
  const [progressNote, setProgressNote] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [task, setTask] = useState(sampleTask as DetailedTask);
  const [isWorkingOnTask, setIsWorkingOnTask] = useState(false);
  const [isOverallWorkStarted, setIsOverallWorkStarted] = useState(false);
  const [attendanceId, setAttendanceId] = useState<number | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressDescription, setProgressDescription] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [progressAnalysis, setProgressAnalysis] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDriveLinkDialog, setShowDriveLinkDialog] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
        
        try {
          const attachmentsData = await taskService.getTaskAttachments(Number(taskId));
          setAttachments(attachmentsData || []);
        } catch (error) {
          console.error("Error fetching attachments:", error);
          // Don't show error toast as this isn't critical
        }
        
        try {
          const analysisData = await taskService.analyzeTaskProgress(Number(taskId));
          setProgressAnalysis(analysisData);
        } catch (error) {
          console.error("Error fetching progress analysis:", error);
          // Don't show error toast as this isn't critical
        }
        
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      
      const newPreviewUrls = files.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      });
      
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    }
  };
  
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
    
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(urls => urls.filter((_, i) => i !== index));
    }
  };
  
  const handleScreenshotUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }
    
    if (!taskId) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        await taskService.uploadTaskScreenshot(Number(taskId), file, progressDescription);
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }
      
      if (progressDescription) {
        await taskService.updateTaskProgress(Number(taskId), { progress_description: progressDescription });
      }
      
      const updatedAttachments = await taskService.getTaskAttachments(Number(taskId));
      setAttachments(updatedAttachments || []);
      
      setSelectedFiles([]);
      setPreviewUrls([]);
      setProgressDescription("");
      setShowUploadDialog(false);
      
      toast.success("Screenshots uploaded successfully");
      
      const analysisData = await taskService.analyzeTaskProgress(Number(taskId));
      setProgressAnalysis(analysisData);
      
    } catch (error) {
      console.error("Error uploading screenshots:", error);
      toast.error("Failed to upload screenshots");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDriveLinkSubmit = async () => {
    if (!driveLink) {
      toast.error("Please enter a Google Drive link");
      return;
    }
    
    if (!taskId) return;
    
    try {
      await taskService.updateTaskProgress(Number(taskId), {
        progress_description: progressDescription,
        drive_link: driveLink
      });
      
      if (task.status !== 'completed') {
        await taskService.updateTaskStatus(Number(taskId), 'completed');
      }
      
      setShowDriveLinkDialog(false);
      setDriveLink("");
      setProgressDescription("");
      
      toast.success("Task completed and Drive link added successfully");
      
      setTask({
        ...task,
        status: 'completed',
        drive_link: driveLink,
        progress_description: progressDescription
      });
      
    } catch (error) {
      console.error("Error submitting Drive link:", error);
      toast.error("Failed to submit Drive link");
    }
  };

  const addProgressNote = () => {
    if (!progressNote.trim()) return;
    
    setTask(prevTask => ({
      ...prevTask,
      progressDescription: progressNote,
      recentActivity: [
        {
          id: Date.now(),
          type: 'progress_update',
          content: progressNote,
          date: new Date(),
          user: 'You'
        },
        ...prevTask.recentActivity
      ]
    }));
    
    setProgressNote('');
    toast.success('Progress note added');
  };

  const addDriveLink = () => {
    if (!driveLink.trim()) return;
    
    setTask(prevTask => ({
      ...prevTask,
      driveLink: driveLink,
      recentActivity: [
        {
          id: Date.now(),
          type: 'link_added',
          content: `Added Google Drive link: ${driveLink}`,
          date: new Date(),
          user: 'You'
        },
        ...prevTask.recentActivity
      ]
    }));
    
    setDriveLink('');
    toast.success('Google Drive link added');
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (!ext) return <File className="h-5 w-5" />;
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (['pdf'].includes(ext)) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (['doc', 'docx'].includes(ext)) {
      return <FileText className="h-5 w-5 text-blue-700" />;
    } else if (['xls', 'xlsx'].includes(ext)) {
      return <FileText className="h-5 w-5 text-green-700" />;
    } else if (['ppt', 'pptx'].includes(ext)) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    }
    
    return <File className="h-5 w-5" />;
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
              
              {task.progress_description && (
                <div className="space-y-4">
                  <h3 className="font-medium">Progress Update</h3>
                  <div className="p-3 rounded-md border border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground">{task.progress_description}</p>
                  </div>
                </div>
              )}
              
              {task.drive_link && (
                <div className="space-y-4">
                  <h3 className="font-medium">Completed Work</h3>
                  <div className="flex items-center p-3 rounded-md border border-border bg-muted/30">
                    <LinkIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <a 
                      href={task.drive_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View completed work on Google Drive
                    </a>
                  </div>
                </div>
              )}
              
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
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Task Screenshots & Attachments</h3>
                  <div className="flex space-x-2">
                    {task.status === 'completed' ? (
                      <Dialog open={showDriveLinkDialog} onOpenChange={setShowDriveLinkDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Update Drive Link
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Google Drive Link</DialogTitle>
                            <DialogDescription>
                              Provide a link to the completed work in Google Drive
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="drive-link">Google Drive Link</Label>
                              <Input
                                id="drive-link"
                                placeholder="https://drive.google.com/..."
                                value={driveLink}
                                onChange={(e) => setDriveLink(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="completion-description">Completion Description</Label>
                              <Textarea
                                id="completion-description"
                                placeholder="Describe what you accomplished and how the task was completed..."
                                value={progressDescription}
                                onChange={(e) => setProgressDescription(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowDriveLinkDialog(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleDriveLinkSubmit}>
                              Submit
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Screenshots
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Upload Task Screenshots</DialogTitle>
                            <DialogDescription>
                              Upload screenshots of your work in progress to update the task status
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="progress-description">Progress Description</Label>
                              <Textarea
                                id="progress-description"
                                placeholder="Describe your progress so far..."
                                value={progressDescription}
                                onChange={(e) => setProgressDescription(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Screenshots</Label>
                              <div 
                                className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  multiple
                                  className="hidden"
                                  ref={fileInputRef}
                                  onChange={handleFileChange}
                                />
                              </div>
                              
                              {selectedFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  {selectedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 rounded-md border bg-muted/30">
                                      <div className="flex items-center">
                                        {file.type.startsWith('image/') && previewUrls[index] ? (
                                          <div className="h-10 w-10 rounded-md overflow-hidden mr-3 bg-muted">
                                            <img 
                                              src={previewUrls[index]} 
                                              alt={file.name} 
                                              className="h-full w-full object-cover"
                                            />
                                          </div>
                                        ) : (
                                          <div className="h-10 w-10 rounded-md mr-3 bg-muted flex items-center justify-center">
                                            {getFileIcon(file.name)}
                                          </div>
                                        )}
                                        <div>
                                          <p className="text-sm font-medium truncate max-w-[200px]">
                                            {file.name}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeSelectedFile(index);
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {uploading && (
                                <div className="mt-2">
                                  <Progress value={uploadProgress} className="h-2" />
                                  <p className="text-xs text-center mt-1">
                                    Uploading: {uploadProgress}%
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleScreenshotUpload} 
                              disabled={selectedFiles.length === 0 || uploading}
                            >
                              {uploading ? 'Uploading...' : 'Upload'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {attachments.length > 0 ? (
                    attachments.map(attachment => (
                      <div 
                        key={attachment.attachment_id} 
                        className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                            {getFileIcon(attachment.file_name)}
                          </div>
                          <div>
                            <p className="font-medium">{attachment.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(attachment.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          asChild
                        >
                          <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4 rounded-md border border-dashed">
                      <Paperclip className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        No attachments yet
                      </p>
                    </div>
                  )}
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
                {progressAnalysis ? (
                  <>
                    {progressAnalysis.analysis && (
                      <div className="p-3 bg-muted/50 rounded-md border border-border">
                        <h4 className="text-sm font-medium mb-2">Progress Analysis</h4>
                        <p className="text-sm text-muted-foreground">
                          {progressAnalysis.analysis}
                        </p>
                      </div>
                    )}
                    
                    {progressAnalysis.suggestions && progressAnalysis.suggestions.length > 0 && (
                      <div className="p-3 bg-muted/50 rounded-md border border-border">
                        <h4 className="text-sm font-medium mb-2">Suggestions</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                          {progressAnalysis.suggestions.map((suggestion: string, idx: number) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskDetail;
