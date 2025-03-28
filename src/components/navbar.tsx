'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Navbar() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/projects" className="text-xl font-bold">
          Project Manager
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-sm">{user.email}</span>
          <Button
            variant="outline"
            onClick={async () => {
              await signOut();
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}