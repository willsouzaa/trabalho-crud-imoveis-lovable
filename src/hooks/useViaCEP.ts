
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const useViaCEP = () => {
  const [loading, setLoading] = useState(false);

  const buscarCEP = async (cep: string) => {
    if (!cep || cep.length < 8) {
      return null;
    }

    setLoading(true);
    
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data: ViaCEPResponse = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado e tente novamente.",
          variant: "destructive",
        });
        return null;
      }

      return {
        cep: data.cep,
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        complemento: data.complemento,
      };
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar CEP. Tente novamente.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buscarCEP, loading };
};
