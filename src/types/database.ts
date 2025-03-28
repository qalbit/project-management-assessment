export type Project = {
    id: string;
    name: string;
    description: string;
    user_id: string;
    created_at: string;
  };
  
  export type Task = {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed';
    project_id: string;
    created_at: string;
  };
  
  export type User = {
    id: string;
    email: string;
    created_at: string;
  };