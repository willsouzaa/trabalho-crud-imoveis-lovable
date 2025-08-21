
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Imovel, ImovelWithAgendamento } from '@/types/imovel';
import { toast } from '@/hooks/use-toast';

export const useImoveis = () => {
  return useQuery({
    queryKey: ['imoveis'],
    queryFn: async (): Promise<ImovelWithAgendamento[]> => {
      console.log('Buscando imóveis...');
      
      const { data: imoveis, error } = await supabase
        .from('imoveis')
        .select(`
          *,
          agendamentos!inner(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar imóveis:', error);
        throw error;
      }

      // Buscar também imóveis sem agendamentos
      const { data: imoveisSemAgendamento, error: errorSem } = await supabase
        .from('imoveis')
        .select('*')
        .not('id', 'in', `(${imoveis?.map(i => i.id).join(',') || '0'})`)
        .order('created_at', { ascending: false });

      if (errorSem) {
        console.error('Erro ao buscar imóveis sem agendamento:', errorSem);
        throw errorSem;
      }

      // Combinar resultados
      const todosImoveis = [
        ...(imoveis?.map(item => ({
          ...item,
          agendamento: item.agendamentos?.[0]
        })) || []),
        ...(imoveisSemAgendamento || [])
      ];

      console.log('Imóveis encontrados:', todosImoveis);
      return todosImoveis;
    },
  });
};

export const useCreateImovel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imovel: Omit<Imovel, 'id' | 'codigo' | 'created_at' | 'updated_at'>) => {
      console.log('Criando imóvel:', imovel);
      
      const { data, error } = await supabase
        .from('imoveis')
        .insert([imovel])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar imóvel:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
      toast({
        title: "Sucesso",
        description: "Imóvel cadastrado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar imóvel:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar imóvel. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteImovel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log('Excluindo imóvel:', id);
      
      const { error } = await supabase
        .from('imoveis')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir imóvel:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
      toast({
        title: "Sucesso",
        description: "Imóvel excluído com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir imóvel:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir imóvel. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
