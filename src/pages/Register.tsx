import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Register() {
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: form.name,
            company: form.company,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          toast.error('Este e-mail já está cadastrado');
        } else {
          toast.error(signUpError.message);
        }
        return;
      }

      if (!authData.user) {
        toast.error('Erro ao criar conta');
        return;
      }

      // 2. Create workspace
      const slug = form.company
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'workspace';

      const { data: workspace, error: wsError } = await supabase
        .from('workspaces')
        .insert({
          name: form.company,
          slug: `${slug}-${Date.now().toString(36)}`,
        })
        .select()
        .single();

      if (wsError) {
        console.error('Workspace creation error:', wsError);
        // Workspace will be created later via onboarding if this fails
      }

      // 3. Link profile to workspace & add admin role
      if (workspace) {
        await supabase
          .from('profiles')
          .update({
            workspace_id: workspace.id,
            name: form.name,
          })
          .eq('id', authData.user.id);

        await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: 'admin',
          });
      }

      toast.success('Conta criada com sucesso!');
      navigate('/onboarding');
    } catch (err) {
      console.error('Register error:', err);
      toast.error('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg">A</div>
          <span className="text-2xl font-bold">AtendePro</span>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">Criar sua conta</CardTitle>
            <CardDescription>Comece a atender seus clientes em minutos</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Seu nome</Label>
                <Input placeholder="Nome completo" value={form.name} onChange={e => update('name', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Nome da empresa</Label>
                <Input placeholder="Minha Empresa" value={form.company} onChange={e => update('company', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" placeholder="seu@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta gratuita'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">Entrar</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
