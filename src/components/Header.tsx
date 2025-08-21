
import { Button } from "@/components/ui/button";
import { Home, Calendar } from "lucide-react";

interface HeaderProps {
  activeView: 'imoveis' | 'agendamentos';
  onViewChange: (view: 'imoveis' | 'agendamentos') => void;
  onCadastrarImovel: () => void;
}

const Header = ({ activeView, onViewChange, onCadastrarImovel }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-[#1C355E]">
              San Remo Imóveis
            </h1>
            
            <nav className="flex space-x-4">
              <Button
                variant={activeView === 'imoveis' ? 'default' : 'ghost'}
                onClick={() => onViewChange('imoveis')}
                className={`flex items-center space-x-2 ${
                  activeView === 'imoveis' 
                    ? 'bg-[#E85D1F] hover:bg-[#d14d0f] text-white' 
                    : 'text-[#1C355E] hover:bg-[#f5f5f5]'
                }`}
              >
                <Home size={20} />
                <span>Imóveis</span>
              </Button>
              
              <Button
                variant={activeView === 'agendamentos' ? 'default' : 'ghost'}
                onClick={() => onViewChange('agendamentos')}
                className={`flex items-center space-x-2 ${
                  activeView === 'agendamentos' 
                    ? 'bg-[#E85D1F] hover:bg-[#d14d0f] text-white' 
                    : 'text-[#1C355E] hover:bg-[#f5f5f5]'
                }`}
              >
                <Calendar size={20} />
                <span>Visitas Agendadas</span>
              </Button>
            </nav>
          </div>

          {activeView === 'imoveis' && (
            <Button
              onClick={onCadastrarImovel}
              className="bg-[#E85D1F] hover:bg-[#d14d0f] text-white font-semibold px-6 py-2"
            >
              Cadastrar Imóvel
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
