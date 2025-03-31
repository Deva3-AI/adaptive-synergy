
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import taskService from '@/services/api/taskService';
import { Task, DetailedTask, TaskFilter } from '@/interfaces/tasks';

/**
 * Hook for managing tasks
 */
const useTasks = () => {
  const [filters, setFilters] = useState<TaskFilter>({});
  const queryClient = useQueryClient();

  // Get all tasks
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
  });

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
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskData }: { taskId: number; taskData: Partial<Task> }) => 
      taskService.updateTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    },
  });

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
    },
  });

  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: Task['status'] }) => 
      taskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task status updated successfully');
    },
    onError: (error) => {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    },
  });

  // Get task by ID
  const getTaskById = async (taskId: number): Promise<Task | null> => {
    try {
      return await taskService.getTaskById(taskId);
    } catch (error) {
      console.error('Error fetching task:', error);
      toast.error('Failed to load task details');
      return null;
    }
  };

  // Get detailed task by ID
  const getDetailedTask = async (taskId: number): Promise<DetailedTask | null> => {
    try {
      return await taskService.getDetailedTask(taskId);
    } catch (error) {
      console.error('Error fetching detailed task:', error);
      toast.error('Failed to load task details');
      return null;
    }
  };

  // Create a task
  const createTask = async (taskData: Partial<Task>): Promise<Task | null> => {
    try {
      return await createTaskMutation.mutateAsync(taskData);
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  };

  // Update a task
  const updateTask = async (taskId: number, taskData: Partial<Task>): Promise<Task | null> => {
    try {
      return await updateTaskMutation.mutateAsync({ taskId, taskData });
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  };

  // Delete a task
  const deleteTask = async (taskId: number): Promise<boolean> => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: number, status: Task['status']): Promise<Task | null> => {
    try {
      return await updateTaskStatusMutation.mutateAsync({ taskId, status });
    } catch (error) {
      console.error('Error updating task status:', error);
      return null;
    }
  };

  // Add a comment to a task
  const addTaskComment = async (taskId: number, userId: number, comment: string) => {
    try {
      const result = await taskService.addTaskComment(taskId, userId, comment);
      if (result) {
        queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] });
        toast.success('Comment added successfully');
      }
      return result;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      return null;
    }
  };

  // Apply filters to the task list
  const applyFilters = (newFilters: TaskFilter) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  return {
    tasks,
    isLoading,
    error,
    getTaskById,
    getDetailedTask,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    addTaskComment,
    filters,
    applyFilters,
    clearFilters,
  };
};

export default useTasks;
