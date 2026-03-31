import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import type { Conversation, Contact, Tag, Message } from '@/types';

interface ConversationRow {
  id: string;
  workspace_id: string;
  contact_id: string;
  channel: string;
  type: string;
  status: string;
  instance_id: string | null;
  assigned_agent_id: string | null;
  queue_id: string | null;
  is_bot_active: boolean;
  is_favorited: boolean;
  unread_count: number;
  last_message_at: string | null;
  resolved_at: string | null;
  created_at: string;
  group_name: string | null;
  group_participants: number | null;
  contacts: {
    id: string;
    workspace_id: string;
    name: string;
    phone: string;
    email: string | null;
    avatar_url: string | null;
    notes: string | null;
    custom_fields: Record<string, string> | null;
    origin: string;
    assigned_agent_id: string | null;
    created_at: string;
    last_seen: string | null;
  };
  profiles: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    is_online: boolean;
  } | null;
  queues: {
    id: string;
    name: string;
    description: string | null;
    color: string;
  } | null;
  conversation_tags: {
    tags: {
      id: string;
      name: string;
      color: string;
      usage_count: number;
      workspace_id: string;
    };
  }[];
}

function mapRowToConversation(row: ConversationRow): Conversation {
  const contact: Contact = {
    id: row.contacts.id,
    workspace_id: row.contacts.workspace_id,
    name: row.contacts.name,
    phone: row.contacts.phone,
    email: row.contacts.email || undefined,
    avatar_url: row.contacts.avatar_url || undefined,
    notes: row.contacts.notes || undefined,
    custom_fields: (row.contacts.custom_fields as Record<string, string>) || undefined,
    origin: row.contacts.origin as Contact['origin'],
    assigned_agent_id: row.contacts.assigned_agent_id || undefined,
    created_at: row.contacts.created_at,
    last_seen: row.contacts.last_seen || undefined,
    tags: [], // loaded separately if needed
  };

  const tags: Tag[] = (row.conversation_tags || []).map(ct => ({
    ...ct.tags,
  }));

  return {
    id: row.id,
    workspace_id: row.workspace_id,
    contact_id: row.contact_id,
    contact,
    channel: row.channel as Conversation['channel'],
    type: row.type as Conversation['type'],
    status: row.status as Conversation['status'],
    instance_id: row.instance_id || undefined,
    assigned_agent_id: row.assigned_agent_id || undefined,
    assigned_agent: row.profiles ? {
      id: row.profiles.id,
      workspace_id: row.workspace_id,
      name: row.profiles.name,
      email: row.profiles.email,
      avatar_url: row.profiles.avatar_url || undefined,
      role: 'atendente' as const,
      is_online: row.profiles.is_online,
      created_at: '',
    } : undefined,
    queue_id: row.queue_id || undefined,
    queue: row.queues ? {
      id: row.queues.id,
      workspace_id: row.workspace_id,
      name: row.queues.name,
      description: row.queues.description || undefined,
      color: row.queues.color,
      agent_ids: [],
    } : undefined,
    tags,
    is_bot_active: row.is_bot_active,
    is_favorited: row.is_favorited,
    unread_count: row.unread_count,
    last_message_at: row.last_message_at || undefined,
    resolved_at: row.resolved_at || undefined,
    created_at: row.created_at,
    group_name: row.group_name || undefined,
    group_participants: row.group_participants || undefined,
  };
}

export function useConversations() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          contacts(*),
          queues(*),
          conversation_tags(tags(*))
        `)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      // Fetch agent profiles separately for assigned conversations
      const agentIds = [...new Set((data || []).map(c => c.assigned_agent_id).filter(Boolean))];
      let agentsMap: Record<string, any> = {};
      
      if (agentIds.length > 0) {
        const { data: agents } = await supabase
          .from('profiles')
          .select('id, name, email, avatar_url, is_online')
          .in('id', agentIds);
        
        if (agents) {
          agentsMap = Object.fromEntries(agents.map(a => [a.id, a]));
        }
      }

      return (data || []).map((row: any) => mapRowToConversation(row, agentsMap));
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('conversations-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useMessages(conversationId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<Message[]> => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map((row: any) => ({
        id: row.id,
        conversation_id: row.conversation_id,
        sender_type: row.sender_type,
        sender_id: row.sender_id || undefined,
        sender_name: row.sender_name || undefined,
        direction: row.direction,
        type: row.type,
        content: row.content,
        media_url: row.media_url || undefined,
        status: row.status,
        external_id: row.external_id || undefined,
        metadata: row.metadata || undefined,
        created_at: row.created_at,
      }));
    },
    enabled: !!conversationId,
  });

  // Real-time for messages
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return query;
}

export function useInternalNotes(conversationId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['internal-notes', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from('internal_notes')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`notes-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'internal_notes',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['internal-notes', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);

  return query;
}

export function useQuickReplies() {
  return useQuery({
    queryKey: ['quick-replies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quick_replies')
        .select('*')
        .order('title');

      if (error) throw error;
      return data || [];
    },
  });
}
