-- Adicionar campos de ID sequencial para ocorrências e pedidos

-- Adicionar campo numero_id para ocorrências
ALTER TABLE public.ocorrencias 
ADD COLUMN numero_id SERIAL UNIQUE;

-- Adicionar campo numero_id para pedidos  
ALTER TABLE public.pedidos
ADD COLUMN numero_id SERIAL UNIQUE;

-- Criar função para gerar número de ocorrência formatado
CREATE OR REPLACE FUNCTION public.get_occurrence_number(occurrence_id uuid)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT 'OC' || LPAD(numero_id::text, 3, '0')
  FROM public.ocorrencias
  WHERE id = occurrence_id;
$$;

-- Criar função para gerar número de pedido formatado
CREATE OR REPLACE FUNCTION public.get_request_number(request_id uuid)
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT 'PD' || LPAD(numero_id::text, 3, '0')
  FROM public.pedidos
  WHERE id = request_id;
$$;