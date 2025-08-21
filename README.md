📘 Projeto – CRUD de Imóveis (Lovable + Supabase)

Este projeto foi desenvolvido como parte de um desafio prático para a vaga de No-Code Developer.
O sistema permite gerenciar imóveis (CRUD) com integração ao Supabase e possui design inspirado no site da San Remo Imóveis.

🚀 Funcionalidades
1️⃣ Cadastro de Imóveis

Cadastro via modal profissional.

Código automático: #0001, #0002, ...

Preenchimento automático do endereço via API ViaCEP ao digitar o CEP.

Upload de foto de capa armazenada no Supabase Storage.

Campos disponíveis:

Código (automático)

CEP, Rua, Número, Complemento, Bairro, Cidade, Estado

Tipo (Aluguel ou Venda)

Valor (R$)

Descrição

2️⃣ Listagem de Imóveis

Exibição em cards responsivos, estilo San Remo Imóveis.

Cada card mostra:

Foto de capa

Código do imóvel

Rua + Bairro

Tipo (Aluguel ou Venda)

Valor (R$)

Status: Disponível, Agendado ou Em Negociação

Filtros disponíveis:

Cidade

Bairro

Tipo de imóvel

Faixa de valor

3️⃣ Agendamento de Visitas

Botão “Agendar Visita” em cada card.

Modal de agendamento com:

Nome do cliente

Data e horário da visita

Status (Agendado, Em Negociação ou Concluído)

Lista completa em aba “Visitas Agendadas”

Status atualizado aparece diretamente no card do imóvel.

4️⃣ Gerenciamento Completo

Edição e exclusão de imóveis diretamente da listagem.

Edição e exclusão de agendamentos.

5️⃣ UI/UX

Interface moderna, limpa e responsiva.

Paleta de cores:

Laranja: #E85D1F

Azul escuro: #1C355E

Cinza claro: #f5f5f5

Branco

Estilo com cards arredondados, botões elegantes e hover animado.

⚙️ Tecnologias Utilizadas

Lovable – plataforma no-code/low-code (frontend + backend)

Supabase – PostgreSQL, autenticação, API REST e Storage

TailwindCSS – estilização responsiva

shadcn-ui – componentes de interface

React + TypeScript – base do frontend

API ViaCEP – consulta de CEP e preenchimento automático

🔧 Como Rodar Localmente
Pré-requisitos

Node.js (recomendado via nvm)

npm (instalado junto com Node.js)

Conta no Supabase

Passo a Passo

Clone o repositório:

git clone https://github.com/willsouzaa/trabalho-crud-imoveis-lovable.git


Entre na pasta do projeto:

cd trabalho-crud-imoveis-lovable


Instale as dependências:

npm install


Inicie o servidor de desenvolvimento:

npm run dev


Acesse no navegador:

http://localhost:5173

🗄️ Configuração do Supabase

Crie um novo projeto no Supabase.

Configure as tabelas copiando o script SQL abaixo no SQL Editor:

-- Bucket para imagens
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Tabela de imóveis
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  cep TEXT NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rent', 'sale')),
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'scheduled', 'negotiating')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de visitas
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'negotiating', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);


Ative Row Level Security (RLS).

Crie um bucket no Storage chamado property-images.

Configure as variáveis de ambiente no arquivo .env.local:

VITE_SUPABASE_URL=<SUA_URL>
VITE_SUPABASE_ANON_KEY=<SUA_ANON_KEY>

🌐 Deploy

Publicação direta no Lovable:
Vá em Share → Publish para gerar o link público.

Para domínio próprio:
Configure em Project → Settings → Domains.
