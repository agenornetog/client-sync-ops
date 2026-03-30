import { useState } from 'react';
import { mockTags } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Hash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import type { Tag } from '@/types';

const presetColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];

export default function Tags() {
  const [tags, setTags] = useState<Tag[]>(mockTags);
  const [editTag, setEditTag] = useState<Partial<Tag> | null>(null);

  const handleSave = () => {
    if (!editTag?.name) return;
    if (editTag.id) {
      setTags(tags.map(t => t.id === editTag.id ? { ...t, ...editTag } as Tag : t));
    } else {
      setTags([...tags, { ...editTag, id: `tag-${Date.now()}`, workspace_id: 'ws-1', usage_count: 0 } as Tag]);
    }
    setEditTag(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Tags</h2>
          <p className="text-sm text-muted-foreground">Organize conversas e contatos com tags coloridas</p>
        </div>
        <Dialog open={editTag !== null} onOpenChange={open => !open && setEditTag(null)}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditTag({ name: '', color: presetColors[0] })}>
              <Plus className="h-4 w-4 mr-1" /> Nova tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editTag?.id ? 'Editar tag' : 'Nova tag'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={editTag?.name || ''} onChange={e => setEditTag({ ...editTag, name: e.target.value })} placeholder="Ex: VIP, Urgente..." />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2 flex-wrap">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setEditTag({ ...editTag, color })}
                      className={`h-8 w-8 rounded-full border-2 transition-all ${editTag?.color === color ? 'border-foreground scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              {editTag?.name && editTag?.color && (
                <div>
                  <Label className="text-xs text-muted-foreground">Preview</Label>
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium" style={{ backgroundColor: editTag.color + '20', color: editTag.color }}>
                      {editTag.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditTag(null)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tags.map(tag => (
          <Card key={tag.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: tag.color }} />
                  <span className="font-medium">{tag.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditTag(tag)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setTags(tags.filter(t => t.id !== tag.id))}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Hash className="h-3 w-3" />
                <span>{tag.usage_count} usos</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
