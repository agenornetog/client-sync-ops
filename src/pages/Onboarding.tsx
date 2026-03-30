import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2, Clock, Users, ArrowRight, Check } from 'lucide-react';

const steps = ['Empresa', 'Horários', 'Equipe'];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState('');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [inviteEmails, setInviteEmails] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const next = () => {
    if (step < 2) setStep(step + 1);
    else {
      toast({ title: 'Configuração concluída!', description: 'Sua plataforma está pronta para uso.' });
      navigate('/dashboard');
    }
  };

  const icons = [Building2, Clock, Users];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">A</div>
          <span className="text-2xl font-bold">AtendePro</span>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <Card className="border-0 shadow-lg">
          {step === 0 && (
            <>
              <CardHeader className="text-center">
                <Building2 className="h-10 w-10 mx-auto text-primary mb-2" />
                <CardTitle>Dados da empresa</CardTitle>
                <CardDescription>Vamos configurar seu workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome da empresa</Label>
                  <Input placeholder="Minha Empresa LTDA" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Fuso horário</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">Brasília (GMT-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                      <SelectItem value="America/Belem">Belém (GMT-3)</SelectItem>
                      <SelectItem value="America/Recife">Recife (GMT-3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </>
          )}
          {step === 1 && (
            <>
              <CardHeader className="text-center">
                <Clock className="h-10 w-10 mx-auto text-primary mb-2" />
                <CardTitle>Horário de atendimento</CardTitle>
                <CardDescription>Defina quando sua equipe está disponível</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, i) => (
                  <div key={day} className="flex items-center justify-between py-1.5 border-b last:border-0">
                    <span className="text-sm font-medium w-20">{day}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {i < 5 ? '08:00 - 18:00' : i === 5 ? '09:00 - 13:00' : 'Fechado'}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-2">Você pode ajustar isso depois nas configurações.</p>
              </CardContent>
            </>
          )}
          {step === 2 && (
            <>
              <CardHeader className="text-center">
                <Users className="h-10 w-10 mx-auto text-primary mb-2" />
                <CardTitle>Convide sua equipe</CardTitle>
                <CardDescription>Adicione os e-mails dos atendentes (opcional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>E-mails (um por linha)</Label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={'atendente1@empresa.com\natendente2@empresa.com'}
                    value={inviteEmails}
                    onChange={e => setInviteEmails(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Você pode pular e convidar depois.</p>
              </CardContent>
            </>
          )}
          <div className="p-6 pt-0 flex justify-between">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>Voltar</Button>
            ) : <div />}
            <Button onClick={next}>
              {step === 2 ? 'Finalizar' : 'Próximo'} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
