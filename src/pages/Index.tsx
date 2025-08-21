import { useState, useMemo } from "react";
import { useImoveis, useDeleteImovel } from "@/hooks/useImoveis";
import { ImovelWithAgendamento } from "@/types/imovel";
import Header from "@/components/Header";
import Filtros from "@/components/Filtros";
import ImovelCard from "@/components/ImovelCard";
import CadastroImovelModal from "@/components/CadastroImovelModal";
import AgendamentoModal from "@/components/AgendamentoModal";
import VisitasAgendadas from "@/components/VisitasAgendadas";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<'imoveis' | 'agendamentos'>('imoveis');
  const [modalCadastro, setModalCadastro] = useState(false);
  const [modalAgendamento, setModalAgendamento] = useState(false);
  const [imovelSelecionado, setImovelSelecionado] = useState<ImovelWithAgendamento | null>(null);
  const [imovelParaEditar, setImovelParaEditar] = useState<ImovelWithAgendamento | null>(null);
  
  const [filtros, setFiltros] = useState({
    cidade: '',
    bairro: '',
    tipo: '',
    valorMin: '',
    valorMax: '',
  });

  const { data: imoveis, isLoading, error } = useImoveis();
  const deleteImovel = useDeleteImovel();

  const handleFiltroChange = (filtro: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [filtro]: valor }));
  };

  const handleLimparFiltros = () => {
    setFiltros({
      cidade: '',
      bairro: '',
      tipo: '',
      valorMin: '',
      valorMax: '',
    });
  };

  const handleAgendar = (imovel: ImovelWithAgendamento) => {
    setImovelSelecionado(imovel);
    setModalAgendamento(true);
  };

  const handleExcluir = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este imóvel?')) {
      await deleteImovel.mutateAsync(id);
    }
  };

  const handleEditar = (imovel: ImovelWithAgendamento) => {
    setImovelParaEditar(imovel);
    setModalCadastro(true);
  };

  const handleCloseCadastro = () => {
    setModalCadastro(false);
    setImovelParaEditar(null);
  };

  // Filtrar imóveis
  const imoveisFiltrados = useMemo(() => {
    if (!imoveis) return [];

    return imoveis.filter(imovel => {
      // Filtro por cidade
      if (filtros.cidade && !imovel.cidade?.toLowerCase().includes(filtros.cidade.toLowerCase())) {
        return false;
      }
      
      // Filtro por bairro
      if (filtros.bairro && !imovel.bairro?.toLowerCase().includes(filtros.bairro.toLowerCase())) {
        return false;
      }
      
      // Filtro por tipo
      if (filtros.tipo && imovel.tipo !== filtros.tipo) {
        return false;
      }
      
      // Filtro por valor mínimo
      if (filtros.valorMin && imovel.valor < parseFloat(filtros.valorMin)) {
        return false;
      }
      
      // Filtro por valor máximo
      if (filtros.valorMax && imovel.valor > parseFloat(filtros.valorMax)) {
        return false;
      }
      
      return true;
    });
  }, [imoveis, filtros]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Header
        activeView={activeView}
        onViewChange={setActiveView}
        onCadastrarImovel={() => setModalCadastro(true)}
      />

      <div className="container mx-auto px-4 py-6">
        {activeView === 'imoveis' ? (
          <>
            {/* Filtros */}
            <Filtros
              filtros={filtros}
              onFiltroChange={handleFiltroChange}
              onLimparFiltros={handleLimparFiltros}
            />

            {/* Lista de Imóveis */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#E85D1F]" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">Erro ao carregar imóveis.</p>
              </div>
            ) : imoveisFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-gray-500">
                  {imoveis?.length === 0 
                    ? 'Cadastre o primeiro imóvel clicando no botão "Cadastrar Imóvel".' 
                    : 'Tente ajustar os filtros ou limpar a busca.'
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    Mostrando {imoveisFiltrados.length} de {imoveis?.length || 0} imóveis
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {imoveisFiltrados.map((imovel) => (
                    <ImovelCard
                      key={imovel.id}
                      imovel={imovel}
                      onAgendar={handleAgendar}
                      onExcluir={handleExcluir}
                      onEditar={handleEditar}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <VisitasAgendadas />
        )}
      </div>

      {/* Modais */}
      <CadastroImovelModal
        open={modalCadastro}
        onClose={handleCloseCadastro}
        imovelParaEditar={imovelParaEditar}
      />

      <AgendamentoModal
        open={modalAgendamento}
        onClose={() => {
          setModalAgendamento(false);
          setImovelSelecionado(null);
        }}
        imovel={imovelSelecionado}
      />
    </div>
  );
};

export default Index;