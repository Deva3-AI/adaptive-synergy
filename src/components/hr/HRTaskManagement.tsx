
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from 'sonner';
import { Calendar, CheckCircle2, ClipboardList, PlusCircle } from "lucide-react";
import { HRTask } from '@/interfaces/hr';
import { format } from 'date-fns';

// Mock data for HR tasks
const MOCK_HR_TASKS: HRTask[] = [
  {
    id: 1,
    title: "Review Jane Smith's performance evaluation",
    description: "Complete the quarterly performance review for Jane Smith in the design department.",
    assigned_to: 1,
    assigned_to_name: "HR Manager",
    due_date: "2023-04-15",
    estimated_time: 1.5,
    priority: "high",
    status: "in_progress",
    related_to: {
      type: "employee",
      id: 5,
      name: "Jane Smith"
    }
  },
  {
    id: 2,
    title: "Process payroll for March",
    description: "Generate and send payslips for all employees for the month of March.",
    assigned_to: 2,
    assigned_to_name: "HR Assistant",
    due_date: "2023-04-05",
    estimated_time: 3,
    priority: "high",
    status: "completed",
    completed_at: "2023-04-03"
  },
  {
    id: 3,
    title: "Schedule interview with John Doe",
    description: "Coordinate with the team lead to schedule a technical interview with John Doe for the developer position.",
    assigned_to: 1,
    assigned_to_name: "HR Manager",
    due_date: "2023-04-10",
    estimated_time: 0.5,
    priority: "medium",
    status: "pending",
    related_to: {
      type: "candidate",
      id: 12,
      name: "John Doe"
    }
  },
  {
    id: 4,
    title: "Update employee handbook",
    description: "Update the company policy section in the employee handbook with the new remote work policy.",
    assigned_to: 2,
    assigned_to_name: "HR Assistant",
    due_date: "2023-04-20",
    estimated_time: 4,
    priority: "medium",
    status: "pending"
  },
  {
    id: 5,
    title: "Follow up on pending leave requests",
    description: "Review and approve pending leave requests for the next month.",
    assigned_to: 1,
    assigned_to_name: "HR Manager",
    due_date: "2023-04-08",
    estimated_time: 1,
    priority: "low",
    status: "in_progress"
  }
];

interface HRTaskManagementProps {
  filterByStatus?: string;
}

const HRTaskManagement: React.FC<HRTaskManagementProps> = ({ filterByStatus }) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<HRTask>>({
    title: '',
    description: '',
    assigned_to: 1,
    due_date: format(new Date(), 'yyyy-MM-dd'),
    estimated_time: 1,
    priority: 'medium',
    status: 'pending'
  });
  
  // Fetch HR tasks (mock for now)
  const { data: tasks, isLoading, refetch } = useQuery({
    queryKey: ['hr-tasks', showCompleted],
    queryFn: () => {
      // This would normally call an API
      return new Promise<HRTask[]>((resolve) => {
        setTimeout(() => {
          if (showCompleted) {
            resolve(MOCK_HR_TASKS);
          } else {
            resolve(MOCK_HR_TASKS.filter(task => task.status !== 'completed'));
          }
        }, 500);
      });
    }
  });
  
  // Filter tasks by status if specified
  const filteredTasks = filterByStatus 
    ? tasks?.filter(task => task.status === filterByStatus)
    : tasks;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddTask = () => {
    // This would normally call an API
    const newTaskWithId: HRTask = {
      ...newTask as HRTask,
      id: (MOCK_HR_TASKS.length + 1),
      assigned_to_name: 'HR Manager',
      due_date: newTask.due_date || format(new Date(), 'yyyy-MM-dd'),
    };
    
    MOCK_HR_TASKS.push(newTaskWithId);
    setIsAddTaskDialogOpen(false);
    refetch();
    toast.success('Task added successfully');
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      assigned_to: 1,
      due_date: format(new Date(), 'yyyy-MM-dd'),
      estimated_time: 1,
      priority: 'medium',
      status: 'pending'
    });
  };
  
  const handleMarkAsCompleted = (taskId: number) => {
    // Update task status (this would normally be an API call)
    const taskIndex = MOCK_HR_TASKS.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
      MOCK_HR_TASKS[taskIndex].status = 'completed';
      MOCK_HR_TASKS[taskIndex].completed_at = new Date().toISOString();
      refetch();
      toast.success('Task marked as completed');
    }
  };
  
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>HR Tasks</CardTitle>
          <CardDescription>Manage HR-related tasks and activities</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </Button>
          <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New HR Task</DialogTitle>
                <DialogDescription>
                  Create a new task for the HR department
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title">Task Title</label>
                  <Input
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="priority">Priority</label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => handleSelectChange('priority', value)}
                    >
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
                    <label htmlFor="assignedTo">Assigned To</label>
                    <Select
                      value={newTask.assigned_to?.toString()}
                      onValueChange={(value) => 
                        handleSelectChange('assigned_to', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">HR Manager</SelectItem>
                        <SelectItem value="2">HR Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="dueDate">Due Date</label>
                    <Input
                      id="due_date"
                      name="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="estimatedTime">Estimated Hours</label>
                    <Input
                      id="estimated_time"
                      name="estimated_time"
                      type="number"
                      min="0.5"
                      step="0.5"
                      value={newTask.estimated_time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsAddTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddTask}>
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : filteredTasks && filteredTasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div>{task.title}</div>
                    {task.related_to && (
                      <div className="text-xs text-muted-foreground">
                        Related to: {task.related_to.name} ({task.related_to.type})
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{task.assigned_to_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {format(new Date(task.due_date), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Est. {task.estimated_time} {task.estimated_time === 1 ? 'hour' : 'hours'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                    {task.completed_at && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Completed on {format(new Date(task.completed_at), 'MMM dd')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {task.status !== 'completed' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleMarkAsCompleted(task.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <ClipboardList className="h-12 w-12 mb-4 opacity-50" />
            <p>No tasks found</p>
            <p className="text-sm">Create a new task to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HRTaskManagement;
