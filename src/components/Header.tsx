import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Menu, X } from "lucide-react";

interface HeaderProps {
  activeView: "imoveis" | "agendamentos";
  onViewChange: (view: "imoveis" | "agendamentos") => void;
  onCadastrarImovel: () => void;
}

const Header = ({ activeView, onViewChange, onCadastrarImovel }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-[#1C355E]">San Remo Imóveis</h1>

          {/* Menu desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant={activeView === "imoveis" ? "default" : "ghost"}
              onClick={() => onViewChange("imoveis")}
              className={`flex items-center space-x-2 ${
                activeView === "imoveis"
                  ? "bg-[#E85D1F] hover:bg-[#d14d0f] text-white"
                  : "text-[#1C355E] hover:bg-[#f5f5f5]"
              }`}
            >
              <Home size={20} />
              <span>Imóveis</span>
            </Button>

            <Button
              variant={activeView === "agendamentos" ? "default" : "ghost"}
              onClick={() => onViewChange("agendamentos")}
              className={`flex items-center space-x-2 ${
                activeView === "agendamentos"
                  ? "bg-[#E85D1F] hover:bg-[#d14d0f] text-white"
                  : "text-[#1C355E] hover:bg-[#f5f5f5]"
              }`}
            >
              <Calendar size={20} />
              <span>Visitas Agendadas</span>
            </Button>

            {activeView === "imoveis" && (
              <Button
                onClick={onCadastrarImovel}
                className="bg-[#E85D1F] hover:bg-[#d14d0f] text-white font-semibold px-6 py-2"
              >
                Cadastrar Imóvel
              </Button>
            )}
          </nav>

          {/* Botão menu mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#1C355E]"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Dropdown mobile */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col space-y-2">
            <Button
              variant={activeView === "imoveis" ? "default" : "ghost"}
              onClick={() => {
                onViewChange("imoveis");
                setMenuOpen(false);
              }}
              className={`flex items-center space-x-2 justify-start ${
                activeView === "imoveis"
                  ? "bg-[#E85D1F] hover:bg-[#d14d0f] text-white"
                  : "text-[#1C355E] hover:bg-[#f5f5f5]"
              }`}
            >
              <Home size={20} />
              <span>Imóveis</span>
            </Button>

            <Button
              variant={activeView === "agendamentos" ? "default" : "ghost"}
              onClick={() => {
                onViewChange("agendamentos");
                setMenuOpen(false);
              }}
              className={`flex items-center space-x-2 justify-start ${
                activeView === "agendamentos"
                  ? "bg-[#E85D1F] hover:bg-[#d14d0f] text-white"
                  : "text-[#1C355E] hover:bg-[#f5f5f5]"
              }`}
            >
              <Calendar size={20} />
              <span>Visitas Agendadas</span>
            </Button>

            {activeView === "imoveis" && (
              <Button
                onClick={() => {
                  onCadastrarImovel();
                  setMenuOpen(false);
                }}
                className="bg-[#E85D1F] hover:bg-[#d14d0f] text-white font-semibold px-6 py-2"
              >
                Cadastrar Imóvel
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
