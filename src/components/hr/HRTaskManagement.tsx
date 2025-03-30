
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  ArrowUpRight,
  FileText
} from "lucide-react";
import { format } from 'date-fns';
import { HRTask } from "@/interfaces/hr";
import { getInitials } from "@/lib/utils";

const HRTaskManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Fetch HR tasks from API
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['hr-tasks'],
    queryFn: () => {
      // This would normally call an API
      return new Promise<HRTask[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              title: "Review resume for Senior Developer position",
              description: "Analyze skills, experience, and fit for the role",
              assigned_to: 2,
              assigned_to_name: "Emily Johnson",
              due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
              estimated_time: 1.5,
              priority: "high",
              status: "pending",
              related_to: {
                type: "candidate",
                id: 101,
                name: "Jacob Wilson"
              }
            },
            {
              id: 2,
              title: "Schedule interview with Marketing Manager candidate",
              description: "Coordinate with the marketing team for availability",
              assigned_to: 2,
              assigned_to_name: "Emily Johnson",
              due_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
              estimated_time: 0.5,
              priority: "medium",
              status: "in_progress",
              related_to: {
                type: "candidate",
                id: 102,
                name: "Sophia Martinez"
              }
            },
            {
              id: 3,
              title: "Generate monthly payroll reports",
              description: "Create and distribute payroll reports for all departments",
              assigned_to: 3,
              assigned_to_name: "Michael Brown",
              due_date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
              estimated_time: 3,
              priority: "high",
              status: "pending",
              related_to: {
                type: "payroll",
                id: 201,
                name: "March 2025 Payroll"
              }
            },
            {
              id: 4,
              title: "Conduct performance review for Design team",
              description: "Quarterly performance evaluation for the design department",
              assigned_to: 1,
              assigned_to_name: "Jessica Smith",
              due_date: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
              estimated_time: 4,
              priority: "medium",
              status: "pending",
              related_to: {
                type: "employee",
                id: 301,
                name: "Design Department"
              }
            },
            {
              id: 5,
              title: "Update employee handbook",
              description: "Revise policies and procedures in the employee handbook",
              assigned_to: 3,
              assigned_to_name: "Michael Brown",
              due_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday (overdue)
              estimated_time: 5,
              priority: "low",
              status: "in_progress"
            },
            {
              id: 6,
              title: "Finalize onboarding process for new hires",
              description: "Complete documentation and checklist for onboarding",
              assigned_to: 1,
              assigned_to_name: "Jessica Smith",
              due_date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago (overdue)
              estimated_time: 2,
              priority: "high",
              status: "completed",
              completed_at: new Date(Date.now() - 86400000).toISOString()
            }
          ]);
        }, 800);
      });
    }
  });

  // Calculate task statistics
  const taskStats = React.useMemo(() => {
    if (!tasks) return { total: 0, completed: 0, pending: 0, inProgress: 0, overdue: 0 };
    
    const now = new Date();
    
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      pending: tasks.filter(task => task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'in_progress').length,
      overdue: tasks.filter(task => {
        const dueDate = new Date(task.due_date);
        return task.status !== 'completed' && dueDate < now;
      }).length
    };
  }, [tasks]);
  
  // Filter tasks based on selected filter
  const filteredTasks = React.useMemo(() => {
    if (!tasks) return [];
    
    const now = new Date();
    
    switch (activeFilter) {
      case 'pending':
        return tasks.filter(task => task.status === 'pending');
      case 'in_progress':
        return tasks.filter(task => task.status === 'in_progress');
      case 'completed':
        return tasks.filter(task => task.status === 'completed');
      case 'overdue':
        return tasks.filter(task => {
          const dueDate = new Date(task.due_date);
          return task.status !== 'completed' && dueDate < now;
        });
      case 'high_priority':
        return tasks.filter(task => task.priority === 'high');
      default:
        return tasks;
    }
  }, [tasks, activeFilter]);
  
  // Get badge color for task status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  
  // Get badge color for task priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  
  // Calculate if a task is overdue
  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };
  
  return (
    <div className="space-y-4">
      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{taskStats.total}</div>
            <Progress
              value={(taskStats.completed / taskStats.total) * 100}
              className="h-1 mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((taskStats.completed / taskStats.total) * 100)}% completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {taskStats.pending}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {taskStats.pending > 2 ? "Needs attention" : "On track"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {taskStats.inProgress}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Currently being worked on
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">
              {taskStats.completed}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Successfully finished
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-destructive">
              {taskStats.overdue}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Past due date
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filter and Add Task Button */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeFilter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === 'pending' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={activeFilter === 'in_progress' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('in_progress')}
          >
            In Progress
          </Button>
          <Button 
            variant={activeFilter === 'completed' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </Button>
          <Button 
            variant={activeFilter === 'overdue' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('overdue')}
          >
            Overdue
          </Button>
          <Button 
            variant={activeFilter === 'high_priority' ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter('high_priority')}
          >
            High Priority
          </Button>
        </div>
        
        <Button className="sm:self-end">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      {/* Tasks List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg">No tasks found</h3>
              <p className="text-muted-foreground mt-1">
                {activeFilter === 'all' 
                  ? "There are no HR tasks. Create one to get started." 
                  : `No ${activeFilter.replace('_', ' ')} tasks found.`}
              </p>
              <Button variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <Card key={task.id} className={isOverdue(task.due_date) && task.status !== 'completed' ? 'border-destructive' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border">
                    <AvatarFallback>{getInitials(task.assigned_to_name || '')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{task.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant={getPriorityColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                        <Badge variant={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {task.estimated_time} {task.estimated_time === 1 ? 'hour' : 'hours'}
                      </div>
                      
                      <div className={`flex items-center ${isOverdue(task.due_date) && task.status !== 'completed' ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Due {format(new Date(task.due_date), 'MMM dd, yyyy')}
                        {isOverdue(task.due_date) && task.status !== 'completed' && (
                          <AlertCircle className="h-3.5 w-3.5 ml-1" />
                        )}
                      </div>
                      
                      {task.related_to && (
                        <div className="flex items-center text-muted-foreground">
                          <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                          {task.related_to.type.charAt(0).toUpperCase() + task.related_to.type.slice(1)}: {task.related_to.name}
                        </div>
                      )}
                      
                      {task.status === 'completed' && task.completed_at && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Completed {format(new Date(task.completed_at), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {task.status !== 'completed' && (
                      <Button variant="outline" size="sm">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* AI-Generated Suggestions */}
      <Card className="border-blue-200 bg-blue-50/40 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <AlertCircle className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Hiring Process Bottleneck:</span> Resume reviews are taking 3 days on average. Consider using AI pre-screening to cut review time by 40%.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Task Optimization:</span> Similar payroll tasks are scheduled each month. Create a standardized template to reduce setup time by 25%.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-1.5">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">Workload Distribution:</span> HR team workload is uneven with 60% of tasks assigned to Emily. Consider redistributing for better efficiency.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRTaskManagement;
