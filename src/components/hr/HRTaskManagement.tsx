
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Calendar, Check, Clock, Plus, User, CalendarClock, CheckCircle2, AlertCircle, ClipboardList } from "lucide-react";
import { format, isToday, isPast, addHours } from 'date-fns';
import hrServiceSupabase from '@/services/api/hrServiceSupabase';
import { HRTask } from '@/interfaces/hr';

const HRTaskManagement = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedTask, setSelectedTask] = useState<HRTask | null>(null);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isCompleteTaskOpen, setIsCompleteTaskOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  
  // Fetch HR tasks
  const { data: tasks, isLoading: isLoadingTasks, refetch: refetchTasks } = useQuery({
    queryKey: ['hr-tasks'],
    queryFn: () => hrServiceSupabase.getHRTasks(),
  });
  
  // Get suggestions/improvements based on tasks and trends
  const { data: trends } = useQuery({
    queryKey: ['hr-trends'],
    queryFn: () => hrServiceSupabase.getHRTrends(),
  });
  
  // Mock task creation function
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    toast.success("Task created successfully!");
    setIsAddTaskOpen(false);
    refetchTasks();
  };
  
  // Mock task completion function
  const handleCompleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      await hrServiceSupabase.completeHRTask(selectedTask.id, completionNotes);
      toast.success("Task marked as completed");
      setIsCompleteTaskOpen(false);
      setCompletionNotes("");
      setSelectedTask(null);
      refetchTasks();
    } catch (error) {
      toast.error("Failed to complete task");
      console.error("Error completing task:", error);
    }
  };
  
  // Filter tasks by status
  const pendingTasks = tasks?.filter(task => task.status === 'pending' || task.status === 'in_progress') || [];
  const completedTasks = tasks?.filter(task => task.status === 'completed') || [];
  
  // Sort tasks by priority and due date
  const sortedPendingTasks = [...pendingTasks].sort((a, b) => {
    // Sort by priority first (high > medium > low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then sort by due date (earliest first)
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
  
  // Get task badge color based on priority
  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };
  
  // Get task status color
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'success';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };
  
  // Check if task is overdue
  const isTaskOverdue = (dueDate: string) => {
    return isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">HR Task Management</h2>
        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New HR Task</DialogTitle>
              <DialogDescription>
                Add a new task for the HR team.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4 mt-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" name="title" placeholder="Enter task title" required />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Task details" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select name="assignee">
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">Sarah Williams (HR Manager)</SelectItem>
                      <SelectItem value="8">David Chen (HR Specialist)</SelectItem>
                      <SelectItem value="12">Maria Rodriguez (Recruiter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input 
                    id="due_date" 
                    name="due_date" 
                    type="date" 
                    defaultValue={format(addHours(new Date(), 48), 'yyyy-MM-dd')} 
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="estimated_time">Estimated Hours</Label>
                  <Input 
                    id="estimated_time" 
                    name="estimated_time" 
                    type="number" 
                    min="0.25" 
                    step="0.25" 
                    defaultValue="1" 
                    required 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="related_to">Related To</Label>
                <Select name="related_to">
                  <SelectTrigger>
                    <SelectValue placeholder="Select related item" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="employee:1">John Doe (Employee)</SelectItem>
                      <SelectItem value="employee:2">Jane Smith (Employee)</SelectItem>
                      <SelectItem value="candidate:5">Sarah Thompson (Candidate)</SelectItem>
                      <SelectItem value="job:1">Senior React Developer (Job)</SelectItem>
                      <SelectItem value="payroll:12">December 2023 Payroll</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button type="submit">Create Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  <span>Pending Tasks</span>
                  <Badge variant="secondary" className="ml-1">
                    {pendingTasks.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Completed Tasks</span>
                  <Badge variant="secondary" className="ml-1">
                    {completedTasks.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="pending" className="space-y-4 mt-0">
              {isLoadingTasks ? (
                <div className="text-center py-8">Loading tasks...</div>
              ) : sortedPendingTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending tasks found.
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedPendingTasks.map((task) => (
                    <Card key={task.id} className={`border-l-4 ${task.priority === 'high' ? 'border-l-destructive' : task.priority === 'medium' ? 'border-l-orange-400' : 'border-l-slate-400'}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-2">
                          <div className="space-y-1">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {task.assigned_to_name}
                              </Badge>
                              
                              <Badge variant={getTaskPriorityColor(task.priority)} className="flex items-center gap-1 capitalize">
                                {task.priority} Priority
                              </Badge>
                              
                              <Badge variant={getTaskStatusColor(task.status)} className="flex items-center gap-1 capitalize">
                                {task.status}
                              </Badge>
                              
                              {task.related_to && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  Related: {task.related_to.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-1 min-w-[150px]">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarClock className="h-3 w-3 mr-1" />
                              <span className={isTaskOverdue(task.due_date) ? 'text-destructive' : ''}>
                                Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                              </span>
                            </div>
                            
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.estimated_time} {task.estimated_time === 1 ? 'hour' : 'hours'}
                            </div>
                            
                            <Button 
                              className="mt-2"
                              size="sm"
                              onClick={() => {
                                setSelectedTask(task);
                                setIsCompleteTaskOpen(true);
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4 mt-0">
              {isLoadingTasks ? (
                <div className="text-center py-8">Loading tasks...</div>
              ) : completedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No completed tasks found.
                </div>
              ) : (
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-2">
                          <div className="space-y-1">
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-muted-foreground">{task.description}</div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {task.assigned_to_name}
                              </Badge>
                              
                              <Badge variant={getTaskStatusColor(task.status)} className="flex items-center gap-1 capitalize">
                                {task.status}
                              </Badge>
                              
                              {task.related_to && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  Related: {task.related_to.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-1 min-w-[150px]">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarClock className="h-3 w-3 mr-1" />
                              Completed: {task.completed_at ? format(new Date(task.completed_at), 'MMM d, yyyy') : 'Unknown'}
                            </div>
                            
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {task.estimated_time} {task.estimated_time === 1 ? 'hour' : 'hours'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
        
        <Card className="md:row-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Improvement Suggestions</CardTitle>
            <CardDescription>AI-generated suggestions for HR processes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trends ? (
              <div className="space-y-3">
                {trends.map((trend) => (
                  <div key={trend.id} className="space-y-1">
                    <h4 className="font-medium text-sm">{trend.title}</h4>
                    <p className="text-xs text-muted-foreground">{trend.description}</p>
                    <div className="text-xs font-medium mt-1">Suggested Action:</div>
                    <p className="text-xs text-muted-foreground">{trend.suggested_actions[0]}</p>
                    <Button size="sm" variant="outline" className="w-full mt-1 text-xs">
                      Create Task
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Loading suggestions...</div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Complete Task Dialog */}
      <Dialog open={isCompleteTaskOpen} onOpenChange={setIsCompleteTaskOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>
              Mark this task as completed and add any completion notes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {selectedTask && (
              <>
                <div className="p-3 bg-muted rounded-md">
                  <div className="font-medium">{selectedTask.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{selectedTask.description}</div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="completion_notes">Completion Notes</Label>
                  <Textarea 
                    id="completion_notes" 
                    placeholder="Add notes about task completion..."
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCompleteTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCompleteTask}>
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRTaskManagement;
