import { useState, useMemo } from 'react';
import { mockConversations, mockMessages, mockNotes, mockTags, mockUsers } from '@/data/mock';
import { ConversationList } from '@/components/inbox/ConversationList';
import { ChatArea } from '@/components/inbox/ChatArea';
import { ContactPanel } from '@/components/inbox/ContactPanel';
import type { Conversation, Message } from '@/types';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

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
    <div className="flex h-full">
      {/* Conversation List */}
      <div className="w-80 xl:w-96 border-r flex flex-col shrink-0 bg-card">
        <div className="p-3 border-b flex items-center gap-2">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
          <h2 className="text-lg font-semibold flex-1">Inbox</h2>
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
              <p className="text-lg font-medium">Selecione uma conversa</p>
              <p className="text-sm">Escolha uma conversa na lista para começar</p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Panel */}
      {selected && showContactPanel && (
        <div className="w-80 border-l shrink-0 bg-card overflow-auto hidden xl:block">
          <ContactPanel
            conversation={selected}
            notes={mockNotes.filter(n => n.conversation_id === selectedId)}
          />
        </div>
      )}
    </div>
  );
}
