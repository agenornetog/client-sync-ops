import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Users as UsersIcon, Star, Bot } from 'lucide-react';
import type { Conversation } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusFilters = [
  { value: 'all', label: 'Todas' },
  { value: 'open', label: 'Abertas' },
  { value: 'attending', label: 'Em atendimento' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'resolved', label: 'Resolvidas' },
];

const statusDotClass: Record<string, string> = {
  open: 'status-dot-unread',
  pending: 'status-dot-pending',
  attending: 'status-dot-attending',
  resolved: 'status-dot-resolved',
  closed: 'status-dot-resolved',
};

interface Props {
  conversations: Conversation[];
  selectedId: string;
  onSelect: (id: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
}

export function ConversationList({ conversations, selectedId, onSelect, statusFilter, onStatusFilterChange, search, onSearchChange }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search */}
      <div className="px-3 pb-2 pt-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar conversa..."
            className="pl-8 h-8 text-sm bg-muted/50 border-0"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="px-3 pb-2 flex gap-1 overflow-x-auto scrollbar-none">
        {statusFilters.map(f => (
          <button
            key={f.value}
            onClick={() => onStatusFilterChange(f.value)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              statusFilter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Conversation Items */}
      <div className="flex-1 overflow-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm">Nenhuma conversa encontrada</p>
          </div>
        ) : (
          conversations.map(conv => {
            const isSelected = conv.id === selectedId;
            const initials = conv.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const timeAgo = conv.last_message_at
              ? formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: false, locale: ptBR })
              : '';

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "w-full text-left px-3 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors",
                  isSelected && "bg-accent"
                )}
              >
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-xs font-medium bg-muted">{initials}</AvatarFallback>
                    </Avatar>
                    <span className={cn("status-dot absolute -bottom-0.5 -right-0.5 ring-2 ring-card", statusDotClass[conv.status])} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {conv.type === 'group' && <UsersIcon className="h-3 w-3 text-muted-foreground shrink-0" />}
                        <span className="text-sm font-medium truncate">
                          {conv.type === 'group' ? conv.group_name : conv.contact.name}
                        </span>
                        {conv.is_favorited && <Star className="h-3 w-3 text-status-pending fill-status-pending shrink-0" />}
                        {conv.is_bot_active && <Bot className="h-3 w-3 text-primary shrink-0" />}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-1">{timeAgo}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate leading-relaxed">
                      {conv.last_message?.sender_name && `${conv.last_message.sender_name}: `}
                      {conv.last_message?.content || 'Sem mensagens'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {conv.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                      {conv.tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">+{conv.tags.length - 2}</span>
                      )}
                      <div className="flex-1" />
                      {conv.unread_count > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
