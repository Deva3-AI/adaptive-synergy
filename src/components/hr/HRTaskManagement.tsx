import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Plus, Calendar, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { HRTask } from '@/interfaces/hr';
import hrServiceSupabase from '@/services/api/hrServiceSupabase';

const HRTaskManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Fetch HR tasks
  const { data: hrTasks, isLoading } = useQuery({
    queryKey: ['hr-tasks'],
    queryFn: async () => {
      try {
        return await hrServiceSupabase.getHRTasks();
      } catch (error) {
        console.error('Error fetching HR tasks:', error);
        return [] as HRTask[];
      }
    },
  });
  
  // Fetch HR trends data
  const { data: hrTrends } = useQuery({
    queryKey: ['hr-trends'],
    queryFn: async () => {
      try {
        return await hrServiceSupabase.getHRTrends();
      } catch (error) {
        console.error('Error fetching HR trends:', error);
        return {
          hiring_trends: [],
          retention_rates: [],
          employee_satisfaction: []
        };
      }
    },
  });
  
  // Mutation to complete a task
  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      return await hrServiceSupabase.completeHRTask(taskId);
    },
    onSuccess: () => {
      toast.success('Task marked as completed');
      queryClient.invalidateQueries({ queryKey: ['hr-tasks'] });
    },
    onError: (error) => {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    },
  });
  
  const handleCompleteTask = (taskId: number) => {
    completeTaskMutation.mutate(taskId);
  };
  
  // Filter tasks based on active tab
  const getFilteredTasks = () => {
    if (!hrTasks) return [];
    
    switch (activeTab) {
      case 'pending':
        return hrTasks.filter(task => task.status === 'pending');
      case 'in-progress':
        return hrTasks.filter(task => task.status === 'in-progress');
      case 'completed':
        return hrTasks.filter(task => task.status === 'completed');
      default:
        return hrTasks;
    }
  };
  
  // Get badge variant based on priority
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };
  
  // Get category display name
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'recruitment':
        return 'Recruitment';
      case 'employee':
        return 'Employee Management';
      case 'payroll':
        return 'Payroll';
      case 'general':
        return 'General';
      default:
        return category;
    }
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">HR Tasks</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No {activeTab !== 'all' ? activeTab : ''} tasks found.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <Badge variant={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline">{getCategoryName(task.category)}</Badge>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          {format(new Date(task.due_date), 'MMM d, yyyy')}
                        </div>
                        {task.assigned_name && (
                          <div className="text-muted-foreground">
                            Assigned to: {task.assigned_name}
                          </div>
                        )}
                      </div>
                      
                      {task.status !== 'completed' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => handleCompleteTask(task.id)}
                          disabled={completeTaskMutation.isPending}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* New Task Dialog - You would implement the form here */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New HR Task</DialogTitle>
            <DialogDescription>
              Add a new HR task to your list.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* Task creation form would go here */}
            <p className="text-center text-muted-foreground">Task creation form will be implemented here.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRTaskManagement;
