
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface FiltrosProps {
  filtros: {
    cidade: string;
    bairro: string;
    tipo: string;
    valorMin: string;
    valorMax: string;
  };
  onFiltroChange: (filtro: string, valor: string) => void;
  onLimparFiltros: () => void;
}

const Filtros = ({ filtros, onFiltroChange, onLimparFiltros }: FiltrosProps) => {
  const temFiltrosAtivos = Object.values(filtros).some(valor => valor !== '');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1C355E] flex items-center">
          <Search size={20} className="mr-2" />
          Filtrar Imóveis
        </h3>
        
        {temFiltrosAtivos && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLimparFiltros}
            className="flex items-center space-x-1"
          >
            <X size={16} />
            <span>Limpar</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <Label htmlFor="cidade" className="text-sm font-medium text-gray-700">
            Cidade
          </Label>
          <Input
            id="cidade"
            placeholder="Digite a cidade"
            value={filtros.cidade}
            onChange={(e) => onFiltroChange('cidade', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="bairro" className="text-sm font-medium text-gray-700">
            Bairro
          </Label>
          <Input
            id="bairro"
            placeholder="Digite o bairro"
            value={filtros.bairro}
            onChange={(e) => onFiltroChange('bairro', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="tipo" className="text-sm font-medium text-gray-700">
            Tipo
          </Label>
          <select
            id="tipo"
            value={filtros.tipo}
            onChange={(e) => onFiltroChange('tipo', e.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          >
            <option value="">Todos</option>
            <option value="aluguel">Aluguel</option>
            <option value="venda">Venda</option>
          </select>
        </div>

        <div>
          <Label htmlFor="valorMin" className="text-sm font-medium text-gray-700">
            Valor Mín. (R$)
          </Label>
          <Input
            id="valorMin"
            type="number"
            placeholder="0"
            value={filtros.valorMin}
            onChange={(e) => onFiltroChange('valorMin', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="valorMax" className="text-sm font-medium text-gray-700">
            Valor Máx. (R$)
          </Label>
          <Input
            id="valorMax"
            type="number"
            placeholder="999999"
            value={filtros.valorMax}
            onChange={(e) => onFiltroChange('valorMax', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Filtros;
