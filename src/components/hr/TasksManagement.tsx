
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Clock, Flag, Calendar, Plus, Search, Filter, CheckCircle, XCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useQuery } from '@tanstack/react-query';
import { hrService, HRTask } from '@/services/api/hrService';
import { format, parseISO, isBefore, formatDistanceToNow } from 'date-fns';

const TasksManagement = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { data: hrTasks, isLoading } = useQuery({
    queryKey: ['hr-tasks'],
    queryFn: () => hrService.getHRTasks(),
  });
  
  const { data: employees } = useQuery({
    queryKey: ['hr-employees'],
    queryFn: () => hrService.getEmployees(),
  });
  
  // Filter tasks
  const filteredTasks = hrTasks ? hrTasks.filter((task: HRTask) => {
    // Filter by status
    if (statusFilter !== 'all' && task.status !== statusFilter) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter !== 'all' && task.category !== categoryFilter) {
      return false;
    }
    
    // Search by title or description
    if (searchQuery && 
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];
  
  // Group tasks by status for Kanban view
  const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in_progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge className="bg-gray-500">{priority}</Badge>;
    }
  };
  
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'hiring':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-600/20">Hiring</Badge>;
      case 'onboarding':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-600/20">Onboarding</Badge>;
      case 'benefits':
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-600/20">Benefits</Badge>;
      case 'compliance':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-600/20">Compliance</Badge>;
      case 'training':
        return <Badge variant="outline" className="bg-cyan-500/10 text-cyan-600 border-cyan-600/20">Training</Badge>;
      case 'other':
        return <Badge variant="outline" className="bg-slate-500/10 text-slate-600 border-slate-600/20">Other</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };
  
  const isOverdue = (dueDate: string) => {
    return isBefore(new Date(dueDate), new Date()) && !isToday(dueDate);
  };
  
  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">HR Tasks Management</h3>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New HR Task</DialogTitle>
              <DialogDescription>
                Add a new task for the HR team
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" placeholder="e.g., Review job applications" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter detailed task description" 
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees && employees.map((employee: any) => (
                        <SelectItem key={employee.user_id} value={employee.user_id.toString()}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input type="date" id="dueDate" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hiring">Hiring</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="benefits">Benefits</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button>Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="list">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-[250px]"
              icon={<Search className="h-4 w-4" />}
            />
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="hiring">Hiring</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="benefits">Benefits</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 text-left text-sm font-medium">Task</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Assignee</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Priority</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center">Loading...</td>
                      </tr>
                    ) : filteredTasks && filteredTasks.length > 0 ? (
                      filteredTasks.map((task: HRTask) => (
                        <tr key={task.task_id} className="border-b hover:bg-muted/50">
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{task.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                                {task.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{task.assignee_name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                              <span>{task.assignee_name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className={isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600' : ''}>
                              {format(new Date(task.due_date), 'MMM d, yyyy')}
                              <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">{getPriorityBadge(task.priority)}</td>
                          <td className="px-4 py-3">{getCategoryBadge(task.category)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {getStatusIcon(task.status)}
                              <span className="ml-1.5 capitalize">{task.status.replace('_', ' ')}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Edit Task</DropdownMenuItem>
                                <DropdownMenuItem>Change Status</DropdownMenuItem>
                                <DropdownMenuItem>Reassign</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center">No tasks found matching your filters</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  Pending
                  <Badge className="ml-2 bg-amber-500">{pendingTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 h-[calc(100vh-250px)] overflow-y-auto">
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No pending tasks
                  </div>
                ) : (
                  pendingTasks.map((task: HRTask) => (
                    <Card key={task.task_id} className="p-3 hover:bg-accent/5">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{task.title}</h4>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={isOverdue(task.due_date) ? 'text-red-600' : ''}>
                              {format(new Date(task.due_date), 'MMM d')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(task.category)}
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">{task.assignee_name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  In Progress
                  <Badge className="ml-2 bg-blue-500">{inProgressTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 h-[calc(100vh-250px)] overflow-y-auto">
                {inProgressTasks.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No tasks in progress
                  </div>
                ) : (
                  inProgressTasks.map((task: HRTask) => (
                    <Card key={task.task_id} className="p-3 hover:bg-accent/5">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{task.title}</h4>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={isOverdue(task.due_date) ? 'text-red-600' : ''}>
                              {format(new Date(task.due_date), 'MMM d')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(task.category)}
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">{task.assignee_name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  Completed
                  <Badge className="ml-2 bg-green-500">{completedTasks.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-2 h-[calc(100vh-250px)] overflow-y-auto">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No completed tasks
                  </div>
                ) : (
                  completedTasks.map((task: HRTask) => (
                    <Card key={task.task_id} className="p-3 hover:bg-accent/5">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{task.title}</h4>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {format(new Date(task.due_date), 'MMM d')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(task.category)}
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[10px]">{task.assignee_name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksManagement;
