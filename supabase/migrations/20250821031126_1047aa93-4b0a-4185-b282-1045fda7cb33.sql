
-- 1) Tabela de imóveis
CREATE TABLE IF NOT EXISTS public.imoveis (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  cep TEXT,
  rua TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('aluguel','venda')),
  valor NUMERIC(12,2) NOT NULL DEFAULT 0,
  descricao TEXT,
  foto_capa TEXT,
  status TEXT NOT NULL DEFAULT 'Disponível',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sequência e trigger para gerar "codigo" (#0001, #0002, ...)
CREATE SEQUENCE IF NOT EXISTS public.imovel_codigo_seq START 1;

CREATE OR REPLACE FUNCTION public.set_imovel_codigo()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.codigo IS NULL OR NEW.codigo = '' THEN
    NEW.codigo := '#' || LPAD(nextval('public.imovel_codigo_seq')::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_imovel_codigo ON public.imoveis;
CREATE TRIGGER trg_set_imovel_codigo
BEFORE INSERT ON public.imoveis
FOR EACH ROW
EXECUTE FUNCTION public.set_imovel_codigo();

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_imoveis_updated_at ON public.imoveis;
CREATE TRIGGER trg_imoveis_updated_at
BEFORE UPDATE ON public.imoveis
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 2) Tabela de agendamentos
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id BIGSERIAL PRIMARY KEY,
  id_imovel BIGINT NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  nome_cliente TEXT NOT NULL,
  data_hora TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Agendado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_agendamentos_updated_at ON public.agendamentos;
CREATE TRIGGER trg_agendamentos_updated_at
BEFORE UPDATE ON public.agendamentos
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- 3) RLS: habilitar e permitir uso público (sem autenticação) por enquanto
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'imoveis' AND policyname = 'public_select_imoveis'
  ) THEN
    CREATE POLICY public_select_imoveis ON public.imoveis FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'imoveis' AND policyname = 'public_insert_imoveis'
  ) THEN
    CREATE POLICY public_insert_imoveis ON public.imoveis FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'imoveis' AND policyname = 'public_update_imoveis'
  ) THEN
    CREATE POLICY public_update_imoveis ON public.imoveis FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'imoveis' AND policyname = 'public_delete_imoveis'
  ) THEN
    CREATE POLICY public_delete_imoveis ON public.imoveis FOR DELETE USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agendamentos' AND policyname = 'public_select_agendamentos'
  ) THEN
    CREATE POLICY public_select_agendamentos ON public.agendamentos FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agendamentos' AND policyname = 'public_insert_agendamentos'
  ) THEN
    CREATE POLICY public_insert_agendamentos ON public.agendamentos FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agendamentos' AND policyname = 'public_update_agendamentos'
  ) THEN
    CREATE POLICY public_update_agendamentos ON public.agendamentos FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'agendamentos' AND policyname = 'public_delete_agendamentos'
  ) THEN
    CREATE POLICY public_delete_agendamentos ON public.agendamentos FOR DELETE USING (true);
  END IF;
END $$;

-- 4) Storage: criar bucket e políticas públicas
INSERT INTO storage.buckets (id, name, public)
VALUES ('imoveis', 'imoveis', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas no storage.objects para o bucket 'imoveis'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'imoveis_public_select'
  ) THEN
    CREATE POLICY imoveis_public_select
    ON storage.objects FOR SELECT
    USING (bucket_id = 'imoveis');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'imoveis_public_insert'
  ) THEN
    CREATE POLICY imoveis_public_insert
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'imoveis');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'imoveis_public_update'
  ) THEN
    CREATE POLICY imoveis_public_update
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'imoveis');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'imoveis_public_delete'
  ) THEN
    CREATE POLICY imoveis_public_delete
    ON storage.objects FOR DELETE
    USING (bucket_id = 'imoveis');
  END IF;
END $$;
