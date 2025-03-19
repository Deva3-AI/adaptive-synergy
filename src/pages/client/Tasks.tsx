
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Plus, Search, Filter, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Sample data for tasks
const tasksList = [
  {
    id: 1,
    title: "Website Homepage Redesign",
    description: "Create a modern, responsive homepage design with improved user experience",
    status: "in_progress",
    priority: "high",
    dueDate: "2023-10-15",
    assignedTo: { id: 1, name: "John Doe", avatar: "JD" },
    clientFeedback: "Looking for a clean, minimal design with emphasis on product showcase",
    tags: ["design", "frontend", "ux"],
  },
  {
    id: 2,
    title: "Mobile App User Authentication",
    description: "Implement secure login and registration flows for the mobile application",
    status: "pending",
    priority: "medium",
    dueDate: "2023-10-20",
    assignedTo: { id: 2, name: "Sarah Miller", avatar: "SM" },
    clientFeedback: "Must support both email and social login options",
    tags: ["development", "security", "mobile"],
  },
  {
    id: 3,
    title: "Product Catalog Database Schema",
    description: "Design and implement database schema for new product catalog system",
    status: "completed",
    priority: "high",
    dueDate: "2023-10-05",
    assignedTo: { id: 3, name: "Mike Johnson", avatar: "MJ" },
    clientFeedback: "Need to support complex product variants and custom attributes",
    tags: ["database", "backend"],
  },
  {
    id: 4,
    title: "Email Marketing Template",
    description: "Design responsive email template for upcoming product launch",
    status: "pending",
    priority: "low",
    dueDate: "2023-10-25",
    assignedTo: { id: 4, name: "Lisa Brown", avatar: "LB" },
    clientFeedback: "Should match our brand guidelines and have strong CTAs",
    tags: ["design", "marketing"],
  },
  {
    id: 5,
    title: "Payment Integration",
    description: "Integrate new payment gateway with existing checkout process",
    status: "in_progress",
    priority: "high",
    dueDate: "2023-10-18",
    assignedTo: { id: 5, name: "David Wilson", avatar: "DW" },
    clientFeedback: "Must support multiple currencies and be PCI compliant",
    tags: ["development", "backend", "security"],
  },
];

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
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return <Badge variant="warning">Medium</Badge>;
    case "low":
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

const ClientTasks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter tasks based on search term and active tab
  const filteredTasks = tasksList.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "completed") return matchesSearch && task.status === "completed";
    if (activeTab === "in_progress") return matchesSearch && task.status === "in_progress";
    if (activeTab === "pending") return matchesSearch && task.status === "pending";
    
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-blur-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all tasks across your projects
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksList.filter(task => task.status === "completed").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksList.filter(task => task.status === "in_progress").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksList.filter(task => task.status === "pending").length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">No tasks found matching your criteria.</p>
          )}
        </TabsContent>
        
        <TabsContent value="in_progress" className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">No in-progress tasks found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">No completed tasks found.</p>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p className="text-center py-8 text-muted-foreground">No pending tasks found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Task Card component
const TaskCard = ({ task }: { task: any }) => {
  return (
    <Card className="hover:bg-muted/30 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <CardDescription className="mt-1">{task.description}</CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarFallback>{task.assignedTo.avatar}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">Assigned to {task.assignedTo.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Due {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">Client Feedback:</p>
          <p className="text-sm text-muted-foreground">{task.clientFeedback}</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {task.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default ClientTasks;
