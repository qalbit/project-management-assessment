'use client';

import { redirect, useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/database';
import { useState } from 'react';
import { TaskForm } from '@/components/task-form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProject } from '@/hooks/useProjects';
import { ProtectedRoute } from '@/components/protected-route';

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString(),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const task = row.original;
      const router = useRouter();
      const { mutate: deleteTask } = useDeleteTask();

      return (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/projects/${task.project_id}/tasks/${task.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(task.id);
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

export default function TaskManagementPage() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const { data: tasks = [], isLoading } = useTasks(projectId as string);
  const { data: project } = useProject(projectId as string);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  if (!user) {
    router.push('/login');
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/projects')}>
              Back to Projects
            </Button>
            <h1 className="text-2xl font-bold">{project?.name} Tasks</h1>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            New Task
          </Button>
        </div>

        <DataTable columns={columns} data={tasks} isLoading={isLoading} />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <TaskForm
              projectId={projectId as string}
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