import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateImovel, useUpdateImovel } from "@/hooks/useImoveis";
import { useViaCEP } from "@/hooks/useViaCEP";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ImovelWithAgendamento } from "@/types/imovel";

interface CadastroImovelModalProps {
  open: boolean;
  onClose: () => void;
  imovelParaEditar?: ImovelWithAgendamento | null;
}

const CadastroImovelModal = ({ open, onClose, imovelParaEditar }: CadastroImovelModalProps) => {
  const isEditMode = !!imovelParaEditar;
  
  const [formData, setFormData] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    tipo: 'aluguel' as 'aluguel' | 'venda',
    valor: '',
    descricao: '',
  });
  
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const createImovel = useCreateImovel();
  const updateImovel = useUpdateImovel();
  const { buscarCEP, loading: loadingCEP } = useViaCEP();

  // Preencher formulário quando for edição
  useEffect(() => {
    if (isEditMode && imovelParaEditar) {
      setFormData({
        cep: imovelParaEditar.cep || '',
        rua: imovelParaEditar.rua || '',
        numero: imovelParaEditar.numero || '',
        complemento: imovelParaEditar.complemento || '',
        bairro: imovelParaEditar.bairro || '',
        cidade: imovelParaEditar.cidade || '',
        estado: imovelParaEditar.estado || '',
        tipo: imovelParaEditar.tipo,
        valor: imovelParaEditar.valor.toString(),
        descricao: imovelParaEditar.descricao || '',
      });
    } else {
      // Reset para modo de criação
      setFormData({
        cep: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        tipo: 'aluguel',
        valor: '',
        descricao: '',
      });
    }
    setArquivo(null);
  }, [isEditMode, imovelParaEditar, open]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCEPChange = async (cep: string) => {
    handleInputChange('cep', cep);
    
    if (cep.length === 8) {
      const endereco = await buscarCEP(cep);
      if (endereco) {
        setFormData(prev => ({
          ...prev,
          rua: endereco.rua || '',
          bairro: endereco.bairro || '',
          cidade: endereco.cidade || '',
          estado: endereco.estado || '',
          complemento: endereco.complemento || prev.complemento,
        }));
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setArquivo(file);
    }
  };

  const uploadImagem = async (): Promise<string | null> => {
    if (!arquivo) return null;

    setUploadingImage(true);
    
    try {
      const fileExt = arquivo.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('imoveis')
        .upload(fileName, arquivo);

      if (error) {
        console.error('Erro no upload:', error);
        toast({
          title: "Erro no upload",
          description: "Erro ao fazer upload da imagem.",
          variant: "destructive",
        });
        return null;
      }

      return data.path;
    } catch (error) {
      console.error('Erro no upload:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let fotoPath = null;
      
      if (arquivo) {
        fotoPath = await uploadImagem();
        if (!fotoPath) return; // Se o upload falhou, não continua
      }

      const imovelData = {
        cep: formData.cep || null,
        rua: formData.rua || null,
        numero: formData.numero || null,
        complemento: formData.complemento || null,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        tipo: formData.tipo,
        valor: parseFloat(formData.valor) || 0,
        descricao: formData.descricao || null,
        foto_capa: fotoPath || (isEditMode ? imovelParaEditar?.foto_capa : null),
        status: isEditMode ? imovelParaEditar?.status || 'Disponível' : 'Disponível',
      };

      if (isEditMode && imovelParaEditar) {
        await updateImovel.mutateAsync({
          id: imovelParaEditar.id,
          imovel: imovelData,
        });
      } else {
        await createImovel.mutateAsync(imovelData);
      }
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar imóvel:', error);
    }
  };

  const isLoading = createImovel.isPending || updateImovel.isPending || uploadingImage || loadingCEP;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1C355E]">
            {isEditMode ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CEP */}
          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => handleCEPChange(e.target.value)}
              placeholder="00000-000"
              maxLength={8}
              disabled={isLoading}
            />
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rua">Rua</Label>
              <Input
                id="rua"
                value={formData.rua}
                onChange={(e) => handleInputChange('rua', e.target.value)}
                placeholder="Digite a rua"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={formData.numero}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                placeholder="123"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="complemento">Complemento</Label>
            <Input
              id="complemento"
              value={formData.complemento}
              onChange={(e) => handleInputChange('complemento', e.target.value)}
              placeholder="Apartamento, bloco, etc."
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={formData.bairro}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                placeholder="Digite o bairro"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="Digite a cidade"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value)}
                placeholder="UF"
                maxLength={2}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Tipo e Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <select
                id="tipo"
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                disabled={isLoading}
              >
                <option value="aluguel">Aluguel</option>
                <option value="venda">Venda</option>
              </select>
            </div>
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                value={formData.valor}
                onChange={(e) => handleInputChange('valor', e.target.value)}
                placeholder="0,00"
                step="0.01"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              placeholder="Descreva o imóvel..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Upload de foto */}
          <div>
            <Label htmlFor="foto">Foto de Capa</Label>
            <div className="mt-1">
              <Input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isLoading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E85D1F] file:text-white hover:file:bg-[#d14d0f]"
              />
              {arquivo && (
                <p className="text-sm text-gray-600 mt-1">
                  Arquivo selecionado: {arquivo.name}
                </p>
              )}
              {isEditMode && imovelParaEditar?.foto_capa && !arquivo && (
                <p className="text-sm text-gray-600 mt-1">
                  Imagem atual mantida
                </p>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#E85D1F] hover:bg-[#d14d0f] text-white"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Atualizar Imóvel' : 'Salvar Imóvel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CadastroImovelModal;