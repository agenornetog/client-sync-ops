
-- Create a security definer function to handle workspace creation + profile linking atomically
CREATE OR REPLACE FUNCTION public.create_workspace_for_user(
  _name text,
  _slug text,
  _timezone text DEFAULT 'America/Sao_Paulo'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _workspace_id uuid;
  _user_id uuid := auth.uid();
BEGIN
  -- Check user doesn't already have a workspace
  IF (SELECT workspace_id FROM profiles WHERE id = _user_id) IS NOT NULL THEN
    RAISE EXCEPTION 'User already has a workspace';
  END IF;

  -- Create workspace
  INSERT INTO workspaces (name, slug, timezone)
  VALUES (_name, _slug, _timezone)
  RETURNING id INTO _workspace_id;

  -- Link profile
  UPDATE profiles SET workspace_id = _workspace_id WHERE id = _user_id;

  -- Add admin role
  INSERT INTO user_roles (user_id, role) VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN _workspace_id;
END;
$$;
