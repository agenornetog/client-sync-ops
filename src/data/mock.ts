import type {
  User, Contact, Conversation, Message, Tag, QuickReply, Queue,
  WhatsAppInstance, Flow, FlowNode, InternalNote, FlowExecution,
  BusinessHours, AuditLog, WebhookEvent, DashboardMetrics, AgentProfile
} from '@/types';

// ============================================
// AGENTS / USERS
// ============================================
export const mockUsers: User[] = [
  {
    id: 'usr-1', workspace_id: 'ws-1', name: 'Ana Silva', email: 'ana@atendepro.com',
    avatar_url: '', role: 'admin', is_online: true, created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'usr-2', workspace_id: 'ws-1', name: 'Carlos Mendes', email: 'carlos@atendepro.com',
    avatar_url: '', role: 'supervisor', is_online: true, created_at: '2024-02-01T10:00:00Z'
  },
  {
    id: 'usr-3', workspace_id: 'ws-1', name: 'Juliana Costa', email: 'juliana@atendepro.com',
    avatar_url: '', role: 'atendente', is_online: false, created_at: '2024-03-10T10:00:00Z'
  },
];

export const mockAgentProfiles: AgentProfile[] = [
  { id: 'ap-1', user_id: 'usr-1', display_name: 'Ana Silva', max_concurrent_chats: 10, active_chats: 3, is_available: true },
  { id: 'ap-2', user_id: 'usr-2', display_name: 'Carlos Mendes', max_concurrent_chats: 8, active_chats: 5, is_available: true },
  { id: 'ap-3', user_id: 'usr-3', display_name: 'Juliana Costa', max_concurrent_chats: 6, active_chats: 0, is_available: false },
];

// ============================================
// TAGS
// ============================================
export const mockTags: Tag[] = [
  { id: 'tag-1', workspace_id: 'ws-1', name: 'Urgente', color: '#EF4444', usage_count: 23 },
  { id: 'tag-2', workspace_id: 'ws-1', name: 'VIP', color: '#F59E0B', usage_count: 12 },
  { id: 'tag-3', workspace_id: 'ws-1', name: 'Suporte', color: '#3B82F6', usage_count: 45 },
  { id: 'tag-4', workspace_id: 'ws-1', name: 'Vendas', color: '#10B981', usage_count: 31 },
  { id: 'tag-5', workspace_id: 'ws-1', name: 'Financeiro', color: '#8B5CF6', usage_count: 17 },
  { id: 'tag-6', workspace_id: 'ws-1', name: 'Reclamação', color: '#EC4899', usage_count: 8 },
  { id: 'tag-7', workspace_id: 'ws-1', name: 'Novo Lead', color: '#06B6D4', usage_count: 38 },
  { id: 'tag-8', workspace_id: 'ws-1', name: 'Retorno', color: '#84CC16', usage_count: 14 },
];

// ============================================
// QUEUES
// ============================================
export const mockQueues: Queue[] = [
  { id: 'q-1', workspace_id: 'ws-1', name: 'Suporte Geral', description: 'Atendimento geral ao cliente', color: '#3B82F6', agent_ids: ['usr-1', 'usr-3'] },
  { id: 'q-2', workspace_id: 'ws-1', name: 'Vendas', description: 'Equipe comercial', color: '#10B981', agent_ids: ['usr-2'] },
  { id: 'q-3', workspace_id: 'ws-1', name: 'Financeiro', description: 'Cobranças e pagamentos', color: '#8B5CF6', agent_ids: ['usr-1'] },
];

