
import { useState } from 'react';
import { useAuth } from './use-auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, Task } from '@/services/api/taskService';
import { toast } from 'sonner';

const useTasks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  // Get all tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const fetchedTasks = await taskService.getTasks();
      return fetchedTasks;
    }
  });

  // Get tasks assigned to the current user
  const { data: myTasks, isLoading: isLoadingMyTasks } = useQuery({
    queryKey: ['myTasks', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      const fetchedTasks = await taskService.getTasksByUser(userId);
      return fetchedTasks;
    },
    enabled: !!user?.id
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (task: Partial<Task>) => taskService.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['myTasks', user?.id] });
      toast.success('Task created successfully');
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskData }: { taskId: number, taskData: Partial<Task> }) => 
      taskService.updateTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['myTasks', user?.id] });
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['myTasks', user?.id] });
      toast.success('Task deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (params: { taskId: number, comment: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      
      return taskService.addTaskComment(params.taskId, {
        task_id: params.taskId,
        user_id: userId,
        user_name: user.name,
        content: params.comment
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Comment added successfully');
    }
  });

  // Function to create a new task
  const createTask = async (taskData: Partial<Task>) => {
    return createTaskMutation.mutateAsync(taskData);
  };

  // Function to update a task
  const updateTask = async (taskId: number, taskData: Partial<Task>) => {
    return updateTaskMutation.mutateAsync({ taskId, taskData });
  };

  // Function to delete a task
  const deleteTask = async (taskId: number) => {
    return deleteTaskMutation.mutateAsync(taskId);
  };

  // Function to add a comment to a task
  const addComment = async (taskId: number, comment: string) => {
    return addCommentMutation.mutateAsync({ taskId, comment });
  };

  return {
    tasks,
    myTasks,
    isLoading,
    isLoadingMyTasks,
    error,
    filter,
    setFilter,
    createTask,
    updateTask,
    deleteTask,
    addComment
  };
};

export default useTasks;
