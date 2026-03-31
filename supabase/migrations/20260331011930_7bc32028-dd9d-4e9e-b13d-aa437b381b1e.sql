
-- ============================================
-- AtendePro — Full Database Schema
-- ============================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'supervisor', 'atendente');
CREATE TYPE public.conversation_status AS ENUM ('open', 'pending', 'attending', 'resolved', 'closed');
CREATE TYPE public.conversation_type AS ENUM ('individual', 'group');
CREATE TYPE public.channel_type AS ENUM ('whatsapp', 'instagram', 'telegram', 'webchat', 'email');
CREATE TYPE public.message_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'audio', 'video', 'document', 'sticker', 'location', 'contact', 'interactive', 'template', 'system');
CREATE TYPE public.message_status AS ENUM ('pending', 'sent', 'delivered', 'read', 'failed');
CREATE TYPE public.instance_status AS ENUM ('connected', 'disconnected', 'connecting', 'qr_code');
CREATE TYPE public.flow_trigger AS ENUM ('welcome', 'keyword', 'tag', 'queue', 'manual');
CREATE TYPE public.flow_node_type AS ENUM ('send_message', 'wait_response', 'condition', 'add_tag', 'remove_tag', 'assign_queue', 'assign_agent', 'delay', 'end', 'transfer_human', 'webhook');
CREATE TYPE public.flow_execution_status AS ENUM ('running', 'completed', 'failed', 'paused');
CREATE TYPE public.contact_origin AS ENUM ('whatsapp', 'manual', 'import', 'api');
CREATE TYPE public.webhook_event_status AS ENUM ('received', 'processed', 'failed');
CREATE TYPE public.sender_type AS ENUM ('contact', 'agent', 'bot', 'system');

-- 2. TABLES

-- Workspaces (tenant)
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles (separate table for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'atendente',
  UNIQUE(user_id, role)
);

-- Agent Profiles
CREATE TABLE public.agent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  max_concurrent_chats INT NOT NULL DEFAULT 5,
  active_chats INT NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true
);

-- WhatsApp Instances
CREATE TABLE public.whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL DEFAULT '',
  status public.instance_status NOT NULL DEFAULT 'disconnected',
  api_token TEXT,
  api_url TEXT,
  qr_code TEXT,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  usage_count INT NOT NULL DEFAULT 0,
  UNIQUE(workspace_id, name)
);

-- Queues
CREATE TABLE public.queues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#6B7280'
);

-- Queue Agents (N:N)
CREATE TABLE public.queue_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_id UUID NOT NULL REFERENCES public.queues(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(queue_id, agent_id)
);

-- Contacts
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  notes TEXT,
  custom_fields JSONB DEFAULT '{}',
  origin public.contact_origin NOT NULL DEFAULT 'manual',
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen TIMESTAMPTZ
);

-- Contact Tags (N:N)
CREATE TABLE public.contact_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(contact_id, tag_id)
);

-- Conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  channel public.channel_type NOT NULL DEFAULT 'whatsapp',
  type public.conversation_type NOT NULL DEFAULT 'individual',
  status public.conversation_status NOT NULL DEFAULT 'open',
  instance_id UUID REFERENCES public.whatsapp_instances(id) ON DELETE SET NULL,
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  queue_id UUID REFERENCES public.queues(id) ON DELETE SET NULL,
  is_bot_active BOOLEAN NOT NULL DEFAULT true,
  is_favorited BOOLEAN NOT NULL DEFAULT false,
  unread_count INT NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  group_name TEXT,
  group_participants INT
);

-- Conversation Tags (N:N)
CREATE TABLE public.conversation_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(conversation_id, tag_id)
);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_type public.sender_type NOT NULL DEFAULT 'contact',
  sender_id UUID,
  sender_name TEXT,
  direction public.message_direction NOT NULL DEFAULT 'inbound',
  type public.message_type NOT NULL DEFAULT 'text',
  content TEXT NOT NULL DEFAULT '',
  media_url TEXT,
  status public.message_status NOT NULL DEFAULT 'pending',
  external_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Internal Notes
CREATE TABLE public.internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Quick Replies
CREATE TABLE public.quick_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  shortcut TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'geral',
  variables TEXT[] DEFAULT '{}'
);

-- Flows
CREATE TABLE public.flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  trigger public.flow_trigger NOT NULL DEFAULT 'welcome',
  trigger_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  executions_count INT NOT NULL DEFAULT 0
);

-- Flow Nodes
CREATE TABLE public.flow_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES public.flows(id) ON DELETE CASCADE,
  type public.flow_node_type NOT NULL,
  position INT NOT NULL DEFAULT 0,
  config JSONB NOT NULL DEFAULT '{}',
  next_node_id UUID,
  condition_true_node_id UUID,
  condition_false_node_id UUID
);

