import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Instance = Tables<'whatsapp_instances'>;

interface InstanceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance?: Instance | null;
  onSubmit: (data: { name: string; phone_number: string; api_url: string; api_token: string }) => Promise<boolean>;
}

export function InstanceFormDialog({ open, onOpenChange, instance, onSubmit }: InstanceFormDialogProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (instance) {
      setName(instance.name);
      setPhone(instance.phone_number);
      setApiUrl(instance.api_url ?? '');
      setApiToken(instance.api_token ?? '');
    } else {
      setName('');
      setPhone('');
      setApiUrl('');
      setApiToken('');
    }
    setShowToken(false);
  }, [instance, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onSubmit({ name, phone_number: phone, api_url: apiUrl, api_token: apiToken });
    setSaving(false);
    if (ok) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{instance ? 'Editar Instância' : 'Nova Instância WhatsApp'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Atendimento Principal" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Número do WhatsApp</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="5511999999999" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api_url">API URL (UAZAPI)</Label>
            <Input id="api_url" value={apiUrl} onChange={e => setApiUrl(e.target.value)} placeholder="https://api.uazapi.com/instance/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api_token">API Token</Label>
            <div className="relative">
              <Input
                id="api_token"
                type={showToken ? 'text' : 'password'}
                value={apiToken}
                onChange={e => setApiToken(e.target.value)}
                placeholder="Token da UAZAPI"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? 'Salvando...' : instance ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
