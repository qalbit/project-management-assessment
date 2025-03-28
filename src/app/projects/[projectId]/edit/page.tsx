'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/hooks/useProjects';
import { ProjectForm } from '@/components/project-form';
import { toast } from 'react-hot-toast';
import { ProtectedRoute } from '@/components/protected-route';

export default function ProjectEditPage() {
  const { projectId } = useParams();
  const { data: project } = useProject(projectId as string);
  const router = useRouter();

  return (
    <ProtectedRoute>
      {project ? 
        <>
          <div className="container mx-auto p-10">
            <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
            <ProjectForm
              project={project}
              userId={project.user_id}
              onSuccess={() => {
                toast.success('Project updated successfully');
                router.push('/projects');
              }}
            />
          </div>
        </> 
        : 
        <>
          <p>Loading...</p>
        </> 
      }
    </ProtectedRoute>
  );
}