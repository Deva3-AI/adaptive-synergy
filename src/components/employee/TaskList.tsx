
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  MoreHorizontal, 
  PanelRight, 
  Filter, 
  ArrowUpDown,
  User,
  Building,
  ArrowRight,
  PlusCircle, 
  AlertCircle,
  FileText,
  ClipboardCheck,
  Trash
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Task interface
interface Task {
  task_id: number;
  id?: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  client_id?: number;
  client_name?: string;
  client?: string;
  assigned_to?: number;
  assignee_name?: string;
  created_at?: string;
  updated_at?: string;
  due_date?: string;
  progress: number;
  estimated_hours?: number;
  actual_hours?: number;
  attachments?: any[];
}

// Filter interface
interface TaskFilter {
  status?: string;
  priority?: string;
  assigned?: number;
  client?: number;
}

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: any;
  filter: TaskFilter;
  setFilter: React.Dispatch<React.SetStateAction<TaskFilter>>;
  showClient?: boolean;
  onTaskUpdate?: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  isLoading, 
  error, 
  filter,
  setFilter,
  showClient = false,
  onTaskUpdate
}) => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [taskView, setTaskView] = useState<'list' | 'card'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task => {
    if (!searchTerm) return true;
    
    // Search in title, description, client name, assignee name
    return (
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.client_name && task.client_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.assignee_name && task.assignee_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }).filter(task => {
    // Apply filters
    if (filter.status && task.status !== filter.status) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    if (filter.assigned && task.assigned_to !== filter.assigned) return false;
    if (filter.client && task.client_id !== filter.client) return false;
    
    return true;
  });
  
  const handleViewTask = (task: Task) => {
    navigate(`/employee/tasks/${task.task_id}`);
  };
  
  const handleQuickView = (task: Task) => {
    setSelectedTask(task);
    setShowDetails(true);
  };
  
  const handleStatusChange = async (task: Task, newStatus: string) => {
    if (task.status === newStatus) return;
    
    // In a real app, you would call an API here
    const updatedTask = { ...task, status: newStatus };
    
    try {
      // Optimistic update
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
      
      // Show a toast notification
      toast.success(`Task status updated to ${newStatus}`);
      
      // Close the dialog if open
      if (selectedTask?.task_id === task.task_id) {
        setSelectedTask(updatedTask);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <h3 className="font-semibold text-lg">Error loading tasks</h3>
        <p className="text-sm text-muted-foreground">{error.message || 'An error occurred'}</p>
        <Button variant="ghost" className="mt-2" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }
  
  // Render empty state if no tasks
  if (filteredTasks.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-1">No tasks found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {searchTerm || Object.keys(filter).length > 0 
            ? 'Try adjusting your filters or search term'
            : 'You have no tasks assigned at the moment'}
        </p>
        {(searchTerm || Object.keys(filter).length > 0) && (
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setFilter({});
          }}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Filters and view controls */}
      <div className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:items-center mb-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
          <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Status filter */}
              <DropdownMenuItem onClick={() => setFilter({ ...filter, status: undefined })}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter({ ...filter, status: 'pending' })}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter({ ...filter, status: 'in_progress' })}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter({ ...filter, status: 'completed' })}>
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-1" /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Newest First</DropdownMenuItem>
              <DropdownMenuItem>Oldest First</DropdownMenuItem>
              <DropdownMenuItem>Due Date</DropdownMenuItem>
              <DropdownMenuItem>Priority</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Tabs defaultValue={taskView} onValueChange={(v: string) => setTaskView(v as 'list' | 'card')}>
            <TabsList className="grid w-[120px] grid-cols-2">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Task list or cards */}
      {taskView === 'list' ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="divide-y">
            {filteredTasks.map((task) => (
              <div 
                key={task.task_id}
                className="p-4 hover:bg-muted/40 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-shrink-0">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleStatusChange(task, 'completed');
                        } else {
                          handleStatusChange(task, 'in_progress');
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="font-medium cursor-pointer" onClick={() => handleViewTask(task)}>
                      {task.title}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-1">
                      {task.description}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                      {showClient && task.client_name && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Building className="h-3 w-3 mr-1" />
                          {task.client_name}
                        </div>
                      )}
                      {task.assignee_name && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          {task.assignee_name}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-3">
                    {task.due_date && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(task.due_date), 'MMM d, yyyy')}
                      </div>
                    )}
                    
                    <Progress 
                      value={task.progress} 
                      className="w-20 h-2"
                    />
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewTask(task)}>
                          <FileText className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleQuickView(task)}>
                          <PanelRight className="h-4 w-4 mr-2" /> Quick View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task, 'pending')}>
                          <Circle className="h-4 w-4 mr-2" /> Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task, 'in_progress')}>
                          <Clock className="h-4 w-4 mr-2" /> Mark as In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(task, 'completed')}>
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Completed
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task.task_id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewTask(task)}>
                        <FileText className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleQuickView(task)}>
                        <PanelRight className="h-4 w-4 mr-2" /> Quick View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(task, 'pending')}>
                        <Circle className="h-4 w-4 mr-2" /> Mark as Pending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(task, 'in_progress')}>
                        <Clock className="h-4 w-4 mr-2" /> Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(task, 'completed')}>
                        <CheckCircle2 className="h-4 w-4 mr-2" /> Mark as Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {task.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                </div>
                
                <div className="space-y-3">
                  {showClient && task.client_name && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Building className="h-3.5 w-3.5 mr-1.5" />
                      {task.client_name}
                    </div>
                  )}
                  
                  {task.assignee_name && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3.5 w-3.5 mr-1.5" />
                      {task.assignee_name}
                    </div>
                  )}
                  
                  {task.due_date && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      Due {format(new Date(task.due_date), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
                
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" onClick={() => handleViewTask(task)}>
                  View Task
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Task detail dialog */}
      {selectedTask && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedTask.status)}
                  {getPriorityBadge(selectedTask.priority)}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/employee/tasks/${selectedTask.task_id}`)}>
                    <PanelRight className="mr-1 h-4 w-4" />
                    Full View
                  </Button>
                </div>
              </div>
              <DialogTitle className="text-xl mt-2">{selectedTask.title}</DialogTitle>
              <DialogDescription className="text-base font-normal">
                {selectedTask.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Task Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedTask.client_name && (
                      <div>
                        <h5 className="text-xs text-muted-foreground">Client</h5>
                        <p className="text-sm">{selectedTask.client_name}</p>
                      </div>
                    )}
                    
                    {selectedTask.assignee_name && (
                      <div>
                        <h5 className="text-xs text-muted-foreground">Assigned To</h5>
                        <p className="text-sm">{selectedTask.assignee_name}</p>
                      </div>
                    )}
                    
                    {selectedTask.created_at && (
                      <div>
                        <h5 className="text-xs text-muted-foreground">Created</h5>
                        <p className="text-sm">{format(new Date(selectedTask.created_at), 'MMM d, yyyy')}</p>
                      </div>
                    )}
                    
                    {selectedTask.due_date && (
                      <div>
                        <h5 className="text-xs text-muted-foreground">Due Date</h5>
                        <p className="text-sm">{format(new Date(selectedTask.due_date), 'MMM d, yyyy')}</p>
                      </div>
                    )}
                    
                    {selectedTask.estimated_hours !== undefined && (
                      <div>
                        <h5 className="text-xs text-muted-foreground">Estimated Hours</h5>
                        <p className="text-sm">{selectedTask.estimated_hours}</p>
                      </div>
                    )}
                    
                    {selectedTask.actual_hours !== undefined && (
                      <div>
                        <h5 className="text-xs text-muted-foreground">Actual Hours</h5>
                        <p className="text-sm">{selectedTask.actual_hours}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Progress</h4>
                  <Progress value={selectedTask.progress} />
                  <p className="text-xs text-right mt-1 text-muted-foreground">{selectedTask.progress}% complete</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Comments</h4>
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    <div className="space-y-3">
                      {selectedTask.comments.map((comment: any) => (
                        <div key={comment.id} className="bg-muted p-3 rounded-md">
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-sm">{comment.user_id}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.created_at), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      No comments yet
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleStatusChange(selectedTask, 'pending')}>
                    <Circle className="mr-2 h-4 w-4" />
                    Mark as Pending
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleStatusChange(selectedTask, 'in_progress')}>
                    <Clock className="mr-2 h-4 w-4" />
                    Mark as In Progress
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleStatusChange(selectedTask, 'completed')}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                  <Separator />
                  <Button variant="outline" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Comment
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Task
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
              <Button onClick={() => navigate(`/employee/tasks/${selectedTask.task_id}`)}>
                Full Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TaskList;
