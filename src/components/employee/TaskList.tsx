
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ListFilter, Search, Clock, CheckCircle2, Plus, AlertCircle } from 'lucide-react';
import { taskService } from '@/services/api';

interface TaskListProps {
  userId?: number;
  clientId?: number;
  limit?: number;
  showSearch?: boolean;
  showFilters?: boolean;
  showCreateButton?: boolean;
  onTaskSelected?: (taskId: number) => void;
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  userId,
  clientId,
  limit,
  showSearch = true,
  showFilters = true,
  showCreateButton = true,
  onTaskSelected,
  className
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', userId, clientId, statusFilter],
    queryFn: async () => {
      const filters: { assignedTo?: number; clientId?: number; status?: string } = {};
      
      if (userId) filters.assignedTo = userId;
      if (clientId) filters.clientId = clientId;
      if (statusFilter !== 'all') filters.status = statusFilter;
      
      return await taskService.getTasks(filters);
    }
  });

  // Filter tasks by search term
  const filteredTasks = tasks
    .filter(task => {
      if (!searchTerm) return true;
      
      const term = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term)) ||
        (task.clients?.client_name && task.clients.client_name.toLowerCase().includes(term))
      );
    })
    .slice(0, limit || undefined);

  // Status badge variants
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Handle task click
  const handleTaskClick = (taskId: number) => {
    if (onTaskSelected) {
      onTaskSelected(taskId);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 border rounded-md">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-red-500">
            <AlertCircle className="mr-2" />
            <p>Error loading tasks. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Tasks</CardTitle>
        {showCreateButton && (
          <Button size="sm" asChild>
            <Link to="/employee/tasks/new">
              <Plus className="h-4 w-4 mr-1" />
              New Task
            </Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="flex flex-col sm:flex-row gap-3">
            {showSearch && (
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            
            {showFilters && (
              <div className="flex items-center gap-2">
                <ListFilter className="h-4 w-4 text-muted-foreground" />
                <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList className="h-9">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="pending" className="text-xs">Pending</TabsTrigger>
                    <TabsTrigger value="in_progress" className="text-xs">In Progress</TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </div>
        )}

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No tasks found</p>
            {searchTerm && (
              <p className="text-sm mt-1">Try a different search term</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div
                key={task.task_id}
                className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleTaskClick(task.task_id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <h3 className="font-medium">{task.title}</h3>
                  {getStatusBadge(task.status)}
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                )}
                
                <div className="flex flex-wrap justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{task.estimated_time || 0}h est.</span>
                    {task.clients?.client_name && (
                      <span className="ml-3">Client: {task.clients.client_name}</span>
                    )}
                  </div>
                  <span>{formatDate(task.created_at)}</span>
                </div>
                
                <div className="mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full" 
                    asChild
                  >
                    <Link to={`/employee/tasks/${task.task_id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Show more button */}
        {limit && tasks.length > limit && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/employee/tasks">
              View All Tasks
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
