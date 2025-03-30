
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, CheckCircle, AlertCircle, XCircle, MessageSquare, ChevronRight, FolderOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import taskService from '@/services/api/taskService';

interface TaskListProps {
  clientId?: number;
  userId?: number;
  limit?: number;
  showClient?: boolean;
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  clientId,
  userId,
  limit = 5,
  showClient = true,
  className
}) => {
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', clientId, userId],
    queryFn: () => taskService.getTasks({ clientId, assignedTo: userId }),
  });

  const toggleTaskExpansion = (taskId: number) => {
    setExpandedTaskId(prevId => (prevId === taskId ? null : taskId));
  };

  const limitedTasks = tasks?.slice(0, limit);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {clientId ? 'Client Tasks' : userId ? 'Assigned Tasks' : 'All Tasks'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-3 w-[60%]" />
                <Skeleton className="h-2 w-[40%]" />
              </div>
            ))}
          </div>
        ) : limitedTasks && limitedTasks.length > 0 ? (
          <ul className="divide-y divide-border">
            {limitedTasks.map(task => (
              <li key={task.task_id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link to={`/employee/tasks/${task.task_id}`} className="font-medium hover:underline">
                        {task.title}
                      </Link>
                      {task.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {showClient && task.clients && (
                      <div className="text-sm text-muted-foreground mt-1">
                        <FolderOpen className="h-3 w-3 inline-block mr-1 align-text-bottom" />
                        {task.clients.client_name || 'Unknown Client'}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 inline-block mr-1 align-text-bottom" />
                      Due: {new Date(task.end_time).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toggleTaskExpansion(task.task_id)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {expandedTaskId === task.task_id && (
                  <div className="mt-3 space-y-2">
                    <Separator />
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="secondary">{task.status}</Badge>
                      <Link to={`/employee/tasks/${task.task_id}`} className="text-sm hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No tasks found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;
