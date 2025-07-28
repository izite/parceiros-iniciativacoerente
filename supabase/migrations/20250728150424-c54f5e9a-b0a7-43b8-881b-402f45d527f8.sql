-- Limpar registos órfãos na tabela arquivos
DELETE FROM public.arquivos;

-- Fazer o campo criado_por obrigatório se não for usado apenas para teste
-- ALTER TABLE public.arquivos ALTER COLUMN criado_por SET NOT NULL;