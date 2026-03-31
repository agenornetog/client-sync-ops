
-- Allow authenticated users to create workspaces (for registration)
CREATE POLICY "Authenticated users can create workspaces"
  ON public.workspaces FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow users to insert their own profile (handle_new_user trigger does this, but also allow manual)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Allow users to insert their own roles
CREATE POLICY "Users can insert own roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Allow users to insert agent profiles
CREATE POLICY "Users can insert own agent profile"
  ON public.agent_profiles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
