import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Imovel, ImovelWithAgendamento } from '@/types/imovel';
import { toast } from '@/hooks/use-toast';

// Tipo específico para inserir no banco (sem código pois é gerado automaticamente)
type ImovelInsert = {
  cep?: string | null;
  rua?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cidade?: string | null;
  estado?: string | null;
  tipo: 'aluguel' | 'venda';
  valor: number;
  descricao?: string | null;
  foto_capa?: string | null;
  status: string;
};

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

      // Combinar resultados e garantir tipos corretos
      const todosImoveis: ImovelWithAgendamento[] = [
        ...(imoveis?.map(item => ({
          ...item,
          agendamento: item.agendamentos?.[0]
        } as ImovelWithAgendamento)) || []),
        ...(imoveisSemAgendamento?.map(item => ({
          ...item,
          tipo: item.tipo as 'aluguel' | 'venda'
        } as ImovelWithAgendamento)) || [])
      ];

      console.log('Imóveis encontrados:', todosImoveis);
      return todosImoveis;
    },
  });
};

export const useCreateImovel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imovel: ImovelInsert) => {
      console.log('Criando imóvel:', imovel);
      
      const { data, error } = await supabase
        .from('imoveis')
        .insert(imovel as any)
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

export const useUpdateImovel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, imovel }: { id: number; imovel: Partial<ImovelInsert> }) => {
      console.log('Atualizando imóvel:', id, imovel);
      
      const { data, error } = await supabase
        .from('imoveis')
        .update(imovel)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar imóvel:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
      toast({
        title: "Sucesso",
        description: "Imóvel atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar imóvel:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar imóvel. Tente novamente.",
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