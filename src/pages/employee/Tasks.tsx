
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Search, 
  Check, 
  Clock, 
  Filter, 
  Calendar, 
  ArrowUpDown, 
  CheckCircle, 
  XCircle,
  PauseCircle,
  Clock8
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const priorityColorMap: Record<string, string> = {
  "High": "destructive",
  "Medium": "warning",
  "Low": "secondary",
};

const statusIconMap: Record<string, React.ReactNode> = {
  "completed": <CheckCircle className="h-5 w-5 text-green-500" />,
  "in_progress": <Clock8 className="h-5 w-5 text-blue-500" />,
  "pending": <Clock className="h-5 w-5 text-gray-500" />,
  "on_hold": <PauseCircle className="h-5 w-5 text-yellow-500" />,
  "cancelled": <XCircle className="h-5 w-5 text-red-500" />,
};

const EmployeeTasks = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  // Fetch tasks from Supabase
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['employee-tasks', user?.id],
    enabled: !!user,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            clients (client_name)
          `)
          .eq('assigned_to', user?.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform data to match our component's expectations
        return data.map(task => ({
          id: task.task_id,
          title: task.title,
          client: task.clients?.client_name || 'Unknown Client',
          dueDate: task.end_time ? new Date(task.end_time) : new Date(),
          priority: task.priority || 'Medium', // This would require adding a priority field
          status: task.status,
          progress: task.progress || 0, // This would require adding a progress field
          estimatedHours: task.estimated_time || 0,
          assignedBy: "System" // This would require adding an assigned_by field
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
      }
    }
  });

  // Filter tasks based on search term and filters
  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setSearchTerm("");
  };

  const formatDate = (date: Date) => {
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

  return (
    <div className="space-y-6 animate-blur-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">
          View and manage all your assigned tasks
        </p>
      </div>
      
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
          
          <Button className="ml-2 hidden sm:flex">
            <Check className="h-4 w-4 mr-2" />
            Mark Selected
          </Button>
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
                  <TableRow key={task.id} className="group cursor-pointer hover:bg-muted/50">
                    <TableCell className="p-2 md:p-4">
                      <div className="flex items-center h-4">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </div>
                    </TableCell>
                    <TableCell className="p-2 md:p-4">
                      <Link to={`/employee/tasks/${task.id}`} className="block group-hover:underline">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {task.client}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="p-2 md:p-4 hidden md:table-cell">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(task.dueDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 md:p-4 hidden md:table-cell">
                      <Badge variant={priorityColorMap[task.priority] as any}>
                        {task.priority}
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
                        <Progress value={task.progress} className="h-2" />
                        <div className="text-xs text-right text-muted-foreground">
                          {task.progress}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 md:p-4 text-right">
                      <div className="flex items-center justify-end">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{task.estimatedHours}h</span>
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

export default EmployeeTasks;
