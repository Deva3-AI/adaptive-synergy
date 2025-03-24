
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  MessageCircle,
  ArrowLeft,
  ExternalLink,
  Download,
  Paperclip,
  BarChart,
  User,
  Tag,
  Brain,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import VirtualManagerInsights from "@/components/employee/VirtualManagerInsights";
import TaskProgressInsights from "@/components/tasks/TaskProgressInsights";
import { Link } from 'react-router-dom';

// Mock API fetch function
const fetchTaskDetail = async (taskId: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return {
    id: taskId,
    title: "Website Redesign - Homepage",
    description: "Create a new homepage design based on the updated brand guidelines. Include mobile-responsive layouts and interactive elements as specified in the requirements document.",
    status: "in_progress",
    priority: "high",
    client: {
      id: 2,
      name: "Acme Corporation",
      logo: "/placeholders/logo-1.png"
    },
    assignee: {
      id: 1,
      name: "Alex Johnson",
      avatar: "/placeholders/avatar-1.jpg"
    },
    created_at: "2023-09-15T09:30:00Z",
    due_date: "2023-09-30T18:00:00Z",
    estimated_hours: 24,
    logged_hours: 10.5,
    attachments: [
      { id: 1, name: "requirements-doc.pdf", size: "2.4 MB", type: "pdf" },
      { id: 2, name: "brand-guidelines-2023.pdf", size: "5.1 MB", type: "pdf" },
      { id: 3, name: "current-homepage-screenshots.zip", size: "8.7 MB", type: "zip" }
    ],
    comments: [
      {
        id: 1,
        user: { id: 1, name: "Alex Johnson", avatar: "/placeholders/avatar-1.jpg" },
        content: "Started working on wireframes. Will share the initial concepts by tomorrow.",
        created_at: "2023-09-16T14:25:00Z"
      },
      {
        id: 2,
        user: { id: 3, name: "Sarah Wilson", avatar: "/placeholders/avatar-3.jpg" },
        content: "Don't forget to include the new product feature section as discussed in yesterday's meeting.",
        created_at: "2023-09-17T09:15:00Z"
      },
      {
        id: 3,
        user: { id: 1, name: "Alex Johnson", avatar: "/placeholders/avatar-1.jpg" },
        content: "Thanks for the reminder. I've included it in the wireframes attached below.",
        created_at: "2023-09-17T11:45:00Z",
        attachment: { id: 4, name: "homepage-wireframes-v1.pdf", size: "3.2 MB", type: "pdf" }
      }
    ],
    tags: ["design", "frontend", "homepage", "redesign"],
    related_tasks: [
      { id: 4, title: "Website Redesign - About Us Page", status: "pending" },
      { id: 5, title: "Website Redesign - Services Section", status: "pending" },
      { id: 6, title: "Update Brand Assets for Web", status: "completed" }
    ]
  };
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-yellow-600 bg-yellow-50">Pending</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="text-blue-600 bg-blue-50">In Progress</Badge>;
    case 'completed':
      return <Badge variant="outline" className="text-green-600 bg-green-50">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="text-red-600 bg-red-50">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Get priority badge
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>;
    case 'low':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Low</Badge>;
    default:
      return <Badge>{priority}</Badge>;
  }
};

