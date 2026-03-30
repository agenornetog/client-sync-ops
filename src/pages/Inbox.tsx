import { useState, useMemo } from 'react';
import { mockConversations, mockMessages, mockNotes } from '@/data/mock';
import { ConversationList } from '@/components/inbox/ConversationList';
import { ChatArea } from '@/components/inbox/ChatArea';
import { ContactPanel } from '@/components/inbox/ContactPanel';

export default function Inbox() {
  const [selectedId, setSelectedId] = useState<string>(mockConversations[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [showContactPanel, setShowContactPanel] = useState(true);

  const filtered = useMemo(() => {
    let convs = mockConversations;
    if (statusFilter !== 'all') convs = convs.filter(c => c.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      convs = convs.filter(c =>
        c.contact.name.toLowerCase().includes(q) ||
        c.contact.phone.includes(q) ||
        c.last_message?.content.toLowerCase().includes(q)
      );
    }
    return convs.sort((a, b) => new Date(b.last_message_at || b.created_at).getTime() - new Date(a.last_message_at || a.created_at).getTime());
  }, [statusFilter, search]);

  const selected = mockConversations.find(c => c.id === selectedId);
  const messages = mockMessages[selectedId] || [];

  return (
    <div className="flex h-full bg-background">
      {/* Conversation List */}
      <div className="w-80 xl:w-[340px] border-r flex flex-col shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Inbox</h2>
        </div>
        <ConversationList
          conversations={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          search={search}
          onSearchChange={setSearch}
        />
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
            notes={mockNotes.filter(n => n.conversation_id === selectedId)}
          />
        </div>
      )}
    </div>
  );
}
