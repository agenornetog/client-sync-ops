
-- Replace permissive workspace insert with a scoped one:
-- Only allow insert if user has no workspace yet (first-time registration)
DROP POLICY "Authenticated users can create workspaces" ON public.workspaces;

CREATE POLICY "Users without workspace can create one"
  ON public.workspaces FOR INSERT TO authenticated
  WITH CHECK (
    public.get_user_workspace_id(auth.uid()) IS NULL
  );
