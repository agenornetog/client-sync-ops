

# Criar todas as tabelas do AtendePro no Supabase

## Resumo
Criar a modelagem completa do banco de dados com enums, tabelas, RLS policies e funções auxiliares. Todas as entidades definidas em `src/types/index.ts` serão mapeadas para tabelas Supabase.

## Migration SQL

Uma única migration com:

### 1. Enums
- `app_role` (admin, supervisor, atendente)
- `conversation_status` (open, pending, attending, resolved, closed)
- `conversation_type` (individual, group)
- `channel_type` (whatsapp, instagram, telegram, webchat, email)
- `message_direction` (inbound, outbound)
- `message_type` (text, image, audio, video, document, sticker, location, contact, interactive, template, system)
- `message_status` (pending, sent, delivered, read, failed)
- `instance_status` (connected, disconnected, connecting, qr_code)
- `flow_trigger` (welcome, keyword, tag, queue, manual)
- `flow_node_type` (send_message, wait_response, condition, add_tag, remove_tag, assign_queue, assign_agent, delay, end, transfer_human, webhook)
- `flow_execution_status` (running, completed, failed, paused)
- `contact_origin` (whatsapp, manual, import, api)
- `webhook_event_status` (received, processed, failed)

### 2. Tabelas (em ordem de dependência)

| Tabela | Descrição |
|--------|-----------|
| `workspaces` | Tenant principal |
| `profiles` | Perfil do usuário (referencia auth.users) |
| `user_roles` | Roles separada (admin/supervisor/atendente) |
| `agent_profiles` | Config de atendente (max chats, disponibilidade) |
| `whatsapp_instances` | Instâncias UAZAPI por workspace |
| `tags` | Tags coloridas por workspace |
| `queues` | Filas de atendimento |
| `queue_agents` | Relação N:N fila-agente |
| `contacts` | Contatos/clientes |
| `contact_tags` | Relação N:N contato-tag |
| `conversations` | Conversas (core do inbox) |
| `conversation_tags` | Relação N:N conversa-tag |
| `messages` | Mensagens de cada conversa |
| `internal_notes` | Notas internas por conversa |
| `quick_replies` | Respostas rápidas |
| `flows` | Fluxos de automação |
| `flow_nodes` | Nós de cada fluxo |
| `flow_executions` | Execuções de fluxo |
| `business_hours` | Horários de atendimento |
| `webhook_events` | Log de webhooks recebidos |
| `audit_logs` | Log de auditoria |

### 3. Funções de segurança
- `has_role(uuid, app_role)` — SECURITY DEFINER para verificar role sem recursão RLS
- `get_user_workspace_id(uuid)` — retorna workspace do usuário

### 4. RLS Policies
- Todas as tabelas com RLS habilitado
- Política padrão: usuário autenticado só acessa dados do próprio workspace
- `user_roles` usa `has_role()` para evitar recursão
- `profiles` permite leitura do próprio perfil e admins veem todos do workspace

### 5. Triggers
- Trigger em `auth.users` → cria `profiles` automaticamente no signup (via função SECURITY DEFINER no schema public)

## Pós-migration
- Atualizar `src/integrations/supabase/types.ts` automaticamente (feito pelo sistema)
- O frontend continuará usando mock data até autenticação ser implementada

## Notas
- Tokens UAZAPI armazenados em `whatsapp_instances.api_token` (texto, protegido por RLS)
- `custom_fields` em contacts como JSONB
- `metadata` em messages como JSONB
- `config` em flow_nodes como JSONB
- `variables` em quick_replies como TEXT[]

