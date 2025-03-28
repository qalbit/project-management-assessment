import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject, updateProject, deleteProject } from '@/services/project-service';
import { toast } from 'react-hot-toast';
import { Project } from '@/types/database';
import { supabase } from '@/lib/supabase/client';

export const useProjects = (userId: string) => {
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: (createdProject) => {
      queryClient.setQueryData<Project[]>(['projects', createdProject.user_id], (old = []) => [
        ...old,
        createdProject
      ]);
      
      toast.success('Project created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<Project> }) => updateProject(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      
      const previousProjects = queryClient.getQueryData<Project[]>(['projects']);
      
      if (previousProjects) {
        queryClient.setQueryData(
          ['projects'], 
          previousProjects.filter(project => project.id !== id)
        );
      }
      
      return { previousProjects };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};