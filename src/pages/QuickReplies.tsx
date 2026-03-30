import { useState } from 'react';
import { mockQuickReplies } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, Zap, Code } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import type { QuickReply } from '@/types';

export default function QuickReplies() {
  const [replies, setReplies] = useState<QuickReply[]>(mockQuickReplies);
  const [search, setSearch] = useState('');
  const [editReply, setEditReply] = useState<Partial<QuickReply> | null>(null);

  const filtered = replies.filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.shortcut.includes(search.toLowerCase()));

  const handleSave = () => {
    if (!editReply?.title || !editReply?.content) return;
    if (editReply.id) {
      setReplies(replies.map(r => r.id === editReply.id ? { ...r, ...editReply } as QuickReply : r));
    } else {
      setReplies([...replies, { ...editReply, id: `qr-${Date.now()}`, workspace_id: 'ws-1', variables: [] } as QuickReply]);
    }
    setEditReply(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Respostas Rápidas</h2>
          <p className="text-sm text-muted-foreground">Atalhos para agilizar o atendimento</p>
        </div>
        <Dialog open={editReply !== null} onOpenChange={open => !open && setEditReply(null)}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditReply({ title: '', shortcut: '/', content: '', category: 'Geral' })}>
              <Plus className="h-4 w-4 mr-1" /> Nova resposta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editReply?.id ? 'Editar resposta' : 'Nova resposta rápida'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={editReply?.title || ''} onChange={e => setEditReply({ ...editReply, title: e.target.value })} placeholder="Saudação" />
                </div>
                <div className="space-y-2">
                  <Label>Atalho</Label>
                  <Input value={editReply?.shortcut || ''} onChange={e => setEditReply({ ...editReply, shortcut: e.target.value })} placeholder="/ola" className="font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input value={editReply?.category || ''} onChange={e => setEditReply({ ...editReply, category: e.target.value })} placeholder="Geral" />
              </div>
              <div className="space-y-2">
                <Label>Conteúdo</Label>
                <Textarea value={editReply?.content || ''} onChange={e => setEditReply({ ...editReply, content: e.target.value })} placeholder="Olá, {{nome_cliente}}! Como posso ajudar?" rows={4} />
                <p className="text-xs text-muted-foreground">Variáveis disponíveis: {'{{nome_cliente}}'}, {'{{atendente}}'}, {'{{empresa}}'}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditReply(null)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por título ou atalho..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="space-y-3">
        {filtered.map(reply => (
          <Card key={reply.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-medium">{reply.title}</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">{reply.shortcut}</Badge>
                    <Badge variant="outline" className="text-[10px]">{reply.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{reply.content}</p>
                  {reply.variables.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Code className="h-3 w-3 text-muted-foreground" />
                      {reply.variables.map(v => (
                        <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{`{{${v}}}`}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditReply(reply)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setReplies(replies.filter(r => r.id !== reply.id))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
