import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDashboardMetrics, mockInstances, mockUsers } from '@/data/mock';
import {
  MessageSquare, MessageCircle, Clock, CheckCircle2,
  Timer, Wifi, WifiOff, ArrowUpRight, TrendingUp
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const metrics = mockDashboardMetrics;

const statCards = [
  { label: 'Conversas Abertas', value: metrics.open_conversations, icon: MessageSquare, description: 'Em andamento agora' },
  { label: 'Não Lidas', value: metrics.unread_conversations, icon: MessageCircle, description: 'Aguardando leitura' },
  { label: 'Pendentes', value: metrics.pending_conversations, icon: Clock, description: 'Sem atendente atribuído' },
  { label: 'Resolvidas Hoje', value: metrics.resolved_today, icon: CheckCircle2, description: 'Encerradas com sucesso' },
];

export default function Dashboard() {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  })();

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {greeting}, <span className="font-normal text-muted-foreground">Ana</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Aqui está um resumo rápido da sua operação.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal h-8 px-3 gap-1.5">
            <span className="status-dot status-dot-online" />
            {metrics.agents_online} online
          </Badge>
        </div>
      </div>

      {/* Stat Cards — clean card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <Card key={card.label} className="border bg-card shadow-none hover:shadow-sm transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                  <card.icon className="h-4 w-4 text-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <p className="text-2xl font-semibold tracking-tight">{card.value}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Volume Chart */}
        <Card className="lg:col-span-2 border shadow-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Volume de Atendimentos</CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">Últimos 7 dias</Badge>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={metrics.volume_by_day}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 0%, 9%)" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="hsl(0, 0%, 9%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(0, 0%, 90%)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid hsl(0, 0%, 90%)',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="hsl(0, 0%, 9%)" strokeWidth={2} fill="url(#colorVolume)" name="Conversas" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agents Performance */}
        <Card className="border shadow-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium">Por Agente</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={metrics.conversations_by_agent} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(0, 0%, 90%)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }} />
                <YAxis type="category" dataKey="agent_name" axisLine={false} tickLine={false} width={90} tick={{ fontSize: 12, fill: 'hsl(0, 0%, 45%)' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid hsl(0, 0%, 90%)', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Bar dataKey="count" fill="hsl(0, 0%, 15%)" radius={[0, 6, 6, 0]} name="Atendimentos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Response Time */}
        <Card className="border shadow-none">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                <Timer className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tempo Médio 1ª Resposta</p>
                <p className="text-xl font-semibold">{metrics.avg_first_response_time} min</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tempo Médio Resolução</p>
                <p className="text-xl font-semibold">{metrics.avg_resolution_time} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Agents */}
        <Card className="border shadow-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium">Equipe</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2.5">
            {mockUsers.map(agent => (
              <div key={agent.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2.5">
                  <span className={`status-dot ${agent.is_online ? 'status-dot-online' : 'status-dot-resolved'}`} />
                  <span className="text-sm">{agent.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {agent.is_online ? 'Online' : 'Offline'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Instances Status */}
        <Card className="border shadow-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2.5">
            {mockInstances.map(inst => (
              <div key={inst.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2.5">
                  {inst.status === 'connected' ? (
                    <Wifi className="h-4 w-4 text-status-online" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{inst.name}</p>
                    <p className="text-xs text-muted-foreground">{inst.phone_number}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${inst.status === 'connected' ? 'text-status-online' : 'text-muted-foreground'}`}>
                  {inst.status === 'connected' ? 'Conectada' : 'Desconectada'}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
