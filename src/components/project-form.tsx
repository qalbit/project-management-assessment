'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Project } from '@/types/database';
import { useCreateProject, useUpdateProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});

type ProjectFormProps = {
  userId: string;
  project?: Project;
  onSuccess: () => void;
};

export function ProjectForm({ userId, project, onSuccess }: ProjectFormProps) {
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
    },
  });

  const onSubmit = (values: z.infer<typeof projectSchema>) => {
    if (project) {
      updateProject(
        { id: project.id, project: values },
        { onSuccess }
      );
    } else {
      createProject(
        { ...values, user_id: userId },
        { onSuccess }
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Project description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}