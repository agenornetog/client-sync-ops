import { useState } from 'react';
import { useInstances } from '@/hooks/useInstances';
import { InstanceFormDialog } from '@/components/channels/InstanceFormDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus, Wifi, WifiOff, RefreshCw, QrCode, Settings, Trash2,
  MessageCircle, Send, Instagram, Globe, Mail, Loader2, Smartphone
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Instance = Tables<'whatsapp_instances'>;

const futureChannels = [
  { name: 'Instagram', icon: Instagram, status: 'Em breve' },
  { name: 'Telegram', icon: Send, status: 'Em breve' },
  { name: 'Webchat', icon: Globe, status: 'Em breve' },
  { name: 'E-mail', icon: Mail, status: 'Em breve' },
];

const statusConfig: Record<string, { label: string; variant: 'default' | 'outline' | 'secondary' | 'destructive'; icon: typeof Wifi }> = {
  connected: { label: 'Conectada', variant: 'default', icon: Wifi },
  disconnected: { label: 'Desconectada', variant: 'outline', icon: WifiOff },
  connecting: { label: 'Conectando...', variant: 'secondary', icon: Loader2 },
  qr_code: { label: 'Aguardando QR', variant: 'secondary', icon: QrCode },
};

export default function Channels() {
  const { instances, loading, createInstance, updateInstance, deleteInstance } = useInstances();
  const [formOpen, setFormOpen] = useState(false);
  const [editInstance, setEditInstance] = useState<Instance | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Instance | null>(null);

  const handleCreate = async (data: { name: string; phone_number: string; api_url: string; api_token: string }) => {
    return createInstance(data);
  };

  const handleEdit = async (data: { name: string; phone_number: string; api_url: string; api_token: string }) => {
    if (!editInstance) return false;
    return updateInstance(editInstance.id, data);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteInstance(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Canais</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas conexões e instâncias</p>
        </div>
        <Button size="sm" onClick={() => { setEditInstance(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Nova instância
        </Button>
      </div>

      {/* WhatsApp Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-5 w-5 text-whatsapp" />
          <h3 className="font-semibold">WhatsApp</h3>
          {instances.length > 0 && (
            <Badge className="bg-whatsapp text-whatsapp-foreground text-[10px]">
              {instances.filter(i => i.status === 'connected').length} ativa(s)
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <Card key={i} className="shadow-sm">
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : instances.length === 0 ? (
          <Card className="shadow-sm border-dashed">
            <CardContent className="p-8 text-center">
              <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h4 className="font-semibold mb-1">Nenhuma instância configurada</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Conecte seu WhatsApp para começar a atender seus clientes.
              </p>
              <Button onClick={() => { setEditInstance(null); setFormOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Criar primeira instância
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instances.map(inst => {
              const cfg = statusConfig[inst.status] ?? statusConfig.disconnected;
              const StatusIcon = cfg.icon;
              return (
                <Card key={inst.id} className="shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                          inst.status === 'connected' ? 'bg-status-online/10' : 'bg-muted'
                        }`}>
                          <StatusIcon className={`h-5 w-5 ${
                            inst.status === 'connected' ? 'text-status-online' : 'text-muted-foreground'
                          } ${inst.status === 'connecting' ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{inst.name}</h4>
                          <p className="text-sm text-muted-foreground">{inst.phone_number || 'Sem número'}</p>
                        </div>
                      </div>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </div>

                    {inst.status === 'qr_code' && inst.qr_code && (
                      <div className="mb-3 p-3 bg-white rounded-lg flex justify-center">
                        <img src={inst.qr_code} alt="QR Code" className="h-48 w-48" />
                      </div>
                    )}

                    {inst.status === 'connected' && inst.last_seen && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Última atividade: {new Date(inst.last_seen).toLocaleString('pt-BR')}
                      </p>
                    )}

                    <div className="flex gap-2">
                      {inst.status === 'connected' ? (
                        <Button variant="outline" size="sm" className="flex-1" disabled>
                          <RefreshCw className="h-3.5 w-3.5 mr-1" /> Reconectar
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1" disabled>
                          <QrCode className="h-3.5 w-3.5 mr-1" /> Conectar via QR
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => { setEditInstance(inst); setFormOpen(true); }}>
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteTarget(inst)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Future Channels */}
      <div>
        <h3 className="font-semibold mb-3">Outros Canais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {futureChannels.map(ch => (
            <Card key={ch.name} className="shadow-sm opacity-60">
              <CardContent className="p-4 text-center">
                <ch.icon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="font-medium text-sm">{ch.name}</p>
                <Badge variant="secondary" className="text-[10px] mt-2">{ch.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Form Dialog */}
      <InstanceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        instance={editInstance}
        onSubmit={editInstance ? handleEdit : handleCreate}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir instância</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteTarget?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
