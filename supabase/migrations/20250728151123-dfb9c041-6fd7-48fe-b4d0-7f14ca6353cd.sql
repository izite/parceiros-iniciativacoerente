-- Remover a foreign key constraint que está a causar problemas
ALTER TABLE public.arquivos 
DROP CONSTRAINT IF EXISTS arquivos_criado_por_fkey;

-- Comentário: Agora criado_por pode ser qualquer UUID (auth.uid)