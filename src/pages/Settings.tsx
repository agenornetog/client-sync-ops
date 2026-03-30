import { useState } from 'react';
import { mockUsers, mockQueues, mockBusinessHours, mockAuditLogs, mockWebhookEvents } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Building2, Clock, Users, Shield, Webhook, History, Settings as SettingsIcon,
  Plus, Pencil, Trash2, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';

const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const roleLabels: Record<string, string> = { admin: 'Admin', supervisor: 'Supervisor', atendente: 'Atendente' };

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState('AtendePro Demo');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Tabs defaultValue="company">
        <TabsList className="flex-wrap">
          <TabsTrigger value="company"><Building2 className="h-3.5 w-3.5 mr-1" /> Empresa</TabsTrigger>
          <TabsTrigger value="hours"><Clock className="h-3.5 w-3.5 mr-1" /> Horários</TabsTrigger>
          <TabsTrigger value="queues"><Users className="h-3.5 w-3.5 mr-1" /> Filas</TabsTrigger>
          <TabsTrigger value="users"><Shield className="h-3.5 w-3.5 mr-1" /> Usuários</TabsTrigger>
          <TabsTrigger value="webhooks"><Webhook className="h-3.5 w-3.5 mr-1" /> Webhooks</TabsTrigger>
          <TabsTrigger value="audit"><History className="h-3.5 w-3.5 mr-1" /> Auditoria</TabsTrigger>
        </TabsList>

        {/* Company */}
        <TabsContent value="company" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da empresa</Label>
                <Input value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Fuso horário</Label>
                <Input value="America/Sao_Paulo (GMT-3)" disabled />
              </div>
              <Button>Salvar alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Hours */}
        <TabsContent value="hours" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Horário de Atendimento</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockBusinessHours.map(bh => (
                  <div key={bh.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3 w-28">
                      <Switch checked={bh.is_open} />
                      <span className="text-sm font-medium">{dayNames[bh.day_of_week]}</span>
                    </div>
                    {bh.is_open ? (
                      <div className="flex items-center gap-2">
                        <Input className="w-24 h-8 text-sm text-center" value={bh.open_time} readOnly />
                        <span className="text-sm text-muted-foreground">até</span>
                        <Input className="w-24 h-8 text-sm text-center" value={bh.close_time} readOnly />
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
              <Button className="mt-4">Salvar horários</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Queues */}
        <TabsContent value="queues" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova fila</Button>
          </div>
          {mockQueues.map(queue => (
            <Card key={queue.id} className="shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: queue.color }} />
                  <div>
                    <p className="font-medium">{queue.name}</p>
                    <p className="text-xs text-muted-foreground">{queue.description} • {queue.agent_ids.length} agentes</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Convidar usuário</Button>
          </div>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs text-muted-foreground font-medium">
                    <th className="text-left p-3 pl-4">Usuário</th>
                    <th className="text-left p-3">E-mail</th>
                    <th className="text-left p-3">Papel</th>
                    <th className="text-left p-3">Status</th>
                    <th className="p-3 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {mockUsers.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3 pl-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-muted">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{user.email}</td>
                      <td className="p-3"><Badge variant="outline" className="text-xs">{roleLabels[user.role]}</Badge></td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`status-dot ${user.is_online ? 'status-dot-online' : 'status-dot-resolved'}`} />
                          <span className="text-xs">{user.is_online ? 'Online' : 'Offline'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks */}
        <TabsContent value="webhooks" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Eventos de Webhook</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs text-muted-foreground font-medium">
                    <th className="text-left p-3 pl-4">Evento</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Data</th>
                    <th className="text-left p-3">Erro</th>
                  </tr>
                </thead>
                <tbody>
                  {mockWebhookEvents.map(event => (
                    <tr key={event.id} className="border-b">
                      <td className="p-3 pl-4 text-sm font-mono">{event.event_type}</td>
                      <td className="p-3">
                        <Badge variant={event.status === 'processed' ? 'default' : 'destructive'} className="text-[10px]">
                          {event.status === 'processed' ? 'Processado' : 'Falha'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{new Date(event.created_at).toLocaleString('pt-BR')}</td>
                      <td className="p-3 text-sm text-muted-foreground">{event.error || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit */}
        <TabsContent value="audit" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Log de Auditoria</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs text-muted-foreground font-medium">
                    <th className="text-left p-3 pl-4">Usuário</th>
                    <th className="text-left p-3">Ação</th>
                    <th className="text-left p-3">Entidade</th>
                    <th className="text-left p-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAuditLogs.map(log => (
                    <tr key={log.id} className="border-b">
                      <td className="p-3 pl-4 text-sm font-medium">{log.user_name}</td>
                      <td className="p-3 text-sm font-mono text-muted-foreground">{log.action}</td>
                      <td className="p-3 text-sm text-muted-foreground">{log.entity_type}</td>
                      <td className="p-3 text-sm text-muted-foreground">{new Date(log.created_at).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
