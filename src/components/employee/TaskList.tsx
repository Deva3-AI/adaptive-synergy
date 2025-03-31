
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, 
  Filter, 
  ChevronDown, 
  Check, 
  Calendar, 
  User, 
  Building,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task } from '@/interfaces/tasks';
import { cn } from '@/lib/utils';

const priorityColors = {
  high: 'text-rose-500 bg-rose-100',
  medium: 'text-amber-500 bg-amber-100',
  low: 'text-emerald-500 bg-emerald-100'
};

const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in_progress':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: Error | null;
  filter?: any;
  setFilter?: any;
  showAssignee?: boolean;
  showClient?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  error,
  filter,
  setFilter,
  showAssignee = false,
  showClient = false,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (setFilter) {
      if (value === 'all') {
        setFilter({ ...filter, status: [] });
      } else {
        setFilter({ ...filter, status: [value] });
      }
    }
  };

  const handlePriorityFilter = (priority: string) => {
    if (setFilter) {
      const currentPriorities = [...(filter.priority || [])];
      if (currentPriorities.includes(priority)) {
        setFilter({
          ...filter,
          priority: currentPriorities.filter((p) => p !== priority),
        });
      } else {
        setFilter({
          ...filter,
          priority: [...currentPriorities, priority],
        });
      }
    }
  };

  const handleClientFilter = (client: string) => {
    if (setFilter) {
      const currentClients = [...(filter.client || [])];
      if (currentClients.includes(client)) {
        setFilter({
          ...filter,
          client: currentClients.filter((c) => c !== client),
        });
      } else {
        setFilter({
          ...filter,
          client: [...currentClients, client],
        });
      }
    }
  };

  const handleAssigneeFilter = (assignee: string) => {
    if (setFilter) {
      const currentAssignees = [...(filter.assigned || [])];
      if (currentAssignees.includes(assignee)) {
        setFilter({
          ...filter,
          assigned: currentAssignees.filter((a) => a !== assignee),
        });
      } else {
        setFilter({
          ...filter,
          assigned: [...currentAssignees, assignee],
        });
      }
    }
  };

  const handleDateFilter = (date: any) => {
    if (setFilter) {
      setFilter({
        ...filter,
        dueDate: date,
      });
    }
  };

  const uniqueClients = Array.from(
    new Set(tasks.map((task) => task.client_name || task.client))
  ).filter(Boolean) as string[];

  const uniqueAssignees = Array.from(
    new Set(tasks.map((task) => task.assignee_name))
  ).filter(Boolean) as string[];

  // Task count by status
  const pendingCount = tasks.filter((task) => task.status === 'pending').length;
  const inProgressCount = tasks.filter((task) => task.status === 'in_progress').length;
  const completedCount = tasks.filter((task) => task.status === 'completed').length;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium">Error loading tasks</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {error.message || 'Please try again later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs md:text-sm">
              All ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs md:text-sm">
              Pending ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs md:text-sm">
              In Progress ({inProgressCount})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs md:text-sm">
              Completed ({completedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {setFilter && (
          <div className="flex gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  Priority
                  <ChevronDown className="h-3.5 w-3.5 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={filter.priority?.includes('high')}
                  onCheckedChange={() => handlePriorityFilter('high')}
                >
                  High
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filter.priority?.includes('medium')}
                  onCheckedChange={() => handlePriorityFilter('medium')}
                >
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filter.priority?.includes('low')}
                  onCheckedChange={() => handlePriorityFilter('low')}
                >
                  Low
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {showClient && uniqueClients.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Building className="h-3.5 w-3.5 mr-2" />
                    Client
                    <ChevronDown className="h-3.5 w-3.5 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Client</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueClients.map((client) => (
                    <DropdownMenuCheckboxItem
                      key={client}
                      checked={filter.client?.includes(client)}
                      onCheckedChange={() => handleClientFilter(client)}
                    >
                      {client}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {showAssignee && uniqueAssignees.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <User className="h-3.5 w-3.5 mr-2" />
                    Assignee
                    <ChevronDown className="h-3.5 w-3.5 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {uniqueAssignees.map((assignee) => (
                    <DropdownMenuCheckboxItem
                      key={assignee}
                      checked={filter.assigned?.includes(assignee)}
                      onCheckedChange={() => handleAssigneeFilter(assignee)}
                    >
                      {assignee}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Calendar className="h-3.5 w-3.5 mr-2" />
                  Due Date
                  <ChevronDown className="h-3.5 w-3.5 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={new Date()}
                  selected={{
                    from: filter.dueDate?.[0] || undefined,
                    to: filter.dueDate?.[1] || undefined,
                  }}
                  onSelect={handleDateFilter}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))
          : tasks.map((task) => (
              <Card
                key={task.task_id || task.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/employee/tasks/${task.task_id || task.id}`)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base line-clamp-2">{task.title}</CardTitle>
                    <Badge
                      className={cn(
                        'text-xs',
                        priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100'
                      )}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    {showClient && (task.client_name || task.client) && (
                      <div className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[100px]">
                          {task.client_name || task.client}
                        </span>
                      </div>
                    )}
                    
                    {showAssignee && task.assignee_name && (
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[100px]">{task.assignee_name}</span>
                      </div>
                    )}
                    
                    {task.estimated_time && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{task.estimated_time} hrs</span>
                      </div>
                    )}
                    
                    {task.due_date && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{format(new Date(task.due_date), 'MMM d')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span>Progress</span>
                      <span>{task.progress}%</span>
                    </div>
                    <Progress
                      value={task.progress}
                      className="h-1.5"
                      indicatorClassName={cn({
                        'bg-emerald-500': task.progress >= 80,
                        'bg-amber-500': task.progress >= 40 && task.progress < 80,
                        'bg-rose-500': task.progress < 40,
                      })}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Badge
                      variant="secondary"
                      className={cn('text-[10px] h-5 font-normal bg-opacity-50', {
                        'bg-yellow-100 text-yellow-700': task.status === 'pending',
                        'bg-blue-100 text-blue-700': task.status === 'in_progress',
                        'bg-green-100 text-green-700': task.status === 'completed',
                        'bg-red-100 text-red-700': task.status === 'cancelled',
                      })}
                    >
                      {task.status === 'in_progress'
                        ? 'In Progress'
                        : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/employee/tasks/${task.task_id || task.id}`, '_blank');
                      }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {tasks.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-64">
          <Check className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {filter && Object.values(filter).some((v: any) => v?.length > 0)
              ? 'Try changing your filters to see more tasks.'
              : 'You have no tasks at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
