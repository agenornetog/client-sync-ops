export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agent_profiles: {
        Row: {
          active_chats: number
          display_name: string
          id: string
          is_available: boolean
          max_concurrent_chats: number
          user_id: string
        }
        Insert: {
          active_chats?: number
          display_name?: string
          id?: string
          is_available?: boolean
          max_concurrent_chats?: number
          user_id: string
        }
        Update: {
          active_chats?: number
          display_name?: string
          id?: string
          is_available?: boolean
          max_concurrent_chats?: number
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          user_id: string
          user_name: string
          workspace_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          user_id: string
          user_name?: string
          workspace_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          user_id?: string
          user_name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          close_time: string
          day_of_week: number
          id: string
          is_open: boolean
          open_time: string
          workspace_id: string
        }
        Insert: {
          close_time?: string
          day_of_week: number
          id?: string
          is_open?: boolean
          open_time?: string
          workspace_id: string
        }
        Update: {
          close_time?: string
          day_of_week?: number
          id?: string
          is_open?: boolean
          open_time?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_tags: {
        Row: {
          contact_id: string
          id: string
          tag_id: string
        }
        Insert: {
          contact_id: string
          id?: string
          tag_id: string
        }
        Update: {
          contact_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_tags_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          assigned_agent_id: string | null
          avatar_url: string | null
          created_at: string
          custom_fields: Json | null
          email: string | null
          id: string
          last_seen: string | null
          name: string
          notes: string | null
          origin: Database["public"]["Enums"]["contact_origin"]
          phone: string
          workspace_id: string
        }
        Insert: {
          assigned_agent_id?: string | null
          avatar_url?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          id?: string
          last_seen?: string | null
          name: string
          notes?: string | null
          origin?: Database["public"]["Enums"]["contact_origin"]
          phone: string
          workspace_id: string
        }
        Update: {
          assigned_agent_id?: string | null
          avatar_url?: string | null
          created_at?: string
          custom_fields?: Json | null
          email?: string | null
          id?: string
          last_seen?: string | null
          name?: string
          notes?: string | null
          origin?: Database["public"]["Enums"]["contact_origin"]
          phone?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_tags: {
        Row: {
          conversation_id: string
          id: string
          tag_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          tag_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_tags_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assigned_agent_id: string | null
          channel: Database["public"]["Enums"]["channel_type"]
          contact_id: string
          created_at: string
          group_name: string | null
          group_participants: number | null
          id: string
          instance_id: string | null
          is_bot_active: boolean
          is_favorited: boolean
          last_message_at: string | null
          queue_id: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["conversation_status"]
          type: Database["public"]["Enums"]["conversation_type"]
          unread_count: number
          workspace_id: string
        }
        Insert: {
          assigned_agent_id?: string | null
          channel?: Database["public"]["Enums"]["channel_type"]
          contact_id: string
          created_at?: string
          group_name?: string | null
          group_participants?: number | null
          id?: string
          instance_id?: string | null
          is_bot_active?: boolean
          is_favorited?: boolean
          last_message_at?: string | null
          queue_id?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"]
          type?: Database["public"]["Enums"]["conversation_type"]
          unread_count?: number
          workspace_id: string
        }
        Update: {
          assigned_agent_id?: string | null
          channel?: Database["public"]["Enums"]["channel_type"]
          contact_id?: string
          created_at?: string
          group_name?: string | null
          group_participants?: number | null
          id?: string
          instance_id?: string | null
          is_bot_active?: boolean
          is_favorited?: boolean
          last_message_at?: string | null
          queue_id?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["conversation_status"]
          type?: Database["public"]["Enums"]["conversation_type"]
          unread_count?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_instance_id_fkey"
            columns: ["instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_instances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_executions: {
        Row: {
          contact_name: string
          conversation_id: string
          current_node_id: string | null
          finished_at: string | null
          flow_id: string
          id: string
          started_at: string
          status: Database["public"]["Enums"]["flow_execution_status"]
        }
        Insert: {
          contact_name?: string
          conversation_id: string
          current_node_id?: string | null
          finished_at?: string | null
          flow_id: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["flow_execution_status"]
        }
        Update: {
          contact_name?: string
          conversation_id?: string
          current_node_id?: string | null
          finished_at?: string | null
          flow_id?: string
          id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["flow_execution_status"]
        }
        Relationships: [
          {
            foreignKeyName: "flow_executions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_executions_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_nodes: {
        Row: {
          condition_false_node_id: string | null
          condition_true_node_id: string | null
          config: Json
          flow_id: string
          id: string
          next_node_id: string | null
          position: number
          type: Database["public"]["Enums"]["flow_node_type"]
        }
        Insert: {
          condition_false_node_id?: string | null
          condition_true_node_id?: string | null
          config?: Json
          flow_id: string
          id?: string
          next_node_id?: string | null
          position?: number
          type: Database["public"]["Enums"]["flow_node_type"]
        }
        Update: {
          condition_false_node_id?: string | null
          condition_true_node_id?: string | null
          config?: Json
          flow_id?: string
          id?: string
          next_node_id?: string | null
          position?: number
          type?: Database["public"]["Enums"]["flow_node_type"]
        }
        Relationships: [
          {
            foreignKeyName: "flow_nodes_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      flows: {
        Row: {
          created_at: string
          description: string | null
          executions_count: number
          id: string
          is_active: boolean
          name: string
          trigger: Database["public"]["Enums"]["flow_trigger"]
          trigger_value: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          executions_count?: number
          id?: string
          is_active?: boolean
          name: string
          trigger?: Database["public"]["Enums"]["flow_trigger"]
          trigger_value?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          executions_count?: number
          id?: string
          is_active?: boolean
          name?: string
          trigger?: Database["public"]["Enums"]["flow_trigger"]
          trigger_value?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flows_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_notes: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          user_id: string
          user_name?: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "internal_notes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          direction: Database["public"]["Enums"]["message_direction"]
          external_id: string | null
          id: string
          media_url: string | null
          metadata: Json | null
          sender_id: string | null
          sender_name: string | null
          sender_type: Database["public"]["Enums"]["sender_type"]
          status: Database["public"]["Enums"]["message_status"]
          type: Database["public"]["Enums"]["message_type"]
        }
        Insert: {
          content?: string
          conversation_id: string
          created_at?: string
          direction?: Database["public"]["Enums"]["message_direction"]
          external_id?: string | null
          id?: string
          media_url?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type?: Database["public"]["Enums"]["sender_type"]
          status?: Database["public"]["Enums"]["message_status"]
          type?: Database["public"]["Enums"]["message_type"]
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          direction?: Database["public"]["Enums"]["message_direction"]
          external_id?: string | null
          id?: string
          media_url?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type?: Database["public"]["Enums"]["sender_type"]
          status?: Database["public"]["Enums"]["message_status"]
          type?: Database["public"]["Enums"]["message_type"]
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          is_online: boolean
          name: string
          workspace_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id: string
          is_online?: boolean
          name?: string
          workspace_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          is_online?: boolean
          name?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_agents: {
        Row: {
          agent_id: string
          id: string
          queue_id: string
        }
        Insert: {
          agent_id: string
          id?: string
          queue_id: string
        }
        Update: {
          agent_id?: string
          id?: string
          queue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_agents_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "queues"
            referencedColumns: ["id"]
          },
        ]
      }
      queues: {
        Row: {
          color: string
          description: string | null
          id: string
          name: string
          workspace_id: string
        }
        Insert: {
          color?: string
          description?: string | null
          id?: string
          name: string
          workspace_id: string
        }
        Update: {
          color?: string
          description?: string | null
          id?: string
          name?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "queues_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_replies: {
        Row: {
          category: string
          content: string
          id: string
          shortcut: string
          title: string
          variables: string[] | null
          workspace_id: string
        }
        Insert: {
          category?: string
          content: string
          id?: string
          shortcut: string
          title: string
          variables?: string[] | null
          workspace_id: string
        }
        Update: {
          category?: string
          content?: string
          id?: string
          shortcut?: string
          title?: string
          variables?: string[] | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_replies_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string
          id: string
          name: string
          usage_count: number
          workspace_id: string
        }
        Insert: {
          color?: string
          id?: string
          name: string
          usage_count?: number
          workspace_id: string
        }
        Update: {
          color?: string
          id?: string
          name?: string
          usage_count?: number
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tags_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          created_at: string
          error: string | null
          event_type: string
          id: string
          payload: Json
          status: Database["public"]["Enums"]["webhook_event_status"]
          workspace_id: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          event_type: string
          id?: string
          payload?: Json
          status?: Database["public"]["Enums"]["webhook_event_status"]
          workspace_id: string
        }
        Update: {
          created_at?: string
          error?: string | null
          event_type?: string
          id?: string
          payload?: Json
          status?: Database["public"]["Enums"]["webhook_event_status"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          api_token: string | null
          api_url: string | null
          created_at: string
          id: string
          last_seen: string | null
          name: string
          phone_number: string
          qr_code: string | null
          status: Database["public"]["Enums"]["instance_status"]
          workspace_id: string
        }
        Insert: {
          api_token?: string | null
          api_url?: string | null
          created_at?: string
          id?: string
          last_seen?: string | null
          name: string
          phone_number?: string
          qr_code?: string | null
          status?: Database["public"]["Enums"]["instance_status"]
          workspace_id: string
        }
        Update: {
          api_token?: string | null
          api_url?: string | null
          created_at?: string
          id?: string
          last_seen?: string | null
          name?: string
          phone_number?: string
          qr_code?: string | null
          status?: Database["public"]["Enums"]["instance_status"]
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          slug: string
          timezone: string
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          slug: string
          timezone?: string
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          slug?: string
          timezone?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_workspace_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "supervisor" | "atendente"
      channel_type: "whatsapp" | "instagram" | "telegram" | "webchat" | "email"
      contact_origin: "whatsapp" | "manual" | "import" | "api"
      conversation_status:
        | "open"
        | "pending"
        | "attending"
        | "resolved"
        | "closed"
      conversation_type: "individual" | "group"
      flow_execution_status: "running" | "completed" | "failed" | "paused"
      flow_node_type:
        | "send_message"
        | "wait_response"
        | "condition"
        | "add_tag"
        | "remove_tag"
        | "assign_queue"
        | "assign_agent"
        | "delay"
        | "end"
        | "transfer_human"
        | "webhook"
      flow_trigger: "welcome" | "keyword" | "tag" | "queue" | "manual"
      instance_status: "connected" | "disconnected" | "connecting" | "qr_code"
      message_direction: "inbound" | "outbound"
      message_status: "pending" | "sent" | "delivered" | "read" | "failed"
      message_type:
        | "text"
        | "image"
        | "audio"
        | "video"
        | "document"
        | "sticker"
        | "location"
        | "contact"
        | "interactive"
        | "template"
        | "system"
      sender_type: "contact" | "agent" | "bot" | "system"
      webhook_event_status: "received" | "processed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "supervisor", "atendente"],
      channel_type: ["whatsapp", "instagram", "telegram", "webchat", "email"],
      contact_origin: ["whatsapp", "manual", "import", "api"],
      conversation_status: [
        "open",
        "pending",
        "attending",
        "resolved",
        "closed",
      ],
      conversation_type: ["individual", "group"],
      flow_execution_status: ["running", "completed", "failed", "paused"],
      flow_node_type: [
        "send_message",
        "wait_response",
        "condition",
        "add_tag",
        "remove_tag",
        "assign_queue",
        "assign_agent",
        "delay",
        "end",
        "transfer_human",
        "webhook",
      ],
      flow_trigger: ["welcome", "keyword", "tag", "queue", "manual"],
      instance_status: ["connected", "disconnected", "connecting", "qr_code"],
      message_direction: ["inbound", "outbound"],
      message_status: ["pending", "sent", "delivered", "read", "failed"],
      message_type: [
        "text",
        "image",
        "audio",
        "video",
        "document",
        "sticker",
        "location",
        "contact",
        "interactive",
        "template",
        "system",
      ],
      sender_type: ["contact", "agent", "bot", "system"],
      webhook_event_status: ["received", "processed", "failed"],
    },
  },
} as const
