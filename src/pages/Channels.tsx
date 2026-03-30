import { mockInstances } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Wifi, WifiOff, RefreshCw, QrCode, Phone, Settings,
  Radio, MessageCircle, Send, Instagram, Globe, Mail
} from 'lucide-react';

const futureChannels = [
  { name: 'Instagram', icon: Instagram, status: 'Em breve' },
  { name: 'Telegram', icon: Send, status: 'Em breve' },
  { name: 'Webchat', icon: Globe, status: 'Em breve' },
  { name: 'E-mail', icon: Mail, status: 'Em breve' },
];

export default function Channels() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Canais</h2>
          <p className="text-sm text-muted-foreground">Gerencie suas conexões e instâncias</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova instância</Button>
      </div>

      {/* WhatsApp Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <MessageCircle className="h-5 w-5 text-whatsapp" />
          <h3 className="font-semibold">WhatsApp</h3>
          <Badge className="bg-whatsapp text-whatsapp-foreground text-[10px]">Ativo</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockInstances.map(inst => (
            <Card key={inst.id} className="shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {inst.status === 'connected' ? (
                      <div className="h-10 w-10 rounded-xl bg-status-online/10 flex items-center justify-center">
                        <Wifi className="h-5 w-5 text-status-online" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <WifiOff className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{inst.name}</h4>
                      <p className="text-sm text-muted-foreground">{inst.phone_number}</p>
                    </div>
                  </div>
                  <Badge variant={inst.status === 'connected' ? 'default' : 'outline'}>
                    {inst.status === 'connected' ? 'Conectada' : 'Desconectada'}
                  </Badge>
                </div>

                {inst.status === 'connected' && inst.last_seen && (
                  <p className="text-xs text-muted-foreground mb-3">
                    Última atividade: {new Date(inst.last_seen).toLocaleString('pt-BR')}
                  </p>
                )}

                <div className="flex gap-2">
                  {inst.status === 'connected' ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1"><RefreshCw className="h-3.5 w-3.5 mr-1" /> Reconectar</Button>
                      <Button variant="outline" size="sm"><Settings className="h-3.5 w-3.5" /></Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" className="flex-1"><QrCode className="h-3.5 w-3.5 mr-1" /> Conectar via QR Code</Button>
                      <Button variant="outline" size="sm"><Settings className="h-3.5 w-3.5" /></Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
    </div>
  );
}
