import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Phone, Mail, MapPin, Calendar, Tag, MessageSquare, StickyNote,
  User, Clock, ExternalLink
} from 'lucide-react';
import type { Conversation, InternalNote } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  conversation: Conversation;
  notes: InternalNote[];
}

export function ContactPanel({ conversation, notes }: Props) {
  const contact = conversation.contact;
  const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="p-4 space-y-5">
      {/* Contact Header */}
      <div className="text-center">
        <Avatar className="h-16 w-16 mx-auto mb-3">
          <AvatarFallback className="text-lg font-semibold bg-accent text-accent-foreground">{initials}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold text-base">{contact.name}</h3>
        {contact.phone && (
          <p className="text-sm text-muted-foreground">{contact.phone}</p>
        )}
        <div className="flex justify-center gap-2 mt-3">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <User className="h-3.5 w-3.5 mr-1" /> Ver perfil
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <ExternalLink className="h-3.5 w-3.5 mr-1" /> Abrir
          </Button>
        </div>
      </div>

      <Separator />

      {/* Contact Info */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Informações</h4>
        <div className="space-y-2.5">
          {contact.phone && (
            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-2.5 text-sm">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2.5 text-sm">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Cliente desde {new Date(contact.created_at).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Origem: {contact.origin === 'whatsapp' ? 'WhatsApp' : contact.origin === 'manual' ? 'Manual' : contact.origin === 'import' ? 'Importação' : 'API'}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tags */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</h4>
          <Button variant="ghost" size="sm" className="h-6 text-xs text-primary">+ Adicionar</Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {conversation.tags.length > 0 ? conversation.tags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: tag.color + '20', color: tag.color }}
            >
              {tag.name}
            </span>
          )) : (
            <span className="text-xs text-muted-foreground">Nenhuma tag</span>
          )}
        </div>
      </div>

      <Separator />

      {/* Assignment */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Atribuição</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Agente</span>
            <span className="font-medium">{conversation.assigned_agent?.name || 'Não atribuído'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fila</span>
            <span className="font-medium">{conversation.queue?.name || 'Sem fila'}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Internal Notes */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notas Internas</h4>
          <Button variant="ghost" size="sm" className="h-6 text-xs text-primary">+ Nova</Button>
        </div>
        {notes.length > 0 ? notes.map(note => (
          <div key={note.id} className="bg-status-pending/5 border border-status-pending/20 rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <StickyNote className="h-3 w-3 text-status-pending" />
              <span className="text-[11px] font-medium">{note.user_name}</span>
              <span className="text-[10px] text-muted-foreground">
                {new Date(note.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{note.content}</p>
          </div>
        )) : (
          <p className="text-xs text-muted-foreground">Nenhuma nota interna</p>
        )}
      </div>

      {/* Notes */}
      {contact.notes && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Observações</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{contact.notes}</p>
          </div>
        </>
      )}
    </div>
  );
}
