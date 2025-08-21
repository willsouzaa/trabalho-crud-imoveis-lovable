
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Agendamento } from '@/types/imovel';
import { toast } from '@/hooks/use-toast';

export const useAgendamentos = () => {
  return useQuery({
    queryKey: ['agendamentos'],
    queryFn: async () => {
      console.log('Buscando agendamentos...');
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          *,
          imoveis(codigo, rua, bairro, cidade)
        `)
        .order('data_hora', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
        throw error;
      }

      console.log('Agendamentos encontrados:', data);
      return data;
    },
  });
};

export const useCreateAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agendamento: Omit<Agendamento, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Criando agendamento:', agendamento);
      
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([agendamento])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar agendamento:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAgendamento = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      console.log('Excluindo agendamento:', id);
      
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir agendamento:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] });
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
      toast({
        title: "Sucesso",
        description: "Agendamento excluído com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir agendamento:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};
