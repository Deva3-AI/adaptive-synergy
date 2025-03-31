
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Search, 
  ArrowUpDown, 
  CheckCircle, 
  XCircle,
  PauseCircle,
  Clock8,
  Briefcase
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Task } from '@/interfaces/tasks';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: any;
}

// Status icon mapping
const statusIconMap: Record<string, React.ReactNode> = {
  "completed": <CheckCircle className="h-5 w-5 text-green-500" />,
  "in_progress": <Clock8 className="h-5 w-5 text-blue-500" />,
  "pending": <Clock className="h-5 w-5 text-gray-500" />,
  "on_hold": <PauseCircle className="h-5 w-5 text-yellow-500" />,
  "cancelled": <XCircle className="h-5 w-5 text-red-500" />,
};

// Priority color mapping
const priorityColorMap: Record<string, string> = {
  "high": "destructive",
  "medium": "warning",
  "low": "secondary",
};

const TaskList: React.FC<TaskListProps> = ({ tasks, isLoading, error }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  // Filter tasks based on search term and filters
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (task.client_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setSearchTerm("");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date set";
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    } else {
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          Error loading tasks. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4 mr-1" />
            Status
            {statusFilter && <Badge variant="secondary" className="ml-1">{statusFilter}</Badge>}
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            Priority
            {priorityFilter && (
              <Badge 
                variant={priorityFilter ? (priorityColorMap[priorityFilter] as any) : "secondary"} 
                className="ml-1"
              >
                {priorityFilter}
              </Badge>
            )}
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Calendar className="h-4 w-4 mr-1" />
            Date
          </Button>
          
          {(statusFilter || priorityFilter || searchTerm) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
        </div>
      </div>
      
      <div className="rounded-md border">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <div className="flex items-center h-4">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  </div>
                </TableHead>
                <TableHead>Task & Client</TableHead>
                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                <TableHead className="hidden md:table-cell">Priority</TableHead>
                <TableHead className="hidden lg:table-cell">Status</TableHead>
                <TableHead className="hidden xl:table-cell">Progress</TableHead>
                <TableHead className="text-right">Time Est.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks && filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TableRow key={task.task_id} className="group cursor-pointer hover:bg-muted/50">
                    <TableCell className="p-2 md:p-4">
                      <div className="flex items-center h-4">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </div>
                    </TableCell>
                    <TableCell className="p-2 md:p-4">
                      <Link to={`/employee/tasks/${task.task_id}`} className="block group-hover:underline">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {task.client_name || 'Unknown Client'}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="p-2 md:p-4 hidden md:table-cell">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(task.due_date)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 md:p-4 hidden md:table-cell">
                      <Badge variant={priorityColorMap[task.priority || 'medium'] as any}>
                        {task.priority || 'Medium'}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 md:p-4 hidden lg:table-cell">
                      <div className="flex items-center">
                        {statusIconMap[task.status] || statusIconMap["pending"]}
                        <span className="ml-2">{task.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 md:p-4 hidden xl:table-cell">
                      <div className="w-full max-w-24 space-y-1">
                        <Progress value={0} className="h-2" />
                        <div className="text-xs text-right text-muted-foreground">
                          0%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 md:p-4 text-right">
                      <div className="flex items-center justify-end">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{task.estimated_time || 0}h</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {isLoading ? 'Loading tasks...' : 'No tasks found. Try a different search term.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredTasks?.length || 0}</span> of{" "}
          <span className="font-medium">{tasks?.length || 0}</span> tasks
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
