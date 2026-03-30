import { mockConversations } from '@/data/mock';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Groups() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const groupConversations = mockConversations.filter(c => c.type === 'group');

  const filtered = groupConversations.filter(c => {
    if (!search) return true;
    return c.group_name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Grupos WhatsApp</h2>
          <p className="text-sm text-muted-foreground">Gerencie conversas de grupo conectadas</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar grupos..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-lg font-medium text-muted-foreground">Nenhum grupo encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">Grupos conectados aparecerão aqui</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(group => (
            <Card key={group.id} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/inbox')}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{group.group_name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" /> {group.group_participants} participantes
                    </div>
                  </div>
                  {group.unread_count > 0 && (
                    <Badge className="text-[10px]">{group.unread_count} não lidas</Badge>
                  )}
                </div>
                {group.last_message && (
                  <p className="text-sm text-muted-foreground truncate">
                    {group.last_message.sender_name && `${group.last_message.sender_name}: `}
                    {group.last_message.content}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
