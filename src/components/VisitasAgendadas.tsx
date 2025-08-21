
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAgendamentos, useDeleteAgendamento } from "@/hooks/useAgendamentos";
import { Calendar, MapPin, Trash2, User, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const VisitasAgendadas = () => {
  const { data: agendamentos, isLoading, error } = useAgendamentos();
  const deleteAgendamento = useDeleteAgendamento();

  const handleExcluir = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      await deleteAgendamento.mutateAsync(id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Em negociação':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Concluído':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#E85D1F]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar agendamentos.</p>
      </div>
    );
  }

  if (!agendamentos || agendamentos.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma visita agendada
        </h3>
        <p className="text-gray-500">
          Quando houver visitas agendadas, elas aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#1C355E] mb-2">
          Visitas Agendadas
        </h2>
        <p className="text-gray-600">
          Total de {agendamentos.length} visita{agendamentos.length !== 1 ? 's' : ''} agendada{agendamentos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid gap-4">
        {agendamentos.map((agendamento: any) => {
          const dataVisita = new Date(agendamento.data_hora);
          const dataFormatada = format(dataVisita, "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
          
          return (
            <div
              key={agendamento.id}
              className="bg-white rounded-lg shadow-md border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Cabeçalho */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-[#1C355E] text-white">
                        {agendamento.imoveis?.codigo || 'N/A'}
                      </Badge>
                      <Badge className={getStatusBadgeColor(agendamento.status)}>
                        {agendamento.status}
                      </Badge>
                    </div>
                    
                    <Button
                      onClick={() => handleExcluir(agendamento.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deleteAgendamento.isPending}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* Informações do Cliente */}
                  <div className="flex items-center space-x-2 mb-3">
                    <User size={16} className="text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {agendamento.nome_cliente}
                    </span>
                  </div>

                  {/* Data e Horário */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-700 capitalize">
                      {dataFormatada}
                    </span>
                  </div>

                  {/* Endereço do Imóvel */}
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-gray-700">
                      {agendamento.imoveis?.rua ? 
                        `${agendamento.imoveis.rua}, ${agendamento.imoveis.bairro}, ${agendamento.imoveis.cidade}` :
                        'Endereço não informado'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisitasAgendadas;