// ============================================
// CONTACTS
// ============================================
export const mockContacts: Contact[] = [
  { id: 'ct-1', workspace_id: 'ws-1', name: 'Maria Oliveira', phone: '+5511999887766', email: 'maria@email.com', notes: 'Cliente desde 2023. Prefere atendimento rápido.', tags: [mockTags[1], mockTags[3]], origin: 'whatsapp', created_at: '2024-01-20T10:00:00Z', last_seen: '2024-03-28T14:30:00Z' },
  { id: 'ct-2', workspace_id: 'ws-1', name: 'João Santos', phone: '+5521988776655', email: 'joao.santos@empresa.com', notes: 'Empresa: TechBR Soluções', tags: [mockTags[2]], origin: 'whatsapp', created_at: '2024-02-10T10:00:00Z', last_seen: '2024-03-28T16:00:00Z' },
  { id: 'ct-3', workspace_id: 'ws-1', name: 'Fernanda Lima', phone: '+5531977665544', tags: [mockTags[0], mockTags[5]], origin: 'whatsapp', created_at: '2024-02-15T10:00:00Z', last_seen: '2024-03-28T10:00:00Z' },
  { id: 'ct-4', workspace_id: 'ws-1', name: 'Ricardo Almeida', phone: '+5511966554433', email: 'ricardo@gmail.com', tags: [mockTags[6]], origin: 'manual', created_at: '2024-03-01T10:00:00Z', last_seen: '2024-03-27T09:00:00Z' },
  { id: 'ct-5', workspace_id: 'ws-1', name: 'Patrícia Souza', phone: '+5548955443322', tags: [mockTags[3], mockTags[7]], origin: 'whatsapp', created_at: '2024-03-05T10:00:00Z', last_seen: '2024-03-28T11:30:00Z' },
  { id: 'ct-6', workspace_id: 'ws-1', name: 'Bruno Ferreira', phone: '+5519944332211', email: 'bruno.f@hotmail.com', tags: [mockTags[4]], origin: 'whatsapp', created_at: '2024-03-10T10:00:00Z', last_seen: '2024-03-28T08:00:00Z' },
  { id: 'ct-7', workspace_id: 'ws-1', name: 'Camila Rodrigues', phone: '+5541933221100', tags: [mockTags[2], mockTags[6]], origin: 'import', created_at: '2024-03-12T10:00:00Z', last_seen: '2024-03-26T15:00:00Z' },
  { id: 'ct-8', workspace_id: 'ws-1', name: 'Diego Martins', phone: '+5585922110099', tags: [mockTags[1]], origin: 'whatsapp', created_at: '2024-03-14T10:00:00Z', last_seen: '2024-03-28T13:00:00Z' },
  { id: 'ct-9', workspace_id: 'ws-1', name: 'Grupo - Equipe Comercial', phone: '', tags: [], origin: 'whatsapp', created_at: '2024-03-15T10:00:00Z' },
  { id: 'ct-10', workspace_id: 'ws-1', name: 'Larissa Nunes', phone: '+5527911009988', email: 'larissa@startup.io', tags: [mockTags[3], mockTags[6]], origin: 'api', created_at: '2024-03-18T10:00:00Z', last_seen: '2024-03-28T17:00:00Z' },
];

