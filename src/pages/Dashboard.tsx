import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockDashboardMetrics, mockInstances, mockUsers } from '@/data/mock';
import {
  MessageSquare, MessageCircle, Clock, CheckCircle2,
  Timer, Users, Wifi, WifiOff, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const metrics = mockDashboardMetrics;

const statCards = [
  { label: 'Conversas Abertas', value: metrics.open_conversations, icon: MessageSquare, color: 'text-status-attending' },
  { label: 'Não Lidas', value: metrics.unread_conversations, icon: MessageCircle, color: 'text-status-unread' },
  { label: 'Pendentes', value: metrics.pending_conversations, icon: Clock, color: 'text-status-pending' },
  { label: 'Resolvidas Hoje', value: metrics.resolved_today, icon: CheckCircle2, color: 'text-status-online' },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <Card key={card.label} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl bg-muted flex items-center justify-center ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Volume Chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Volume de Atendimentos</CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">Últimos 7 dias</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={metrics.volume_by_day}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(172, 66%, 36%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(172, 66%, 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214, 20%, 92%)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 92%)', fontSize: '13px' }} />
                <Area type="monotone" dataKey="count" stroke="hsl(172, 66%, 36%)" strokeWidth={2} fill="url(#colorVolume)" name="Conversas" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agents Performance */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Atendimentos por Agente</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={metrics.conversations_by_agent} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(214, 20%, 92%)" />
                <XAxis type="number" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis type="category" dataKey="agent_name" axisLine={false} tickLine={false} width={100} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 92%)', fontSize: '13px' }} />
                <Bar dataKey="count" fill="hsl(172, 66%, 36%)" radius={[0, 4, 4, 0]} name="Atendimentos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Response Time */}
        <Card className="shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground">
                <Timer className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio 1ª Resposta</p>
                <p className="text-2xl font-bold">{metrics.avg_first_response_time} min</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio Resolução</p>
                <p className="text-2xl font-bold">{metrics.avg_resolution_time} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Online Agents */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Equipe Online</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockUsers.map(agent => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`status-dot ${agent.is_online ? 'status-dot-online' : 'status-dot-resolved'}`} />
                  <span className="text-sm font-medium">{agent.name}</span>
                </div>
                <Badge variant={agent.is_online ? 'default' : 'secondary'} className="text-[10px]">
                  {agent.is_online ? 'Online' : 'Offline'}
                </Badge>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              {metrics.agents_online}/{metrics.total_agents} agentes online
            </p>
          </CardContent>
        </Card>

        {/* Instances Status */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Instâncias WhatsApp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockInstances.map(inst => (
              <div key={inst.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {inst.status === 'connected' ? (
                    <Wifi className="h-4 w-4 text-status-online" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-status-resolved" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{inst.name}</p>
                    <p className="text-xs text-muted-foreground">{inst.phone_number}</p>
                  </div>
                </div>
                <Badge variant={inst.status === 'connected' ? 'default' : 'outline'} className="text-[10px]">
                  {inst.status === 'connected' ? 'Conectada' : 'Desconectada'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
