

# AtendePro — SaaS de Atendimento ao Cliente via WhatsApp

## Visão Geral
Plataforma multi-tenant de atendimento ao cliente com foco em WhatsApp, inbox operacional como coração do sistema, automação por fluxos/bot e gestão completa de contatos e conversas.

**Stack**: React + Vite + TypeScript + Tailwind + shadcn/ui + Supabase (auth, DB, real-time, edge functions)
**Idioma**: Português (BR)
**Backend**: Supabase externo (a conectar)

---

## Fase 1 — Fundação (Auth + Layout + Navegação)

### Autenticação
- Tela de **Login** com email/senha
- Tela de **Cadastro** com criação de workspace
- **Recuperação de senha** com fluxo completo
- **Onboarding** pós-cadastro: nome da empresa, fuso horário, convite de agentes

### Layout Principal
- **Sidebar** esquerda com navegação por módulos (ícones + labels)
- Módulos: Dashboard, Inbox, Contatos, Tags, Respostas Rápidas, Fluxos, Canais, Grupos, Relatórios, Configurações
- Header com busca global, notificações e perfil do usuário
- Design system consistente: cores, tipografia, espaçamento, status dots

---

## Fase 2 — Dashboard

- Cards de métricas: conversas abertas, não lidas, pendentes, resolvidas hoje
- Gráfico de volume por período (últimos 7/30 dias)
- Atendimentos por agente (barras horizontais)
- Tempo médio de primeira resposta
- Status das instâncias WhatsApp (online/offline/reconectando)
- Empty states elegantes quando sem dados

---

## Fase 3 — Inbox (Coração do Sistema)

### Layout 3 painéis
- **Esquerda**: Lista de conversas com avatar, nome, preview, horário, status dot, tags, badge não lidas
- **Centro**: Chat com histórico, composer com formatação, anexos, respostas rápidas via `/comando`
- **Direita**: Painel contextual do contato (dados, tags, notas, histórico, atendente)

### Funcionalidades
- Filtros: status, atendente, tag, não lidas, canal, grupo/individual
- Ações: responder, anexar, marcar lida, tags, atribuir, transferir, encerrar/reabrir, nota interna, favoritar
- Busca global por nome, número, conteúdo
- Indicadores visuais: online/offline, pendente, em atendimento, resolvido, não lido, conversa de grupo
- Atalhos de teclado (Ctrl+K busca, Ctrl+Enter enviar, etc.)

---

## Fase 4 — Contatos / CRM

- Lista com busca, filtros por tag, origem, atendente
- Cadastro completo: nome, telefone, email, observações, campos personalizados
- Tags por contato
- Histórico de todas as conversas
- Visão 360° com timeline de interações
- Origem do lead (manual, WhatsApp, importação)

---

## Fase 5 — Tags + Respostas Rápidas

### Tags
- CRUD com nome e cor (color picker)
- Contador de uso
- Aplicação em massa no inbox e contatos

### Respostas Rápidas
- CRUD com título, atalho (`/comando`), conteúdo, categoria
- Variáveis dinâmicas: `{{nome_cliente}}`, `{{atendente}}`, `{{empresa}}`
- Busca instantânea no composer ao digitar `/`
- Categorização por tipo

---

## Fase 6 — Canais + Integração WhatsApp (UAZAPI)

### Gestão de Instâncias
- Tela para gerenciar instâncias WhatsApp
- Status de conexão em tempo real (conectado, desconectado, reconectando)
- Configuração de token UAZAPI por instância
- QR Code para conexão quando necessário
- Logs técnicos de integração

### Arquitetura de Integração
- Service/Adapter isolado para UAZAPI (camada de abstração)
- Edge Function para receber webhooks
- Envio de mensagens (texto simples + interativas com fallback)
- Rastreabilidade por message tracking ID
- Idempotência no processamento de webhooks
- Tratamento de falhas e retries
- Suporte a grupos

### Canais futuros
- Interface preparada com seletor de canal (WhatsApp ativo, demais "em breve")

---

## Fase 7 — Bot + Automação + Fluxos

### Bot Básico
- Mensagem de boas-vindas configurável
- Mensagem fora do horário comercial
- Roteamento por opção (menu numerado)
- Regras por palavra-chave, tag, fila
- Handoff automático para humano
- Pausa automática quando humano assume

### Construtor de Fluxos
- Builder visual linear (lista de nós conectados)
- Tipos de nó: enviar mensagem, esperar resposta, condição, adicionar/remover tag, atribuir fila/atendente, delay, encerrar, transferir humano, webhook
- Preview do fluxo
- Histórico de execução

---

## Fase 8 — Grupos WhatsApp

- Lista de grupos conectados com badge visual
- Conversas de grupo no inbox (ícone diferenciado)
- Visualização de participantes
- Envio de mensagens para grupo
- Filtros específicos para grupos

---

## Fase 9 — Configurações

- Dados da empresa (nome, logo, fuso)
- Horários de atendimento (por dia da semana)
- Filas de atendimento (CRUD)
- Usuários e permissões (admin, supervisor, atendente)
- Webhooks configuráveis
- Integrações (UAZAPI)
- Auditoria (log de ações)
- Preferências do inbox

---

## Fase 10 — Relatórios

- Volume de atendimentos por dia (gráfico de linha)
- Atendimentos por agente (tabela + gráfico)
- Tempo médio de resposta e resolução
- Tags mais utilizadas
- Origem dos contatos
- Taxa de encerramento
- Filtro por período

---

## Modelagem de Dados (Supabase)

Entidades principais: Workspace, User, UserRole, AgentProfile, Channel, WhatsAppInstance, Contact, ContactCustomField, Conversation, ConversationParticipant, Message, MessageAttachment, MessageStatus, Tag, ContactTag, ConversationTag, QuickReply, Flow, FlowNode, FlowExecution, Queue, Assignment, InternalNote, BusinessHours, WebhookEvent, AuditLog

---

## Dados Mock Iniciais

- 3 agentes com perfis realistas
- 15+ conversas em diferentes status (abertas, pendentes, resolvidas)
- 30+ contatos com dados brasileiros
- 8 tags coloridas (Urgente, VIP, Suporte, Vendas, etc.)
- 5 respostas rápidas com variáveis
- 1 fluxo de boas-vindas completo
- 2 instâncias WhatsApp (1 conectada, 1 desconectada)
- Mensagens realistas em português

---

## UX/Design

- Paleta escura opcional, light como padrão
- Sidebar colapsável com ícones Lucide
- Status dots coloridos (verde=online, amarelo=pendente, azul=em atendimento, cinza=resolvido)
- Cards com sombras suaves, bordas arredondadas
- Transições suaves
- Empty states com ilustrações e CTAs
- Loading skeletons
- Toasts para feedback de ações
- Microcopy real em PT-BR

