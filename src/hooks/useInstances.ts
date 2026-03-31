import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Instance = Tables<'whatsapp_instances'>;
type InstanceInsert = TablesInsert<'whatsapp_instances'>;
type InstanceUpdate = TablesUpdate<'whatsapp_instances'>;

export function useInstances() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchInstances = async () => {
    const { data, error } = await supabase
      .from('whatsapp_instances')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Erro ao carregar instâncias', description: error.message, variant: 'destructive' });
    } else {
      setInstances(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInstances();

    const channel = supabase
      .channel('whatsapp_instances_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'whatsapp_instances' }, () => {
        fetchInstances();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const createInstance = async (data: Omit<InstanceInsert, 'workspace_id'>) => {
    // Get workspace_id from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('workspace_id')
      .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
      .single();

    if (!profile?.workspace_id) {
      toast({ title: 'Erro', description: 'Workspace não encontrado', variant: 'destructive' });
      return false;
    }

    const { error } = await supabase
      .from('whatsapp_instances')
      .insert({ ...data, workspace_id: profile.workspace_id });

    if (error) {
      toast({ title: 'Erro ao criar instância', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Instância criada com sucesso' });
    return true;
  };

  const updateInstance = async (id: string, data: InstanceUpdate) => {
    const { error } = await supabase
      .from('whatsapp_instances')
      .update(data)
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao atualizar instância', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Instância atualizada com sucesso' });
    return true;
  };

  const deleteInstance = async (id: string) => {
    const { error } = await supabase
      .from('whatsapp_instances')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao excluir instância', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Instância excluída com sucesso' });
    return true;
  };

  return { instances, loading, createInstance, updateInstance, deleteInstance, refetch: fetchInstances };
}