// ============================================
// CONVERSATIONS
// ============================================
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1', workspace_id: 'ws-1', contact_id: 'ct-1', contact: mockContacts[0],
    channel: 'whatsapp', type: 'individual', status: 'attending',
    assigned_agent_id: 'usr-1', assigned_agent: mockUsers[0], queue_id: 'q-2', queue: mockQueues[1],
    tags: [mockTags[1], mockTags[3]], is_bot_active: false, is_favorited: true,
    unread_count: 2, last_message_at: '2024-03-28T14:32:00Z', created_at: '2024-03-25T10:00:00Z',
    last_message: { id: 'msg-1a', conversation_id: 'conv-1', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Oi, gostaria de saber sobre o plano empresarial. Vocês têm desconto para startups?', status: 'delivered', created_at: '2024-03-28T14:32:00Z' }
  },
  {
    id: 'conv-2', workspace_id: 'ws-1', contact_id: 'ct-2', contact: mockContacts[1],
    channel: 'whatsapp', type: 'individual', status: 'open',
    tags: [mockTags[2]], is_bot_active: true, is_favorited: false,
    unread_count: 5, last_message_at: '2024-03-28T16:05:00Z', created_at: '2024-03-28T15:50:00Z',
    last_message: { id: 'msg-2a', conversation_id: 'conv-2', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Estou com problema no login. Já tentei redefinir a senha duas vezes e não funciona.', status: 'delivered', created_at: '2024-03-28T16:05:00Z' }
  },
  {
    id: 'conv-3', workspace_id: 'ws-1', contact_id: 'ct-3', contact: mockContacts[2],
    channel: 'whatsapp', type: 'individual', status: 'pending',
    assigned_agent_id: 'usr-2', assigned_agent: mockUsers[1],
    tags: [mockTags[0], mockTags[5]], is_bot_active: false, is_favorited: false,
    unread_count: 1, last_message_at: '2024-03-28T10:15:00Z', created_at: '2024-03-27T09:00:00Z',
    last_message: { id: 'msg-3a', conversation_id: 'conv-3', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Preciso de uma solução urgente. Meu pedido #4521 está atrasado há 5 dias!', status: 'delivered', created_at: '2024-03-28T10:15:00Z' }
  },
  {
    id: 'conv-4', workspace_id: 'ws-1', contact_id: 'ct-4', contact: mockContacts[3],
    channel: 'whatsapp', type: 'individual', status: 'resolved',
    assigned_agent_id: 'usr-1', assigned_agent: mockUsers[0],
    tags: [mockTags[6]], is_bot_active: false, is_favorited: false,
    unread_count: 0, last_message_at: '2024-03-27T09:30:00Z', resolved_at: '2024-03-27T09:30:00Z', created_at: '2024-03-26T14:00:00Z',
    last_message: { id: 'msg-4a', conversation_id: 'conv-4', sender_type: 'agent', sender_name: 'Ana Silva', direction: 'outbound', type: 'text', content: 'Perfeito, Ricardo! Fico feliz em ajudar. Qualquer dúvida, estamos à disposição. 😊', status: 'read', created_at: '2024-03-27T09:30:00Z' }
  },
  {
    id: 'conv-5', workspace_id: 'ws-1', contact_id: 'ct-5', contact: mockContacts[4],
    channel: 'whatsapp', type: 'individual', status: 'attending',
    assigned_agent_id: 'usr-2', assigned_agent: mockUsers[1], queue_id: 'q-2', queue: mockQueues[1],
    tags: [mockTags[3], mockTags[7]], is_bot_active: false, is_favorited: true,
    unread_count: 0, last_message_at: '2024-03-28T11:45:00Z', created_at: '2024-03-27T16:00:00Z',
    last_message: { id: 'msg-5a', conversation_id: 'conv-5', sender_type: 'agent', sender_name: 'Carlos Mendes', direction: 'outbound', type: 'text', content: 'Patrícia, vou enviar a proposta atualizada até o final do dia. Combinado?', status: 'read', created_at: '2024-03-28T11:45:00Z' }
  },
  {
    id: 'conv-6', workspace_id: 'ws-1', contact_id: 'ct-6', contact: mockContacts[5],
    channel: 'whatsapp', type: 'individual', status: 'open',
    tags: [mockTags[4]], is_bot_active: false, is_favorited: false,
    unread_count: 3, last_message_at: '2024-03-28T08:20:00Z', created_at: '2024-03-28T08:00:00Z',
    last_message: { id: 'msg-6a', conversation_id: 'conv-6', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Bom dia! Preciso do boleto atualizado da fatura de março. Podem enviar?', status: 'delivered', created_at: '2024-03-28T08:20:00Z' }
  },
  {
    id: 'conv-7', workspace_id: 'ws-1', contact_id: 'ct-9', contact: mockContacts[8],
    channel: 'whatsapp', type: 'group', status: 'open',
    tags: [], is_bot_active: false, is_favorited: false,
    unread_count: 12, last_message_at: '2024-03-28T17:00:00Z', created_at: '2024-03-20T10:00:00Z',
    group_name: 'Equipe Comercial', group_participants: 8,
    last_message: { id: 'msg-7a', conversation_id: 'conv-7', sender_type: 'contact', sender_name: 'Diego', direction: 'inbound', type: 'text', content: 'Pessoal, alguém sabe se o cliente da Zona Sul confirmou a reunião de amanhã?', status: 'delivered', created_at: '2024-03-28T17:00:00Z' }
  },
  {
    id: 'conv-8', workspace_id: 'ws-1', contact_id: 'ct-7', contact: mockContacts[6],
    channel: 'whatsapp', type: 'individual', status: 'resolved',
    assigned_agent_id: 'usr-3', assigned_agent: mockUsers[2],
    tags: [mockTags[2], mockTags[6]], is_bot_active: false, is_favorited: false,
    unread_count: 0, last_message_at: '2024-03-26T15:30:00Z', resolved_at: '2024-03-26T15:30:00Z', created_at: '2024-03-25T11:00:00Z',
    last_message: { id: 'msg-8a', conversation_id: 'conv-8', sender_type: 'agent', sender_name: 'Juliana Costa', direction: 'outbound', type: 'text', content: 'Camila, o problema foi resolvido. A integração está funcionando normalmente agora.', status: 'read', created_at: '2024-03-26T15:30:00Z' }
  },
  {
    id: 'conv-9', workspace_id: 'ws-1', contact_id: 'ct-8', contact: mockContacts[7],
    channel: 'whatsapp', type: 'individual', status: 'attending',
    assigned_agent_id: 'usr-1', assigned_agent: mockUsers[0],
    tags: [mockTags[1]], is_bot_active: false, is_favorited: false,
    unread_count: 1, last_message_at: '2024-03-28T13:10:00Z', created_at: '2024-03-28T12:00:00Z',
    last_message: { id: 'msg-9a', conversation_id: 'conv-9', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Obrigado pela informação! Vou analisar e retorno em breve.', status: 'delivered', created_at: '2024-03-28T13:10:00Z' }
  },
  {
    id: 'conv-10', workspace_id: 'ws-1', contact_id: 'ct-10', contact: mockContacts[9],
    channel: 'whatsapp', type: 'individual', status: 'open',
    tags: [mockTags[3], mockTags[6]], is_bot_active: true, is_favorited: false,
    unread_count: 4, last_message_at: '2024-03-28T17:20:00Z', created_at: '2024-03-28T17:00:00Z',
    last_message: { id: 'msg-10a', conversation_id: 'conv-10', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Oi! Vi o anúncio de vocês no Instagram. Quero saber mais sobre a plataforma.', status: 'delivered', created_at: '2024-03-28T17:20:00Z' }
  },
];

// ============================================
// MESSAGES (for conv-1)
// ============================================
export const mockMessages: Record<string, Message[]> = {
  'conv-1': [
    { id: 'msg-c1-1', conversation_id: 'conv-1', sender_type: 'bot', direction: 'outbound', type: 'text', content: 'Olá! 👋 Bem-vindo(a) ao AtendePro. Como posso ajudar você hoje?\n\n1️⃣ Vendas\n2️⃣ Suporte\n3️⃣ Financeiro\n4️⃣ Outros', status: 'read', created_at: '2024-03-25T10:00:00Z' },
    { id: 'msg-c1-2', conversation_id: 'conv-1', sender_type: 'contact', direction: 'inbound', type: 'text', content: '1', status: 'read', created_at: '2024-03-25T10:01:00Z' },
    { id: 'msg-c1-3', conversation_id: 'conv-1', sender_type: 'system', direction: 'outbound', type: 'system', content: 'Conversa transferida para a fila Vendas', status: 'read', created_at: '2024-03-25T10:01:05Z' },
    { id: 'msg-c1-4', conversation_id: 'conv-1', sender_type: 'agent', sender_name: 'Ana Silva', sender_id: 'usr-1', direction: 'outbound', type: 'text', content: 'Olá, Maria! Eu sou a Ana, da equipe de vendas. Tudo bem? Em que posso te ajudar?', status: 'read', created_at: '2024-03-25T10:05:00Z' },
    { id: 'msg-c1-5', conversation_id: 'conv-1', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Oi Ana! Tudo sim. Estou procurando uma solução de atendimento para minha loja. Vocês atendem pequenas empresas?', status: 'read', created_at: '2024-03-25T10:07:00Z' },
    { id: 'msg-c1-6', conversation_id: 'conv-1', sender_type: 'agent', sender_name: 'Ana Silva', sender_id: 'usr-1', direction: 'outbound', type: 'text', content: 'Com certeza, Maria! Temos planos a partir de R$ 97/mês que são perfeitos para operações menores. Você tem quantos atendentes hoje?', status: 'read', created_at: '2024-03-25T10:10:00Z' },
    { id: 'msg-c1-7', conversation_id: 'conv-1', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Somos 3 pessoas que atendem os clientes. Hoje usamos só o WhatsApp pessoal mesmo, tá uma bagunça 😅', status: 'read', created_at: '2024-03-25T10:12:00Z' },
    { id: 'msg-c1-8', conversation_id: 'conv-1', sender_type: 'agent', sender_name: 'Ana Silva', sender_id: 'usr-1', direction: 'outbound', type: 'text', content: 'Entendo perfeitamente! Esse é o cenário mais comum. Com o AtendePro, vocês centralizam tudo, cada atendente tem sua fila e ninguém perde conversa. Vou preparar uma proposta personalizada para vocês!', status: 'read', created_at: '2024-03-25T10:15:00Z' },
    { id: 'msg-c1-9', conversation_id: 'conv-1', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Oi, gostaria de saber sobre o plano empresarial. Vocês têm desconto para startups?', status: 'delivered', created_at: '2024-03-28T14:32:00Z' },
  ],
  'conv-2': [
    { id: 'msg-c2-1', conversation_id: 'conv-2', sender_type: 'bot', direction: 'outbound', type: 'text', content: 'Olá! 👋 Bem-vindo(a) ao suporte. Como posso ajudar?\n\n1️⃣ Problema técnico\n2️⃣ Dúvida sobre o serviço\n3️⃣ Falar com atendente', status: 'read', created_at: '2024-03-28T15:50:00Z' },
    { id: 'msg-c2-2', conversation_id: 'conv-2', sender_type: 'contact', direction: 'inbound', type: 'text', content: '1', status: 'read', created_at: '2024-03-28T15:51:00Z' },
    { id: 'msg-c2-3', conversation_id: 'conv-2', sender_type: 'bot', direction: 'outbound', type: 'text', content: 'Entendi que você está com um problema técnico. Pode descrever o que está acontecendo?', status: 'read', created_at: '2024-03-28T15:51:05Z' },
    { id: 'msg-c2-4', conversation_id: 'conv-2', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Estou com problema no login. Já tentei redefinir a senha duas vezes e não funciona.', status: 'delivered', created_at: '2024-03-28T16:05:00Z' },
  ],
  'conv-3': [
    { id: 'msg-c3-1', conversation_id: 'conv-3', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Boa tarde, preciso falar sobre meu pedido', status: 'read', created_at: '2024-03-27T09:00:00Z' },
    { id: 'msg-c3-2', conversation_id: 'conv-3', sender_type: 'agent', sender_name: 'Carlos Mendes', sender_id: 'usr-2', direction: 'outbound', type: 'text', content: 'Olá Fernanda, pode me informar o número do pedido?', status: 'read', created_at: '2024-03-27T09:05:00Z' },
    { id: 'msg-c3-3', conversation_id: 'conv-3', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Pedido #4521. Estava previsto para chegar segunda-feira e até agora nada.', status: 'read', created_at: '2024-03-27T09:07:00Z' },
    { id: 'msg-c3-4', conversation_id: 'conv-3', sender_type: 'agent', sender_name: 'Carlos Mendes', sender_id: 'usr-2', direction: 'outbound', type: 'text', content: 'Vou verificar agora mesmo, Fernanda. Me dá um momento.', status: 'read', created_at: '2024-03-27T09:08:00Z' },
    { id: 'msg-c3-5', conversation_id: 'conv-3', sender_type: 'contact', direction: 'inbound', type: 'text', content: 'Preciso de uma solução urgente. Meu pedido #4521 está atrasado há 5 dias!', status: 'delivered', created_at: '2024-03-28T10:15:00Z' },
  ],
};

// ============================================
// INTERNAL NOTES
// ============================================
export const mockNotes: InternalNote[] = [
  { id: 'note-1', conversation_id: 'conv-1', user_id: 'usr-1', user_name: 'Ana Silva', content: 'Cliente interessada no plano empresarial. Preparar proposta com desconto de 15% para startups.', created_at: '2024-03-25T10:20:00Z' },
  { id: 'note-2', conversation_id: 'conv-3', user_id: 'usr-2', user_name: 'Carlos Mendes', content: 'Pedido #4521 com problema na transportadora. Aberto chamado #789 na logística.', created_at: '2024-03-27T09:10:00Z' },
];

// ============================================
// WHATSAPP INSTANCES
// ============================================
export const mockInstances: WhatsAppInstance[] = [
  {
    id: 'inst-1', workspace_id: 'ws-1', name: 'Atendimento Principal',
    phone_number: '+5511999000001', status: 'connected',
    api_url: 'https://api.uazapi.com', last_seen: '2024-03-28T17:30:00Z',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'inst-2', workspace_id: 'ws-1', name: 'Vendas',
    phone_number: '+5511999000002', status: 'disconnected',
    api_url: 'https://api.uazapi.com',
    created_at: '2024-02-20T10:00:00Z'
  },
];

// ============================================
// QUICK REPLIES
// ============================================
export const mockQuickReplies: QuickReply[] = [
  { id: 'qr-1', workspace_id: 'ws-1', title: 'Saudação', shortcut: '/ola', content: 'Olá, {{nome_cliente}}! Tudo bem? Eu sou {{atendente}} da {{empresa}}. Como posso ajudar?', category: 'Geral', variables: ['nome_cliente', 'atendente', 'empresa'] },
  { id: 'qr-2', workspace_id: 'ws-1', title: 'Despedida', shortcut: '/tchau', content: 'Foi um prazer ajudar, {{nome_cliente}}! Se precisar de algo mais, estamos à disposição. Tenha um ótimo dia! 😊', category: 'Geral', variables: ['nome_cliente'] },
  { id: 'qr-3', workspace_id: 'ws-1', title: 'Aguardar', shortcut: '/aguarde', content: 'Um momento, por favor. Estou verificando essa informação para você. 🔍', category: 'Suporte', variables: [] },
  { id: 'qr-4', workspace_id: 'ws-1', title: 'Horário', shortcut: '/horario', content: 'Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Aos sábados, das 9h às 13h.', category: 'Informação', variables: [] },
  { id: 'qr-5', workspace_id: 'ws-1', title: 'Boleto', shortcut: '/boleto', content: 'Vou gerar um novo boleto para você agora mesmo, {{nome_cliente}}. Em instantes envio aqui. 📄', category: 'Financeiro', variables: ['nome_cliente'] },
];

// ============================================
// FLOWS
// ============================================
const welcomeNodes: FlowNode[] = [
  { id: 'fn-1', flow_id: 'flow-1', type: 'send_message', position: 0, config: { message: 'Olá! 👋 Bem-vindo(a) ao AtendePro. Como posso ajudar?\n\n1️⃣ Vendas\n2️⃣ Suporte\n3️⃣ Financeiro\n4️⃣ Outros' }, next_node_id: 'fn-2' },
  { id: 'fn-2', flow_id: 'flow-1', type: 'wait_response', position: 1, config: { timeout: 300 }, next_node_id: 'fn-3' },
  { id: 'fn-3', flow_id: 'flow-1', type: 'condition', position: 2, config: { variable: 'response', operator: 'equals', value: '1' }, condition_true_node_id: 'fn-4', condition_false_node_id: 'fn-5' },
  { id: 'fn-4', flow_id: 'flow-1', type: 'assign_queue', position: 3, config: { queue_id: 'q-2', queue_name: 'Vendas' }, next_node_id: 'fn-7' },
  { id: 'fn-5', flow_id: 'flow-1', type: 'condition', position: 4, config: { variable: 'response', operator: 'equals', value: '2' }, condition_true_node_id: 'fn-6', condition_false_node_id: 'fn-8' },
  { id: 'fn-6', flow_id: 'flow-1', type: 'assign_queue', position: 5, config: { queue_id: 'q-1', queue_name: 'Suporte Geral' }, next_node_id: 'fn-7' },
  { id: 'fn-7', flow_id: 'flow-1', type: 'transfer_human', position: 6, config: { message: 'Vou transferir você para um de nossos atendentes. Aguarde um momento! 🙏' } },
  { id: 'fn-8', flow_id: 'flow-1', type: 'send_message', position: 7, config: { message: 'Desculpe, não entendi sua opção. Pode tentar novamente?' }, next_node_id: 'fn-1' },
];

export const mockFlows: Flow[] = [
  {
    id: 'flow-1', workspace_id: 'ws-1', name: 'Boas-vindas', description: 'Fluxo de entrada com menu de opções',
    is_active: true, trigger: 'welcome', nodes: welcomeNodes,
    created_at: '2024-01-20T10:00:00Z', updated_at: '2024-03-15T10:00:00Z', executions_count: 342
  },
  {
    id: 'flow-2', workspace_id: 'ws-1', name: 'Fora do Horário', description: 'Mensagem automática fora do expediente',
    is_active: true, trigger: 'keyword', trigger_value: '__off_hours__',
    nodes: [
      { id: 'fn-oh-1', flow_id: 'flow-2', type: 'send_message', position: 0, config: { message: 'Olá! Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Deixe sua mensagem que retornaremos assim que possível! ⏰' }, next_node_id: 'fn-oh-2' },
      { id: 'fn-oh-2', flow_id: 'flow-2', type: 'add_tag', position: 1, config: { tag_id: 'tag-7', tag_name: 'Retorno' }, next_node_id: 'fn-oh-3' },
      { id: 'fn-oh-3', flow_id: 'flow-2', type: 'end', position: 2, config: {} },
    ],
    created_at: '2024-02-01T10:00:00Z', updated_at: '2024-03-10T10:00:00Z', executions_count: 128
  },
];

export const mockFlowExecutions: FlowExecution[] = [
  { id: 'fe-1', flow_id: 'flow-1', conversation_id: 'conv-1', contact_name: 'Maria Oliveira', current_node_id: 'fn-7', status: 'completed', started_at: '2024-03-25T10:00:00Z', finished_at: '2024-03-25T10:01:05Z' },
  { id: 'fe-2', flow_id: 'flow-1', conversation_id: 'conv-2', contact_name: 'João Santos', current_node_id: 'fn-3', status: 'running', started_at: '2024-03-28T15:50:00Z' },
  { id: 'fe-3', flow_id: 'flow-2', conversation_id: 'conv-10', contact_name: 'Larissa Nunes', current_node_id: 'fn-oh-3', status: 'completed', started_at: '2024-03-28T17:00:00Z', finished_at: '2024-03-28T17:00:02Z' },
];

// ============================================
// BUSINESS HOURS
// ============================================
export const mockBusinessHours: BusinessHours[] = [
  { id: 'bh-0', workspace_id: 'ws-1', day_of_week: 0, is_open: false, open_time: '09:00', close_time: '13:00' },
  { id: 'bh-1', workspace_id: 'ws-1', day_of_week: 1, is_open: true, open_time: '08:00', close_time: '18:00' },
  { id: 'bh-2', workspace_id: 'ws-1', day_of_week: 2, is_open: true, open_time: '08:00', close_time: '18:00' },
  { id: 'bh-3', workspace_id: 'ws-1', day_of_week: 3, is_open: true, open_time: '08:00', close_time: '18:00' },
  { id: 'bh-4', workspace_id: 'ws-1', day_of_week: 4, is_open: true, open_time: '08:00', close_time: '18:00' },
  { id: 'bh-5', workspace_id: 'ws-1', day_of_week: 5, is_open: true, open_time: '08:00', close_time: '18:00' },
  { id: 'bh-6', workspace_id: 'ws-1', day_of_week: 6, is_open: true, open_time: '09:00', close_time: '13:00' },
];

// ============================================
// AUDIT LOG
// ============================================
export const mockAuditLogs: AuditLog[] = [
  { id: 'al-1', workspace_id: 'ws-1', user_id: 'usr-1', user_name: 'Ana Silva', action: 'conversation.assigned', entity_type: 'conversation', entity_id: 'conv-1', details: { agent: 'Ana Silva' }, created_at: '2024-03-25T10:04:00Z' },
  { id: 'al-2', workspace_id: 'ws-1', user_id: 'usr-2', user_name: 'Carlos Mendes', action: 'tag.added', entity_type: 'conversation', entity_id: 'conv-3', details: { tag: 'Urgente' }, created_at: '2024-03-27T09:06:00Z' },
  { id: 'al-3', workspace_id: 'ws-1', user_id: 'usr-1', user_name: 'Ana Silva', action: 'conversation.resolved', entity_type: 'conversation', entity_id: 'conv-4', created_at: '2024-03-27T09:30:00Z' },
  { id: 'al-4', workspace_id: 'ws-1', user_id: 'usr-1', user_name: 'Ana Silva', action: 'instance.connected', entity_type: 'whatsapp_instance', entity_id: 'inst-1', created_at: '2024-03-28T08:00:00Z' },
];

// ============================================
// WEBHOOK EVENTS
// ============================================
export const mockWebhookEvents: WebhookEvent[] = [
  { id: 'we-1', workspace_id: 'ws-1', event_type: 'message.received', payload: { from: '+5511999887766', body: 'Olá' }, status: 'processed', created_at: '2024-03-28T14:32:00Z' },
  { id: 'we-2', workspace_id: 'ws-1', event_type: 'message.status', payload: { message_id: 'ext-123', status: 'read' }, status: 'processed', created_at: '2024-03-28T14:33:00Z' },
  { id: 'we-3', workspace_id: 'ws-1', event_type: 'message.received', payload: { from: '+5521988776655', body: '1' }, status: 'failed', error: 'Timeout na fila', created_at: '2024-03-28T15:51:00Z' },
];

// ============================================
// DASHBOARD METRICS
// ============================================
export const mockDashboardMetrics: DashboardMetrics = {
  open_conversations: 4,
  unread_conversations: 6,
  pending_conversations: 1,
  resolved_today: 3,
  avg_first_response_time: 4.2,
  avg_resolution_time: 47,
  agents_online: 2,
  total_agents: 3,
  conversations_by_agent: [
    { agent_name: 'Ana Silva', count: 12 },
    { agent_name: 'Carlos Mendes', count: 9 },
    { agent_name: 'Juliana Costa', count: 5 },
  ],
  volume_by_day: [
    { date: '22/03', count: 18 },
    { date: '23/03', count: 25 },
    { date: '24/03', count: 12 },
    { date: '25/03', count: 32 },
    { date: '26/03', count: 28 },
    { date: '27/03', count: 22 },
    { date: '28/03', count: 35 },
  ],
  tags_usage: [
    { tag_name: 'Suporte', color: '#3B82F6', count: 45 },
    { tag_name: 'Novo Lead', color: '#06B6D4', count: 38 },
    { tag_name: 'Vendas', color: '#10B981', count: 31 },
    { tag_name: 'Urgente', color: '#EF4444', count: 23 },
    { tag_name: 'Financeiro', color: '#8B5CF6', count: 17 },
  ],
};
