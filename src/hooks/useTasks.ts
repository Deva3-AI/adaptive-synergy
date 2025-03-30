
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Task, DetailedTask } from '@/interfaces/tasks';
import { taskService } from '@/services/api';

export const useTasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const { data: taskData, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const response = await taskService.getTasks();
        return response;
      } catch (err) {
        throw new Error('Failed to fetch tasks');
      }
    },
  });
  
  useEffect(() => {
    if (queryLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      if (taskData) {
        setTasks(taskData);
      }
      if (queryError) {
        setError(queryError as Error);
      }
    }
  }, [taskData, queryLoading, queryError]);
  
  const getTaskById = async (taskId: number): Promise<DetailedTask | null> => {
    try {
      const task = await taskService.getTaskDetails(taskId);
      return task;
    } catch (err) {
      console.error('Error fetching task details:', err);
      return null;
    }
  };
  
  const updateTaskStatus = async (taskId: number, status: string): Promise<boolean> => {
    try {
      await taskService.updateTaskStatus(taskId, status);
      // Refresh tasks after update
      const updatedTasks = await taskService.getTasks();
      setTasks(updatedTasks);
      return true;
    } catch (err) {
      console.error('Error updating task status:', err);
      return false;
    }
  };
  
  return {
    tasks,
    isLoading,
    error,
    getTaskById,
    updateTaskStatus
  };
};

export default useTasks;
