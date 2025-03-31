import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '@/services/api/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertCircle, 
  Clock, 
  Edit2, 
  Eye, 
  Filter, 
  MoreVertical, 
  Plus, 
  Search, 
  Trash2, 
  User, 
  Calendar, 
  CheckCircle, 
  Circle, 
  ArrowUpDown,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DateRangePicker } from '@/components/ui/date-range-picker';

interface Task {
  id?: number;
  task_id: number;
  title: string;
  description: string;
  client_id?: number;
  client_name?: string;
  client?: string;
  assigned_to?: number;
  assignee_name?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  progress: number;
  estimated_hours?: number;
  actual_hours?: number;
  comments?: any[];
}

const TaskList = ({ tasks, isLoading, error, filter, setFilter, showClient }: {
  tasks: Task[];
  isLoading: boolean;
  error: any;
  filter: any;
  setFilter: any;
  showClient: boolean;
}) => {
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTaskData, setEditedTaskData] = useState<Partial<Task>>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState({
    status: 'all',
    priority: 'all',
    dueDate: null,
  });
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleOpenTaskDialog = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleCloseTaskDialog = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setEditedTaskData({ ...task });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditTask(null);
    setEditedTaskData({});
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedTaskData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveEdit = async () => {
    if (!editTask) return;

    try {
      // Await the updateTask function
      await taskService.updateTask(editTask.task_id, editedTaskData);

      toast.success('Task updated successfully');
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      // Await the deleteTask function
      await taskService.deleteTask(taskId);

      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasks = React.useMemo(() => {
    let filtered = tasks || [];

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (taskFilter.status !== 'all') {
      filtered = filtered.filter(task => task.status === taskFilter.status);
    }

    // Apply priority filter
    if (taskFilter.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === taskFilter.priority);
    }

    // Apply due date filter
    if (taskFilter.dueDate) {
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const taskDueDate = new Date(task.due_date);
        return (
          taskDueDate >= taskFilter.dueDate.from &&
          taskDueDate <= taskFilter.dueDate.to
        );
      });
    }

    return filtered;
  }, [tasks, searchQuery, taskFilter]);

  const sortedTasks = React.useMemo(() => {
    if (!filteredTasks) return [];

    const sorted = [...filteredTasks].sort((a, b) => {
      const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
      const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;

      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return sorted;
  }, [filteredTasks, sortOrder]);

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleFilterChange}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter Tasks</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button onClick={() => navigate('/ai/client-requirements')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={isFilterOpen} className="justify-start w-[200px]">
            Filter: {taskFilter.status !== 'all' ? taskFilter.status : 'All'}
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <SelectValue placeholder="Select" />
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </PopoverContent>
      </Popover>

      {sortedTasks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-4 mx-auto" />
            <p className="text-muted-foreground">No tasks found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedTasks.map((task) => (
            <Card key={task.task_id} className="bg-card/50">
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle>{task.title}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditTask(task)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteTask(task.task_id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleOpenTaskDialog(task)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {showClient && task.client_name && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{task.client_name}</p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{task.assignee_name || 'Unassigned'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {task.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : task.status === 'pending' ? (
                    <Circle className="h-4 w-4 text-gray-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <Badge variant="secondary">{task.status}</Badge>
                </div>
                <Progress value={task.progress} className="h-2" />
                <p className="text-sm text-muted-foreground">Progress: {task.progress}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                defaultValue={editTask?.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editTask?.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveEdit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-muted-foreground">{selectedTask?.description}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Assignee</h4>
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium">{selectedTask?.assignee_name || 'Unassigned'}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Due Date</h4>
                <p className="text-muted-foreground">
                  {selectedTask?.due_date ? format(new Date(selectedTask.due_date), 'MMM dd, yyyy') : 'No due date'}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Status</h4>
                <Badge variant="secondary">{selectedTask?.status}</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Comments</h4>
                {selectedTask?.comments && selectedTask.comments.length > 0 ? (
                  selectedTask.comments.map((comment: any) => (
                    <div key={comment.id} className="space-y-1">
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{comment.user_name}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(comment.created_at), 'MMM dd, yyyy hh:mm a')}</p>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No comments yet.</p>
                )}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button type="button" onClick={handleCloseTaskDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