const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  
  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => fetchTaskDetail(taskId || ''),
    enabled: !!taskId,
  });
  
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    
    // In a real app, this would call an API to add the comment
    toast.success('Comment added successfully');
    setNewComment('');
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto py-8 animate-in">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="container max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Task Not Found</h2>
            <p className="text-muted-foreground mb-6">The task you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/app/client/tasks">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tasks
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-8 animate-in">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link to="/app/client/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {getStatusBadge(task.status)}
          {getPriorityBadge(task.priority)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>Information about this task</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Client</h3>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={task.client.logo} alt={task.client.name} />
                            <AvatarFallback>{task.client.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{task.client.name}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Assignee</h3>
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{task.assignee.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Created On</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(task.created_at)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Due Date</h3>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{formatDate(task.due_date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Estimated Hours</h3>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{task.estimated_hours} hours</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Logged Hours</h3>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{task.logged_hours} hours</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-muted">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Related Tasks</h3>
                      <div className="space-y-2">
                        {task.related_tasks.map((relatedTask: any) => (
                          <div key={relatedTask.id} className="flex items-center justify-between p-2 border rounded-md">
                            <span className="text-sm">{relatedTask.title}</span>
                            {getStatusBadge(relatedTask.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="comments">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {task.comments.map((comment: any) => (
                        <div key={comment.id} className="flex gap-4 pb-4 border-b last:border-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium">{comment.user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{comment.content}</p>
                            {comment.attachment && (
                              <div className="flex items-center gap-2 p-2 bg-muted rounded-md w-fit">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">{comment.attachment.name}</span>
                                <span className="text-xs text-muted-foreground">({comment.attachment.size})</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2">
                                  <Download className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                          <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Add a comment..."
                            className="resize-none"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <div className="flex justify-between">
                            <Button variant="outline" size="sm">
                              <Paperclip className="h-4 w-4 mr-2" />
                              Attach File
                            </Button>
                            <Button size="sm" onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Add Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments">
                  <div className="space-y-4">
                    {task.attachments.map((attachment: any) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 mr-3 text-blue-500" />
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">{attachment.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4">
                      <Button className="w-full">
                        <Paperclip className="h-4 w-4 mr-2" />
                        Upload New Attachment
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai-insights">
                  <div className="space-y-6">
                    <TaskProgressInsights taskId={parseInt(taskId || "0")} taskTitle={task.title} taskDescription={task.description} />
                    
                    <div className="p-4 border rounded-md">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-5 w-5 text-purple-500" />
                        <h3 className="font-medium">AI Task Analysis</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Complexity Assessment:</span>
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                            Medium
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Estimated Completion Time:</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            23-26 hours
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Recommended Team Size:</span>
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            1-2 people
                          </Badge>
                        </div>
                        <Separator className="my-3" />
                        <div>
                          <span className="text-sm font-medium">Suggested Task Breakdown:</span>
                          <ul className="mt-1 space-y-1 text-sm list-disc list-inside text-muted-foreground">
                            <li>Initial wireframing (4-5h)</li>
                            <li>Design mockups (6-8h)</li>
                            <li>Frontend implementation (8-10h)</li>
                            <li>Testing and refinement (4-5h)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="w-full flex justify-between">
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Log Time
                </Button>
                
                <div className="space-x-2">
                  {task.status !== "completed" && (
                    <Button onClick={() => toast.success("Task marked as complete!")}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                  
                  {task.status === "completed" && (
                    <Button variant="outline" onClick={() => toast.info("Task reopened!")}>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reopen Task
                    </Button>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        <div className="space-y-6">
          <VirtualManagerInsights clientId={task.client.id} taskId={parseInt(taskId || "0")} employeeName={task.assignee.name} />
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{task.logged_hours} / {task.estimated_hours} hours</span>
                  </div>
                  <Progress value={(task.logged_hours / task.estimated_hours) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-muted-foreground">Estimated</p>
                    <p className="font-medium">{task.estimated_hours} hours</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-muted-foreground">Logged</p>
                    <p className="font-medium">{task.logged_hours} hours</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="font-medium">{task.estimated_hours - task.logged_hours} hours</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                    <p className="font-medium">
                      {Math.round((task.logged_hours / task.estimated_hours) * 100)}%
                    </p>
                  </div>
                </div>
                
                <Button className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Start Timer
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="relative mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="absolute top-8 bottom-0 left-1/2 w-px bg-muted -translate-x-1/2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Comment Added</p>
                      <p className="text-xs text-muted-foreground">
                        {task.comments[task.comments.length - 1].user.name} added a comment
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.comments[task.comments.length - 1].created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="relative mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="absolute top-8 bottom-0 left-1/2 w-px bg-muted -translate-x-1/2"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">File Uploaded</p>
                      <p className="text-xs text-muted-foreground">
                        {task.comments[task.comments.length - 1].user.name} uploaded a file
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.comments[task.comments.length - 1].created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="relative mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Task Assigned</p>
                      <p className="text-xs text-muted-foreground">
                        Task assigned to {task.assignee.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(task.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
