'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTask } from '@/hooks/useTasks';
import { TaskForm } from '@/components/task-form';
import { ProtectedRoute } from '@/components/protected-route';

export default function TaskEditPage() {
  const { projectId, taskId } = useParams();
  const { data: task } = useTask(taskId as string);
  const router = useRouter();

  if (!task) {
    router.push(`/projects/${projectId}`);
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-10">
        <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
        <TaskForm
          task={task}
          projectId={projectId as string}
          onSuccess={() => {
            router.push(`/projects/${projectId}`);
          }}
        />
      </div>
    </ProtectedRoute>
  );
}