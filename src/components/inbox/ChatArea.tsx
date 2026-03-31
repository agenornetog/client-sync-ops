import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Send, Paperclip, Smile, MoreVertical, Phone, User, Bot,
  CheckCheck, Check, Clock, Star, Tag, UserPlus, ArrowRightLeft,
  XCircle, StickyNote, PanelRightOpen, PanelRightClose, Users as UsersIcon
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { Conversation, Message } from '@/types';
import { cn } from '@/lib/utils';
import { useQuickReplies } from '@/hooks/useConversations';
import { mockQuickReplies } from '@/data/mock';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const statusLabel: Record<string, string> = {
  open: 'Aberta', pending: 'Pendente', attending: 'Em atendimento', resolved: 'Resolvida', closed: 'Fechada'
};

const statusColor: Record<string, string> = {
  open: 'bg-status-unread/10 text-status-unread', pending: 'bg-status-pending/10 text-status-pending',
  attending: 'bg-status-attending/10 text-status-attending', resolved: 'bg-status-resolved/10 text-muted-foreground',
};

const msgStatusIcon: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3 text-muted-foreground" />,
  sent: <Check className="h-3 w-3 text-muted-foreground" />,
  delivered: <CheckCheck className="h-3 w-3 text-muted-foreground" />,
  read: <CheckCheck className="h-3 w-3 text-primary" />,
};

interface Props {
  conversation: Conversation;
  messages: Message[];
  onToggleContactPanel: () => void;
}

export function ChatArea({ conversation, messages, onToggleContactPanel }: Props) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contact = conversation.contact;
  const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Quick replies from Supabase or mock
  const { data: supaQuickReplies } = useQuickReplies();
  const quickReplies = supaQuickReplies && supaQuickReplies.length > 0
    ? supaQuickReplies
    : mockQuickReplies;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, conversation.id]);

  const handleInputChange = (value: string) => {
    setInput(value);
    setShowQuickReplies(value.startsWith('/'));
  };

  const filteredQuickReplies = showQuickReplies
    ? quickReplies.filter(qr => qr.shortcut.startsWith(input.toLowerCase()))
    : [];

  const applyQuickReply = (content: string) => {
    const replaced = content
      .replace(/\{\{nome_cliente\}\}/g, contact.name.split(' ')[0])
      .replace(/\{\{atendente\}\}/g, 'Agente')
      .replace(/\{\{empresa\}\}/g, 'AtendePro');
    setInput(replaced);
    setShowQuickReplies(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    try {
      // Try sending via edge function (real UAZAPI)
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        const { error } = await supabase.functions.invoke('send-message', {
          body: {
            type: 'text',
            conversation_id: conversation.id,
            content: text,
          },
        });

        if (error) throw error;
        setInput('');
        toast.success('Mensagem enviada');
      } else {
        // No auth session — just clear input (mock mode)
        setInput('');
        toast.info('Modo demo: mensagem não enviada (faça login para enviar)');
      }
    } catch (err: any) {
      console.error('Send error:', err);
      toast.error('Erro ao enviar mensagem');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b bg-card shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {conversation.type === 'group' && <UsersIcon className="h-3.5 w-3.5 text-muted-foreground" />}
              <h3 className="text-sm font-semibold truncate">
                {conversation.type === 'group' ? conversation.group_name : contact.name}
              </h3>
              {conversation.is_bot_active && (
                <Badge variant="secondary" className="text-[10px] gap-1 h-5">
                  <Bot className="h-3 w-3" /> Bot ativo
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium", statusColor[conversation.status])}>
                {statusLabel[conversation.status]}
              </span>
              {conversation.assigned_agent && (
                <span>• {conversation.assigned_agent.name}</span>
              )}
              {conversation.queue && (
                <span>• {conversation.queue.name}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleContactPanel}>
            <PanelRightOpen className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem><Star className="h-4 w-4 mr-2" /> Favoritar</DropdownMenuItem>
              <DropdownMenuItem><Tag className="h-4 w-4 mr-2" /> Adicionar tag</DropdownMenuItem>
              <DropdownMenuItem><UserPlus className="h-4 w-4 mr-2" /> Atribuir agente</DropdownMenuItem>
              <DropdownMenuItem><ArrowRightLeft className="h-4 w-4 mr-2" /> Transferir</DropdownMenuItem>
              <DropdownMenuItem><StickyNote className="h-4 w-4 mr-2" /> Nota interna</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><CheckCheck className="h-4 w-4 mr-2" /> Marcar como lida</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive"><XCircle className="h-4 w-4 mr-2" /> Encerrar conversa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3 bg-muted/20">
        {messages.map(msg => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full">{msg.content}</span>
              </div>
            );
          }

          const isOutbound = msg.direction === 'outbound';
          const isBot = msg.sender_type === 'bot';
          const time = new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

          return (
            <div key={msg.id} className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                isOutbound
                  ? isBot
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border rounded-bl-md"
              )}>
                {msg.sender_name && isOutbound && (
                  <p className={cn("text-[11px] font-medium mb-0.5", isBot ? "text-primary" : "text-primary-foreground/70")}>
                    {isBot ? '🤖 Bot' : msg.sender_name}
                  </p>
                )}
                {msg.sender_name && !isOutbound && conversation.type === 'group' && (
                  <p className="text-[11px] font-medium text-primary mb-0.5">{msg.sender_name}</p>
                )}
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <div className={cn("flex items-center gap-1 mt-1", isOutbound ? "justify-end" : "justify-start")}>
                  <span className={cn("text-[10px]", isOutbound ? (isBot ? "text-accent-foreground/50" : "text-primary-foreground/60") : "text-muted-foreground")}>{time}</span>
                  {isOutbound && msgStatusIcon[msg.status]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t bg-card p-3 shrink-0 relative">
        {/* Quick Replies Popup */}
        {showQuickReplies && filteredQuickReplies.length > 0 && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-popover border rounded-lg shadow-lg max-h-48 overflow-auto">
            {filteredQuickReplies.map(qr => (
              <button
                key={qr.id}
                onClick={() => applyQuickReply(qr.content)}
                className="w-full text-left px-3 py-2 hover:bg-muted transition-colors border-b last:border-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{qr.title}</span>
                  <span className="text-xs text-muted-foreground font-mono">{qr.shortcut}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{qr.content}</p>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Digite uma mensagem... (/ para atalhos)"
              value={input}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') setShowQuickReplies(false);
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend();
              }}
              className="pr-10 bg-muted/50 border-0"
            />
            <button className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Smile className="h-4 w-4" />
            </button>
          </div>
          <Button size="icon" className="h-9 w-9 shrink-0" disabled={!input.trim() || sending} onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 px-1">
          Ctrl+Enter para enviar • Digite / para respostas rápidas
        </p>
      </div>
    </div>
  );
}
