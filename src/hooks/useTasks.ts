
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, DetailedTask, TaskFilter } from '@/interfaces/tasks';
import taskService from '@/services/api/taskService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const useTasks = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<TaskFilter>({});
  
  // Fetch tasks with filtering
  const { 
    data: tasks, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: async () => {
      try {
        return await taskService.getTasks(filter);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        throw new Error('Failed to fetch tasks. Please try again.');
      }
    },
  });
  
  // Get task by ID
  const getTaskById = async (taskId: number): Promise<DetailedTask | null> => {
    try {
      const task = await taskService.getTaskById(taskId);
      return {
        id: task.task_id,
        title: task.title,
        description: task.description,
        client: task.client_name || 'Unknown Client',
        priority: task.priority || 'medium',
        status: task.status,
        dueDate: task.due_date ? new Date(task.due_date) : new Date(),
        estimatedHours: task.estimated_time || 0,
        actualHours: task.actual_time || 0,
        assignedTo: task.assignee_name || 'Unassigned'
      };
    } catch (err) {
      console.error('Error fetching task details:', err);
      toast.error('Failed to load task details');
      return null;
    }
  };
  
  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: string }) => 
      taskService.updateTask(taskId, { status: status as any }),
    onSuccess: () => {
      // Invalidate and refetch tasks after update
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  });
  
  // Update task
  const updateTaskStatus = async (taskId: number, status: string): Promise<boolean> => {
    try {
      await updateTaskStatusMutation.mutateAsync({ taskId, status });
      return true;
    } catch (err) {
      return false;
    }
  };
  
  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (taskData: Partial<Task>) => taskService.createTask(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  });
  
  // Create task
  const createTask = async (taskData: Partial<Task>): Promise<boolean> => {
    try {
      await createTaskMutation.mutateAsync(taskData);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  });
  
  // Delete task
  const deleteTask = async (taskId: number): Promise<boolean> => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  // Set up real-time subscriptions for tasks
  useEffect(() => {
    const channel = supabase
      .channel('table-db-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, () => {
        // When any change happens to tasks, refetch the data
        refetch();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);
  
  return {
    tasks: tasks || [],
    isLoading,
    error,
    getTaskById,
    updateTaskStatus,
    createTask,
    deleteTask,
    filter,
    setFilter,
    refetch
  };
};

export default useTasks;
