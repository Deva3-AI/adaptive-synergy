
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  FileText, 
  Paperclip, 
  Edit, 
  History
} from "lucide-react";

// Sample task data (would be fetched by ID in a real application)
const taskData = {
  id: 1,
  title: "Website Homepage Redesign",
  description: "Create a modern, responsive homepage design with improved user experience that aligns with the new brand guidelines. Focus on mobile-first approach and ensure fast loading times.",
  status: "in_progress",
  priority: "high",
  dueDate: "2023-10-15",
  createdDate: "2023-09-25",
  estimatedHours: 24,
  actualHours: 18,
  completionPercentage: 75,
  assignedTo: { 
    id: 1, 
    name: "John Doe", 
    avatar: "JD",
    role: "Senior Designer",
    email: "john.doe@company.com" 
  },
  client: {
    name: "Acme Corporation",
    contactPerson: "Jane Smith",
    email: "jane.smith@acme.com"
  },
  clientFeedback: "Looking for a clean, minimal design with emphasis on product showcase. Please ensure the navigation is intuitive and the call-to-action buttons are prominently placed.",
  tags: ["design", "frontend", "ux"],
  attachments: [
    { id: 1, name: "brand_guidelines.pdf", size: "2.4 MB", type: "pdf" },
    { id: 2, name: "current_homepage_analysis.docx", size: "1.8 MB", type: "doc" },
    { id: 3, name: "wireframes_v1.sketch", size: "4.2 MB", type: "sketch" }
  ],
  comments: [
    { 
      id: 1, 
      user: { name: "Jane Smith", avatar: "JS" }, 
      text: "Please make sure to include our new product line in the showcase slider.",
      timestamp: "2023-09-26T10:23:00Z"
    },
    { 
      id: 2, 
      user: { name: "John Doe", avatar: "JD" }, 
      text: "I've added the new products to the design. Also improving the mobile navigation based on our discussion.",
      timestamp: "2023-09-27T14:15:00Z"
    },
    { 
      id: 3, 
      user: { name: "Mike Johnson", avatar: "MJ" }, 
      text: "The initial designs look great! Just a few minor tweaks needed for the product cards.",
      timestamp: "2023-09-29T09:45:00Z"
    }
  ],
  history: [
    { action: "Task created", user: "Jane Smith", timestamp: "2023-09-25T08:30:00Z" },
    { action: "Assigned to John Doe", user: "Jane Smith", timestamp: "2023-09-25T08:35:00Z" },
    { action: "Status changed to In Progress", user: "John Doe", timestamp: "2023-09-26T09:15:00Z" },
    { action: "Files uploaded: wireframes_v1.sketch", user: "John Doe", timestamp: "2023-09-27T11:20:00Z" },
    { action: "Completion percentage updated to 75%", user: "John Doe", timestamp: "2023-09-29T16:10:00Z" }
  ]
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
    case "in_progress":
      return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" /> In Progress</Badge>;
    case "pending":
      return <Badge variant="outline" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Pending</Badge>;
    case "cancelled":
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High Priority</Badge>;
    case "medium":
      return <Badge variant="warning">Medium Priority</Badge>;
    case "low":
      return <Badge variant="secondary">Low Priority</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateTimeString: string) => {
  return new Date(dateTimeString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ClientTaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const task = taskData; // In a real app, we would fetch the task by ID

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/client/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{task.title}</CardTitle>
                  <CardDescription className="mt-2">
                    Task #{task.id} • Created on {formatDate(task.createdDate)}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2 items-start md:items-end">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{task.description}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Client Feedback</h3>
                <p className="text-muted-foreground">{task.clientFeedback}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Assigned To</h3>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{task.assignedTo.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{task.assignedTo.name}</p>
                      <p className="text-sm text-muted-foreground">{task.assignedTo.role}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-2">Client</h3>
                  <div>
                    <p className="font-medium">{task.client.name}</p>
                    <p className="text-sm text-muted-foreground">Contact: {task.client.contactPerson}</p>
                    <p className="text-sm text-muted-foreground">{task.client.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(task.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Hours</p>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {task.estimatedHours} hours
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Actual Hours</p>
                  <p className="font-medium">{task.actualHours} hours</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion</p>
                  <p className="font-medium">{task.completionPercentage}%</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Task
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Complete
              </Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="comments">
            <TabsList className="mb-4">
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Task discussion and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 rounded-lg border">
                      <Avatar>
                        <AvatarFallback>{comment.user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-medium">{comment.user.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(comment.timestamp)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <div className="w-full space-y-4">
                    <Textarea placeholder="Add a comment..." className="resize-none" />
                    <div className="flex justify-end">
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle>Attachments</CardTitle>
                  <CardDescription>
                    Files and documents related to this task
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {task.attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Upload New Attachment
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                  <CardDescription>
                    Timeline of changes and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {task.history.map((item, index) => (
                      <div key={index} className="relative pl-6 pb-4">
                        {index !== task.history.length - 1 && (
                          <div className="absolute left-2 top-2 bottom-0 w-px bg-border" />
                        )}
                        <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-background border-2 border-primary" />
                        <div>
                          <p className="font-medium">{item.action}</p>
                          <p className="text-sm text-muted-foreground">
                            By {item.user} • {formatDateTime(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientTaskDetail;
