import { useState } from 'react';
import { mockDashboardMetrics, mockTags } from '@/data/mock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, CheckCircle2, Users, Tag } from 'lucide-react';

const metrics = mockDashboardMetrics;

const agentPerformance = [
  { agent: 'Ana Silva', conversations: 12, avg_response: 3.1, avg_resolution: 38, satisfaction: 4.8 },
  { agent: 'Carlos Mendes', conversations: 9, avg_response: 5.4, avg_resolution: 52, satisfaction: 4.5 },
  { agent: 'Juliana Costa', conversations: 5, avg_response: 4.0, avg_resolution: 44, satisfaction: 4.7 },
];

const contactOrigins = [
  { name: 'WhatsApp', value: 65, color: '#25D366' },
  { name: 'Manual', value: 20, color: '#3B82F6' },
  { name: 'Importação', value: 10, color: '#8B5CF6' },
  { name: 'API', value: 5, color: '#F59E0B' },
];

export default function Reports() {
  const [period, setPeriod] = useState('7d');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Relatórios</h2>
          <p className="text-sm text-muted-foreground">Acompanhe o desempenho da sua operação</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Atendimentos</p>
                <p className="text-2xl font-bold">172</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-status-pending" />
              <div>
                <p className="text-xs text-muted-foreground">Tempo Médio Resposta</p>
                <p className="text-2xl font-bold">{metrics.avg_first_response_time} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-status-online" />
              <div>
                <p className="text-xs text-muted-foreground">Tempo Médio Resolução</p>
                <p className="text-2xl font-bold">{metrics.avg_resolution_time} min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Taxa de Encerramento</p>
                <p className="text-2xl font-bold">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Volume Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Volume Diário</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics.volume_by_day}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214, 20%, 92%)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 92%)', fontSize: '13px' }} />
                <Line type="monotone" dataKey="count" stroke="hsl(172, 66%, 36%)" strokeWidth={2} dot={{ r: 4 }} name="Conversas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contact Origins */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Origem dos Contatos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={contactOrigins} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {contactOrigins.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Desempenho por Agente</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="text-xs text-muted-foreground font-medium">
                <th className="text-left p-3 pl-4">Agente</th>
                <th className="text-center p-3">Atendimentos</th>
                <th className="text-center p-3">Tempo Médio Resposta</th>
                <th className="text-center p-3">Tempo Médio Resolução</th>
                <th className="text-center p-3">Satisfação</th>
              </tr>
            </thead>
            <tbody>
              {agentPerformance.map(agent => (
                <tr key={agent.agent} className="border-b">
                  <td className="p-3 pl-4 text-sm font-medium">{agent.agent}</td>
                  <td className="p-3 text-sm text-center">{agent.conversations}</td>
                  <td className="p-3 text-sm text-center">{agent.avg_response} min</td>
                  <td className="p-3 text-sm text-center">{agent.avg_resolution} min</td>
                  <td className="p-3 text-sm text-center">⭐ {agent.satisfaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Tags Usage */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tags Mais Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics.tags_usage}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214, 20%, 92%)" />
              <XAxis dataKey="tag_name" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 92%)', fontSize: '13px' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Usos">
                {metrics.tags_usage.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
