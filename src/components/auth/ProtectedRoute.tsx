import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [workspaceCheck, setWorkspaceCheck] = useState<'loading' | 'has_workspace' | 'no_workspace'>('loading');

  useEffect(() => {
    if (!session?.user) {
      setWorkspaceCheck('loading');
      return;
    }

    supabase
      .from('profiles')
      .select('workspace_id')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setWorkspaceCheck(data?.workspace_id ? 'has_workspace' : 'no_workspace');
      });
  }, [session?.user?.id]);

  if (loading || (session && workspaceCheck === 'loading')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (workspaceCheck === 'no_workspace' && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
