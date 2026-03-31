import { useState, useMemo } from 'react';
import { useConversations, useMessages, useInternalNotes } from '@/hooks/useConversations';
import { ConversationList } from '@/components/inbox/ConversationList';
import { ChatArea } from '@/components/inbox/ChatArea';
import { ContactPanel } from '@/components/inbox/ContactPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export default function Inbox() {
  const [selectedId, setSelectedId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showContactPanel, setShowContactPanel] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading: loadingConvs } = useConversations();
  const effectiveSelectedId = selectedId || conversations[0]?.id || '';
  const { data: messages = [] } = useMessages(effectiveSelectedId || null);
  const { data: notes = [] } = useInternalNotes(effectiveSelectedId || null);

  const filtered = useMemo(() => {
    let convs = conversations;
    if (statusFilter !== 'all') convs = convs.filter(c => c.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      convs = convs.filter(c =>
        c.contact.name.toLowerCase().includes(q) ||
        c.contact.phone.includes(q)
      );
    }
    return convs.sort((a, b) =>
      new Date(b.last_message_at || b.created_at).getTime() -
      new Date(a.last_message_at || a.created_at).getTime()
    );
  }, [conversations, statusFilter, search]);

  const selected = conversations.find(c => c.id === effectiveSelectedId);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const { error } = await supabase.functions.invoke('seed-data');
      if (error) throw error;
      toast.success('Dados de demonstração criados!');
      queryClient.invalidateQueries();
    } catch (err: any) {
      console.error('Seed error:', err);
      toast.error('Erro ao criar dados de demonstração');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Conversation List */}
      <div className="w-80 xl:w-[340px] border-r flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Inbox</h2>
        </div>
        {loadingConvs ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3 px-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <Database className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Nenhuma conversa</p>
            <p className="text-xs text-muted-foreground mb-4">Popule o sistema com dados de demonstração para explorar</p>
            <Button size="sm" onClick={handleSeed} disabled={seeding}>
              {seeding ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Criando...</> : 'Criar dados demo'}
            </Button>
          </div>
        ) : (
          <ConversationList
            conversations={filtered}
            selectedId={effectiveSelectedId}
            onSelect={setSelectedId}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            search={search}
            onSearchChange={setSearch}
          />
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <ChatArea
            conversation={selected}
            messages={messages}
            onToggleContactPanel={() => setShowContactPanel(!showContactPanel)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-base font-medium">Selecione uma conversa</p>
              <p className="text-sm mt-1">Escolha uma conversa na lista para começar</p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Panel */}
      {selected && showContactPanel && (
        <div className="w-80 border-l shrink-0 overflow-auto hidden xl:block">
          <ContactPanel
            conversation={selected}
            notes={notes}
          />
        </div>
      )}
    </div>
  );
}