-- Flow Executions
CREATE TABLE public.flow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id UUID NOT NULL REFERENCES public.flows(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL DEFAULT '',
  current_node_id UUID,
  status public.flow_execution_status NOT NULL DEFAULT 'running',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

-- Business Hours
CREATE TABLE public.business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT true,
  open_time TEXT NOT NULL DEFAULT '08:00',
  close_time TEXT NOT NULL DEFAULT '18:00'
);

-- Webhook Events
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status public.webhook_event_status NOT NULL DEFAULT 'received',
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. SECURITY FUNCTIONS

CREATE OR REPLACE FUNCTION public.get_user_workspace_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT workspace_id FROM public.profiles WHERE id = _user_id LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  );
$$;

-- 4. TRIGGER: Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. ENABLE RLS ON ALL TABLES
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES

-- Profiles: own profile or same workspace
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can view workspace profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- User Roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Workspaces: members only
CREATE POLICY "Members can view workspace" ON public.workspaces
  FOR SELECT TO authenticated
  USING (id = public.get_user_workspace_id(auth.uid()));

CREATE POLICY "Admins can update workspace" ON public.workspaces
  FOR UPDATE TO authenticated
  USING (id = public.get_user_workspace_id(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

-- Workspace-scoped tables: standard policy pattern
-- Agent Profiles
CREATE POLICY "Workspace access" ON public.agent_profiles
  FOR ALL TO authenticated
  USING (user_id IN (SELECT id FROM public.profiles WHERE workspace_id = public.get_user_workspace_id(auth.uid())));

-- WhatsApp Instances
CREATE POLICY "Workspace access" ON public.whatsapp_instances
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Tags
CREATE POLICY "Workspace access" ON public.tags
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Queues
CREATE POLICY "Workspace access" ON public.queues
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Queue Agents
CREATE POLICY "Workspace access" ON public.queue_agents
  FOR ALL TO authenticated
  USING (queue_id IN (SELECT id FROM public.queues WHERE workspace_id = public.get_user_workspace_id(auth.uid())));

-- Contacts
CREATE POLICY "Workspace access" ON public.contacts
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Contact Tags
CREATE POLICY "Workspace access" ON public.contact_tags
  FOR ALL TO authenticated
  USING (contact_id IN (SELECT id FROM public.contacts WHERE workspace_id = public.get_user_workspace_id(auth.uid())));

-- Conversations
CREATE POLICY "Workspace access" ON public.conversations
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Conversation Tags
CREATE POLICY "Workspace access" ON public.conversation_tags
  FOR ALL TO authenticated
  USING (conversation_id IN (SELECT id FROM public.conversations WHERE workspace_id = public.get_user_workspace_id(auth.uid())));

-- Messages
CREATE POLICY "Workspace access" ON public.messages
  FOR ALL TO authenticated
  USING (conversation_id IN (SELECT id FROM public.conversations WHERE workspace_id = public.get_user_workspace_id(auth.uid())));

-- Internal Notes
CREATE POLICY "Workspace access" ON public.internal_notes
  FOR ALL TO authenticated
  USING (conversation_id IN (SELECT id FROM public.conversations WHERE workspace_id = public.get_user_workspace_id(auth.uid())));

-- Quick Replies
CREATE POLICY "Workspace access" ON public.quick_replies
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Flows
CREATE POLICY "Workspace access" ON public.flows
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Flow Nodes
CREATE POLICY "Workspace access" ON public.flow_nodes
  FOR ALL TO authenticated
  USING (flow_id IN (SELECT id FROM public.flows WHERE workspace_id = public.get_user_workspace_id(auth.uid())));

-- Flow Executions
CREATE POLICY "Workspace access" ON public.flow_executions
  FOR ALL TO authenticated
  USING (flow_id IN (SELECT id FROM public.flows WHERE workspace_id = public.get_user_workspace_id(auth.uid())));

-- Business Hours
CREATE POLICY "Workspace access" ON public.business_hours
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Webhook Events
CREATE POLICY "Workspace access" ON public.webhook_events
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- Audit Logs
CREATE POLICY "Workspace access" ON public.audit_logs
  FOR ALL TO authenticated
  USING (workspace_id = public.get_user_workspace_id(auth.uid()));

-- 7. INDEXES for performance
CREATE INDEX idx_profiles_workspace ON public.profiles(workspace_id);
CREATE INDEX idx_contacts_workspace ON public.contacts(workspace_id);
CREATE INDEX idx_contacts_phone ON public.contacts(phone);
CREATE INDEX idx_conversations_workspace ON public.conversations(workspace_id);
CREATE INDEX idx_conversations_contact ON public.conversations(contact_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_conversations_assigned ON public.conversations(assigned_agent_id);
CREATE INDEX idx_conversations_last_msg ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_tags_workspace ON public.tags(workspace_id);
CREATE INDEX idx_flows_workspace ON public.flows(workspace_id);
CREATE INDEX idx_audit_workspace ON public.audit_logs(workspace_id);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);
