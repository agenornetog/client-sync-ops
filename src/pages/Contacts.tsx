import { useState } from 'react';
import { mockContacts, mockTags } from '@/data/mock';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Phone, Mail, Calendar, MessageSquare, Tag, Filter, MoreVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Contact } from '@/types';

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const filtered = mockContacts.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q);
  });

  return (
    <div className="flex h-full">
      {/* Contact List */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar contatos..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-1" /> Filtros</Button>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo contato</Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0">
              <tr className="text-xs text-muted-foreground font-medium">
                <th className="text-left p-3 pl-4">Contato</th>
                <th className="text-left p-3">Telefone</th>
                <th className="text-left p-3 hidden md:table-cell">E-mail</th>
                <th className="text-left p-3 hidden lg:table-cell">Tags</th>
                <th className="text-left p-3 hidden lg:table-cell">Origem</th>
                <th className="text-left p-3 hidden xl:table-cell">Última interação</th>
                <th className="p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(contact => {
                const initials = contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr
                    key={contact.id}
                    className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => setSelectedContact(contact)}
                  >
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{contact.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{contact.phone}</td>
                    <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{contact.email || '—'}</td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {contact.tags.slice(0, 2).map(tag => (
                          <span key={tag.id} className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground hidden lg:table-cell capitalize">{contact.origin === 'whatsapp' ? 'WhatsApp' : contact.origin}</td>
                    <td className="p-3 text-sm text-muted-foreground hidden xl:table-cell">
                      {contact.last_seen ? new Date(contact.last_seen).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="p-3"><MoreVertical className="h-4 w-4 text-muted-foreground" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Detail Panel */}
      {selectedContact && (
        <div className="w-96 border-l bg-card overflow-auto shrink-0 hidden lg:block">
          <div className="p-6">
            <div className="text-center mb-6">
              <Avatar className="h-20 w-20 mx-auto mb-3">
                <AvatarFallback className="text-xl font-semibold bg-accent text-accent-foreground">
                  {selectedContact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">{selectedContact.name}</h2>
              <Badge variant="secondary" className="mt-1 text-xs capitalize">{selectedContact.origin}</Badge>
            </div>

            <Separator className="mb-4" />

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Informações</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedContact.phone}</div>
                  {selectedContact.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{selectedContact.email}</div>}
                  <div className="flex items-center gap-2 text-sm"><Calendar className="h-3.5 w-3.5 text-muted-foreground" />Desde {new Date(selectedContact.created_at).toLocaleDateString('pt-BR')}</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedContact.tags.map(tag => (
                    <span key={tag.id} className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: tag.color + '20', color: tag.color }}>
                      {tag.name}
                    </span>
                  ))}
                  {selectedContact.tags.length === 0 && <span className="text-xs text-muted-foreground">Sem tags</span>}
                </div>
              </div>

              {selectedContact.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Observações</h4>
                    <p className="text-sm text-muted-foreground">{selectedContact.notes}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
