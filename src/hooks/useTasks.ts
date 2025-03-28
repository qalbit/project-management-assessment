import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask, deleteTask } from '@/services/task-service';
import { toast } from 'react-hot-toast';
import { Task } from '@/types/database';
import { supabase } from '@/lib/supabase/client';

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (createdTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.setQueryData<Task[]>(['tasks', createdTask.project_id], (old = []) => [
        ...old,
        createdTask
      ]);
            
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, task }: { id: string; task: Partial<Task> }) => updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      if (previousTasks) {
        queryClient.setQueryData(
          ['tasks'], 
          previousTasks.filter(task => task.id !== id)
        );
      }
      
      return { previousTasks };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};