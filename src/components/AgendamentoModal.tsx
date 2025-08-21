
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAgendamento } from "@/hooks/useAgendamentos";
import { ImovelWithAgendamento } from "@/types/imovel";
import { Loader2 } from "lucide-react";

interface AgendamentoModalProps {
  open: boolean;
  onClose: () => void;
  imovel: ImovelWithAgendamento | null;
}

const AgendamentoModal = ({ open, onClose, imovel }: AgendamentoModalProps) => {
  const [formData, setFormData] = useState({
    nome_cliente: '',
    data_hora: '',
    status: 'Agendado',
  });

  const createAgendamento = useCreateAgendamento();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imovel) return;

    try {
      const agendamentoData = {
        id_imovel: imovel.id,
        nome_cliente: formData.nome_cliente,
        data_hora: formData.data_hora,
        status: formData.status,
      };

      await createAgendamento.mutateAsync(agendamentoData);
      
      // Reset form
      setFormData({
        nome_cliente: '',
        data_hora: '',
        status: 'Agendado',
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
    }
  };

  // Formatação da data mínima (hoje)
  const hoje = new Date();
  const dataMinima = hoje.toISOString().slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1C355E]">
            Agendar Visita
          </DialogTitle>
          {imovel && (
            <p className="text-sm text-gray-600">
              Imóvel: {imovel.codigo} - {imovel.rua}, {imovel.bairro}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome_cliente">Nome do Cliente</Label>
            <Input
              id="nome_cliente"
              value={formData.nome_cliente}
              onChange={(e) => handleInputChange('nome_cliente', e.target.value)}
              placeholder="Digite o nome do cliente"
              required
              disabled={createAgendamento.isPending}
            />
          </div>

          <div>
            <Label htmlFor="data_hora">Data e Horário</Label>
            <Input
              id="data_hora"
              type="datetime-local"
              value={formData.data_hora}
              onChange={(e) => handleInputChange('data_hora', e.target.value)}
              min={dataMinima}
              required
              disabled={createAgendamento.isPending}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              disabled={createAgendamento.isPending}
            >
              <option value="Agendado">Agendado</option>
              <option value="Em negociação">Em negociação</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createAgendamento.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#E85D1F] hover:bg-[#d14d0f] text-white"
              disabled={createAgendamento.isPending}
            >
              {createAgendamento.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agendar Visita
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AgendamentoModal;
