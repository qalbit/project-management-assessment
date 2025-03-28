import { supabase } from '@/lib/supabase/client';
import { Task } from '@/types/database';

export const getTasks = async (projectId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTask = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) throw error;
};