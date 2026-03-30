// ============================================
// AtendePro — Type Definitions
// ============================================

export type UserRole = 'admin' | 'supervisor' | 'atendente';
export type ConversationStatus = 'open' | 'pending' | 'attending' | 'resolved' | 'closed';
export type ConversationType = 'individual' | 'group';
export type ChannelType = 'whatsapp' | 'instagram' | 'telegram' | 'webchat' | 'email';
export type MessageDirection = 'inbound' | 'outbound';
export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document' | 'sticker' | 'location' | 'contact' | 'interactive' | 'template' | 'system';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
export type InstanceStatus = 'connected' | 'disconnected' | 'connecting' | 'qr_code';
export type FlowNodeType = 'send_message' | 'wait_response' | 'condition' | 'add_tag' | 'remove_tag' | 'assign_queue' | 'assign_agent' | 'delay' | 'end' | 'transfer_human' | 'webhook';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  logo_url?: string;
  created_at: string;
}

export interface User {
  id: string;
  workspace_id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  is_online: boolean;
  created_at: string;
}

export interface AgentProfile {
  id: string;
  user_id: string;
  display_name: string;
  max_concurrent_chats: number;
  active_chats: number;
  is_available: boolean;
}

export interface WhatsAppInstance {
  id: string;
  workspace_id: string;
  name: string;
  phone_number: string;
  status: InstanceStatus;
  api_token?: string;
  api_url?: string;
  qr_code?: string;
  last_seen?: string;
  created_at: string;
}

export interface Contact {
  id: string;
  workspace_id: string;
  name: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  notes?: string;
  custom_fields?: Record<string, string>;
  tags: Tag[];
  origin: 'whatsapp' | 'manual' | 'import' | 'api';
  assigned_agent_id?: string;
  created_at: string;
  last_seen?: string;
}

export interface Conversation {
  id: string;
  workspace_id: string;
  contact_id: string;
  contact: Contact;
  channel: ChannelType;
  type: ConversationType;
  status: ConversationStatus;
  instance_id?: string;
  assigned_agent_id?: string;
  assigned_agent?: User;
  queue_id?: string;
  queue?: Queue;
  tags: Tag[];
  is_bot_active: boolean;
  is_favorited: boolean;
  unread_count: number;
  last_message?: Message;
  last_message_at?: string;
  resolved_at?: string;
  created_at: string;
  group_name?: string;
  group_participants?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_type: 'contact' | 'agent' | 'bot' | 'system';
  sender_id?: string;
  sender_name?: string;
  direction: MessageDirection;
  type: MessageType;
  content: string;
  media_url?: string;
  status: MessageStatus;
  external_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface InternalNote {
  id: string;
  conversation_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface Tag {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  usage_count: number;
}

export interface QuickReply {
  id: string;
  workspace_id: string;
  title: string;
  shortcut: string;
  content: string;
  category: string;
  variables: string[];
}

export interface Queue {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  color: string;
  agent_ids: string[];
}

export interface Flow {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  trigger: 'welcome' | 'keyword' | 'tag' | 'queue' | 'manual';
  trigger_value?: string;
  nodes: FlowNode[];
  created_at: string;
  updated_at: string;
  executions_count: number;
}

export interface FlowNode {
  id: string;
  flow_id: string;
  type: FlowNodeType;
  position: number;
  config: Record<string, any>;
  next_node_id?: string;
  condition_true_node_id?: string;
  condition_false_node_id?: string;
}

export interface FlowExecution {
  id: string;
  flow_id: string;
  conversation_id: string;
  contact_name: string;
  current_node_id: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  started_at: string;
  finished_at?: string;
}

export interface BusinessHours {
  id: string;
  workspace_id: string;
  day_of_week: number; // 0=Sunday
  is_open: boolean;
  open_time: string;
  close_time: string;
}

export interface WebhookEvent {
  id: string;
  workspace_id: string;
  event_type: string;
  payload: Record<string, any>;
  status: 'received' | 'processed' | 'failed';
  error?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  workspace_id: string;
  user_id: string;
  user_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface DashboardMetrics {
  open_conversations: number;
  unread_conversations: number;
  pending_conversations: number;
  resolved_today: number;
  avg_first_response_time: number; // minutes
  avg_resolution_time: number; // minutes
  agents_online: number;
  total_agents: number;
  conversations_by_agent: { agent_name: string; count: number }[];
  volume_by_day: { date: string; count: number }[];
  tags_usage: { tag_name: string; color: string; count: number }[];
}
