import { useState } from 'react';
import { mockFlows, mockFlowExecutions } from '@/data/mock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, GitBranch, Play, Pause, MoreVertical, MessageSquare,
  Clock, Tag, Users, ArrowRight, Zap, CheckCircle2, XCircle,
  AlertCircle, Send, Timer, GitMerge
} from 'lucide-react';
import type { Flow, FlowNode as FlowNodeType } from '@/types';

const nodeTypeConfig: Record<string, { icon: any; label: string; color: string }> = {
  send_message: { icon: Send, label: 'Enviar Mensagem', color: '#3B82F6' },
  wait_response: { icon: Clock, label: 'Esperar Resposta', color: '#F59E0B' },
  condition: { icon: GitMerge, label: 'Condição', color: '#8B5CF6' },
  add_tag: { icon: Tag, label: 'Adicionar Tag', color: '#10B981' },
  remove_tag: { icon: Tag, label: 'Remover Tag', color: '#EF4444' },
  assign_queue: { icon: Users, label: 'Atribuir Fila', color: '#06B6D4' },
  assign_agent: { icon: Users, label: 'Atribuir Agente', color: '#06B6D4' },
  delay: { icon: Timer, label: 'Atraso', color: '#F97316' },
  end: { icon: XCircle, label: 'Encerrar', color: '#6B7280' },
  transfer_human: { icon: Users, label: 'Transferir Humano', color: '#EC4899' },
  webhook: { icon: Zap, label: 'Webhook', color: '#6366F1' },
};

const executionStatusIcon: Record<string, React.ReactNode> = {
  running: <Play className="h-3.5 w-3.5 text-status-attending" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5 text-status-online" />,
  failed: <XCircle className="h-3.5 w-3.5 text-destructive" />,
  paused: <Pause className="h-3.5 w-3.5 text-status-pending" />,
};

function FlowNodeCard({ node }: { node: FlowNodeType }) {
  const config = nodeTypeConfig[node.type] || { icon: Zap, label: node.type, color: '#6B7280' };
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow">
      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: config.color + '15' }}>
        <Icon className="h-4 w-4" style={{ color: config.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{config.label}</p>
        {node.config.message && (
          <p className="text-xs text-muted-foreground truncate">{node.config.message.slice(0, 60)}...</p>
        )}
        {node.config.queue_name && (
          <p className="text-xs text-muted-foreground">Fila: {node.config.queue_name}</p>
        )}
        {node.config.value && (
          <p className="text-xs text-muted-foreground">Valor: {node.config.value}</p>
        )}
      </div>
    </div>
  );
}

export default function Flows() {
  const [flows, setFlows] = useState(mockFlows);
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(null);

  const toggleActive = (id: string) => {
    setFlows(flows.map(f => f.id === id ? { ...f, is_active: !f.is_active } : f));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Fluxos de Automação</h2>
          <p className="text-sm text-muted-foreground">Crie fluxos para automatizar o atendimento</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo fluxo</Button>
      </div>

      <Tabs defaultValue="flows">
        <TabsList>
          <TabsTrigger value="flows">Fluxos</TabsTrigger>
          <TabsTrigger value="executions">Execuções</TabsTrigger>
        </TabsList>

        <TabsContent value="flows" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {flows.map(flow => (
              <Card key={flow.id} className={`shadow-sm hover:shadow-md transition-shadow cursor-pointer ${selectedFlow?.id === flow.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedFlow(flow)}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-semibold">{flow.name}</h3>
                        <p className="text-xs text-muted-foreground">{flow.description}</p>
                      </div>
                    </div>
                    <Switch checked={flow.is_active} onCheckedChange={() => toggleActive(flow.id)} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant={flow.is_active ? 'default' : 'secondary'} className="text-[10px]">
                      {flow.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                    <span>Trigger: {flow.trigger}</span>
                    <span>•</span>
                    <span>{flow.nodes.length} etapas</span>
                    <span>•</span>
                    <span>{flow.executions_count} execuções</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Flow Detail / Builder */}
          {selectedFlow && (
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Etapas do Fluxo: {selectedFlow.name}</CardTitle>
                  <Button variant="outline" size="sm"><Zap className="h-3.5 w-3.5 mr-1" /> Editar fluxo</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedFlow.nodes.map((node, i) => (
                    <div key={node.id}>
                      <FlowNodeCard node={node} />
                      {i < selectedFlow.nodes.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="executions" className="mt-4">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-xs text-muted-foreground font-medium">
                    <th className="text-left p-3 pl-4">Fluxo</th>
                    <th className="text-left p-3">Contato</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Início</th>
                    <th className="text-left p-3">Fim</th>
                  </tr>
                </thead>
                <tbody>
                  {mockFlowExecutions.map(exec => {
                    const flow = flows.find(f => f.id === exec.flow_id);
                    return (
                      <tr key={exec.id} className="border-b">
                        <td className="p-3 pl-4 text-sm font-medium">{flow?.name || exec.flow_id}</td>
                        <td className="p-3 text-sm">{exec.contact_name}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            {executionStatusIcon[exec.status]}
                            <span className="text-sm capitalize">{exec.status === 'running' ? 'Em execução' : exec.status === 'completed' ? 'Concluído' : exec.status === 'failed' ? 'Falhou' : 'Pausado'}</span>
                          </div>
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">{new Date(exec.started_at).toLocaleString('pt-BR')}</td>
                        <td className="p-3 text-sm text-muted-foreground">{exec.finished_at ? new Date(exec.finished_at).toLocaleString('pt-BR') : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
