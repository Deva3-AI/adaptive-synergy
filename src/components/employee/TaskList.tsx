
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, ExternalLink } from "lucide-react";
import { Link } from 'react-router-dom';
import taskService from '@/services/api/taskService';

interface TaskListProps {
  employeeId?: number;
  limit?: number;
  showViewAll?: boolean;
  client_id?: number;
  status?: string;
}

const TaskList = ({ employeeId, limit = 5, showViewAll = true, client_id, status }: TaskListProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: tasks, isLoading, error, refetch } = useQuery({
    queryKey: ['employee-tasks', employeeId, activeTab, client_id],
    queryFn: () => {
      const queryParams: {
        status?: string;
        assigned_to?: number;
        client_id?: number;
      } = {};
      
      if (activeTab !== 'all') {
        queryParams.status = activeTab;
      } else if (status) {
        queryParams.status = status;
      }
      
      if (employeeId) {
        queryParams.assigned_to = employeeId;
      }
      
      if (client_id) {
        queryParams.client_id = client_id;
      }
      
      return taskService.getTasks(queryParams);
    }
  });
  
  // Effect to refetch data when active tab changes
  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);
  
  // Function to get badge color based on task status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'warning';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };
  
  // Function to get badge color based on task priority
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            Error loading tasks. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">To Do</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="pt-2">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            ) : !tasks || tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No tasks found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.slice(0, limit).map((task) => (
                    <TableRow key={task.id || task.task_id}>
                      <TableCell className="font-medium">
                        {task.title}
                      </TableCell>
                      <TableCell>{task.client_name || task.client}</TableCell>
                      <TableCell>
                        {task.due_date || task.dueDate 
                          ? format(new Date(task.due_date || task.dueDate), 'MMM dd, yyyy') 
                          : 'Not set'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(task.priority || 'medium')}>
                          {task.priority || 'Medium'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(task.status)}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link to={`/tasks/${task.id || task.task_id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            
            {showViewAll && tasks && tasks.length > limit && (
              <div className="mt-4 text-center">
                <Link to={employeeId ? `/employee/${employeeId}/tasks` : '/tasks'}>
                  <Button variant="outline" size="sm">
                    View All Tasks
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskList;
