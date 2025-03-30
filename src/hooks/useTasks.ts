
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { taskService } from '@/services/api';
import { Task } from '@/services/api/taskService';

export const useTasks = (filters?: { status?: string; assigned_to?: number; client_id?: number }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { data, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (queryError) {
      setError(queryError as Error);
      setIsLoading(false);
    }
  }, [queryError]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const newTasks = await taskService.getTasks(filters);
      setTasks(newTasks);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { tasks, isLoading: isLoading || queryLoading, error: error || queryError, refetch };
};

export default useTasks;
