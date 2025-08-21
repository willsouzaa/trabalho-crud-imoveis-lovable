# 🏠 Sistema de Gerenciamento de Imóveis – Desafio Prático

Este projeto foi desenvolvido como parte de um **teste técnico para vaga No-Code**, utilizando **Lovable (frontend)** e **Supabase (backend + storage)**.  

---

## 🚀 Tecnologias Utilizadas
- [Lovable.dev](https://lovable.dev) – construção do frontend  
- [Supabase](https://supabase.com) – banco de dados e storage  
- [ViaCEP](https://viacep.com.br/) – API para preenchimento automático de endereço  
- **React + TypeScript + TailwindCSS + shadcn-ui** (gerados pelo Lovable)  

---

## ⚙️ Funcionalidades
- **Cadastro de imóveis** com foto de capa, endereço automático via CEP e código gerado (#0001, #0002...).  
- **Listagem de imóveis** em cards modernos, com filtros (cidade, bairro, tipo e valor).  
- **Agendamento de visitas** com data, horário e status (Agendado, Em negociação, Concluído).  
- **Gestão de status do imóvel**: disponível, agendado ou em negociação.  
- **Exclusão de imóveis** direto da listagem.  
- **UI/UX moderna e responsiva**, inspirada no site da San Remo Imóveis.  

---

## 📦 Estrutura do Banco de Dados (Supabase)
### Tabela `properties`
- id (UUID, PK)  
- code (gerado automaticamente: #0001, #0002...)  
- cep, rua, número, complemento, bairro, cidade, estado  
- tipo (aluguel ou venda)  
- valor (decimal)  
- descrição (text)  
- foto_capa (url Supabase Storage)  
- status (disponível, agendado, em negociação)  

### Tabela `visits`
- id (UUID, PK)  
- id_imovel (FK → properties.id)  
- nome_cliente  
- data_hora  
- status (Agendado, Em negociação, Concluído)  

---

## 🛠️ Como Rodar Localmente
```bash
# Clonar o repositório
git clone <URL_DO_REPO>

# Entrar na pasta do projeto
cd <NOME_DO_PROJETO>

# Instalar dependências
npm install

# Rodar em ambiente local
npm run dev
