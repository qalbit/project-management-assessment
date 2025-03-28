'use client';

import { redirect, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/database';
import { useState } from 'react';
import { ProjectForm } from '@/components/project-form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProtectedRoute } from '@/components/protected-route';

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const project = row.original;
      const router = useRouter();
      const { mutate: deleteProject } = useDeleteProject();

      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/projects/${project.id}`)}
          >
            View Tasks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/projects/${project.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to delete this project?')) {
                deleteProject(project.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];

export default function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects = [], isLoading, isRefetching } = useProjects(user?.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user) {
    redirect('/login');
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            New Project
          </Button>
        </div>

        <DataTable columns={columns} data={projects} isLoading={isLoading || isRefetching} />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <ProjectForm
              userId={user.id}
              onSuccess={() => {
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}