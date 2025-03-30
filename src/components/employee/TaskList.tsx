
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { taskService } from '@/services/api';

const TaskList = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['employee-tasks'],
    queryFn: () => taskService.getTasks(),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks found</p>
              </div>
            ) : (
              tasks.map((task: any) => (
                <div key={task.task_id} className="border rounded-lg p-3 hover:bg-slate-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </span>
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {/* Similar structure as "all" tab but filtered for pending tasks */}
            <div className="text-center py-8 text-muted-foreground">
              <p>Filter implemented in full component</p>
            </div>
          </TabsContent>
          
          <TabsContent value="in_progress" className="space-y-4">
            {/* Similar structure as "all" tab but filtered for in-progress tasks */}
            <div className="text-center py-8 text-muted-foreground">
              <p>Filter implemented in full component</p>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {/* Similar structure as "all" tab but filtered for completed tasks */}
            <div className="text-center py-8 text-muted-foreground">
              <p>Filter implemented in full component</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskList;
