
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImovelWithAgendamento } from "@/types/imovel";
import { MapPin, Calendar, Trash2, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ImovelCardProps {
  imovel: ImovelWithAgendamento;
  onAgendar: (imovel: ImovelWithAgendamento) => void;
  onExcluir: (id: number) => void;
}

const ImovelCard = ({ imovel, onAgendar, onExcluir }: ImovelCardProps) => {
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusBadge = () => {
    if (imovel.agendamento) {
      const dataAgendamento = new Date(imovel.agendamento.data_hora);
      const agendamentoFormatado = format(dataAgendamento, "dd/MM 'às' HH:mm", { locale: ptBR });
      
      if (imovel.agendamento.status === 'Agendado') {
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Agendado - {agendamentoFormatado}
          </Badge>
        );
      } else if (imovel.agendamento.status === 'Em negociação') {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Em negociação
          </Badge>
        );
      }
    }
    
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        {imovel.status}
      </Badge>
    );
  };

  const imagemUrl = imovel.foto_capa 
    ? `https://plhezahvxueojrospexg.supabase.co/storage/v1/object/public/imoveis/${imovel.foto_capa}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow duration-200">
      {/* Imagem */}
      <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
        {imagemUrl ? (
          <img
            src={imagemUrl}
            alt={`Imóvel ${imovel.codigo}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Código do imóvel */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-[#1C355E] text-white">
            {imovel.codigo}
          </Badge>
        </div>

        {/* Status */}
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Endereço */}
        <div className="flex items-start space-x-2 mb-3">
          <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-medium">
              {imovel.rua && imovel.numero ? `${imovel.rua}, ${imovel.numero}` : 'Endereço não informado'}
            </p>
            <p>{imovel.bairro && imovel.cidade ? `${imovel.bairro}, ${imovel.cidade}` : ''}</p>
          </div>
        </div>

        {/* Tipo e Valor */}
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="capitalize">
            {imovel.tipo}
          </Badge>
          <span className="text-lg font-bold text-[#E85D1F]">
            {formatarValor(imovel.valor)}
          </span>
        </div>

        {/* Descrição */}
        {imovel.descricao && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {imovel.descricao}
          </p>
        )}

        {/* Ações */}
        <div className="flex space-x-2">
          <Button
            onClick={() => onAgendar(imovel)}
            className="flex-1 bg-[#E85D1F] hover:bg-[#d14d0f] text-white"
            size="sm"
          >
            <Calendar size={16} className="mr-1" />
            Agendar Visita
          </Button>
          
          <Button
            onClick={() => onExcluir(imovel.id)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImovelCard;
